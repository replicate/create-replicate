#!/usr/bin/env node

import fs from 'fs'
import path, { dirname } from 'path'
import { execSync } from 'child_process'
import minimist from 'minimist'
import JSON5 from 'json5'
import readline from 'readline'
import { promisify } from 'util'
import open from 'open'

// ESM shenanigans for dealing with local files
import { fileURLToPath } from 'url'
import { getModel, getModelInputs, getModelNameWithVersion } from './lib/models.js'
const readlineSync = await import('readline-sync').then(module => module.default)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const args = minimist(process.argv.slice(2), {
  boolean: ['run-after-setup'],
  default: { 'run-after-setup': true }
})

const targetAppName = args._[0] || 'my-replicate-app'
const modelName = args.model || 'stability-ai/sdxl'

let model
try {
  model = getModel(modelName)
} catch (e) {
  console.error('Model not found:', modelName)
  process.exit()
}

// If user has provided a model version, use it. Otherwise, use the latest version
const modelVersionRegexp = /.*:[a-fA-F0-9]{64}$/
const modelNameWithVersion = modelName.match(modelVersionRegexp) ? modelName : getModelNameWithVersion(model)

const inputs = getModelInputs(model)

console.log(`Creating project "${targetAppName}"...`)
console.log(`Model: ${modelName}...`)
console.log('Copying files...')
const templateDir = path.join(__dirname, 'template')
const targetDir = path.join(process.cwd(), targetAppName)
fs.cpSync(templateDir, targetDir, { recursive: true })

// Get env from existing REPLICATE_API_TOKEN, or prompt user to get it from the browser
const envFile = path.join(targetDir, '.env')

if (process.env.REPLICATE_API_TOKEN) {
  fs.writeFileSync(envFile, `REPLICATE_API_TOKEN=${process.env.REPLICATE_API_TOKEN}`)
  console.log('Adding API token to .env file')
} else {
  console.log('API token not found in environment.')
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const question = promisify(rl.question).bind(rl)
  const answer = await question('Open your browser to copy a Replicate API token? (Y/n) ')
  if (answer.toLowerCase() === 'y' || answer === '') {
    await open('https://replicate.com/account')
    const token = readlineSync.question('Paste your API token here: ', { hideEchoBack: true })
    fs.writeFileSync(envFile, `REPLICATE_API_TOKEN=${token}`)
    console.log('API token written to .env file')
  }
}

console.log('Setting package name...')
execSync(`npm pkg set name=${targetAppName}`, { cwd: targetDir, stdio: 'ignore' })

console.log('Installing dependencies...')
execSync('npm install', { cwd: targetDir, stdio: 'ignore' })

const indexFile = path.join(targetDir, 'index.js')
const indexFileContents = fs.readFileSync(indexFile, 'utf8')
const newContents = indexFileContents
  .replace('{{MODEL}}', modelNameWithVersion)
  .replace('\'{{INPUTS}}\'', JSON5.stringify(inputs, null, 2))
fs.writeFileSync(indexFile, newContents)

console.log('App created successfully!')

if (args['run-after-setup']) {
  console.log(`Running command: \`node ${targetAppName}/index.js\`\n\n`)
  execSync('node index.js', { cwd: targetDir, stdio: 'inherit' })
} else {
  console.log('To run your app, execute the following command:')
  console.log(`cd ${targetAppName} && node index.js`)
}
