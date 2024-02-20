import fs from 'fs'
import Replicate from 'replicate'
import dotenv from 'dotenv'
dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})

const pipeline = JSON.parse(fs.readFileSync('./pipeline.json', 'utf8'))

for (const {model, input} of pipeline) {
  console.log({ model, input })
  console.log('Running...')
  const output = await replicate.run(model, { input })
  console.log('Done!', output)
}