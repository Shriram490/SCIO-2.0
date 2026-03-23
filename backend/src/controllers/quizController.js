const { buildQuizPrompt } = require('../ai-engine/promptBuilder');
const { generateQuizWithAI } = require('../ai-engine/geminiService');
const { parseAIResponse } = require('../ai-engine/formatter');
const Quiz = require('../models/Quiz');

const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty = 'medium', numberOfQuestions = 5 } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, message: 'Topic is required' });
    }

    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Invalid difficulty level' });
    }

    const numQuestions = parseInt(numberOfQuestions, 10);
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 20) {
      return res.status(400).json({ success: false, message: 'Number of questions must be between 1 and 20' });
    }

    const prompt = buildQuizPrompt(topic, difficulty, numQuestions);

    let resultJson = null;
    let attempts = 0;
    const maxAttempts = 2; // 1 retry if failed
    let lastError = null;

    while (attempts < maxAttempts && !resultJson) {
      attempts++;
      try {
        const rawAiResponse = await generateQuizWithAI(prompt);
        resultJson = parseAIResponse(rawAiResponse);
      } catch (err) {
        console.warn(`Attempt ${attempts} failed to generate valid quiz:`, err.message);
        lastError = err;
      }
    }

    if (!resultJson) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate valid quiz after multiple attempts', 
        error: lastError?.message 
      });
    }

    const newQuiz = new Quiz({
      title: resultJson.quizTitle || `${topic} Quiz`,
      topic,
      difficulty: difficulty.toLowerCase(),
      questions: resultJson.questions,
      createdBy: req.user ? req.user.id : null
    });

    await newQuiz.save();

    res.status(201).json({
      success: true,
      message: 'Quiz generated successfully',
      data: newQuiz
    });

  } catch (error) {
    console.error('Quiz Generation Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during quiz generation'
    });
  }
};

module.exports = { generateQuiz };
