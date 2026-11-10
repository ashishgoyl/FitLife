import { getEnvValue } from './configService.js'
import { generateBuiltinHealthAdvice } from './healthAdviceService.js'

/**
 * Service to call Google Gemini API for personalized health coaching advice.
 */
export async function getCoachAdvice(healthData) {
  const serverApiKey =
    getEnvValue('GEMINI_API_KEY') ||
    getEnvValue('GOOGLE_API_KEY') ||
    getEnvValue('VITE_GEMINI_API_KEY')

  if (serverApiKey) {
    try {
      const systemPrompt =
        'You are an encouraging and supportive health-tracking coach. Give concise, actionable general wellness guidance based only on the supplied daily logs (calories, macros, hydration, workout, and sleep). Use clean bullet points and friendly emojis. Do not diagnose, prescribe, or replace a clinician. Clearly mention when medical advice is appropriate.'
      const userPrompt = `Here are my daily health habits and logs for today:\n${JSON.stringify(healthData, null, 2)}\n\nPlease provide personalized feedback and quick actionable tips for today.`

      const candidateModels = [
        'gemini-3.1-flash-lite',
        'gemini-3.1-flash-lite-preview',
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
      ]

      for (const model of candidateModels) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${serverApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ parts: [{ text: userPrompt }] }],
              }),
            }
          )

          if (res.ok) {
            const data = await res.json()
            const adviceText = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('\n')
            if (adviceText) {
              return { advice: adviceText, source: 'gemini', model }
            }
          }
        } catch {
          // Continue to next model on network/model error
        }
      }
    } catch (geminiError) {
      console.warn('[AI Coach] Gemini API error, falling back to built-in coach:', geminiError)
    }
  }

  // Built-in intelligent fallback
  const advice = generateBuiltinHealthAdvice(healthData)
  return { advice, source: 'builtin' }
}

