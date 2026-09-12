import { describe, expect, it, vi } from 'vitest'
import type { ChatModel } from '../server/utils/assistantFallback'
import { isExhausted, withModelFallbacks } from '../server/utils/assistantFallback'

/** The call options are opaque to the fallback logic; it only forwards them. */
const PARAMS = { prompt: [{ role: 'user', content: [{ type: 'text', text: 'hi' }] }] } as never

function httpError(statusCode: number, message = `HTTP ${statusCode}`) {
  return Object.assign(new Error(message), { statusCode })
}

/**
 * A model that either answers with its own id or fails.
 *
 * Only `doStream` is exercised: `streamText` never calls `doGenerate`.
 */
function model(modelId: string, failWith?: unknown): ChatModel {
  return {
    specificationVersion: 'v4',
    provider: 'test',
    modelId,
    supportedUrls: {},
    doGenerate: vi.fn(),
    doStream: vi.fn(async () => {
      if (failWith) throw failWith
      return { stream: modelId } as never
    }),
  } as unknown as ChatModel
}

/** Which model actually answered, by the marker its `doStream` returns. */
async function answeredBy(chain: ChatModel[]): Promise<string> {
  const result = await withModelFallbacks(chain).doStream(PARAMS)
  return (result as unknown as { stream: string }).stream
}

describe('isExhausted', () => {
  it('treats quota and overload responses as reasons to switch model', () => {
    expect(isExhausted(httpError(429))).toBe(true)
    expect(isExhausted(httpError(503))).toBe(true)
    expect(isExhausted(new Error('RESOURCE_EXHAUSTED: quota exceeded'))).toBe(true)
    expect(isExhausted(new Error('The model is overloaded. Please try again later.'))).toBe(true)
    expect(isExhausted(new Error('rate limit reached for this model'))).toBe(true)
  })

  it('leaves our own mistakes alone, since every model would reject them', () => {
    expect(isExhausted(httpError(401, 'API key not valid'))).toBe(false)
    expect(isExhausted(httpError(400, 'Invalid JSON payload'))).toBe(false)
    expect(isExhausted(httpError(404, 'models/nope is not found'))).toBe(false)
    expect(isExhausted(undefined)).toBe(false)
  })
})

describe('withModelFallbacks', () => {
  it('returns the only model untouched when there is nothing to fall back to', async () => {
    const only = model('solo')
    expect(withModelFallbacks([only])).toBe(only)
  })

  it('refuses an empty chain rather than failing later inside the SDK', () => {
    expect(() => withModelFallbacks([])).toThrow(/at least one model/)
  })

  it('uses the primary model and never touches the rest', async () => {
    const chain = [model('primary'), model('second')]
    expect(await answeredBy(chain)).toBe('primary')
    expect(chain[1]!.doStream).not.toHaveBeenCalled()
  })

  it('moves to the next model when the quota is spent', async () => {
    const chain = [model('primary', httpError(429)), model('second')]
    expect(await answeredBy(chain)).toBe('second')
  })

  it('keeps walking the chain while models stay exhausted', async () => {
    const chain = [
      model('primary', httpError(429)),
      model('second', httpError(503)),
      model('third'),
    ]
    expect(await answeredBy(chain)).toBe('third')
    expect(chain[2]!.doStream).toHaveBeenCalledWith(PARAMS)
  })

  it('reports the last refusal once every model is spent', async () => {
    const chain = [
      model('primary', httpError(429, 'first')),
      model('second', httpError(429, 'last')),
    ]
    await expect(answeredBy(chain)).rejects.toThrow('last')
  })

  it('surfaces a broken request immediately instead of retrying it everywhere', async () => {
    const chain = [model('primary', httpError(401, 'API key not valid')), model('second')]
    await expect(answeredBy(chain)).rejects.toThrow('API key not valid')
    expect(chain[1]!.doStream).not.toHaveBeenCalled()
  })

  it('stops at the first non-quota failure part-way down the chain', async () => {
    const chain = [
      model('primary', httpError(429)),
      model('second', httpError(400, 'Invalid JSON payload')),
      model('third'),
    ]
    await expect(answeredBy(chain)).rejects.toThrow('Invalid JSON payload')
    expect(chain[2]!.doStream).not.toHaveBeenCalled()
  })

  it('steps over a fallback Google has since retired', async () => {
    const chain = [
      model('primary', httpError(429)),
      model('retired', httpError(404, 'models/gemini-x is not found')),
      model('third'),
    ]
    expect(await answeredBy(chain)).toBe('third')
  })

  it('still reports a primary that does not exist, so a typo stays loud', async () => {
    const chain = [model('typo', httpError(404, 'models/gemini-x is not found')), model('second')]
    await expect(answeredBy(chain)).rejects.toThrow('is not found')
    expect(chain[1]!.doStream).not.toHaveBeenCalled()
  })
})
