const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { generateQuiz } = require('../controllers/quizController');
const { auth } = require('../middleware/auth');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many quizzes generated from this IP, please try again after 15 minutes' }
});

const optionalAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return auth(req, res, next);
  } else {
    next();
  }
};

router.post('/generate', apiLimiter, optionalAuth, generateQuiz);

module.exports = router;
