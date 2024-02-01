import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
const model = '{{MODEL}}'
const input = '{{INPUTS}}'

console.log('Model:', model)
console.log('Prompt:', input.prompt)
console.log('Running...')
const output = await replicate.run(model, { input })
console.log('Done!', output)
