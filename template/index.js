import Replicate from "replicate";

const replicate = new Replicate({auth: process.env.REPLICATE_API_TOKEN});
const model = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
const input = {
  prompt: "An astronaut riding a rainbow unicorn, cinematic, dramatic",
  num_outputs: 1,
}

console.log("Model:", model);
console.log("Prompt:", input.prompt);
console.log("Running...")
const output = await replicate.run(model, {input});
console.log("Done!", output);