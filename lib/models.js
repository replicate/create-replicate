import models from 'all-the-public-replicate-models'

export function getModelInputs (model) {
  return model.default_example.input
}

export function getModelNameWithVersion (model) {
  return `${model.owner}/${model.name}:${model.latest_version.id}`
}

export function getModel (fullModelName) {
  // Extract owner and model name, omitting the version if it's present
  const [owner, modelName] = fullModelName.split(':')[0].split('/')

  const model = models.find(model => model.owner === owner && model.name === modelName)

  if (!model) {
    throw new Error(`Model "${fullModelName}" not found`)
  }

  return model
}
