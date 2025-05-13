import React from 'react';
import { formatDate } from './HackathonData';

const TaskList = ({ tasks = [], onTaskAction }) => {
  const handleTaskAction = (taskId, action) => {
    if (onTaskAction) {
      onTaskAction(taskId, action);
    }
  };
  
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
        <p className="text-gray-400 text-sm">No tasks available for this phase.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {tasks.map(task => {
        // Determine status
        const isCompleted = task.completed;
        const isRequired = task.required;
        
        return (
          <div
            key={task.id}
            className={`
              border rounded-lg p-3 transition-colors
              ${isCompleted 
                ? 'border-green-700/30 bg-green-900/10' 
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}
            `}
          >
            <div className="flex items-center">
              {/* Status indicator */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div className="w-6 h-6 bg-green-900/70 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className={`w-6 h-6 ${isRequired ? 'bg-blue-900/50' : 'bg-gray-700'} rounded-full flex items-center justify-center`}>
                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Task info */}
              <div className="ml-3 flex-grow">
                <h4 className={`text-sm font-medium ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                  {task.name}
                  {isRequired && !isCompleted && (
                    <span className="ml-2 bg-red-900/30 text-red-400 text-[10px] px-1.5 py-0.5 rounded-full">
                      Required
                    </span>
                  )}
                </h4>
                <p className="mt-0.5 text-xs text-gray-400">{task.description}</p>
                
                {/* Completion date */}
                {isCompleted && task.completedDate && (
                  <div className="mt-1 text-[11px] text-gray-500">
                    Completed on {formatDate(task.completedDate)}
                  </div>
                )}
              </div>
              
              {/* Action button */}
              <div className="ml-2 flex-shrink-0">
                {!isCompleted ? (
                  <button
                    onClick={() => handleTaskAction(task.id, 'complete')}
                    className="text-xs px-2.5 py-1.5 bg-indigo-800/50 hover:bg-indigo-700/50 text-indigo-300 rounded-md transition-colors"
                  >
                    Complete
                  </button>
                ) : task.submission ? (
                  <button
                    onClick={() => handleTaskAction(task.id, 'view')}
                    className="text-xs px-2.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors"
                  >
                    View
                  </button>
                ) : null}
              </div>
            </div>
            
            {/* If the task has a team attached */}
            {task.teamMembers && (
              <div className="mt-3 pl-9">
                <div className="text-xs text-gray-400 mb-1">Team: {task.teamName}</div>
                <div className="flex space-x-1">
                  {task.teamMembers.slice(0, 4).map((member, index) => (
                    <div key={member.id} className="relative group">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {member.name}
                      </div>
                    </div>
                  ))}
                  {task.teamMembers.length > 4 && (
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                      +{task.teamMembers.length - 4}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Submission feedback */}
            {task.submission && task.submission.feedback && (
              <div className="mt-3 pl-9">
                <div className="p-2 bg-gray-700/50 rounded border border-gray-600 text-xs">
                  <div className="font-medium text-gray-300 mb-1">Feedback</div>
                  <div className="text-gray-400">{task.submission.feedback}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TaskList; 