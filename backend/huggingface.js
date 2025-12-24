const axios = require("axios");

// async function generateHFImage(prompt) {
//   const response = await axios.post(
//     "https://router.huggingface.co/models/runwayml/stable-diffusion-v1-5",
//     { inputs: prompt },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.HF_API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       responseType: "arraybuffer" // Hugging Face returns raw image bytes
//     }
//   );

//   // Convert binary to base64 so you can embed directly in <img>
//   const base64Image = Buffer.from(response.data, "binary").toString("base64");
//   return `data:image/png;base64,${base64Image}`;
// }

// module.exports = { generateHFImage };

// import { InferenceClient } from "@huggingface/inference";
// import fs from "fs";

// const client = new InferenceClient(process.env.HF_TOKEN);

// async function generateTurboImage(prompt) {
//   const image = await client.textToImage({
//     provider: "fal-ai",
//     model: "Tongyi-MAI/Z-Image-Turbo",
//     inputs: prompt,
//     parameters: { num_inference_steps: 5 },
//   });

//   // The result is a Blob → convert to Buffer
//   const arrayBuffer = await image.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   // Option 1: Save to file
//   //fs.writeFileSync("output.png", buffer);

//   // Option 2: Return base64 for embedding in <img>
//   return `data:image/png;base64,${buffer.toString("base64")}`;
// }

async function generateTurboImage(prompt) {
  const { InferenceClient } = await import("@huggingface/inference");
  const client = new InferenceClient(process.env.HF_API_KEY);

  const image = await client.textToImage({
    //provider: "fal-ai",
    //model: "Tongyi-MAI/Z-Image-Turbo",
    //inputs: prompt,
    provider: "hf-inference",
    model: "stabilityai/stable-diffusion-xl-base-1.0", // ✅ free model 
    //inputs: "Astronaut riding a horse in a magical Christmas style",
    //: "A vivid and colorful realistic image of ${prompt} with a dramatic lighting.",
    inputs: `A joyful and colorful and imaginative image of ${prompt}, with dramatic lighting, safe and family-friendly`,
    parameters: { num_inference_steps: 30, guidance_scale: 7, negative_prompt: "family, people, holiday"},
  });

  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}


module.exports = {generateTurboImage};