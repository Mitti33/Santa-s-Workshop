// moderation.js
// const { InferenceClient } = require("@huggingface/inference");

// const client = new InferenceClient(process.env.HF_API_KEY);

// async function isSafeWish(wish) {
//   try {
//     const result = await client.textClassification({
//       model: "unitary/toxic-bert", // moderation model
//       inputs: wish
//     });

//     // Result is an array of labels with scores
//     // Example: [{label: "toxic", score: 0.95}, {label: "safe", score: 0.05}]
//     const toxic = result.find(r => r.label.toLowerCase().includes("toxic"));
//     return !toxic || toxic.score < 0.5; // block if toxic score ≥ 0.5
//   } catch (err) {
//     console.error("Moderation error:", err);
//     // Fail-safe: block if moderation fails
//     return false;
//   }
// }

const bannedWords = [ "kill","murder","blood","weapon","gun","knife","bomb","shoot","attack","terrorist", "suicide","hang","cut","die","death", "drugs","cocaine","penis","heroin","meth","alcohol abuse", "hate","racist","sexist","homophobic","fuck","sex","kiss","romance","nude","porn","naked","slang","baby"// add more terms you want to block 
]; 
function isSafeWish(wish) { 
    const lower = wish.toLowerCase(); 
    return !bannedWords.some(word => lower.includes(word)); 
}

module.exports = { isSafeWish };
