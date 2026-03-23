const parseAIResponse = (responseText) => {
  try {
    let jsonString = responseText.trim();
    
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7);
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.slice(3);
    }
    
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.slice(0, -3);
    }

    jsonString = jsonString.trim();

    const data = JSON.parse(jsonString);

    if (!data.quizTitle || !Array.isArray(data.questions)) {
      throw new Error('Invalid JSON structure returned from AI');
    }

    data.questions = data.questions.map(q => {
      // Ensure MCQ has options
      if (q.type === 'mcq' && (!Array.isArray(q.options) || q.options.length !== 4)) {
        q.options = q.options || [];
        while (q.options.length < 4) {
          q.options.push("N/A");
        }
      }
      return q;
    });

    return data;
  } catch (error) {
    console.error('Failed to parse AI response:', error, 'Raw response:', responseText);
    throw new Error('Failed to parse the generated quiz');
  }
};

module.exports = { parseAIResponse };
