import React, { useState, useEffect } from 'react';

const AttendanceTracker = ({ participants, hackathons }) => {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedHackathon, setSelectedHackathon] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  
  // Generate random attendance data on component mount
  useEffect(() => {
    const data = {};
    participants.forEach(participant => {
      data[participant.id] = {};
      hackathons.forEach(hackathon => {
        // Random attendance between 0-100%
        data[participant.id][hackathon.id] = {
          checkins: Math.floor(Math.random() * (hackathon.days || 3) + 1),
          totalDays: hackathon.days || 3,
          lastCheckin: new Date(
            new Date().getTime() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
          ).toISOString()
        };
      });
    });
    setAttendanceData(data);
  }, [participants, hackathons]);
  
  // Filter participants based on search and selected hackathon
  useEffect(() => {
    let filtered = participants;
    
    if (searchText) {
      filtered = filtered.filter(participant => 
        participant.name.toLowerCase().includes(searchText.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredParticipants(filtered);
  }, [participants, searchText, selectedHackathon]);
  
  // Calculate attendance percentage
  const calculateAttendance = (participantId, hackathonId) => {
    if (!attendanceData[participantId] || !attendanceData[participantId][hackathonId]) {
      return 0;
    }
    
    const data = attendanceData[participantId][hackathonId];
    return Math.round((data.checkins / data.totalDays) * 100);
  };
  
  // Get average attendance for a participant across all hackathons
  const getAverageAttendance = (participantId) => {
    if (!attendanceData[participantId]) return 0;
    
    const hackathonIds = selectedHackathon === 'all' 
      ? hackathons.map(h => h.id)
      : [selectedHackathon];
    
    let total = 0;
    hackathonIds.forEach(id => {
      total += calculateAttendance(participantId, id);
    });
    
    return Math.round(total / hackathonIds.length);
  };
  
  // Handle manually updating attendance
  const handleUpdateAttendance = (participantId, hackathonId, increment) => {
    setAttendanceData(prev => {
      const newData = { ...prev };
      const current = newData[participantId][hackathonId].checkins;
      const totalDays = newData[participantId][hackathonId].totalDays;
      
      // Ensure checkins is between 0 and totalDays
      newData[participantId][hackathonId].checkins = Math.max(
        0, 
        Math.min(totalDays, current + increment)
      );
      
      // Update last checkin date if incrementing
      if (increment > 0) {
        newData[participantId][hackathonId].lastCheckin = new Date().toISOString();
      }
      
      return newData;
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px]">
          <input
            type="text"
            placeholder="Search participants..."
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        
        <div>
          <select
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
            value={selectedHackathon}
            onChange={(e) => setSelectedHackathon(e.target.value)}
          >
            <option value="all">All Hackathons</option>
            {hackathons.map(hackathon => (
              <option key={hackathon.id} value={hackathon.id}>
                {hackathon.name}
              </option>
            ))}
          </select>
        </div>
        
        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium">
          Export Attendance Data
        </button>
      </div>
      
      {/* Attendance Table */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Participant
                </th>
                {selectedHackathon === 'all' ? (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Average Attendance
                  </th>
                ) : (
                  <>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Check-ins
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Attendance %
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Last Check-in
                    </th>
                  </>
                )}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredParticipants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-800/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-lg font-medium text-cyan-300">{participant.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{participant.name}</div>
                        <div className="text-sm text-gray-500">{participant.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  {selectedHackathon === 'all' ? (
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-cyan-600 h-2.5 rounded-full" 
                            style={{ width: `${getAverageAttendance(participant.id)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-white">{getAverageAttendance(participant.id)}%</span>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleUpdateAttendance(participant.id, selectedHackathon, -1)}
                            className="text-gray-400 hover:text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <span className="mx-2 text-white">
                            {attendanceData[participant.id]?.[selectedHackathon]?.checkins || 0} / 
                            {attendanceData[participant.id]?.[selectedHackathon]?.totalDays || 0}
                          </span>
                          <button 
                            onClick={() => handleUpdateAttendance(participant.id, selectedHackathon, 1)}
                            className="text-gray-400 hover:text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                calculateAttendance(participant.id, selectedHackathon) >= 75 ? 'bg-green-500' :
                                calculateAttendance(participant.id, selectedHackathon) >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${calculateAttendance(participant.id, selectedHackathon)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-white">{calculateAttendance(participant.id, selectedHackathon)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {attendanceData[participant.id]?.[selectedHackathon]?.lastCheckin 
                          ? new Date(attendanceData[participant.id][selectedHackathon].lastCheckin).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                    </>
                  )}
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-cyan-400 hover:text-cyan-300">
                      {selectedHackathon === 'all' ? 'View Details' : 'Record Check-in'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;