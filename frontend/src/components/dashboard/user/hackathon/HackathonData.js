// Mock data for a complete hackathon lifecycle
export const hackathonTimeline = {
  id: 'hack-1',
  title: 'AI Innovation Challenge',
  description: 'Create innovative AI solutions for real-world problems',
  organizer: 'TechGrowth Labs',
  organizerLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=AI&backgroundColor=4f46e5',
  banner: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&q=80&w=1770&ixlib=rb-4.0.3',
  prize: '$10,000',
  startDate: '2023-10-01',
  endDate: '2023-10-30',
  created: '2023-08-15',
  location: 'Virtual',
  phases: [
    {
      id: 'registration',
      name: 'Registration & Team Formation',
      description: 'Register for the hackathon and form your team',
      startDate: '2023-09-01',
      endDate: '2023-09-30',
      status: 'completed',
      order: 1,
      tasks: [
        {
          id: 'register',
          name: 'Register for Hackathon',
          description: 'Create an account and register for the hackathon',
          required: true,
          completed: true,
          completedDate: '2023-09-05'
        },
        {
          id: 'form-team',
          name: 'Form or Join a Team',
          description: 'Create a new team or join an existing one',
          required: true,
          completed: true,
          completedDate: '2023-09-10',
          teamId: 'team-123',
          teamName: 'CodeCrafters',
          teamMembers: [
            { id: 'user-1', name: 'John Doe', role: 'Team Leader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
            { id: 'user-2', name: 'Jane Smith', role: 'Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
            { id: 'user-3', name: 'Mike Johnson', role: 'Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
            { id: 'user-4', name: 'Sarah Wilson', role: 'Data Scientist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
          ]
        },
        {
          id: 'profile-completion',
          name: 'Complete Team Profile',
          description: 'Add all required information to your team profile',
          required: true,
          completed: true,
          completedDate: '2023-09-15'
        }
      ]
    },
    {
      id: 'ideation',
      name: 'Idea Submission',
      description: 'Develop and submit your initial project idea',
      startDate: '2023-10-01',
      endDate: '2023-10-07',
      status: 'completed',
      order: 2,
      tasks: [
        {
          id: 'idea-submission',
          name: 'Submit Project Idea',
          description: 'Describe your project idea, challenge it addresses, and proposed solution',
          required: true,
          completed: true,
          completedDate: '2023-10-05',
          submission: {
            id: 'sub-1',
            title: 'AI-Powered Medical Diagnosis Assistant',
            description: 'An AI system that helps healthcare professionals quickly identify potential diagnoses based on patient symptoms and medical history.',
            problem: 'Delayed diagnoses in healthcare settings due to information overload and time constraints.',
            solution: 'Using machine learning to analyze patient data and provide diagnostic suggestions to healthcare providers.',
            techStack: ['Python', 'TensorFlow', 'React', 'Node.js'],
            feedback: 'Strong concept with clear problem/solution. Consider adding privacy and security aspects.'
          }
        },
        {
          id: 'idea-feedback',
          name: 'Review Mentor Feedback',
          description: 'Review feedback from mentors on your project idea',
          required: false,
          completed: true,
          completedDate: '2023-10-06'
        }
      ]
    },
    {
      id: 'development',
      name: 'Project Development',
      description: 'Build your solution according to the approved idea',
      startDate: '2023-10-08',
      endDate: '2023-10-21',
      status: 'completed',
      order: 3,
      tasks: [
        {
          id: 'milestone-1',
          name: 'Submit Progress Milestone 1',
          description: 'Share your initial prototype or proof of concept',
          required: true,
          completed: true,
          completedDate: '2023-10-14',
          submission: {
            id: 'sub-2',
            title: 'Initial Prototype',
            description: 'First version of the AI diagnostic engine with basic symptom processing',
            demoLink: 'https://example.com/demo1',
            repoLink: 'https://github.com/example/medai-prototype',
            screenshots: ['https://via.placeholder.com/300x200?text=Prototype+Screenshot'],
            feedback: 'Good progress. Focus on improving accuracy and adding more symptoms to the database.'
          }
        },
        {
          id: 'milestone-2',
          name: 'Submit Progress Milestone 2',
          description: 'Share your refined prototype with core functionality',
          required: true,
          completed: true,
          completedDate: '2023-10-20',
          submission: {
            id: 'sub-3',
            title: 'Enhanced Prototype',
            description: 'Improved AI model with expanded symptom database and initial UI',
            demoLink: 'https://example.com/demo2',
            repoLink: 'https://github.com/example/medai-prototype',
            screenshots: ['https://via.placeholder.com/300x200?text=Enhanced+Prototype'],
            feedback: 'Significant improvement. UI needs work but the core functionality is strong.'
          }
        },
        {
          id: 'mentor-session',
          name: 'Attend Mentor Session',
          description: 'Participate in a mentor feedback session',
          required: false,
          completed: true,
          completedDate: '2023-10-15'
        }
      ]
    },
    {
      id: 'final-submission',
      name: 'Final Submission',
      description: 'Submit your complete project for judging',
      startDate: '2023-10-22',
      endDate: '2023-10-27',
      status: 'active', // This is the current active phase
      order: 4,
      tasks: [
        {
          id: 'final-code',
          name: 'Submit Final Code',
          description: 'Submit the final version of your project code',
          required: true,
          completed: false
        },
        {
          id: 'presentation',
          name: 'Create Project Presentation',
          description: 'Prepare a presentation showcasing your solution',
          required: true,
          completed: false
        },
        {
          id: 'demo-video',
          name: 'Submit Demo Video',
          description: 'Create and submit a video demonstrating your solution',
          required: true,
          completed: false
        }
      ]
    },
    {
      id: 'judging',
      name: 'Judging Period',
      description: 'Judges evaluate submitted projects',
      startDate: '2023-10-28',
      endDate: '2023-10-29',
      status: 'upcoming',
      order: 5,
      tasks: [
        {
          id: 'q-and-a',
          name: 'Q&A Session with Judges',
          description: 'Be available to answer questions about your project',
          required: true,
          completed: false
        }
      ]
    },
    {
      id: 'results',
      name: 'Results Announcement',
      description: 'Winners announced and prizes awarded',
      startDate: '2023-10-30',
      endDate: '2023-10-30',
      status: 'upcoming',
      order: 6,
      tasks: [
        {
          id: 'awards-ceremony',
          name: 'Attend Virtual Awards Ceremony',
          description: 'Join the live stream for the results announcement',
          required: false,
          completed: false
        }
      ]
    }
  ],
  // Current progress stats
  progress: {
    currentPhase: 'final-submission',
    phasesCompleted: 3,
    totalPhases: 6,
    tasksCompleted: 9,
    totalTasks: 14,
    daysRemaining: 3,
    overallProgress: 85
  },
  team: {
    id: 'team-123',
    name: 'CodeCrafters',
    members: [
      { id: 'user-1', name: 'John Doe', role: 'Team Leader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
      { id: 'user-2', name: 'Jane Smith', role: 'Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
      { id: 'user-3', name: 'Mike Johnson', role: 'Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
      { id: 'user-4', name: 'Sarah Wilson', role: 'Data Scientist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
    ],
    isLeader: true, // Current user is team leader
  }
};

// Helper functions
export const getCurrentPhase = (hackathon) => {
  return hackathon.phases.find(phase => phase.status === 'active') || 
         hackathon.phases[hackathon.phases.length - 1];
};

export const getPhaseProgress = (phase) => {
  if (!phase) return 0;
  const completedTasks = phase.tasks.filter(task => task.completed).length;
  return phase.tasks.length > 0 ? (completedTasks / phase.tasks.length) * 100 : 0;
};

export const getNextTask = (hackathon) => {
  const currentPhase = getCurrentPhase(hackathon);
  if (!currentPhase) return null;
  
  return currentPhase.tasks.find(task => !task.completed && task.required);
};

// Format date to more readable format
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Check if a date is in the past
export const isPastDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date < today;
};

// Calculate days remaining
export const getDaysRemaining = (endDateString) => {
  const endDate = new Date(endDateString);
  const today = new Date();
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}; 