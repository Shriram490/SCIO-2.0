require('dotenv').config();
const { buildQuizPrompt } = require('./src/ai-engine/promptBuilder');
const { generateQuizWithAI } = require('./src/ai-engine/geminiService');
const { parseAIResponse } = require('./src/ai-engine/formatter');

async function test() {
  try {
    const prompt = buildQuizPrompt('React Hooks', 'easy', 2);
    console.log('Sending prompt to Gemini...');
    const resultText = await generateQuizWithAI(prompt);
    console.log('Got response. Parsing...');
    const parsed = parseAIResponse(resultText);
    console.log('Parsed successfully:', JSON.stringify(parsed, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}
test();
