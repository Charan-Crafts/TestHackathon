import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from './layout/DashboardLayout';
import Profile from './profile/Profile';
import Settings from './common/Settings';
import { ClockIcon, LockClosedIcon } from '@heroicons/react/24/outline';

// Import User Dashboard Components
import UserDashboard from './user/Overview';
import UserChallenges from './user/UserChallenges';
import UserWatchlist from './user/UserWatchlist';
import RecentlyViewed from './user/RecentlyViewed';
import UserHackathons from './user/UserHackathons';
import { HackathonDetail } from './user/hackathon';
import UserCertificates from './user/UserCertificates';
import OrganizerVerificationForm from './user/OrganizerVerificationForm';
import FindTeam from './user/FindTeam';
import MyTeam from './user/MyTeam';

// Import Organizer Dashboard Components
import HackathonsManagement from './organizer/HackathonsDashboard';
import ParticipantsDashboard from './organizer/ParticipantsDashboard';
import TeamsDashboard from './organizer/TeamsDashboard';
import TeamDetail from './organizer/teams/TeamDetail';
import SubmissionsDashboard from './organizer/SubmissionsDashboard';
import TeamFormation from './organizer/teams/TeamFormation';
import JudgingDashboard from './organizer/JudgingDashboard';
import OrgHackathonDetail from './organizer/hackathons/OrgHackathonDetail.js';
import { WalletDashboard } from './organizer/wallet';
import OrganizerHackathonDetail from './organizer/OrganizerHackathonDetail';
import TestDetailsDashboard from './organizer/TestDetailsDashboard';

// Import Admin Dashboard Components
import AdminPanel from './admin/AdminPanel';
import AdminLayout from './admin/AdminLayout';
import UserManagement from './admin/users/UserManagement';
import HackathonManagement from './admin/hackathons/HackathonManagement';
import ChallengeManagement from './admin/challenges/ChallengeManagement';
import CreateChallenge from './admin/challenges/CreateChallenge';
import EditChallenge from './admin/challenges/EditChallenge';

// Clean Layout without sidebar for verification form
const CleanLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/dashboard" className="flex items-center">
              <img
                src="/logo.svg"
                alt="HackathonHub"
                className="h-8 w-auto mr-3"
              />
              <h1 className="text-xl font-bold text-white">HackathonHub</h1>
            </a>
          </div>
          <a
            href="/dashboard/user"
            className="text-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

// Verification pending message component
const VerificationPendingMessage = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl">
    <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
      <div className="text-center">
        <ClockIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Organizer Verification Pending</h2>
        <p className="text-gray-300 mb-4">
          Your organizer verification request has been submitted and is currently under review.
          Our team will process your request within 2-3 business days.
        </p>
        <div className="bg-yellow-900/30 rounded-lg border border-yellow-500/30 p-4 mb-6">
          <div className="flex items-center mb-2">
            <LockClosedIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-yellow-300 font-medium">
              Until your account is verified by an admin, access to organizer features will be restricted.
            </p>
          </div>
          <p className="text-gray-400">
            You will receive an email notification once your verification status is updated,
            and all organizer features will be automatically unlocked without requiring a new login.
          </p>
          <div className="mt-4 pt-4 border-t border-yellow-700/30">
            <p className="text-yellow-200 text-sm">
              <strong>Note:</strong> The organizer dashboard and related features are not available while your verification is pending.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Temporary placeholder component for routes without implemented components
const PlaceholderComponent = ({ title }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-600">This feature is coming soon. Check back later!</p>
    </div>
  </div>
);

// HOC for protected organizer routes
const OrganizerRoute = ({ element, user }) => {
  const isVerifiedOrganizer = user?.role === 'organizer' || user?.role === 'admin';
  const isPendingOrganizer = user?.role === 'pending_organizer';

  console.log('OrganizerRoute - User role:', user?.role);
  console.log('OrganizerRoute - Is verified:', isVerifiedOrganizer);
  console.log('OrganizerRoute - Is pending:', isPendingOrganizer);

  if (isPendingOrganizer) {
    return <VerificationPendingMessage />;
  }

  if (!isVerifiedOrganizer) {
    console.log('OrganizerRoute - Redirecting to verification');
    return <Navigate to="/dashboard/user/verification" replace />;
  }

  return element;
};

const DashboardRouter = () => {
  const { user, loading } = useAuth();

  // Add debug logging
  console.log('DashboardRouter - Current user role:', user?.role);
  console.log('DashboardRouter - Current path:', window.location.pathname);

  // Show loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role for the root dashboard path
  if (window.location.pathname === '/dashboard') {
    if (user.role === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (user.role === 'organizer') {
      return <Navigate to="/dashboard/organizer" replace />;
    } else {
      return <Navigate to="/dashboard/user" replace />;
    }
  }

  // Handle verification route redirection
  const isVerificationRoute = window.location.pathname.includes('/verification');
  if (isVerificationRoute) {
    return <Navigate to="/verification" replace />;
  }

  // Check if user is accessing admin routes
  const isAdminRoute = window.location.pathname.includes('/dashboard/admin');

  // Check if user is accessing organizer routes
  const isOrganizerRoute = window.location.pathname.includes('/dashboard/organizer');

  // Check if user is accessing user dashboard routes - exclude myteam from this check
  const isUserRoute = window.location.pathname.includes('/dashboard/user') &&
    !window.location.pathname.includes('/dashboard/myteam');

  // Enforce role-based access restrictions
  if (isAdminRoute && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (isOrganizerRoute && user.role === 'pending_organizer') {
    console.log('DashboardRouter - Redirecting pending organizer trying to access organizer routes');
    return <Navigate to="/verification" replace />;
  }

  // If it's an admin route, use the AdminLayout
  if (isAdminRoute) {
    return (
      <AdminLayout user={user}>
        <Routes>
          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminPanel user={user} />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/hackathons" element={<HackathonManagement />} />
          <Route path="/admin/challenges" element={<ChallengeManagement />} />
          <Route path="/admin/challenges/create" element={<CreateChallenge />} />
          <Route path="/admin/challenges/edit/:id" element={<EditChallenge />} />
          <Route path="/admin/verification" element={<UserManagement />} />
          <Route path="/admin/moderation" element={<PlaceholderComponent title="Content Moderation" />} />
          <Route path="/admin/analytics" element={<PlaceholderComponent title="Analytics & Reports" />} />
          <Route path="/admin/system" element={<PlaceholderComponent title="System Settings" />} />
          <Route path="/admin/notifications" element={<PlaceholderComponent title="Notification Management" />} />
          <Route path="/admin/help" element={<PlaceholderComponent title="Support Dashboard" />} />

          {/* Profile & Settings */}
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/settings" element={<Settings user={user} />} />

          {/* Fallback route for admin section */}
          <Route path="/admin/*" element={<Navigate to="/dashboard/admin" replace />} />
        </Routes>
      </AdminLayout>
    );
  }

  // For regular user and organizer routes, use the standard DashboardLayout
  return (
    <DashboardLayout user={user}>
      <Routes>
        {/* Common Routes */}
        <Route path="/" element={<UserDashboard user={user} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/settings" element={<Settings user={user} />} />
        <Route path="/find-team" element={<FindTeam />} />
        <Route path="/myteam" element={<MyTeam />} />

        {/* Add verification routes - these should never actually render because we intercept above */}
        <Route path="/user/verification" element={<Navigate to="/verification" replace />} />
        <Route path="/dashboard/user/verification" element={<Navigate to="/verification" replace />} />

        {/* Organizer Routes - Wrapped with protector component */}
        <Route path="/dashboard/organizer" element={<OrganizerRoute element={<HackathonsManagement user={user} />} user={user} />} />
        <Route path="/dashboard/organizer/hackathons" element={<OrganizerRoute element={<HackathonsManagement user={user} />} user={user} />} />
        <Route path="/dashboard/organizer/hackathons/:id" element={<OrganizerRoute element={<OrganizerHackathonDetail user={user} />} user={user} />} />
        <Route path="/dashboard/organizer/participants" element={<OrganizerRoute element={<ParticipantsDashboard user={user} />} user={user} />} />
        <Route path="/dashboard/organizer/teams" element={<OrganizerRoute element={<TeamsDashboard user={user} />} user={user} />} />
        <Route path="/dashboard/organizer/teams/:teamId" element={<OrganizerRoute element={<TeamDetail />} user={user} />} />
        <Route path="/dashboard/organizer/teams/detail/:teamId" element={<OrganizerRoute element={<TeamDetail />} user={user} />} />
        <Route path="/dashboard/organizer/teams/formation" element={<OrganizerRoute element={<TeamFormation />} user={user} />} />
        <Route path="/dashboard/organizer/judging" element={<OrganizerRoute element={<JudgingDashboard user={user} />} user={user} />} />
        <Route path="/dashboard/organizer/wallet" element={<OrganizerRoute element={<WalletDashboard user={user} />} user={user} />} />
        <Route path="/dashboard/organizer/test-details" element={<OrganizerRoute element={<TestDetailsDashboard user={user} />} user={user} />} />

        {/* Submissions Routes */}
        <Route path="/dashboard/organizer/submissions" element={<OrganizerRoute element={<SubmissionsDashboard user={user} />} user={user} />} />
        <Route path="/dashboard/organizer/submissions/:hackathonId" element={<OrganizerRoute element={<SubmissionsDashboard user={user} />} user={user} />} />
        <Route path="/dashboard/organizer/submissions/:hackathonId/:roundId" element={<OrganizerRoute element={<SubmissionsDashboard user={user} />} user={user} />} />

        {/* Special debug route */}
        <Route path="/orgview/:id" element={<OrganizerRoute element={
          <div className="p-6 bg-gray-900">
            <h1 className="text-xl font-bold text-white mb-4">Debug OrgHackathonDetail Route</h1>
            <p className="text-gray-300">This is a debug route that will render the OrgHackathonDetail component.</p>
            <hr className="my-4 border-gray-700" />
            <OrgHackathonDetail user={user} />
          </div>
        } user={user} />} />

        {/* Additional explicit paths for common hackathon IDs */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(id => (
          <Route
            key={id}
            path={`/dashboard/organizer/hackathons/${id}`}
            element={<OrganizerRoute element={<OrgHackathonDetail user={user} />} user={user} />}
          />
        ))}

        {/* User Dashboard Routes */}
        <Route path="/dashboard/user" element={<UserDashboard user={user} />} />
        <Route path="/dashboard/user/hackathons" element={<UserHackathons user={user} />} />
        <Route path="/dashboard/user/hackathons/:hackathonId" element={<HackathonDetail />} />
        <Route path="/dashboard/user/challenges" element={<UserChallenges user={user} />} />
        <Route path="/dashboard/user/watchlist" element={<UserWatchlist user={user} />} />
        <Route path="/dashboard/user/history" element={<RecentlyViewed user={user} />} />
        <Route path="/dashboard/user/certificates" element={<UserCertificates user={user} />} />
        <Route path="/dashboard/myteam" element={<MyTeam />} />

        {/* Hackathon-specific routes */}
        <Route path="/hackathon/:id/participants" element={<OrganizerRoute element={<ParticipantsDashboard user={user} />} user={user} />} />
        <Route path="/hackathon/:id/teams" element={<OrganizerRoute element={<TeamsDashboard user={user} />} user={user} />} />
        <Route path="/hackathon/:id/submissions" element={<OrganizerRoute element={<SubmissionsDashboard user={user} />} user={user} />} />

        {/* Also add routes with /dashboard prefix */}
        <Route path="/dashboard/hackathon/:id/participants" element={<OrganizerRoute element={<ParticipantsDashboard user={user} />} user={user} />} />
        <Route path="/dashboard/hackathon/:id/teams" element={<OrganizerRoute element={<TeamsDashboard user={user} />} user={user} />} />
        <Route path="/dashboard/hackathon/:id/submissions" element={<OrganizerRoute element={<SubmissionsDashboard user={user} />} user={user} />} />

        {/* Add alternative routes without /dashboard prefix for compatibility */}
        <Route path="/organizer" element={<OrganizerRoute element={<HackathonsManagement user={user} />} user={user} />} />
        <Route path="/organizer/hackathons" element={<OrganizerRoute element={<HackathonsManagement user={user} />} user={user} />} />
        <Route path="/organizer/hackathons/:id" element={<OrganizerRoute element={<OrganizerHackathonDetail user={user} />} user={user} />} />
        <Route path="/organizer/participants" element={<OrganizerRoute element={<ParticipantsDashboard user={user} />} user={user} />} />
        <Route path="/organizer/teams" element={<OrganizerRoute element={<TeamsDashboard user={user} />} user={user} />} />
        <Route path="/organizer/teams/:teamId" element={<OrganizerRoute element={<TeamDetail />} user={user} />} />
        <Route path="/organizer/teams/detail/:teamId" element={<OrganizerRoute element={<TeamDetail />} user={user} />} />
        <Route path="/organizer/teams/formation" element={<OrganizerRoute element={<TeamFormation />} user={user} />} />
        <Route path="/organizer/judging" element={<OrganizerRoute element={<JudgingDashboard user={user} />} user={user} />} />
        <Route path="/organizer/wallet" element={<OrganizerRoute element={<WalletDashboard user={user} />} user={user} />} />
        <Route path="/organizer/test-details" element={<OrganizerRoute element={<TestDetailsDashboard user={user} />} user={user} />} />
        <Route path="/organizer/submissions" element={<OrganizerRoute element={<SubmissionsDashboard user={user} />} user={user} />} />
        <Route path="/organizer/submissions/:hackathonId" element={<OrganizerRoute element={<SubmissionsDashboard user={user} />} user={user} />} />
        <Route path="/organizer/submissions/:hackathonId/:roundId" element={<OrganizerRoute element={<SubmissionsDashboard user={user} />} user={user} />} />

        {/* Add alternative user routes without /dashboard prefix for compatibility */}
        <Route path="/user" element={<UserDashboard user={user} />} />
        <Route path="/user/hackathons" element={<UserHackathons user={user} />} />
        <Route path="/user/hackathons/:hackathonId" element={<HackathonDetail />} />
        <Route path="/user/challenges" element={<UserChallenges user={user} />} />
        <Route path="/user/watchlist" element={<UserWatchlist user={user} />} />
        <Route path="/user/history" element={<RecentlyViewed user={user} />} />
        <Route path="/user/certificates" element={<UserCertificates user={user} />} />
        <Route path="/user/myteam" element={<MyTeam />} />

        {/* Wallet Dashboard */}
        <Route path="/wallet" element={<OrganizerRoute element={<WalletDashboard user={user} />} user={user} />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard/user" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRouter;  