import React from 'react';

const Students = () => {
  const features = [
    {
      title: 'Personalized Learning Path',
      description: 'Get quizzes that match your skill level and help you improve where you need it most.',
      icon: '🎯'
    },
    {
      title: 'Instant Feedback',
      description: 'Know immediately how you did and get detailed explanations to learn from mistakes.',
      icon: '💡'
    },
    {
      title: 'Learn Anywhere',
      description: 'Access quizzes on any device - phone, tablet, or computer. Learning fits your schedule.',
      icon: '📱'
    },
    {
      title: 'Track Progress',
      description: 'See your improvement over time with detailed progress reports and achievement badges.',
      icon: '🏆'
    },
    {
      title: 'Study Together',
      description: 'Join study groups, compete with friends, and learn collaboratively in a fun environment.',
      icon: '👥'
    },
    {
      title: 'Gamified Experience',
      description: 'Earn points, unlock achievements, and make learning feel like playing your favorite game.',
      icon: '🎮'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Learn Better, Learn Smarter
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience education that adapts to you. SCIO makes learning engaging, personalized, and fun.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Student Success Stories</h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-gray-700 mb-2 italic">
                  "I went from struggling with math to actually enjoying it. The quizzes help me understand concepts better than traditional homework."
                </p>
                <div className="flex items-center">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="Student" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Alex Chen</p>
                    <p className="text-sm text-gray-600">Grade 10 Student</p>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-gray-700 mb-2 italic">
                  "The instant feedback helps me learn from my mistakes immediately. I feel more confident in class and my grades have improved."
                </p>
                <div className="flex items-center">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" alt="Student" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Maria Rodriguez</p>
                    <p className="text-sm text-gray-600">Grade 11 Student</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Start Learning Today</h3>
              <p className="text-lg mb-6 opacity-90">Join thousands of students already learning with SCIO</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">95%</div>
                  <div className="text-sm opacity-80">Grade Improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">2x</div>
                  <div className="text-sm opacity-80">Faster Learning</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">50K+</div>
                  <div className="text-sm opacity-80">Active Students</div>
                </div>
              </div>
              
              <button className="w-full px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200">
                Join as Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Students;
