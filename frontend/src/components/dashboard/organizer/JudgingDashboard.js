import React, { useState, useEffect } from 'react';
import { hackathonsData } from '../../../data/hackathons';
import JudgingPanel from './submissions/components/JudgingPanel';

const JudgingDashboard = ({ user }) => {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showJudgingPanel, setShowJudgingPanel] = useState(false);
  
  // Load hackathons when component mounts
  useEffect(() => {
    const activeHackathons = hackathonsData
      .filter(h => h.status !== 'completed')
      .slice(0, 5)
      .map(h => ({
        ...h,
        submissionCount: Math.floor(Math.random() * 15) + 5,
        pendingCount: Math.floor(Math.random() * 10),
        reviewedCount: Math.floor(Math.random() * 8),
        awardedCount: Math.floor(Math.random() * 3)
      }));
    
    setHackathons(activeHackathons);
  }, []);
  
  // Generate submissions when a hackathon is selected
  useEffect(() => {
    if (!selectedHackathon) {
      setSubmissions([]);
      setFilteredSubmissions([]);
      return;
    }
    
    // Generate sample submissions
    const generateSubmissions = () => {
      const submissionsList = [];
      const count = selectedHackathon.submissionCount || 10;
      
      for (let i = 1; i <= count; i++) {
        const status = i % 5 === 0 ? 'awarded' : (i % 3 === 0 ? 'reviewed' : 'pending');
        const submittedDate = new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000);
        
        submissionsList.push({
          id: i,
          projectName: `${selectedHackathon.name} Project ${i}`,
          teamName: `Team Innovators ${i}`,
          teamId: i,
          memberCount: Math.floor(Math.random() * 3) + 2,
          hackathonId: selectedHackathon.id,
          hackathonName: selectedHackathon.name,
          submittedDate: submittedDate.toISOString(),
          lastUpdated: new Date(submittedDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: status,
          description: `An innovative solution for ${selectedHackathon.name} that addresses key challenges in ${selectedHackathon.category}.`,
          demoUrl: `https://example.com/demos/project-${i}`,
          repoUrl: `https://github.com/example/project-${i}`,
          score: status !== 'pending' ? Math.floor(Math.random() * 30) + 70 : null,
          comments: status !== 'pending' ? ['Great project!', 'Innovative solution.'].slice(0, Math.floor(Math.random() * 2) + 1) : [],
          judges: status !== 'pending' ? [`Judge ${Math.floor(Math.random() * 5) + 1}`] : [],
          tags: ['Web', 'AI', 'Mobile', 'Blockchain', 'AR/VR'].slice(0, Math.floor(Math.random() * 3) + 1),
          thumbnailUrl: `https://picsum.photos/seed/${i + selectedHackathon.id}/400/300`
        });
      }
      
      return submissionsList;
    };
    
    const submissionsList = generateSubmissions();
    setSubmissions(submissionsList);
    applyFilters(submissionsList, searchText, filterStatus);
  }, [selectedHackathon, searchText, filterStatus]);
  
  // Apply filters when search text or filter status changes
  useEffect(() => {
    applyFilters(submissions, searchText, filterStatus);
  }, [searchText, filterStatus, submissions]);
  
  // Filter submissions based on search text and status
  const applyFilters = (subs, search, status) => {
    let filtered = [...subs];
    
    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(sub => sub.status === status);
    }
    
    // Filter by search text
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(sub => 
        sub.projectName.toLowerCase().includes(searchLower) ||
        sub.teamName.toLowerCase().includes(searchLower) ||
        sub.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredSubmissions(filtered);
  };
  
  // Handle hackathon selection
  const handleSelectHackathon = (hackathon) => {
    setSelectedHackathon(hackathon);
    setSelectedSubmission(null);
    setShowJudgingPanel(false);
  };
  
  // Handle submission selection for judging
  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowJudgingPanel(true);
  };
  
  // Handle submission judging
  const handleJudgeSubmission = (judgingData) => {
    // Update the submission with judgment data
    const updatedSubmissions = submissions.map(sub => 
      sub.id === selectedSubmission.id 
        ? { 
            ...sub, 
            status: judgingData.status,
            score: judgingData.overallScore,
            comments: [...(sub.comments || []), judgingData.comments],
            judges: [...(sub.judges || []), user.name],
            reviewDate: judgingData.reviewDate,
            awardTitle: judgingData.awardTitle,
            awardType: judgingData.awardType
          } 
        : sub
    );
    
    setSubmissions(updatedSubmissions);
    applyFilters(updatedSubmissions, searchText, filterStatus);
    
    // Reset selection and close judging panel
    setShowJudgingPanel(false);
    setSelectedSubmission(null);
  };
  
  // Cancel judging panel
  const handleCancelJudging = () => {
    setShowJudgingPanel(false);
    setSelectedSubmission(null);
  };
  
  // Render stats cards for selected hackathon
  const renderStatsCards = () => {
    if (!selectedHackathon) return null;
    
    const stats = {
      total: submissions.length,
      pending: submissions.filter(s => s.status === 'pending').length,
      reviewed: submissions.filter(s => s.status === 'reviewed').length,
      awarded: submissions.filter(s => s.status === 'awarded').length
    };
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 overflow-hidden group hover:border-gray-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20">
          <div className="px-4 pt-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gray-900/70 flex items-center justify-center group-hover:bg-gray-800/90 transition-all">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-gray-400">Total Submissions</div>
            </div>
          </div>
          <div className="mt-2 border-t border-gray-900/30 px-4 py-1.5 bg-gradient-to-r from-gray-900/20 to-gray-900/0">
            <div className="flex items-center text-xs text-gray-400">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <span>All projects</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/40 backdrop-blur-sm rounded-xl border border-yellow-700/30 overflow-hidden group hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-900/20">
          <div className="px-4 pt-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-yellow-900/70 flex items-center justify-center group-hover:bg-yellow-800/90 transition-all">
                <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-white">{stats.pending}</div>
              <div className="text-xs text-gray-400">Pending Review</div>
            </div>
          </div>
          <div className="mt-2 border-t border-yellow-900/30 px-4 py-1.5 bg-gradient-to-r from-yellow-900/20 to-yellow-900/0">
            <div className="flex items-center text-xs text-yellow-400">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <span>Needs review</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/40 backdrop-blur-sm rounded-xl border border-blue-700/30 overflow-hidden group hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20">
          <div className="px-4 pt-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-900/70 flex items-center justify-center group-hover:bg-blue-800/90 transition-all">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-white">{stats.reviewed}</div>
              <div className="text-xs text-gray-400">Reviewed</div>
            </div>
          </div>
          <div className="mt-2 border-t border-blue-900/30 px-4 py-1.5 bg-gradient-to-r from-blue-900/20 to-blue-900/0">
            <div className="flex items-center text-xs text-blue-400">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <span>Scored</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/40 backdrop-blur-sm rounded-xl border border-purple-700/30 overflow-hidden group hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20">
          <div className="px-4 pt-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-purple-900/70 flex items-center justify-center group-hover:bg-purple-800/90 transition-all">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-white">{stats.awarded}</div>
              <div className="text-xs text-gray-400">Awarded</div>
            </div>
          </div>
          <div className="mt-2 border-t border-purple-900/30 px-4 py-1.5 bg-gradient-to-r from-purple-900/20 to-purple-900/0">
            <div className="flex items-center text-xs text-purple-400">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <span>Winners</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="px-4 py-6">
      {/* Page Header with Title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Hackathon Judging
        </h2>
        <p className="text-gray-400 text-sm mb-4">Review and score hackathon submissions.</p>
      </div>
      
      {!selectedHackathon ? (
        // Hackathon selection screen
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Select a Hackathon to Judge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hackathons.map(hackathon => (
              <div 
                key={hackathon.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 cursor-pointer hover:bg-gray-800/80 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20"
                onClick={() => handleSelectHackathon(hackathon)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                    <img className="h-16 w-16 object-cover" src={hackathon.image} alt={hackathon.name} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">{hackathon.name || hackathon.title}</h3>
                    <p className="text-sm text-gray-400">{hackathon.organizer}</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-sm text-yellow-300 font-semibold">{hackathon.pendingCount || 0}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-300 font-semibold">{hackathon.reviewedCount || 0}</p>
                    <p className="text-xs text-gray-500">Reviewed</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-300 font-semibold">{hackathon.awardedCount || 0}</p>
                    <p className="text-xs text-gray-500">Awarded</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : showJudgingPanel ? (
        // Judging panel
        <div>
          <button 
            onClick={handleCancelJudging}
            className="flex items-center text-gray-400 hover:text-white mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Submissions
          </button>
          
          <JudgingPanel 
            submission={selectedSubmission}
            onJudge={handleJudgeSubmission}
            onCancel={handleCancelJudging}
          />
        </div>
      ) : (
        // Submissions list for selected hackathon
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <button 
                onClick={() => setSelectedHackathon(null)}
                className="flex items-center text-gray-400 hover:text-white mr-4"
              >
                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              
              <h2 className="text-xl font-semibold text-white">{selectedHackathon.name || selectedHackathon.title}</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <input 
                  type="text"
                  placeholder="Search submissions..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              >
                <option value="all">All Submissions</option>
                <option value="pending">Pending Review</option>
                <option value="reviewed">Reviewed</option>
                <option value="awarded">Awarded</option>
              </select>
            </div>
          </div>
          
          {renderStatsCards()}
          
          {filteredSubmissions.length === 0 ? (
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-700/50 p-8 text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-white mb-1">No Submissions Found</h3>
              <p className="text-gray-400 mb-4">There are no submissions matching your current filters.</p>
              <button 
                onClick={() => { setSearchText(''); setFilterStatus('all'); }}
                className="px-4 py-2 bg-blue-700/80 text-blue-100 rounded-lg hover:bg-blue-600/80"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubmissions.map(submission => (
                <div 
                  key={submission.id}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-700/50 overflow-hidden hover:border-gray-600/70 transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onClick={() => handleSelectSubmission(submission)}
                >
                  <div className="h-40 overflow-hidden relative">
                    <img 
                      src={submission.thumbnailUrl} 
                      alt={submission.projectName} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-16" />
                    <div className="absolute top-2 right-2">
                      {submission.status === 'pending' && (
                        <span className="bg-yellow-900/70 text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
                          Pending Review
                        </span>
                      )}
                      {submission.status === 'reviewed' && (
                        <span className="bg-blue-900/70 text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                          Reviewed
                        </span>
                      )}
                      {submission.status === 'awarded' && (
                        <span className="bg-purple-900/70 text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                          Awarded
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{submission.projectName}</h3>
                    <p className="text-sm text-gray-400 mb-2">{submission.teamName}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {submission.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-gray-700/70 text-gray-300 border border-gray-600/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{submission.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Submitted {new Date(submission.submittedDate).toLocaleDateString()}
                      </div>
                      {submission.score && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-400 mr-1">Score:</span>
                          <span className="text-md font-bold text-blue-400">{submission.score}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JudgingDashboard;