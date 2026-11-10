import { sendOtpMessage } from '../services/otpService.js'

export async function handleSendOtp(req, res, body) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  try {
    const payload = typeof body === 'object' && body !== null ? body : JSON.parse(body || '{}')
    const result = await sendOtpMessage(payload)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result))
  } catch (err) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ success: false, error: err.message || 'Failed to dispatch OTP.' }))
  }
}

