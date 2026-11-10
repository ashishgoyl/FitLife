import { getCoachAdvice } from '../services/geminiService.js'

export async function handleAiCoach(req, res, body) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  let healthData = {}
  try {
    healthData = typeof body === 'object' && body !== null ? body : JSON.parse(body || '{}')
  } catch {}

  const result = await getCoachAdvice(healthData)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(result))
}

