import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { Link } from 'react-router-dom';

function FaqSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [typedQuestion, setTypedQuestion] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const sectionRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const faqs = useMemo(() => [
    {
      question: "What is a hackathon?",
      answer: "A hackathon is a time-bound competitive event where participants collaborate to build innovative solutions to specific challenges. Our platform helps organizations run successful hackathons by handling registration, team formation, project submissions, and judging."
    },
    {
      question: "Who can participate in hackathons?",
      answer: "Anyone with an interest in technology, innovation, and problem-solving can participate in hackathons. Most hackathons welcome participants from various backgrounds including developers, designers, product managers, data scientists, and subject matter experts."
    },
    {
      question: "Do I need to have a team to join a hackathon?",
      answer: "No, you can register individually and either form a team before the event or find teammates during the hackathon. Our platform provides team formation tools to help solo participants connect with others who have complementary skills."
    },
    {
      question: "How are hackathon winners selected?",
      answer: "Each hackathon has its own judging criteria, typically including innovation, technical complexity, design, user experience, and potential impact. Projects are usually evaluated by a panel of judges through presentations and demonstrations."
    }
  ], []);

  useEffect(() => {
    if (activeIndex !== null) {
      // Reset
      setTypedQuestion('');
      setShowAnswer(false);
      setCurrentCharIndex(0);
    }
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex !== null) {
      const questionText = faqs[activeIndex].question;
      
      if (currentCharIndex < questionText.length) {
        const typingTimer = setTimeout(() => {
          setTypedQuestion(prev => prev + questionText[currentCharIndex]);
          setCurrentCharIndex(prev => prev + 1);
        }, 30); // Faster typing speed
        
        return () => clearTimeout(typingTimer);
      } else {
        const answerTimer = setTimeout(() => {
          setShowAnswer(true);
        }, 300); // Shorter pause before showing answer
        
        return () => clearTimeout(answerTimer);
      }
    }
  }, [activeIndex, currentCharIndex, faqs]);

  // Auto-scroll terminal when content changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [typedQuestion, showAnswer]);

  const selectQuestion = (index) => {
    setActiveIndex(index);
    setCurrentCharIndex(0);
    setTypedQuestion('');
    setShowAnswer(false);
  };

  return (
    <section ref={sectionRef} id="faq" className="py-20 relative overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Digital circuit pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
        
        {/* Animated tech dots */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`dot-${i}`}
            className="absolute rounded-full bg-purple-500"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              boxShadow: '0 0 8px rgba(139, 92, 246, 0.8)',
              animation: `pulse-slow ${Math.random() * 4 + 2}s infinite alternate`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-12 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="inline-block px-3 py-1 rounded-full bg-purple-900/30 text-purple-400 text-xs font-semibold mb-3">
            SYSTEM.HELP
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-4">
            Command-Line FAQ
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Access our knowledge database using this interactive terminal interface
          </p>
        </div>
        
        <div className={`mx-auto rounded-xl overflow-hidden shadow-2xl transition-all duration-700 delay-300 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          {/* Terminal window UI */}
          <div className="bg-gray-800 px-4 py-2 flex items-center border-b border-gray-700">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="bg-gray-700 rounded px-3 py-1 text-gray-400 text-xs flex-grow text-center">
              hackathonhub@faq:~
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Sidebar with question options */}
            <div className="w-full md:w-1/3 bg-gray-900 border-r border-gray-700 p-4">
              <div className="text-gray-400 text-xs mb-3 font-mono">
                $ ls -la questions/
              </div>
              <div className="space-y-2">
                {faqs.map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => selectQuestion(index)}
                    className={`w-full text-left py-2 px-3 rounded text-sm transition-colors ${
                      activeIndex === index 
                        ? 'bg-purple-900/30 text-purple-300'
                        : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <span className="font-mono mr-2 text-purple-500">~$</span> 
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Main terminal window */}
            <div 
              ref={terminalRef}
              className="w-full md:w-2/3 bg-gray-950 p-4 font-mono text-sm h-80 overflow-y-auto"
            >
              <div className="text-green-500 mb-4">
                Welcome to HackathonHub FAQ Terminal v1.0.1
                <br/>
                Type help() or select a question from the sidebar to begin.
              </div>
              
              {activeIndex !== null && (
                <div>
                  <div className="flex items-start text-white mb-4">
                    <span className="text-purple-500 mr-2 font-bold">$</span>
                    <span className="text-yellow-300 mr-2">query</span> 
                    <span className="text-blue-400">
                      &#123;"<span className="text-green-300">{typedQuestion}</span>
                      <span className={`inline-block w-2 h-5 bg-white ml-0.5 ${typedQuestion.length === faqs[activeIndex].question.length ? 'opacity-0' : 'blink-cursor'}`}></span>"&#125;
                    </span>
                  </div>
                  
                  {showAnswer && (
                    <div className="pl-4 border-l-2 border-gray-700 mb-6 fade-in">
                      <div className="text-gray-400 mb-2">{/* Response from knowledge base: */}</div>
                      <div className="text-purple-200">
                        <span className="text-yellow-300">const</span> <span className="text-blue-400">answer</span> = <span className="text-green-300">"{faqs[activeIndex].answer}"</span>;
                      </div>
                      <div className="mt-4 bg-gray-800/40 p-3 rounded border border-gray-700">
                        {faqs[activeIndex].answer}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center text-gray-300">
                <span className="text-purple-500 mr-2">~$</span>
                <span className="blink-cursor">│</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 border-t border-gray-700 p-3 flex justify-between items-center">
            <div className="text-xs text-gray-500 font-mono">
              Press CTRL+C to copy answers
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqSection; 