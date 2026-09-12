import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { convertToModelMessages, streamText } from 'ai'
import { withModelFallbacks } from '../../utils/assistantFallback'

/**
 * The documentation assistant, running on Google's Gemini API instead of the
 * Vercel AI Gateway that Docus reaches for by default.
 *
 * This file is the whole switch. Docus registers its own handler on this path,
 * then removes it again when it finds a scanned route of ours there — see the
 * `nitro:build:before` hook in `docus/modules/assistant/index.ts`. On Vercel
 * that matters, because `VERCEL_OIDC_TOKEN` is injected at build time and would
 * otherwise silently keep the Gateway version (and its billing) in place.
 *
 * Everything except the model still comes from Docus:
 * `getAssistantDefaultOptions` supplies the system prompt and connects the docs
 * MCP server, so the assistant can still list and read pages.
 */

/**
 * Tried in order when the configured model runs out of quota, by
 * `withModelFallbacks`. They descend in capability on purpose: a slower answer
 * from a smaller model beats an error.
 */
const FALLBACK_MODEL_IDS = [
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite-preview',
]

export default defineEventHandler(async (event) => {
  // Read by `@ai-sdk/google` under this exact name by default; passed through
  // explicitly so a missing key fails here with something readable rather than
  // deep inside the SDK once a visitor has already asked a question.
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'The assistant is not configured: GOOGLE_GENERATIVE_AI_API_KEY is not set.',
    })
  }

  const { messages } = await readBody(event)
  const config = useRuntimeConfig()
  const google = createGoogleGenerativeAI({ apiKey })

  // Docus writes the model as an AI Gateway id (`google/gemini-3-flash`). The
  // Google provider addresses models by bare name, so drop the vendor prefix
  // and the default config keeps working untouched.
  const primary = config.assistant.model.replace(/^google\//, '')
  const modelIds = [primary, ...FALLBACK_MODEL_IDS.filter(id => id !== primary)]

  return createAssistantResponse(streamText({
    ...await getAssistantDefaultOptions(event),
    model: withModelFallbacks(modelIds.map(id => google(id))),
    messages: await convertToModelMessages(messages),
  }))
})
