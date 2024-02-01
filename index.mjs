#!/usr/bin/env node

import fs from 'fs'
import path, { dirname } from 'path'
import { execSync } from 'child_process'
import minimist from 'minimist'
import JSON5 from 'json5'

// ESM shenanigans for dealing with local files
import { fileURLToPath } from 'url'
import { getModel, getModelInputs, getModelNameWithVersion } from './lib/models.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const argv = minimist(process.argv.slice(2))

const targetAppName = argv._[0] || 'my-replicate-app'
const modelName = argv.model || 'stability-ai/sdxl'

let model
try {
  model = getModel(modelName)
} catch (e) {
  console.error('Model not found:', modelName)
  process.exit()
}

const modelNameWithVersion = getModelNameWithVersion(model)
const inputs = getModelInputs(model)

console.log(`Creating project "${targetAppName}"...`)
console.log(`Model: ${modelName}...`)
console.log('Copying files...')
const templateDir = path.join(__dirname, 'template')
const targetDir = path.join(process.cwd(), targetAppName)
fs.cpSync(templateDir, targetDir, { recursive: true })

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
console.log(`Running command: \`node ${targetAppName}/index.js\`\n\n`)

execSync("node index.js", { cwd: targetDir, stdio: 'inherit' })
