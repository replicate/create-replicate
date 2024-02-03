import Replicate from 'replicate'
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.REPLICATE_API_TOKEN) {
  console.error('REPLICATE_API_TOKEN not found in environment')
  console.error('To copy a token, go to https://replicate.com/account')
  console.error('Then add your token to a local .env file like this:')
  console.error('echo "REPLICATE_API_TOKEN=your-token" > .env')
  process.exit()
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://npm.im/create-replicate'
})
const model = '{{MODEL}}'
const input = '{{INPUTS}}'

console.log('Model:', model)
console.log('Prompt:', input.prompt)
console.log('Running...')
const output = await replicate.run(model, { input })
console.log('Done!', output)
