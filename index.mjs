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
import { isValidToken, redactToken } from './lib/token.js'

const readlineSync = await import('readline-sync').then(module => module.default)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const args = minimist(process.argv.slice(2), {
  boolean: ['run-after-setup', 'debug'],
  default: {
    'run-after-setup': true,
    debug: false,
    model: 'black-forest-labs/flux-dev'
  }
})
args.packageName = args._[0] || 'my-replicate-app'

if (args.debug) {
  console.debug({ args })
}

// Display version number if --version flag is present
if (args.version) {
  const { version } = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'))
  console.log(version)
  process.exit()
}

console.log(`Creating project "${args.packageName}"...`)
console.log(`Model: ${args.model}...`)
console.log('Copying files...')
const templateDir = path.join(__dirname, 'template')
const targetDir = path.join(process.cwd(), args.packageName)
fs.cpSync(templateDir, targetDir, { recursive: true })

// Copy hidden files too
const gitignoreSrc = path.join(templateDir, 'gitignore')
const gitignoreDest = path.join(targetDir, '.gitignore')
fs.copyFileSync(gitignoreSrc, gitignoreDest)

// Get env from existing REPLICATE_API_TOKEN, or prompt user to get it from the browser
const envFile = path.join(targetDir, '.env')

if (process.env.REPLICATE_API_TOKEN) {
  fs.writeFileSync(envFile, `REPLICATE_API_TOKEN=${process.env.REPLICATE_API_TOKEN}`)
  console.log(`Adding API token ${redactToken(process.env.REPLICATE_API_TOKEN)} to .env file...`)
} else {
  console.log('API token not found in environment.')
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const question = promisify(rl.question).bind(rl)
  const answer = await question('Open your browser to copy a Replicate API token? (Y/n) ')
  if (answer.toLowerCase() === 'y' || answer === '') {
    await open('https://replicate.com/account/api-tokens?utm_campaign=create-replicate&utm_source=project')
    const token = readlineSync.question('Paste your API token here: ', { hideEchoBack: true })

    // Add the pasted token to the user's local .env file for when they run their project
    fs.writeFileSync(envFile, `REPLICATE_API_TOKEN=${token}`)

    // Also add the pasted token to THIS script's environment, so we can use it to make Replicate API calls
    process.env.REPLICATE_API_TOKEN = token

    console.log(`API token ${redactToken(process.env.REPLICATE_API_TOKEN)} written to .env file`)
  }
}

// Check use-provided API token looks legit before proceeding
if (!isValidToken(process.env.REPLICATE_API_TOKEN)) {
  console.log('Invalid API token:', redactToken(process.env.REPLICATE_API_TOKEN))
  console.log('Go to https://replicate.com/account, copy a valid token, then re-run this command')
  process.exit()
}

console.log('Setting package name...')
execSync(`npm pkg set name=${args.packageName}`, { cwd: targetDir, stdio: 'ignore' })

console.log('Installing dependencies...')
execSync('npm install', { cwd: targetDir, stdio: 'ignore' })

console.log('Fetching model metadata using Replicate API...')
const model = await getModel(args.model)

// If user has provided a model version, use it. Otherwise, use the latest version
const modelVersionRegexp = /.*:[a-fA-F0-9]{64}$/
const modelNameWithVersion = args.model.match(modelVersionRegexp) ? args.model : getModelNameWithVersion(model)

const inputs = getModelInputs(model)

const indexFile = path.join(targetDir, 'index.js')
const indexFileContents = fs.readFileSync(indexFile, 'utf8')
const newContents = indexFileContents
  .replace('{{MODEL}}', modelNameWithVersion)
  .replace('\'{{INPUTS}}\'', JSON5.stringify(inputs, null, 2))
fs.writeFileSync(indexFile, newContents)

console.log('App created successfully!')

if (args['run-after-setup']) {
  console.log(`Running command: \`node ${args.packageName}/index.js\`\n`)
  console.log('--- START OF OUTPUT ---')
  execSync('node index.js', { cwd: targetDir, stdio: 'inherit' })
  console.log('--- END OF OUTPUT ---')
} else {
  console.log('To run your app, execute the following command:')
  console.log(`cd ${args.packageName} && node index.js`)
}

console.log('')
console.log('To learn more about configuring this model check out the documentation:')
console.log(` - Model API Documentation: https://replicate.com/${model.owner}/${model.name}/api`)
console.log(' - Replicate Documentation: https://replicate.com/docs/get-started/nodejs')
console.log(' - Replicate JavaScript Client: https://github.com/replicate/replicate-javascript#readme')
