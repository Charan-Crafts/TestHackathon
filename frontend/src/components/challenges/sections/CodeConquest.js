import React from 'react';
import { Link } from 'react-router-dom';

function CodeConquest() {
  return (
    <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-700">
      <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold text-white">Code Conquest</h2>
          
          <p className="text-gray-300">
            Pick your topics, set your difficulty, and master key concepts with ease!
          </p>
          
          <Link 
            to="/challenges/code-conquest"
            className="inline-flex items-center justify-center px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-colors"
          >
            Start now
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        
        <div className="md:w-1/2 relative">
          {/* Code editor window */}
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg max-w-md mx-auto border border-gray-700">
            {/* Editor header */}
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <span className="font-mono bg-gray-700 px-2 py-1 rounded text-white text-xs mr-2">C++</span>
                  <span className="font-mono bg-gray-700 px-2 py-1 rounded text-white text-xs mr-2">JAVA</span>
                  <span className="font-mono bg-gray-700 px-2 py-1 rounded text-white text-xs">PY</span>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            {/* Editor content */}
            <div className="px-4 py-3 font-mono text-xs">
              <div className="flex">
                <div className="text-gray-500 w-6">1</div>
                <div className="text-red-400 flex-1">{/* Error in code */}</div>
              </div>
              <div className="flex">
                <div className="text-gray-500 w-6">2</div>
                <div className="flex-1">
                  <span className="text-yellow-400">function</span>
                  <span className="text-white"> </span>
                  <span className="text-cyan-400">solution</span>
                  <span className="text-white">(</span>
                  <span className="text-purple-400">array</span>
                  <span className="text-white">) {'{'}</span>
                </div>
              </div>
              <div className="flex">
                <div className="text-gray-500 w-6">3</div>
                <div className="flex-1">
                  <span className="text-indigo-400">  if</span>
                  <span className="text-white">(</span>
                  <span className="text-purple-400">array</span>
                  <span className="text-white">.</span>
                  <span className="text-cyan-400">length</span>
                  <span className="text-white"> === </span>
                  <span className="text-orange-400">0</span>
                  <span className="text-white">) {'{'}</span>
                </div>
              </div>
              <div className="flex">
                <div className="text-gray-500 w-6">4</div>
                <div className="flex-1">
                  <span className="text-indigo-400">    return</span>
                  <span className="text-white"> </span>
                  <span className="text-green-400">'Empty array'</span>
                  <span className="text-white">;</span>
                </div>
              </div>
              <div className="flex">
                <div className="text-gray-500 w-6">5</div>
                <div className="flex-1">
                  <span className="text-white">  {'}'}</span>
                </div>
              </div>
              <div className="flex">
                <div className="text-gray-500 w-6">6</div>
                <div className="flex-1">
                  <span className="text-indigo-400">  let</span>
                  <span className="text-white"> </span>
                  <span className="text-cyan-400">result</span>
                  <span className="text-white"> = </span>
                  <span className="text-orange-400">0</span>
                  <span className="text-white">;</span>
                </div>
              </div>
              <div className="flex">
                <div className="text-gray-500 w-6">7</div>
                <div className="flex-1">
                  <span className="text-indigo-400">  for</span>
                  <span className="text-white">(</span>
                  <span className="text-indigo-400">let</span>
                  <span className="text-white"> </span>
                  <span className="text-cyan-400">i</span>
                  <span className="text-white">=</span>
                  <span className="text-orange-400">0</span>
                  <span className="text-white">; i{'<'}</span>
                  <span className="text-purple-400">array</span>
                  <span className="text-white">.</span>
                  <span className="text-cyan-400">length</span>
                  <span className="text-white">; i++) {'{'}</span>
                </div>
              </div>
              <div className="flex">
                <div className="text-gray-500 w-6">8</div>
                <div className="flex-1">
                  <span className="text-white"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeConquest; 