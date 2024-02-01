# create-replicate-app

Generate a simple Node.js project structure for running AI models with Replicate's API

## Usage

Make sure you have [Node.js](https://nodejs.org/) 18 or greater installed, then run:

```console
npm create replicate-app
```

You can specify an optional name for your project:

```console
npm create replicate-app foo
```

You can also specify which model you want to use as a starting point:

```console
npm create replicate-app my-image-interrogator --model=yorickvp/llava-13b
```

:point_up: This will work any model that is public, has at least one published version, and at least one example prediction.