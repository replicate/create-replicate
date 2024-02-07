import Replicate from 'replicate'
import fs from 'fs'
import path from 'path'

export function getModelInputs (model) {
  return model.default_example.input
}

export function getModelNameWithVersion (model) {
  return `${model.owner}/${model.name}:${model.latest_version.id}`
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
