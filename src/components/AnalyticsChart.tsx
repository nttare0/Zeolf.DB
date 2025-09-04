import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

export const AnalyticsChart: React.FC = () => {
  const [chartType, setChartType] = useState<'weekly' | 'monthly'>('weekly');

  // Generate sample data for demonstration
  const weeklyData = [
    { name: 'Mon', visitors: 45, logins: 32 },
    { name: 'Tue', visitors: 52, logins: 38 },
    { name: 'Wed', visitors: 48, logins: 35 },
    { name: 'Thu', visitors: 61, logins: 42 },
    { name: 'Fri', visitors: 55, logins: 40 },
    { name: 'Sat', visitors: 38, logins: 28 },
    { name: 'Sun', visitors: 42, logins: 30 }
  ];

  const monthlyData = [
    { name: 'Jan', visitors: 1240, logins: 890 },
    { name: 'Feb', visitors: 1380, logins: 980 },
    { name: 'Mar', visitors: 1520, logins: 1100 },
    { name: 'Apr', visitors: 1680, logins: 1200 },
    { name: 'May', visitors: 1850, logins: 1350 },
    { name: 'Jun', visitors: 1920, logins: 1400 },
    { name: 'Jul', visitors: 2100, logins: 1520 },
    { name: 'Aug', visitors: 2250, logins: 1650 },
    { name: 'Sep', visitors: 2180, logins: 1580 },
    { name: 'Oct', visitors: 2350, logins: 1720 },
    { name: 'Nov', visitors: 2480, logins: 1800 },
    { name: 'Dec', visitors: 2650, logins: 1950 }
  ];

  const currentData = chartType === 'weekly' ? weeklyData : monthlyData;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Visitor Analytics</h3>
        </div>
        
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setChartType('weekly')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              chartType === 'weekly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Weekly</span>
          </button>
          <button
            onClick={() => setChartType('monthly')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              chartType === 'monthly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Monthly</span>
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'weekly' ? (
            <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="logins" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="logins" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center space-x-6 mt-4 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Visitors</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Logins</span>
        </div>
      </div>
    </div>
  );
};