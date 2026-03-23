const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const key = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
console.log("🔍 Gemini API Key loaded. Length:", key.length);
if (key) {
  console.log("🔍 Key starts/ends with:", key.substring(0, 4) + "..." + key.substring(key.length - 4));
}
const genAI = new GoogleGenerativeAI(key);


router.post("/generate-quiz", async (req, res) => {
  try {
    const { subject, difficulty, questionCount, questionTypes } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-pro"
    });


    const prompt = `
You are a quiz generator.

Create ${questionCount} ${difficulty} level quiz questions about ${subject}.

Rules:
- Mix question types: ${questionTypes.join(", ")}
- Provide 4 options for MCQ
- correctAnswer should be index number
- explanation must be short and educational

Return ONLY JSON in this format:

{
 "questions":[
  {
   "id":1,
   "type":"multiple-choice",
   "question":"Question text",
   "options":["A","B","C","D"],
   "correctAnswer":0,
   "explanation":"Explanation"
  }
 ]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    let cleanedResponse = responseText.trim();
    
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/^```json/, "").replace(/```$/, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/^```/, "").replace(/```$/, "");
    }
    
    const jsonStart = cleanedResponse.indexOf("{");
    const jsonEnd = cleanedResponse.lastIndexOf("}");
    const json = JSON.parse(cleanedResponse.slice(jsonStart, jsonEnd + 1));



    res.json(json);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

module.exports = router;
