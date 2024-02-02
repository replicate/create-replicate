import { describe, it, expect, afterEach } from 'vitest'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

describe('Node script test', () => {
  const directoryName = 'foo'

  // Function to check if a file exists
  const fileExists = (filePath) => {
    try {
      return fs.existsSync(filePath)
    } catch (err) {
      return false
    }
  }

  // Clean up after each test
  afterEach(() => {
    if (fs.existsSync(directoryName)) {
      fs.rmSync(directoryName, { recursive: true, force: true })
    }
  })

  it('should create a directory with expected files', () => {
    const command = `REPLICATE_API_TOKEN=test_token node index.mjs ${directoryName} --run-after-setup=false`

    execSync(command, { stdio: 'ignore', env: process.env })

    // Check if the directory exists
    expect(fs.existsSync(directoryName)).toBe(true)

    // Check if package.json exists in the directory
    expect(fileExists(path.join(directoryName, 'package.json'))).toBe(true)

    // Check if index.js exists in the directory
    expect(fileExists(path.join(directoryName, 'index.js'))).toBe(true)

    // Check if .env exists in the directory with test token
    const envFile = path.join(directoryName, '.env')
    expect(fileExists(envFile)).toBe(true)
    const envFileContents = fs.readFileSync(envFile, 'utf8')
    expect(envFileContents).toBe('REPLICATE_API_TOKEN=test_token')

    // Check if .gitignore exists in the directory
    const gitignoreFile = path.join(directoryName, '.gitignore')
    expect(fileExists(gitignoreFile)).toBe(true)
    const gitignoreFileContents = fs.readFileSync(gitignoreFile, 'utf8')
    expect(gitignoreFileContents).toBe('.env\n.npmrc')
  })
})
