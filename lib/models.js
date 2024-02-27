import Replicate from 'replicate'
import fs from 'fs'
import path from 'path'

export function getModelInputs (model) {
  return model.default_example.input
}

export function getModelNameWithVersion (model) {
  if (supportsPerTokenPricing(model)) {
    return `${model.owner}/${model.name}`
  } else {
    return `${model.owner}/${model.name}:${model.latest_version.id}`
  }
}

export async function getModel (fullModelName) {
  // Extract owner and model name, omitting the version if it's present
  const [owner, name] = fullModelName.split(':')[0].split('/')

  if (process.env.REPLICATE_API_TOKEN === 'r8_test_token') {
    const filePath = path.join(process.cwd(), 'test', 'fixtures', owner, `${name}.json`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const loadedModel = JSON.parse(fileContents)
    return loadedModel
  }

  // Instantiate a Replicate client on the fly instead of at the top of this module,
  // as the API token may have been user-provided and added to the process env AFTER this script's import time.
  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

  const model = await replicate.models.get(owner, name)

  return model
}

export function supportsPerTokenPricing (model) {
  if (model.owner === 'meta') {
    return new Set([
      'llama-2-7b',
      'llama-2-7b-chat',
      'llama-2-13b',
      'llama-2-13b-chat',
      'llama-2-70b',
      'llama-2-70b-chat'
    ]).has(model.name)
  } else if (model.owner === 'mistralai') {
    return new Set([
      'mistral-7b-v0.1',
      'mistral-7b-instruct-v0.2',
      'mixtral-8x7b-instruct-v0.1'
    ]).has(model.name)
  }

  return false
}
