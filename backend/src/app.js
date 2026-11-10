import { handleAiCoach } from './controllers/aiCoachController.js'
import { handleSendOtp } from './controllers/otpController.js'
import { handleGoogleClientId } from './controllers/authController.js'

/**
 * Main HTTP Request Handler for FitLife API
 */
export async function handleRequest(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-rapidapi-key')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const pathname = url.pathname

  // Collect request body for POST/PUT requests
  let rawBody = ''
  if (req.method === 'POST' || req.method === 'PUT') {
    for await (const chunk of req) {
      rawBody += chunk
    }
  }

  let parsedBody = null
  if (rawBody) {
    try {
      parsedBody = JSON.parse(rawBody)
    } catch {
      parsedBody = rawBody
    }
  }

  // Routes
  if (pathname === '/api/ai-coach') {
    return handleAiCoach(req, res, parsedBody)
  }

  if (pathname === '/api/send-otp') {
    return handleSendOtp(req, res, parsedBody)
  }

  if (pathname === '/api/google-client-id') {
    return handleGoogleClientId(req, res, parsedBody)
  }

  if (pathname === '/api/health') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }))
    return
  }

  // Not Found
  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ error: `Route ${pathname} not found` }))
}

