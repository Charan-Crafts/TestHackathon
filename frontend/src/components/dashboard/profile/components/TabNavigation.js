import React, { useEffect, useRef, useState } from 'react';
import { 
  ChartBarIcon, 
  BriefcaseIcon, 
  TrophyIcon,
  UserCircleIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef({});
  
  // Define tab-specific colors for styling
  const tabColors = {
    personal: 'from-blue-500 to-indigo-600',
    skills: 'from-purple-500 to-indigo-600',
    experience: 'from-cyan-500 to-blue-600',
    achievements: 'from-amber-500 to-orange-600',
    resume: 'from-emerald-500 to-teal-600'
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <UserCircleIcon className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <ChartBarIcon className="w-4 h-4" /> },
    { id: 'experience', label: 'Experience', icon: <BriefcaseIcon className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <TrophyIcon className="w-4 h-4" /> },
    { id: 'resume', label: 'Resume', icon: <DocumentDuplicateIcon className="w-4 h-4" /> },
  ];

  // Update the indicator position when tab changes
  useEffect(() => {
    if (tabsRef.current[activeTab]) {
      const activeTabEl = tabsRef.current[activeTab];
      setIndicatorStyle({
        width: `${activeTabEl.offsetWidth}px`,
        left: `${activeTabEl.offsetLeft}px`,
        transition: 'all 0.3s ease',
        background: `linear-gradient(to right, var(--tw-gradient-stops))`,
      });
    }
  }, [activeTab]);

  // Helper to get tab-specific icon color
  const getTabIconColor = (tabId) => {
    switch(tabId) {
      case 'personal': return 'text-blue-400';
      case 'skills': return 'text-purple-400';
      case 'experience': return 'text-cyan-400';
      case 'achievements': return 'text-amber-400';
      case 'resume': return 'text-emerald-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="border-b border-gray-700 sticky top-0 bg-gray-800/90 z-10 shadow-sm">
      <div className="relative">
        <nav className="flex md:space-x-1" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={el => tabsRef.current[tab.id] = el}
              onClick={() => setActiveTab(tab.id)}
              className={`
                inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm
                ${activeTab === tab.id 
                  ? `border-${tab.id === 'personal' ? 'blue' : tab.id === 'skills' ? 'purple' : tab.id === 'experience' ? 'cyan' : tab.id === 'achievements' ? 'amber' : 'emerald'}-500 text-white` 
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'}
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <span className="flex items-center">
                <span className={`mr-2 ${activeTab === tab.id ? getTabIconColor(tab.id) : 'text-gray-400'}`}>
                  {tab.icon}
                </span>
                {tab.label}
              </span>
              {/* Mobile indicator - only visible on small screens */}
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 md:hidden ${
                activeTab === tab.id 
                  ? `bg-gradient-to-r ${tabColors[tab.id]}` 
                  : 'bg-transparent'
              }`}></span>
            </button>
          ))}
        </nav>
        
        {/* Desktop animated indicator - only visible on larger screens */}
        <div 
          className={`absolute bottom-0 h-0.5 bg-gradient-to-r ${tabColors[activeTab]} hidden md:block`}
          style={indicatorStyle}
        ></div>
      </div>
      
      {/* Mobile selected tab label */}
      <div className={`md:hidden px-4 py-2 bg-gray-700/50 text-xs font-medium text-${
          activeTab === 'personal' ? 'blue' : 
          activeTab === 'skills' ? 'purple' : 
          activeTab === 'experience' ? 'cyan' : 
          activeTab === 'achievements' ? 'amber' : 
          'emerald'
        }-300`}>
        Currently viewing: {tabs.find(tab => tab.id === activeTab)?.label}
      </div>
    </div>
  );
};

export default TabNavigation; 