import models from 'all-the-public-replicate-models'

export function getModelInputs (model) {
  return model.default_example.input
}

export function getModelNameWithVersion (model) {
  return `${model.owner}/${model.name}:${model.latest_version.id}`
}

export function getModel (fullModelName) {
  const [owner, modelName] = fullModelName.split('/')

  const model = models.find(model => model.owner === owner && model.name === modelName)

  if (!model) {
    throw new Error(`Model "${fullModelName}" not found`)
  }

  return model
}
