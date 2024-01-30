#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const targetAppName = process.argv[2] || 'my-replicate-app'

console.log(`Creating app "${targetAppName}"...`)
console.log('Copying files...')
const templateDir = path.join(__dirname, 'template')
const targetDir = path.join(process.cwd(), targetAppName)
fs.cpSync(templateDir, targetDir, { recursive: true })

console.log('Setting package name...')
execSync(`npm pkg set name=${targetAppName}`, { cwd: targetDir, stdio: 'inherit' })

console.log('Installing dependencies...')
execSync('npm install', { cwd: targetDir, stdio: 'inherit' })

console.log('\n\nReplicate app created successfully!')
console.log(`Try it out by running the following commands:\n\ncd ${targetAppName} && npm start`)
