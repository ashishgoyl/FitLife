import http from 'http'
import { handleRequest } from './src/app.js'
import { getEnvValue } from './src/services/configService.js'

const PORT = Number(process.env.PORT || process.env.BACKEND_PORT || 5001)

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((err) => {
    console.error('[FitLife Server Error]:', err)
    if (!res.headersSent) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }))
    }
  })
})

server.listen(PORT, '0.0.0.0', () => {
  const geminiConfigured = Boolean(getEnvValue('GEMINI_API_KEY') || getEnvValue('GOOGLE_API_KEY'))
  console.log(`\n🚀 FitLife Backend API Server running at: http://localhost:${PORT}`)
  console.log(`   Health Check:     http://localhost:${PORT}/api/health`)
  console.log(`   AI Coach:         http://localhost:${PORT}/api/ai-coach [Gemini: ${geminiConfigured ? 'Active' : 'Fallback Engine'}]`)
  console.log(`   OTP Dispatch:     http://localhost:${PORT}/api/send-otp`)
  console.log(`   Google Auth API:  http://localhost:${PORT}/api/google-client-id\n`)
})

export default server

