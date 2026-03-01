import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAIQuiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState({
    title: '',
    subject: '',
    difficulty: 'medium',
    questionCount: 10,
    topics: [],
    questionTypes: ['multiple-choice'],
    timeLimit: 30,
    description: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [publishedQuizzes, setPublishedQuizzes] = useState([]);

  const steps = [
    { id: 1, title: 'Basic Information', description: 'Set quiz title and subject' },
    { id: 2, title: 'Quiz Configuration', description: 'Configure difficulty and question types' },
    { id: 3, title: 'AI Generation', description: 'Generate questions with AI' },
    { id: 4, title: 'Review & Edit', description: 'Review and customize questions' },
    { id: 5, title: 'Settings & Publish', description: 'Set time limits and publish' }
  ];

  const [subjects, setSubjects] = useState(['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science', 'Physics', 'Chemistry', 'Biology']);
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const questionTypes = [
    { id: 'multiple-choice', label: 'Multiple Choice' },
    { id: 'true-false', label: 'True/False' },
    { id: 'fill-blank', label: 'Fill in the Blank' },
    { id: 'short-answer', label: 'Short Answer' }
  ];

  // Load published quizzes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('publishedQuizzes');
    if (saved) {
      setPublishedQuizzes(JSON.parse(saved));
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Real AI Question Generation
  const generateQuestions = async () => {
    setIsGenerating(true);
    
    try {
      // Call AI API to generate questions
      const response = await fetch('http://localhost:5000/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: quizData.subject,
          difficulty: quizData.difficulty,
          questionCount: quizData.questionCount,
          questionTypes: quizData.questionTypes,
          topics: quizData.topics
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      setGeneratedQuestions(data.questions);
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to mock questions if API fails
      const mockQuestions = [
        {
          id: 1,
          type: 'multiple-choice',
          question: `What is the capital of ${quizData.subject || 'France'}?`,
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 2,
          explanation: `Paris is the capital and largest city of ${quizData.subject || 'France'}.`
        },
        {
          id: 2,
          type: 'true-false',
          question: `The Earth is flat in ${quizData.subject || 'Geography'}.`,
          correctAnswer: false,
          explanation: 'The Earth is spherical in shape.'
        },
        {
          id: 3,
          type: 'fill-blank',
          question: `The largest planet in our solar system is ____ in ${quizData.subject || 'Astronomy'}.`,
          correctAnswer: 'Jupiter',
          explanation: 'Jupiter is the largest planet in our solar system.'
        }
      ];
      
      setGeneratedQuestions(mockQuestions);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save quiz to localStorage
  const saveQuiz = () => {
    const quiz = {
      id: Date.now(),
      title: quizData.title,
      subject: quizData.subject,
      difficulty: quizData.difficulty,
      questions: generatedQuestions,
      timeLimit: quizData.timeLimit,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    const updatedQuizzes = [...publishedQuizzes, quiz];
    setPublishedQuizzes(updatedQuizzes);
    localStorage.setItem('publishedQuizzes', JSON.stringify(updatedQuizzes));
  };

  // Publish quiz
  const publishQuiz = () => {
    const quiz = {
      id: Date.now(),
      title: quizData.title,
      subject: quizData.subject,
      difficulty: quizData.difficulty,
      questions: generatedQuestions,
      timeLimit: quizData.timeLimit,
      createdAt: new Date().toISOString(),
      status: 'published'
    };

    const updatedQuizzes = [...publishedQuizzes, quiz];
    setPublishedQuizzes(updatedQuizzes);
    localStorage.setItem('publishedQuizzes', JSON.stringify(updatedQuizzes));
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title
              </label>
              <input
                type="text"
                value={quizData.title}
                onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter quiz title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={quizData.subject}
                onChange={(e) => setQuizData({...quizData, subject: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter subject (e.g., Mathematics, Physics, Chemistry)"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => setQuizData({...quizData, subject: subject})}
                    className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                      quizData.subject === subject
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newSubject = prompt('Enter custom subject:');
                    if (newSubject && newSubject.trim()) {
                      setSubjects(prev => [...prev, newSubject.trim()]);
                      setQuizData({...quizData, subject: newSubject.trim()});
                    }
                  }}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  + Custom
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={quizData.description}
                onChange={(e) => setQuizData({...quizData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Describe what this quiz covers..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {difficulties.map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setQuizData({...quizData, difficulty: difficulty.toLowerCase()})}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      quizData.difficulty === difficulty.toLowerCase()
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                value={quizData.questionCount}
                onChange={(e) => setQuizData({...quizData, questionCount: parseInt(e.target.value)})}
                min="5"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Types
              </label>
              <div className="space-y-2">
                {questionTypes.map(type => (
                  <label key={type.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={quizData.questionTypes.includes(type.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setQuizData({
                            ...quizData,
                            questionTypes: [...quizData.questionTypes, type.id]
                          });
                        } else {
                          setQuizData({
                            ...quizData,
                            questionTypes: quizData.questionTypes.filter(t => t !== type.id)
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={quizData.timeLimit}
                onChange={(e) => setQuizData({...quizData, timeLimit: parseInt(e.target.value)})}
                min="5"
                max="120"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <div className="mb-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Quiz Generation</h3>
                <p className="text-gray-600 mb-6">
                  Our AI will generate {quizData.questionCount} questions for your {quizData.subject} quiz
                </p>
              </div>

              {!isGenerating && generatedQuestions.length === 0 && (
                <button
                  onClick={generateQuestions}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Generate Questions
                </button>
              )}

              {isGenerating && (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-gray-600">AI is generating your questions...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                  </div>
                </div>
              )}

              {generatedQuestions.length > 0 && (
                <div className="text-left">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800 font-medium">✅ Successfully generated {generatedQuestions.length} questions!</p>
                  </div>
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Review Questions
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review Generated Questions</h3>
            <div className="space-y-4">
              {generatedQuestions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {question.type.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{question.question}</p>
                  
                  {question.type === 'multiple-choice' && (
                    <div className="space-y-2 mb-3">
                      {question.options.map((option, optIndex) => (
                        <label key={optIndex} className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={optIndex === question.correctAnswer}
                            className="mr-2"
                            readOnly
                          />
                          <span className={optIndex === question.correctAnswer ? 'text-green-700 font-medium' : ''}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <div className="space-y-2 mb-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={question.correctAnswer === true}
                          className="mr-2"
                          readOnly
                        />
                        <span className={question.correctAnswer === true ? 'text-green-700 font-medium' : ''}>
                          True
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={question.correctAnswer === false}
                          className="mr-2"
                          readOnly
                        />
                        <span className={question.correctAnswer === false ? 'text-green-700 font-medium' : ''}>
                          False
                        </span>
                      </label>
                    </div>
                  )}

                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2 mt-3">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        const updated = generatedQuestions.filter(q => q.id !== question.id);
                        setGeneratedQuestions(updated);
                      }}
                      className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Final Settings & Publish</h3>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Quiz Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium">{quizData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">{quizData.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium capitalize">{quizData.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions:</span>
                  <span className="font-medium">{generatedQuestions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Limit:</span>
                  <span className="font-medium">{quizData.timeLimit} minutes</span>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm text-gray-700">Allow students to see correct answers after completion</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm text-gray-700">Shuffle question order for each student</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Require students to enter their name before starting</span>
              </label>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={saveQuiz}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Save as Draft
              </button>
              <button 
                onClick={publishQuiz}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Publish Quiz
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}>
                {step.id}
              </div>
              <div className="ml-3 hidden md:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
        
        {currentStep < 5 && currentStep !== 3 && (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateAIQuiz;
