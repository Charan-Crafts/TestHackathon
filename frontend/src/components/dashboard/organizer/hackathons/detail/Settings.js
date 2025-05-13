import React, { useState } from 'react';

const Settings = ({ hackathon, setHackathon }) => {
  const [settings, setSettings] = useState({
    requireApproval: hackathon?.settings?.requireApproval || true,
    allowTeamFormation: hackathon?.settings?.allowTeamFormation || true,
    maxTeamSize: hackathon?.settings?.maxTeamSize || 4,
    minTeamSize: hackathon?.settings?.minTeamSize || 2,
    autoStartRounds: hackathon?.settings?.autoStartRounds || false,
    allowPublicVoting: hackathon?.settings?.allowPublicVoting || false,
    requireProjectLinks: hackathon?.settings?.requireProjectLinks || true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle settings change
  const handleSettingChange = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: value
    });
  };

  // Save settings
  const saveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update hackathon settings
      if (setHackathon) {
        setHackathon({
          ...hackathon,
          settings: settings
        });
      }
      
      setIsSaving(false);
      setSuccessMessage('Settings saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 800);
  };

  return (
    <div>
      {/* Settings Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Hackathon Settings</h2>
        <p className="text-gray-400">Configure settings for your hackathon</p>
      </div>
      
      {/* Settings Form */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/40 p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">General Settings</h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Require Application Approval</h4>
              <p className="text-gray-400 text-sm">Manually approve participants before they can join the hackathon</p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input 
                type="checkbox" 
                checked={settings.requireApproval}
                onChange={() => handleSettingChange('requireApproval', !settings.requireApproval)}
                className="sr-only" 
                id="requireApproval" 
              />
              <label 
                htmlFor="requireApproval"
                className={`block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer ${
                  settings.requireApproval ? 'bg-cyan-600' : ''
                }`}
              >
                <span 
                  className={`absolute block w-5 h-5 rounded-full bg-white transform transition-transform ${
                    settings.requireApproval ? 'translate-x-6' : 'translate-x-1'
                  } mt-0.5`}
                ></span>
              </label>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Allow Team Formation</h4>
                <p className="text-gray-400 text-sm">Let participants create and join teams</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={settings.allowTeamFormation}
                  onChange={() => handleSettingChange('allowTeamFormation', !settings.allowTeamFormation)}
                  className="sr-only" 
                  id="allowTeamFormation" 
                />
                <label 
                  htmlFor="allowTeamFormation"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer ${
                    settings.allowTeamFormation ? 'bg-cyan-600' : ''
                  }`}
                >
                  <span 
                    className={`absolute block w-5 h-5 rounded-full bg-white transform transition-transform ${
                      settings.allowTeamFormation ? 'translate-x-6' : 'translate-x-1'
                    } mt-0.5`}
                  ></span>
                </label>
              </div>
            </div>
            
            {settings.allowTeamFormation && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1" htmlFor="minTeamSize">
                    Minimum Team Size
                  </label>
                  <input 
                    type="number" 
                    id="minTeamSize"
                    value={settings.minTeamSize}
                    onChange={(e) => handleSettingChange('minTeamSize', parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1" htmlFor="maxTeamSize">
                    Maximum Team Size
                  </label>
                  <input 
                    type="number" 
                    id="maxTeamSize"
                    value={settings.maxTeamSize}
                    onChange={(e) => handleSettingChange('maxTeamSize', parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Auto-start Rounds</h4>
                <p className="text-gray-400 text-sm">Automatically begin rounds based on their scheduled start dates</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={settings.autoStartRounds}
                  onChange={() => handleSettingChange('autoStartRounds', !settings.autoStartRounds)}
                  className="sr-only" 
                  id="autoStartRounds" 
                />
                <label 
                  htmlFor="autoStartRounds"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer ${
                    settings.autoStartRounds ? 'bg-cyan-600' : ''
                  }`}
                >
                  <span 
                    className={`absolute block w-5 h-5 rounded-full bg-white transform transition-transform ${
                      settings.autoStartRounds ? 'translate-x-6' : 'translate-x-1'
                    } mt-0.5`}
                  ></span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Allow Public Voting</h4>
                <p className="text-gray-400 text-sm">Enable community voting on projects</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={settings.allowPublicVoting}
                  onChange={() => handleSettingChange('allowPublicVoting', !settings.allowPublicVoting)}
                  className="sr-only" 
                  id="allowPublicVoting" 
                />
                <label 
                  htmlFor="allowPublicVoting"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer ${
                    settings.allowPublicVoting ? 'bg-cyan-600' : ''
                  }`}
                >
                  <span 
                    className={`absolute block w-5 h-5 rounded-full bg-white transform transition-transform ${
                      settings.allowPublicVoting ? 'translate-x-6' : 'translate-x-1'
                    } mt-0.5`}
                  ></span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Require Project Links</h4>
                <p className="text-gray-400 text-sm">Require demo and repository links for submissions</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={settings.requireProjectLinks}
                  onChange={() => handleSettingChange('requireProjectLinks', !settings.requireProjectLinks)}
                  className="sr-only" 
                  id="requireProjectLinks" 
                />
                <label 
                  htmlFor="requireProjectLinks"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer ${
                    settings.requireProjectLinks ? 'bg-cyan-600' : ''
                  }`}
                >
                  <span 
                    className={`absolute block w-5 h-5 rounded-full bg-white transform transition-transform ${
                      settings.requireProjectLinks ? 'translate-x-6' : 'translate-x-1'
                    } mt-0.5`}
                  ></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end">
        {successMessage && (
          <div className="mr-4 bg-green-900/30 text-green-300 px-4 py-2 rounded-lg border border-green-700/40">
            {successMessage}
          </div>
        )}
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings; 