import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function BlogsComingSoon() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Simulate API call
    setError('');
    setTimeout(() => {
      setIsSubscribed(true);
    }, 800);
  };
  
  // Sample blog categories
  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'hackathons', name: 'Hackathon Tips' },
    { id: 'tech', name: 'Technology' },
    { id: 'career', name: 'Career Growth' },
    { id: 'stories', name: 'Success Stories' }
  ];
  
  // Sample featured blog post
  const featuredPost = {
    title: "The Ultimate Guide to Winning Your First Hackathon",
    excerpt: "Comprehensive strategies, teamwork tips, and technical insights to help you stand out in competitive hackathons and build projects that impress judges.",
    category: "Hackathon Tips",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  };
  
  // Sample blog posts
  const blogPosts = [
    {
      title: "Building a Successful Hackathon Project: From Idea to Demo",
      excerpt: "Learn the step-by-step process of creating a winning project that showcases both technical excellence and practical applications.",
      category: "hackathons",
      readTime: "8 min read",
      colorClass: "from-purple-700 to-indigo-700"
    },
    {
      title: "The Rise of AI in Hackathon Projects: Trends and Opportunities",
      excerpt: "Explore how artificial intelligence is transforming hackathon submissions and opening new possibilities for innovators.",
      category: "tech",
      readTime: "10 min read",
      colorClass: "from-blue-700 to-cyan-700"
    },
    {
      title: "How to Form the Perfect Hackathon Team",
      excerpt: "Discover strategies for building a balanced team with complementary skills that can tackle any hackathon challenge effectively.",
      category: "hackathons",
      readTime: "7 min read",
      colorClass: "from-emerald-700 to-teal-700"
    },
    {
      title: "Remote vs. In-Person Hackathons: Pros and Cons",
      excerpt: "A detailed comparison of virtual and physical hackathon experiences to help you choose the format that suits your style.",
      category: "hackathons",
      readTime: "6 min read",
      colorClass: "from-amber-700 to-orange-700"
    },
    {
      title: "Securing Funding After Your Hackathon Success",
      excerpt: "Navigate the path from hackathon prototype to funded startup with advice from founders who've made the journey.",
      category: "career",
      readTime: "9 min read",
      colorClass: "from-rose-700 to-pink-700"
    },
    {
      title: "From Hackathon to Startup: Success Stories",
      excerpt: "Inspirational stories of renowned companies that began as hackathon projects and tips for following their path.",
      category: "stories",
      readTime: "11 min read",
      colorClass: "from-violet-700 to-purple-700"
    }
  ];
  
  // Filter posts based on active category
  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className={`text-center mb-20 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="inline-block px-4 py-1 bg-indigo-900/50 rounded-full text-indigo-400 text-sm font-medium mb-4">
            Coming Soon
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Insights for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Innovators</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Practical advice, inspirational stories, and technical deep-dives for the hackathon community.
          </p>
          
          <div className="relative inline-block w-full max-w-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30"></div>
            <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-xl">
              {!isSubscribed ? (
                <>
                  <h2 className="text-2xl font-bold text-white mb-4">Be the first to know</h2>
                  <p className="text-gray-300 mb-6">
                    Subscribe to receive our articles as soon as they're published and get exclusive content.
                  </p>
                  <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-grow px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Email address for blog notification"
                        aria-required="true"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105"
                        aria-label="Subscribe to blog notifications"
                      >
                        Subscribe
                      </button>
                    </div>
                    {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">You're in the loop!</h2>
                  <p className="text-gray-300">
                    Thanks for subscribing. You'll be among the first to receive our content.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Featured Post */}
        <div className={`mb-16 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <img src={featuredPost.image} alt="Featured post" className="w-full h-96 object-cover" />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
              <span className="px-3 py-1 bg-indigo-500 text-white text-sm font-medium rounded-full w-fit mb-4">
                {featuredPost.category}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{featuredPost.title}</h2>
              <p className="text-gray-200 mb-4 max-w-3xl">{featuredPost.excerpt}</p>
              <div className="flex items-center text-gray-300">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {featuredPost.readTime}
                </span>
                <span className="flex items-center ml-8">
                  <span className="text-indigo-400 font-semibold">Coming Soon</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className={`mb-10 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Blog Posts Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
          {filteredPosts.map((post, index) => (
            <div key={index} className="bg-gray-800/70 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group">
              <div className={`h-48 bg-gradient-to-r ${post.colorClass} group-hover:scale-105 transition-all duration-300`}>
                <div className="h-full w-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-gray-700 text-indigo-400 text-xs font-medium rounded-full">
                    {categories.find(cat => cat.id === post.category)?.name || post.category}
                  </span>
                  <span className="text-gray-400 text-sm">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{post.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-400 text-sm font-medium">Coming Soon</span>
                  <button className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Newsletter CTA */}
        <div className={`mb-16 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '500ms' }}>
          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-8 md:p-12 border border-indigo-800/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Stay in the know</h2>
                <p className="text-gray-300">
                  Our blog is launching soon with expert insights, hackathon news, and coding tips.
                </p>
              </div>
              <Link to="#subscribe" className="whitespace-nowrap px-8 py-3 bg-white text-indigo-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Get Notified
              </Link>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-gray-300 mt-2">Everything you need to know about our upcoming blog</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700 hover:border-indigo-500/30 transition-colors">
              <h3 className="text-lg font-medium text-white mb-2">What topics will your blog cover?</h3>
              <p className="text-gray-300">
                Our blog will feature hackathon tips, technical tutorials, success stories, industry insights, and resources for developers at all skill levels. We'll focus on practical advice that you can apply immediately.
              </p>
            </div>
            
            <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700 hover:border-indigo-500/30 transition-colors">
              <h3 className="text-lg font-medium text-white mb-2">How often will you publish new content?</h3>
              <p className="text-gray-300">
                We plan to publish new content weekly, with in-depth technical articles and hackathon guides twice a month. We value quality over quantity.
              </p>
            </div>
            
            <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700 hover:border-indigo-500/30 transition-colors">
              <h3 className="text-lg font-medium text-white mb-2">Can I contribute to the blog?</h3>
              <p className="text-gray-300">
                Absolutely! We welcome guest contributors who have valuable insights to share with our community. Once we launch, you'll find information on how to submit your articles for consideration.
              </p>
            </div>
            
            <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700 hover:border-indigo-500/30 transition-colors">
              <h3 className="text-lg font-medium text-white mb-2">Will the content be beginner-friendly?</h3>
              <p className="text-gray-300">
                We're designing our content to be accessible to developers at all levels. Each article will clearly indicate whether it's beginner, intermediate, or advanced to help you find relevant content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogsComingSoon; 