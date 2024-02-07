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
    const command = `REPLICATE_API_TOKEN=r8_test_token node index.mjs ${directoryName} --run-after-setup=false`

    // set stdio to 'inherit' to see script output in test output
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
    expect(envFileContents).toBe('REPLICATE_API_TOKEN=r8_test_token')

    // Check if .gitignore exists in the directory
    const gitignoreFile = path.join(directoryName, '.gitignore')
    expect(fileExists(gitignoreFile)).toBe(true)
    const gitignoreFileContents = fs.readFileSync(gitignoreFile, 'utf8')
    expect(gitignoreFileContents).toBe('.env\n.npmrc')
  })

  it('handles basic `model` argument in the form {owner}/{model}', () => {
    const command = `REPLICATE_API_TOKEN=r8_test_token node index.mjs ${directoryName} --model=yorickvp/llava-13b --run-after-setup=false`

    // set stdio to 'inherit' to see script output in test output
    execSync(command, { stdio: 'ignore', env: process.env })

    // Check if the directory exists
    expect(fs.existsSync(directoryName)).toBe(true)

    // Check if index.js exists in the directory
    const indexFile = path.join(directoryName, 'index.js')
    expect(fileExists(indexFile)).toBe(true)

    // Check if index.js contains the correct model name
    const indexFileContents = fs.readFileSync(indexFile, 'utf8')
    expect(indexFileContents).toMatch(/yorickvp\/llava-13b:[a-zA-Z0-9]{64}/)
  })

  it('handles a `model` argument in the form {owner}/{model}:{version}', () => {
    const command = `REPLICATE_API_TOKEN=r8_test_token node index.mjs ${directoryName} --model=yorickvp/llava-13b:2cfef05a8e8e648f6e92ddb53fa21a81c04ab2c4f1390a6528cc4e331d608df8 --run-after-setup=false`

    // set stdio to 'inherit' to see script output in test output
    execSync(command, { stdio: 'ignore', env: process.env })

    // Check if the directory exists
    expect(fs.existsSync(directoryName)).toBe(true)

    // Check if index.js exists in the directory
    const indexFile = path.join(directoryName, 'index.js')
    expect(fileExists(indexFile)).toBe(true)

    // Check if index.js contains the correct model name
    const indexFileContents = fs.readFileSync(indexFile, 'utf8')
    expect(indexFileContents).toContain("const model = 'yorickvp/llava-13b:2cfef05a8e8e648f6e92ddb53fa21a81c04ab2c4f1390a6528cc4e331d608df8'")
  })
})
