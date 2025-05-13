import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
import Layout from './components/layout/Layout';
import DashboardRouter from './components/dashboard/DashboardRouter';
import OrganizerVerificationForm from './components/dashboard/user/OrganizerVerificationForm';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AssessmentDetails from './components/assessment/AssessmentDetails';
import VerificationPending from './components/dashboard/user/VerificationPending';
import TestDetailsDashboard from './components/dashboard/organizer/TestDetailsDashboard';

// Pages
import Home from './pages/Home';

// Auth pages
import Login from './pages/auth/Login';
import SignupWrapper from './pages/auth/SignupWrapper';
import Auth from './pages/auth/Auth';

// Team pages
import TeamCreation from './pages/team/TeamCreation';

// Hackathon pages
import Leaderboard from './pages/hackathons/Leaderboard';
import HackathonPage from './pages/hackathons/HackathonPage';
import HackathonDetails from './pages/hackathons/HackathonDetails';
import HackRegistration from './pages/hackathons/registration/HackRegistration';
import TeamFormationPage from './pages/hackathons/TeamFormationPage';
import FeaturedList from './pages/hackathons/sections/featured/FeaturedList';
import UpcomingList from './pages/hackathons/sections/upcoming/UpcomingList';
import WinnersShowcase from './pages/hackathons/sections/WinnersShowcase';
import ResourcesCommunity from './pages/hackathons/sections/ResourcesCommunity';

// Info pages
import About from './pages/info/About';
import Contact from './pages/info/Contact';
import FAQ from './pages/info/FAQ';

// Host pages
import HostHackathon from './pages/hackathons/host/HostHackathon';
import HackathonApplication from './pages/hackathons/host/HackathonApplication';

// Coding Challenge pages
import ChallengesList from './pages/challenges/ChallengesList';
import ChallengeSolver from './pages/challenges/ChallengeSolver';
import ChallengeLeaderboard from './pages/challenges/ChallengeLeaderboard';

// Challenge section pages
import DailySprintPage from './pages/challenges/sections/DailySprintPage';
import CodeConquestPage from './pages/challenges/sections/CodeConquestPage';
import ChallengeCardsPage from './pages/challenges/sections/ChallengeCardsPage';
import CompanyPrepPage from './pages/challenges/sections/CompanyPrepPage';

// Blogs page
import BlogsComingSoon from './pages/blogs/BlogsComingSoon';

// Community pages
import CommunityPage from './pages/community/CommunityPage';
import ForumsPage from './pages/community/ForumsPage';

// Clean Layout Component for Verification
const CleanLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md py-4">
        <div className="container mx-auto px-4">
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
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    // You could show a loading spinner here
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  // Allow children to be a function that receives user data
  return typeof children === 'function' ? children(user) : children;
};

// Role-based protected route
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // Redirect to dashboard or show unauthorized message
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Add this component before the AppRoutes function
const VerificationRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Debug 
  console.log('VerificationRedirect - Current user role:', user?.role);
  console.log('VerificationRedirect - Current path:', location.pathname);

  useEffect(() => {
    // Skip redirection if:
    // 1. Already on verification page
    // 2. User is loading
    // 3. Path is login/signup/auth
    // 4. User is not a pending_organizer
    if (
      loading ||
      location.pathname === '/verification' ||
      location.pathname.includes('/login') ||
      location.pathname.includes('/signup') ||
      location.pathname.includes('/auth') ||
      !user ||
      user.role !== 'pending_organizer'
    ) {
      return;
    }

    // Check if user is trying to access organizer routes
    const isOrganizerRoute =
      location.pathname.includes('/organizer') ||
      location.pathname.includes('/host') ||
      location.pathname.includes('/dashboard/organizer');

    // Only redirect to verification if pending_organizer is trying to access organizer routes
    if (isOrganizerRoute) {
      console.log('VerificationRedirect - Redirecting pending organizer from organizer route');
      navigate('/verification', { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);

  return children;
};

// RequireApprovedOrganizer wrapper
const RequireApprovedOrganizer = ({ children }) => {
  const { user, userVerification, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user?.role === 'organizer' && userVerification?.status !== 'approved') {
    return <Navigate to="/verification" replace />;
  }
  return children;
};

// VerificationRouteGuard for /verification route
const VerificationRouteGuard = ({ children }) => {
  const { user, userVerification, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  // Allow if:
  // 1. Not an organizer (let candidates/admins see it if needed)
  // 2. Organizer with no verification request
  // 3. Organizer with status 'rejected'
  if (
    !user ||
    user.role !== 'organizer' ||
    !userVerification ||
    userVerification.status === 'rejected'
  ) {
    return children;
  }

  // If status is pending, show Verification Pending page
  if (userVerification.status === 'pending') {
    return <VerificationPending />;
  }
  if (userVerification.status === 'approved') {
    return <Navigate to="/dashboard/organizer" replace />;
  }

  // Fallback
  return <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <VerificationRedirect>
        <Routes>
          {/* Special route for verification that bypasses the standard Layout */}
          <Route path="/verification" element={
            <ProtectedRoute>
              <VerificationRouteGuard>
                <CleanLayout>
                  <OrganizerVerificationForm />
                </CleanLayout>
              </VerificationRouteGuard>
            </ProtectedRoute>
          } />

          {/* All other routes use the standard Layout */}
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignupWrapper />} />

                {/* Dashboard routes (protected) with role-based redirection */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    {user => {
                      if (user.role === 'admin') {
                        return <Navigate to="/dashboard/admin" replace />;
                      } else if (user.role === 'organizer') {
                        return <Navigate to="/dashboard/organizer" replace />;
                      } else {
                        return <Navigate to="/dashboard/user" replace />;
                      }
                    }}
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/*" element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } />

                {/* Protected routes */}
                <Route path="/create-team" element={
                  <ProtectedRoute>
                    <TeamCreation />
                  </ProtectedRoute>
                } />

                <Route path="/assessment/:assessmentId" element={
                  <ProtectedRoute>
                    <AssessmentDetails />
                  </ProtectedRoute>
                } />

                <Route path="/registration" element={
                  <ProtectedRoute>
                    <RequireApprovedOrganizer>
                      <HackRegistration />
                    </RequireApprovedOrganizer>
                  </ProtectedRoute>
                } />

                <Route path="/registration/:hackathonId" element={
                  <ProtectedRoute>
                    <RequireApprovedOrganizer>
                      <HackRegistration />
                    </RequireApprovedOrganizer>
                  </ProtectedRoute>
                } />

                <Route path="/team-formation" element={
                  <ProtectedRoute>
                    <TeamFormationPage />
                  </ProtectedRoute>
                } />

                {/* Admin/Host routes */}
                <Route path="/host" element={
                  <RoleProtectedRoute allowedRoles={['admin', 'organizer']}>
                    <HackathonApplication />
                  </RoleProtectedRoute>
                } />

                <Route path="/host/create" element={
                  <RoleProtectedRoute allowedRoles={['admin', 'organizer']}>
                    <HostHackathon />
                  </RoleProtectedRoute>
                } />

                <Route path="/host/dev-create" element={
                  <RoleProtectedRoute allowedRoles={['admin', 'organizer']}>
                    <HostHackathon />
                  </RoleProtectedRoute>
                } />

                <Route path="/host/edit/:id" element={
                  <RoleProtectedRoute allowedRoles={['admin', 'organizer']}>
                    <HostHackathon />
                  </RoleProtectedRoute>
                } />

                {/* Public routes */}
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/hackathons" element={<HackathonPage />} />
                <Route path="/hackathons/featured" element={<FeaturedList />} />
                <Route path="/hackathons/upcoming" element={<UpcomingList />} />
                <Route path="/hackathons/winners" element={<WinnersShowcase />} />
                <Route path="/hackathons/resources" element={<ResourcesCommunity />} />
                <Route path="/hackathon/:hackathonId" element={<HackathonDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />

                {/* Coding Challenges routes */}
                <Route path="/challenges" element={<ChallengesList />} />
                <Route path="/challenges/leaderboard" element={<ChallengeLeaderboard />} />
                <Route path="/challenges/:challengeId" element={<ChallengeSolver />} />

                {/* Challenge Section Routes */}
                <Route path="/challenges/daily-sprint" element={<DailySprintPage />} />
                <Route path="/challenges/code-conquest" element={<CodeConquestPage />} />
                <Route path="/challenges/weekly-coding" element={<ChallengeCardsPage />} />
                <Route path="/challenges/cards" element={<ChallengeCardsPage />} />
                <Route path="/challenges/cards/:categoryId" element={<ChallengeCardsPage />} />
                <Route path="/challenges/daily-quiz" element={<ChallengesList />} />
                <Route path="/challenges/weekly-case" element={<ChallengesList />} />
                <Route path="/challenges/treasure-hunt" element={<ChallengesList />} />
                <Route path="/challenges/company-prep" element={<CompanyPrepPage />} />
                <Route path="/challenges/company-prep/:companyId" element={<CompanyPrepPage />} />
                <Route path="/company-prep" element={<CompanyPrepPage />} />
                <Route path="/company-prep/:companyId" element={<CompanyPrepPage />} />

                <Route path="/blogs" element={<BlogsComingSoon />} />

                {/* Legacy routes */}
                <Route path="/host/hackathon" element={<Navigate to="/host" replace />} />
                <Route path="/hackathons/hall-of-fame" element={<WinnersShowcase />} />

                {/* Community routes */}
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/community/forums" element={<ForumsPage />} />

                {/* Add TestDetailsDashboard route before the dashboard route */}
                <Route path="/dashboard/organizer/test-details" element={<TestDetailsDashboard />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </VerificationRedirect>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App; 