import React, { useState } from 'react';

const AnalyticsReports = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [dateRange, setDateRange] = useState('30days');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const dateRanges = [
    { id: '7days', label: 'Last 7 Days' },
    { id: '30days', label: 'Last 30 Days' },
    { id: '90days', label: 'Last 90 Days' },
    { id: '1year', label: 'Last Year' }
  ];

  const subjects = [
    { id: 'all', label: 'All Subjects' },
    { id: 'math', label: 'Mathematics' },
    { id: 'science', label: 'Science' },
    { id: 'english', label: 'English' },
    { id: 'history', label: 'History' }
  ];

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalQuizzes: 156,
      totalParticipants: 1245,
      avgScore: 78.5,
      completionRate: 85.2,
      improvementRate: 12.3
    },
    performanceTrends: [
      { month: 'Jan', avgScore: 72, participants: 180 },
      { month: 'Feb', avgScore: 75, participants: 220 },
      { month: 'Mar', avgScore: 78, participants: 195 },
      { month: 'Apr', avgScore: 76, participants: 240 },
      { month: 'May', avgScore: 82, participants: 210 },
      { month: 'Jun', avgScore: 79, participants: 200 }
    ],
    subjectPerformance: [
      { subject: 'Mathematics', avgScore: 82.3, improvement: 5.2, participants: 320 },
      { subject: 'Science', avgScore: 76.8, improvement: 3.1, participants: 280 },
      { subject: 'English', avgScore: 79.1, improvement: 2.8, participants: 300 },
      { subject: 'History', avgScore: 85.2, improvement: 6.5, participants: 180 },
      { subject: 'Geography', avgScore: 74.5, improvement: 1.9, participants: 165 }
    ],
    difficultyAnalysis: [
      { difficulty: 'Easy', avgScore: 91.2, completionRate: 95.5, timeSpent: '8:30' },
      { difficulty: 'Medium', avgScore: 78.6, completionRate: 87.2, timeSpent: '12:45' },
      { difficulty: 'Hard', avgScore: 65.3, completionRate: 72.8, timeSpent: '18:20' }
    ]
  };

  const reportTypes = [
    {
      id: 'performance',
      title: 'Student Performance Report',
      description: 'Detailed analysis of individual and class performance',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'engagement',
      title: 'Engagement Metrics Report',
      description: 'Track student participation and engagement levels',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      id: 'progress',
      title: 'Learning Progress Report',
      description: 'Monitor student progress over time',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      id: 'completion',
      title: 'Quiz Completion Report',
      description: 'Analysis of quiz completion rates and patterns',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const generateReport = (reportType) => {
    // Mock report generation
    alert(`Generating ${reportType} report... This would typically download a PDF or Excel file.`);
  };

  const MetricCard = ({ title, value, subtitle, trend, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {trend > 0 ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          )}
        </div>
      </div>
      {trend && (
        <div className="mt-4">
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}% from last period
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-2">Track performance, generate insights, and monitor progress</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'analytics'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics Dashboard
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'reports'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Generate Reports
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {dateRanges.map(range => (
              <option key={range.id} value={range.id}>{range.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.label}</option>
            ))}
          </select>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        /* Analytics Dashboard */
        <div className="space-y-6">
          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard
              title="Total Quizzes"
              value={analyticsData.overview.totalQuizzes}
              subtitle="Completed sessions"
              trend={8.2}
              color="bg-blue-500"
            />
            <MetricCard
              title="Participants"
              value={analyticsData.overview.totalParticipants}
              subtitle="Unique students"
              trend={12.5}
              color="bg-green-500"
            />
            <MetricCard
              title="Average Score"
              value={`${analyticsData.overview.avgScore}%`}
              subtitle="Across all quizzes"
              trend={2.1}
              color="bg-purple-500"
            />
            <MetricCard
              title="Completion Rate"
              value={`${analyticsData.overview.completionRate}%`}
              subtitle="Finished quizzes"
              trend={-1.3}
              color="bg-orange-500"
            />
            <MetricCard
              title="Improvement"
              value={`${analyticsData.overview.improvementRate}%`}
              subtitle="Score improvement"
              trend={5.7}
              color="bg-pink-500"
            />
          </div>

          {/* Performance Trends Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.performanceTrends.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-indigo-200 rounded-t" style={{height: `${(data.avgScore / 100) * 100}%`}}>
                    <div className="w-full bg-indigo-600 rounded-t" style={{height: `${(data.avgScore / 100) * 80}%`}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                  <p className="text-xs font-medium">{data.avgScore}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.subjectPerformance.map((subject, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.avgScore}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+{subject.improvement}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.participants}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: `${subject.avgScore}%`}}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Difficulty Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulty Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analyticsData.difficultyAnalysis.map((difficulty, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">{difficulty.difficulty}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Score:</span>
                      <span className="font-medium">{difficulty.avgScore}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completion:</span>
                      <span className="font-medium">{difficulty.completionRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Time:</span>
                      <span className="font-medium">{difficulty.timeSpent}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Reports Generation */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    {report.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-gray-600 mt-1">{report.description}</p>
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => generateReport(report.title)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      >
                        Generate PDF
                      </button>
                      <button
                        onClick={() => generateReport(report.title)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Export Excel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scheduled Reports */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Reports</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Weekly Performance Summary</h4>
                  <p className="text-sm text-gray-600">Every Monday at 9:00 AM</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">Edit</button>
                  <button className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Monthly Analytics Report</h4>
                  <p className="text-sm text-gray-600">1st of every month at 8:00 AM</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">Edit</button>
                  <button className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
                </div>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Schedule New Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsReports;
