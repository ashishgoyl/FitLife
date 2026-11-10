import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

console.log('\x1b[32m%s\x1b[0m', '🌱 Starting FitLife Full-Stack Development Environment...')

// 1. Spawn Backend
const backend = spawn('node', ['server.js'], {
  cwd: path.resolve(rootDir, 'backend'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
  env: { ...process.env, PORT: '5001' },
})

backend.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n')
  for (const line of lines) {
    console.log('\x1b[36m[backend]\x1b[0m', line)
  }
})

backend.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n')
  for (const line of lines) {
    console.error('\x1b[31m[backend error]\x1b[0m', line)
  }
})

// 2. Spawn Frontend Vite
const frontend = spawn('npx', ['vite'], {
  cwd: path.resolve(rootDir, 'frontend'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
  env: { ...process.env, VITE_BACKEND_URL: 'http://localhost:5001' },
})

frontend.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n')
  for (const line of lines) {
    console.log('\x1b[35m[frontend]\x1b[0m', line)
  }
})

frontend.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n')
  for (const line of lines) {
    console.error('\x1b[33m[frontend]\x1b[0m', line)
  }
})

function cleanup() {
  console.log('\n\x1b[33mShutting down FitLife servers...\x1b[0m')
  try { backend.kill() } catch {}
  try { frontend.kill() } catch {}
  process.exit(0)
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
process.on('exit', cleanup)

