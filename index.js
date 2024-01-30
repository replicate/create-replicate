#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const targetAppName = 'my-replicate-app';

console.log("Creating a Replicate app...");
console.log("Copying files...");
const templateDir = path.join(__dirname, 'template');
const targetDir = path.join(process.cwd(), targetAppName);
fs.cpSync(templateDir, targetDir, { recursive: true });

const { execSync } = require('child_process');

console.log("Installing dependencies...");
execSync('npm install', { cwd: targetDir, stdio: 'inherit' });


console.log("\n\nReplicate app created successfully!");
console.log(`Try it out by running the following commands:\n\ncd ${targetAppName} && npm start`);