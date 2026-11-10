import { getEnvValue, updateGoogleClientId } from '../services/configService.js'

export async function handleGoogleClientId(req, res, body) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'GET') {
    const clientId = getEnvValue('VITE_GOOGLE_CLIENT_ID') || getEnvValue('GOOGLE_CLIENT_ID')
    res.statusCode = 200
    res.end(JSON.stringify({ clientId }))
    return
  }

  if (req.method === 'POST') {
    try {
      const payload = typeof body === 'object' && body !== null ? body : JSON.parse(body || '{}')
      const cleanId = String(payload.clientId || '').trim()
      updateGoogleClientId(cleanId)
      res.statusCode = 200
      res.end(JSON.stringify({ success: true, clientId: cleanId }))
    } catch (err) {
      res.statusCode = 400
      res.end(JSON.stringify({ success: false, error: err.message }))
    }
    return
  }

  res.statusCode = 405
  res.end(JSON.stringify({ error: 'Method not allowed' }))
}

