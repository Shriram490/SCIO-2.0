const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate-quiz", async (req, res) => {
  try {
    const { subject, difficulty, questionCount, questionTypes } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
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
    const response = result.response.text();

    const jsonStart = response.indexOf("{");
    const json = JSON.parse(response.slice(jsonStart));

    res.json(json);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

module.exports = router;
