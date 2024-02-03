# create-replicate-app

Generate a simple Node.js project structure for running AI models with [Replicate](https://replicate.com).

What it does:

- Creates a directory for your project
- Lets you specify any public model as a starting point, or defaults to [stability-ai/sdxl](https://replicate.com/stability-ai/sdxl)
- Adds a package.json file with necessary dependencies like the [replicate](https://npm.im/replicate) npm package.
- Runs `npm install`
- Adds a .env file and helps you add your Replicate API token
- Gitignores the .env file so you keep your secrets out of source control
- Runs your app with a simple example input

## Usage

Make sure you have [Node.js](https://nodejs.org/) 18 or greater installed, then run:

```console
npm create replicate-app
```

You can specify an optional name for your project:

```console
npm create replicate-app foo
```

You can also specify which model you want to use as a starting point. The latest version of the model will be used:

```console
npm create replicate-app my-image-interrogator --model=yorickvp/llava-13b
```

You can also specify a version of the model you want to use:

```console
npm create replicate-app my-image-interrogator --model=yorickvp/llava-13b:2cfef05a8e8e648f6e92ddb53fa21a81c04ab2c4f1390a6528cc4e331d608df8
```