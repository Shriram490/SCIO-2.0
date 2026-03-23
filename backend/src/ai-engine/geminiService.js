const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateQuizWithAI = async (prompt) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating AI content:', error);
    throw new Error('Failed to generate quiz from AI provider');
  }
};

module.exports = { generateQuizWithAI };
