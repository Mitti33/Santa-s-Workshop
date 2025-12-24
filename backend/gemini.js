const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function generateGiftImage(wish) {
//   const model = genAI.getGenerativeModel({ model: "gemini-3-pro-image-preview" });

//   const prompt = `A magical Christmas illustration of ${wish}, festive and cozy`;

//   const result = await model.generateContent(prompt);
//   // Depending on Gemini’s response format, you’ll get either base64 image data or a URL
//   return result.response.text(); // adjust if it returns image data
// }

// module.exports = { generateGiftImage };

async function generateSantaLetter(name, wish) { 
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    const prompt = ` Write a warm, festive Christmas letter from Santa Claus to ${name}. 
    Mention their wish for "${wish}" and respond with kindness, encouragement, and holiday cheer. 
    Keep it magical and heartfelt. Maximum length should be approximately 200 to 300 words. Write the
    letter as if Santa knows the reader will read it upon getting up on Christmas morning while
    unwraping Santa's gift. Keep the letter safe and family-friendly.`; 
    const result = await model.generateContent(prompt); 
    return result.response.text(); 
} 
module.exports = { generateSantaLetter };