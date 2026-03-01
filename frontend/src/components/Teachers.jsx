import React from 'react';

const Teachers = () => {
  const benefits = [
    {
      title: 'Save 10+ Hours Weekly',
      description: 'Automated quiz creation frees up your time for what matters most - teaching.',
      icon: '⏰'
    },
    {
      title: 'Data-Driven Insights',
      description: 'Identify learning gaps and track student progress with comprehensive analytics.',
      icon: '📈'
    },
    {
      title: 'Customizable Content',
      description: 'Tailor quizzes to your curriculum, teaching style, and student needs.',
      icon: '🎨'
    },
    {
      title: 'Collaborative Tools',
      description: 'Share quizzes with colleagues and build a community of best practices.',
      icon: '🤝'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Empowering Educators Everywhere
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of teachers who have transformed their assessment process with SCIO's intelligent platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                  <div className="text-3xl mb-3">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl transform -rotate-2 opacity-20"></div>
              <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face" alt="Teacher" className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Sarah Johnson</h4>
                    <p className="text-gray-600">High School Science Teacher</p>
                  </div>
                </div>
                
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "SCIO has revolutionized how I create assessments. What used to take hours now takes minutes. My students are more engaged, and I have more time to focus on teaching."
                </blockquote>
                
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Transform Your Teaching?</h3>
          <p className="text-lg mb-6 opacity-90">Join the community of innovative educators using SCIO</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200">
              Start Free Trial
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Teachers;
