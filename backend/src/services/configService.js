import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Locate .env in workspace root or current working directory
 */
export function getEnvFilePath() {
  const possiblePaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '../../../.env'),
    path.resolve(__dirname, '../../.env'),
  ]

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p
  }
  return possiblePaths[0]
}

/**
 * Retrieve environment variable from process.env or .env file
 */
export function getEnvValue(keyName) {
  if (process.env[keyName]) return process.env[keyName].trim()

  try {
    const envFile = getEnvFilePath()
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf8')
      const match = content.match(new RegExp(`^${keyName}\\s*=\\s*(.*)$`, 'm'))
      if (match) {
        return match[1].trim().replace(/^["']|["']$/g, '')
      }
    }
  } catch {}

  return ''
}

/**
 * Update Google Client ID in .env file and environment
 */
export function updateGoogleClientId(cleanId) {
  const envFile = getEnvFilePath()
  let envContent = ''
  if (fs.existsSync(envFile)) {
    envContent = fs.readFileSync(envFile, 'utf8')
  }

  if (/^VITE_GOOGLE_CLIENT_ID\s*=/m.test(envContent)) {
    envContent = envContent.replace(/^VITE_GOOGLE_CLIENT_ID\s*=.*$/m, `VITE_GOOGLE_CLIENT_ID=${cleanId}`)
  } else {
    envContent += `\nVITE_GOOGLE_CLIENT_ID=${cleanId}\n`
  }

  fs.writeFileSync(envFile, envContent, 'utf8')
  process.env.VITE_GOOGLE_CLIENT_ID = cleanId
  return cleanId
}

