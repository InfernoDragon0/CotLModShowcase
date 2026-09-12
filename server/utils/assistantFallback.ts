import { wrapLanguageModel } from 'ai'

/**
 * Chaining language models so the assistant survives a spent quota.
 *
 * Google meters the free tier per model, so a second model on the same key has
 * its own requests-per-minute and requests-per-day budget — the cheapest way to
 * survive a burst of questions without a billing account.
 */

/**
 * A provider's language model. Taken from `ai` rather than named directly, so
 * the spec version follows whatever `@ai-sdk/provider` the SDK resolves —
 * which is a transitive dependency here and not ours to pin.
 */
export type ChatModel = ReturnType<typeof wrapLanguageModel>

/**
 * Whether to move on to the next model rather than surface the error.
 *
 * 429 is the quota itself; 503 is Gemini shedding load, which the free tier
 * sees often enough to be worth the same treatment. Anything else — a bad key,
 * a malformed request — is our bug and would fail identically on every model,
 * so it travels up instead of burning through the whole list.
 */
export function isExhausted(error: unknown): boolean {
  const status = (error as { statusCode?: number } | undefined)?.statusCode
  if (status === 429 || status === 503) {
    return true
  }

  const message = (error as { message?: string } | undefined)?.message ?? ''
  return /RESOURCE_EXHAUSTED|quota|rate.?limit|overloaded/i.test(message)
}

/**
 * Whether a model further down the chain is simply gone.
 *
 * Google retires model names on its own schedule, and a fallback that has been
 * withdrawn should not take the chain down with it at the exact moment the
 * primary has run dry. This is deliberately not applied to the primary: a name
 * that does not exist there is a config mistake, and it should be loud.
 */
function isMissing(error: unknown): boolean {
  const status = (error as { statusCode?: number } | undefined)?.statusCode
  if (status === 404) {
    return true
  }

  const message = (error as { message?: string } | undefined)?.message ?? ''
  return /NOT_FOUND|is not found|not supported/i.test(message)
}

/**
 * One model that fails over to the next, presented to `streamText` as if it
 * were a single model.
 *
 * The swap happens inside `wrapStream`, which is the last point where an
 * attempt can be abandoned invisibly: the provider rejects there on a non-2xx
 * response, before any token has been produced, so the reader never sees the
 * switch. Once bytes are flowing there is no taking them back, which is why
 * this cannot be done from `onError`.
 *
 * Models are tried in the order given and nothing here cares which provider
 * each one came from, so a different vendor is just another entry.
 */
export function withModelFallbacks(models: ChatModel[]): ChatModel {
  const [primary, ...rest] = models
  if (!primary) {
    throw new Error('withModelFallbacks needs at least one model')
  }
  if (!rest.length) {
    return primary
  }

  return wrapLanguageModel({
    model: primary,
    middleware: {
      async wrapStream({ doStream, params }) {
        let lastError: unknown

        try {
          return await doStream()
        }
        catch (error) {
          if (!isExhausted(error)) throw error
          lastError = error
        }

        for (const fallback of rest) {
          console.warn(`[assistant] ${(lastError as Error)?.message || 'quota reached'} - falling back to ${fallback.modelId}`)
          try {
            return await fallback.doStream(params)
          }
          catch (error) {
            if (!isExhausted(error) && !isMissing(error)) throw error
            lastError = error
          }
        }

        // Every model is spent; the last refusal is the honest one to report.
        throw lastError
      },
    },
  })
}
