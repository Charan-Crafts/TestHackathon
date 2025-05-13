import React from 'react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-gray-800/60 p-5 rounded-xl shadow-sm border border-gray-700 hover:shadow-lg hover:border-indigo-700/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative group"
        >
          {/* Decorative elements */}
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-indigo-100 to-transparent rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          
          <div className="flex items-start justify-between relative">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">{stat.name}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              {stat.change && (
                <p className={`text-xs font-medium mt-1 flex items-center ${
                  stat.change > 0 ? 'text-green-600' : stat.change < 0 ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change > 0 && '↑ '}
                  {stat.change < 0 && '↓ '}
                  {stat.change}% from last month
                </p>
              )}
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 shadow-sm group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-indigo-100 group-hover:to-blue-100 transition-all duration-300">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards; 