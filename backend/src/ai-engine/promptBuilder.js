const buildQuizPrompt = (topic, difficulty, numberOfQuestions) => {
  return `You are an expert AI quiz generator.
Generate a quiz on the topic: "${topic}".
Difficulty level: ${difficulty} (Adjust the complexity of questions accordingly).
Number of questions: ${numberOfQuestions}.

The quiz should contain a mix of Multiple Choice Questions (MCQ) and Short Answer questions. If not specified, aim for a balanced mix or mostly MCQs.
For MCQs, there MUST be exactly 4 options.
For Short Answer questions, there should be no options array.

You MUST return the output STRICTLY in the following JSON format without any markdown wrappers (like \`\`\`json) or additional text.

{
  "quizTitle": "A descriptive title for the quiz",
  "questions": [
    {
      "type": "mcq",
      "question": "The question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The exact text of the correct option"
    },
    {
      "type": "short",
      "question": "The question text here",
      "answer": "The expected short answer"
    }
  ]
}

Ensure the JSON is perfectly valid and can be parsed by JSON.parse().
`;
};

module.exports = { buildQuizPrompt };
