import Replicate from 'replicate'
import dotenv from 'dotenv'
dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})
const model = '{{MODEL}}'
const version = '{{VERSION}}'
const input = '{{INPUTS}}'

console.log('Using model: %s', model)
console.log('With input: %O', input)

console.log('Running...')
let prediction = await replicate.predictions.create({ version, input })
prediction = await replicate.wait(prediction)

console.log('Done!')
console.log('Output:', prediction.output)
console.log('View this prediction on the web:', `https://replicate.com/p/${prediction.id}`)
