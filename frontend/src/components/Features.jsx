import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '🚀',
      title: 'Lightning Fast Generation',
      description: 'Create comprehensive quizzes in under 30 seconds with our advanced AI algorithms.'
    },
    {
      icon: '🎯',
      title: 'Personalized Learning',
      description: 'Adaptive difficulty levels that match each student\'s learning pace and knowledge gaps.'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track student progress, identify knowledge gaps, and get actionable insights instantly.'
    },
    {
      icon: '🔄',
      title: 'Multiple Question Types',
      description: 'Support for multiple choice, true/false, fill-in-the-blank, and open-ended questions.'
    },
    {
      icon: '👥',
      title: 'Unlimited Participants',
      description: 'No limits on class size. From small groups to entire schools, we\'ve got you covered.'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime ensures your data is always safe and accessible.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Education
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create, manage, and analyze quizzes effectively in one integrated platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
