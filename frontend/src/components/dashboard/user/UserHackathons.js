import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { getApprovedHackathons } from '../../../services/api';
import { registrationAPI } from '../../../services/api';

function UserHackathons({ user }) {
  const [activeTab, setActiveTab] = useState('active');
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    upcoming: 0,
    completed: 0,
    totalPrize: 0,
    topRanking: null
  });

  // Fetch hackathons
  useEffect(() => {
    setLoading(true);
    getApprovedHackathons()
      .then(res => {
        const fetchedHackathons = res.data && res.data.data ? res.data.data : [];
        // Map 'approved' to 'active' for display
        const mapped = fetchedHackathons.map(h => ({
          ...h,
          status: h.status === 'approved' ? 'active' : h.status
        }));
        setHackathons(mapped);
        // Calculate stats
        const active = mapped.filter(h => h.status === 'active').length;
        const upcoming = mapped.filter(h => h.status === 'upcoming').length;
        const completed = mapped.filter(h => h.status === 'completed').length;
        const totalPrize = mapped.reduce((sum, h) => {
          let prizeNum = 0;
          if (typeof h.prize === 'string') {
            prizeNum = parseInt(h.prize.replace(/\$|,/g, '')) || 0;
          } else if (typeof h.prize === 'number') {
            prizeNum = h.prize;
          }
          return sum + prizeNum;
        }, 0);
        const completedHackathons = mapped.filter(h => h.status === 'completed' && h.result);
        const topRanking = completedHackathons.length > 0
          ? completedHackathons.reduce((best, current) =>
            (best.result.rank < current.result.rank) ? best : current
          )
          : null;
        setStats({
          active,
          upcoming,
          completed,
          totalPrize,
          topRanking
        });
        setLoading(false);
      })
      .catch(err => {
        setHackathons([]);
        setLoading(false);
      });
  }, []);

  // Fetch user registrations
  useEffect(() => {
    if (user && user._id) {
      registrationAPI.getRegistrations({ userId: user._id })
        .then(res => {
          if (res.data && res.data.success) {
            setUserRegistrations(res.data.data);
          }
        })
        .catch(() => setUserRegistrations([]));
    }
  }, [user]);

  // Set of hackathon IDs the user is registered for
  const registeredHackathonIds = new Set(userRegistrations.map(r => (r.hackathonId?._id || r.hackathonId)));

  // Filter hackathons based on selected tab
  const filteredHackathons = hackathons.filter(hackathon => {
    if (activeTab === 'active') return hackathon.status === 'active';
    if (activeTab === 'upcoming') return hackathon.status === 'upcoming';
    if (activeTab === 'completed') return hackathon.status === 'completed';
    return true;
  });

  // Format date to display in readable format
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'upcoming': return 'brand';
      case 'completed': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="px-4 py-6">
      {/* Page Header with Title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          My Hackathons
        </h2>

        {/* Stats overview */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {/* Active Hackathons Card */}
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/40 backdrop-blur-sm rounded-xl border border-green-700/30 overflow-hidden group hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20">
              <div className="px-4 pt-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-green-900/70 flex items-center justify-center group-hover:bg-green-800/90 transition-all">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-white">{stats.active}</div>
                  <div className="text-xs text-gray-400">Active Hackathons</div>
                </div>
              </div>
              <div className="mt-2 border-t border-green-900/30 px-4 py-1.5 bg-gradient-to-r from-green-900/20 to-green-900/0">
                <div className="flex items-center text-xs text-green-400">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>In progress</span>
                </div>
              </div>
            </div>

            {/* Upcoming Hackathons Card */}
            <div className="bg-gradient-to-br from-brand-900/30 to-brand-800/40 backdrop-blur-sm rounded-xl border border-brand-700/30 overflow-hidden group hover:border-brand-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-900/20">
              <div className="px-4 pt-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-brand-900/70 flex items-center justify-center group-hover:bg-brand-800/90 transition-all">
                    <svg className="w-4 h-4 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-white">{stats.upcoming}</div>
                  <div className="text-xs text-gray-400">Upcoming Hackathons</div>
                </div>
              </div>
              <div className="mt-2 border-t border-brand-900/30 px-4 py-1.5 bg-gradient-to-r from-brand-900/20 to-brand-900/0">
                <div className="flex items-center text-xs text-brand-300">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Coming soon</span>
                </div>
              </div>
            </div>

            {/* Completed Hackathons Card */}
            <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/40 backdrop-blur-sm rounded-xl border border-orange-700/30 overflow-hidden group hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-900/20">
              <div className="px-4 pt-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-orange-900/70 flex items-center justify-center group-hover:bg-orange-800/90 transition-all">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-white">{stats.completed}</div>
                  <div className="text-xs text-gray-400">Completed Hackathons</div>
                </div>
              </div>
              <div className="mt-2 border-t border-orange-900/30 px-4 py-1.5 bg-gradient-to-r from-orange-900/20 to-orange-900/0">
                <div className="flex items-center text-xs text-orange-400">
                  {stats.topRanking ? (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Best rank: #{stats.topRanking.result.rank}</span>
                    </>
                  ) : (
                    <span>No rankings yet</span>
                  )}
                </div>
              </div>
            </div>

            {/* Total Prize Card */}
            <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/40 backdrop-blur-sm rounded-xl border border-yellow-700/30 overflow-hidden group hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-900/20">
              <div className="px-4 pt-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-yellow-900/70 flex items-center justify-center group-hover:bg-yellow-800/90 transition-all">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-white">${(stats.totalPrize / 1000).toFixed(1)}K</div>
                  <div className="text-xs text-gray-400">Total Prize Pool</div>
                </div>
              </div>
              <div className="mt-2 border-t border-yellow-900/30 px-4 py-1.5 bg-gradient-to-r from-yellow-900/20 to-yellow-900/0">
                <div className="flex items-center text-xs text-yellow-400">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>{hackathons.length} hackathons</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            to="/hackathons"
            className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 hover:bg-indigo-800/50 transition-colors"
          >
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 mr-1.5" />
            Explore Hackathons
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900/40 rounded-lg mb-6 p-1 backdrop-blur-sm border border-gray-700/50">
        <div className="flex text-sm">
          {['active', 'upcoming', 'completed', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 rounded-md font-medium text-xs capitalize flex items-center ${activeTab === tab
                ? `bg-${getStatusColor(tab)}-900/40 text-${getStatusColor(tab)}-400`
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                }`}
            >
              {tab === 'active' && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
              )}
              {tab === 'upcoming' && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-1.5"></span>
              )}
              {tab === 'completed' && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
              )}
              {tab}
              {tab !== 'all' && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-gray-800 text-gray-300 rounded-full">
                  {hackathons.filter(h => h.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        // Loading state
        <div className="h-40 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="ml-3 text-gray-400">Loading hackathons...</p>
        </div>
      ) : filteredHackathons.length === 0 ? (
        // Empty state
        <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-700/50 p-8 text-center">
          <svg
            className="mx-auto h-10 w-10 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-white">No hackathons found</h3>
          <p className="mt-2 text-xs text-gray-400">
            {activeTab === 'active'
              ? "You're not participating in any active hackathons."
              : activeTab === 'upcoming'
                ? "You haven't registered for any upcoming hackathons."
                : activeTab === 'completed'
                  ? "You haven't completed any hackathons yet."
                  : "You haven't joined any hackathons yet."
            }
          </p>
          <div className="mt-6">
            <Link
              to="/hackathons"
              className="inline-flex items-center px-3 py-1.5 text-xs bg-gradient-to-r from-indigo-600 to-blue-600 font-medium rounded-md text-white hover:from-indigo-500 hover:to-blue-500"
            >
              <ArrowTopRightOnSquareIcon className="mr-1.5 h-3.5 w-3.5" />
              Explore Hackathons
            </Link>
          </div>
        </div>
      ) : (
        // Hackathon cards grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHackathons.map((hackathon) => {
            const isRegistered = registeredHackathonIds.has(hackathon.id) || registeredHackathonIds.has(hackathon._id);
            return (
              <div
                key={hackathon.id}
                className={`bg-gradient-to-br from-${getStatusColor(hackathon.status)}-900/30 to-${getStatusColor(hackathon.status)}-800/20 backdrop-blur-sm rounded-lg border border-${getStatusColor(hackathon.status)}-700/30 hover:border-${getStatusColor(hackathon.status)}-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-${getStatusColor(hackathon.status)}-900/20 overflow-hidden`}
              >
                {/* Banner and header info */}
                <div className="h-24 relative">
                  <img
                    src={hackathon.banner}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/40"></div>

                  {/* Organizer logo */}
                  <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-white p-0.5 shadow-sm">
                    <img
                      src={hackathon.organizerLogo}
                      alt=""
                      className="w-full h-full rounded-full"
                    />
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <div className={`
                      text-[10px] font-medium px-1.5 py-0.5 rounded-full
                      bg-${getStatusColor(hackathon.status)}-900/50 text-${getStatusColor(hackathon.status)}-300
                    `}>
                      {hackathon.status === 'active' ? 'Active' :
                        hackathon.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <h3 className="text-sm font-medium text-white truncate">{hackathon.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-300">{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                      <span className="text-xs font-medium text-amber-300">{hackathon.prize}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  {/* Team information */}
                  {hackathon.teamName ? (
                    <div className="text-xs flex justify-between items-center mb-2.5">
                      <div className="text-gray-400">Team: <span className="text-white font-medium">{hackathon.teamName}</span></div>
                      <Link to={`/hackathon/${hackathon.id}/team`} className={`text-xs text-${getStatusColor(hackathon.status)}-400 hover:text-${getStatusColor(hackathon.status)}-300`}>
                        View
                      </Link>
                    </div>
                  ) : hackathon.status === 'upcoming' ? (
                    <div className="text-xs flex justify-between items-center mb-2.5 text-amber-400">
                      <div>Team formation required</div>
                      <Link to="/create-team" className="text-indigo-400 hover:text-indigo-300">
                        Create
                      </Link>
                    </div>
                  ) : null}

                  {/* Progress bar for active hackathons */}
                  {hackathon.status === 'active' && (
                    <div className="mb-2.5">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-[10px] text-gray-400">Progress</div>
                        <div className="text-[10px] text-gray-300">
                          {hackathon.daysLeft > 0 ? `${hackathon.daysLeft}d left` : 'Ending today'}
                        </div>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                        <div
                          className={`bg-${getStatusColor(hackathon.status)}-500/80 h-1.5 rounded-full`}
                          style={{ width: `${hackathon.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Submissions for active */}
                  {hackathon.status === 'active' && (
                    <div className="text-xs flex justify-between items-center mb-2.5">
                      <div className="text-gray-400">
                        Submissions: <span className="text-gray-300">{hackathon.submissionsCount}</span>
                      </div>
                      <Link to={`/hackathon/${hackathon.id}/submissions`} className="text-indigo-400 hover:text-indigo-300">
                        {hackathon.submissionsCount > 0 ? 'View' : 'Submit'}
                      </Link>
                    </div>
                  )}

                  {/* Ranking for completed */}
                  {hackathon.status === 'completed' && hackathon.result && (
                    <div className="text-xs flex justify-between items-center mb-2.5">
                      <div className="text-amber-400 font-medium">
                        Rank #{hackathon.result.rank} of {hackathon.result.outOf}
                      </div>
                      {hackathon.result.certificate && (
                        <Link to={`/dashboard/user/certificates/hackathon-${hackathon.id}`} className="text-indigo-400 hover:text-indigo-300">
                          Certificate
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Action button */}
                  <Link
                    to={isRegistered ? `/dashboard/user/hackathons/${hackathon.id}` : `/registration/${hackathon.id}`}
                    className={`block w-full text-center text-xs font-medium py-1.5 px-3 rounded transition-colors
                      bg-${getStatusColor(hackathon.status)}-900/60 text-${getStatusColor(hackathon.status)}-300 
                      hover:bg-${getStatusColor(hackathon.status)}-800/60
                    `}
                  >
                    {isRegistered ? 'Continue Project' : 'Register Now'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserHackathons;