import React, { useState, useEffect } from 'react';

const DashboardOverview = () => {
  const [metrics, setMetrics] = useState({
    totalQuizzes: 0,
    activeStudents: 0,
    avgScore: 0,
    completionRate: 0,
    recentActivity: [],
    topPerformers: [],
    subjectBreakdown: []
  });

  useEffect(() => {
    // Mock data for demonstration
    setMetrics({
      totalQuizzes: 24,
      activeStudents: 156,
      avgScore: 78.5,
      completionRate: 85.2,
      recentActivity: [
        { id: 1, type: 'quiz_completed', student: 'John Doe', quiz: 'Math Basics', score: 92, time: '2 mins ago' },
        { id: 2, type: 'quiz_started', student: 'Jane Smith', quiz: 'Science Quiz', time: '5 mins ago' },
        { id: 3, type: 'quiz_created', teacher: 'Dr. Wilson', quiz: 'History Test', time: '10 mins ago' },
        { id: 4, type: 'quiz_completed', student: 'Mike Johnson', quiz: 'English Grammar', score: 88, time: '15 mins ago' }
      ],
      topPerformers: [
        { name: 'Alice Brown', avgScore: 95.2, quizzesTaken: 12 },
        { name: 'Bob Davis', avgScore: 91.8, quizzesTaken: 10 },
        { name: 'Carol White', avgScore: 89.5, quizzesTaken: 15 },
        { id: 4, type: 'quiz_completed', student: 'Mike Johnson', quiz: 'English Grammar', score: 88, time: '15 mins ago' }
      ],
      subjectBreakdown: [
        { subject: 'Mathematics', quizzes: 8, avgScore: 82.3 },
        { subject: 'Science', quizzes: 6, avgScore: 76.8 },
        { subject: 'English', quizzes: 5, avgScore: 79.1 },
        { subject: 'History', quizzes: 5, avgScore: 85.2 }
      ]
    });
  }, []);

  const MetricCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Monitor your quiz performance and student engagement</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Quizzes"
          value={metrics.totalQuizzes}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="bg-blue-500"
          trend={12.5}
        />
        <MetricCard
          title="Active Students"
          value={metrics.activeStudents}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="bg-green-500"
          trend={8.2}
        />
        <MetricCard
          title="Average Score"
          value={`${metrics.avgScore}%`}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="bg-purple-500"
          trend={-2.1}
        />
        <MetricCard
          title="Completion Rate"
          value={`${metrics.completionRate}%`}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="bg-orange-500"
          trend={5.7}
        />
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {metrics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'quiz_completed' ? 'bg-green-500' :
                    activity.type === 'quiz_started' ? 'bg-blue-500' : 'bg-purple-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.student || activity.teacher}
                    </p>
                    <p className="text-xs text-gray-600">
                      {activity.type === 'quiz_completed' ? `Completed ${activity.quiz} (Score: ${activity.score}%)` :
                       activity.type === 'quiz_started' ? `Started ${activity.quiz}` :
                       `Created ${activity.quiz}`}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {metrics.topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                    <p className="text-xs text-gray-600">{performer.quizzesTaken} quizzes</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">{performer.avgScore}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.subjectBreakdown.map((subject) => (
            <div key={subject.subject} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900">{subject.subject}</h4>
              <p className="text-sm text-gray-600 mt-1">{subject.quizzes} quizzes</p>
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Avg Score</span>
                  <span className="text-sm font-semibold">{subject.avgScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${subject.avgScore}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
