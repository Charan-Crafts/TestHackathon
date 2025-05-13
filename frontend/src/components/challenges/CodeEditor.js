import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';

// Mock available languages
const AVAILABLE_LANGUAGES = [
  { id: "javascript", name: "JavaScript", extension: "js" },
  { id: "python", name: "Python", extension: "py" },
  { id: "java", name: "Java", extension: "java" },
  { id: "cpp", name: "C++", extension: "cpp" },
  { id: "csharp", name: "C#", extension: "cs" },
  { id: "ruby", name: "Ruby", extension: "rb" },
  { id: "go", name: "Go", extension: "go" },
  { id: "swift", name: "Swift", extension: "swift" },
  { id: "rust", name: "Rust", extension: "rs" },
];

// Sample templates for each language
const CODE_TEMPLATES = {
  javascript: `// Implement your solution here

function solution(input) {
  // Your code here
  
  return result;
}

// Example usage:
// solution([1, 2, 3]);`,

  python: `# Implement your solution here

def solution(input):
    # Your code here
    
    return result

# Example usage:
# solution([1, 2, 3])`,

  java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        // Example usage
        // int[] input = {1, 2, 3};
        // System.out.println(solution(input));
    }
    
    public static Object solution(Object input) {
        // Your code here
        
        return null;
    }
}`,

  cpp: `#include <iostream>
#include <vector>
using namespace std;

// Implement your solution here
auto solution(auto input) {
    // Your code here
    
    return result;
}

int main() {
    // Example usage:
    // vector<int> input = {1, 2, 3};
    // auto result = solution(input);
    // cout << result << endl;
    return 0;
}`,
  
  csharp: `using System;
using System.Collections.Generic;

public class Solution {
    public static void Main() {
        // Example usage
        // var input = new[] {1, 2, 3};
        // Console.WriteLine(solution(input));
    }
    
    public static object solution(object input) {
        // Your code here
        
        return null;
    }
}`,
  
  ruby: `# Implement your solution here

def solution(input)
  # Your code here
  
  return result
end

# Example usage:
# solution([1, 2, 3])`,
  
  go: `package main

import "fmt"

// Implement your solution here
func solution(input interface{}) interface{} {
    // Your code here
    
    return nil
}

func main() {
    // Example usage:
    // input := []int{1, 2, 3}
    // result := solution(input)
    // fmt.Println(result)
}`,
  
  swift: `// Implement your solution here

func solution(input: [Any]) -> Any {
    // Your code here
    
    return result
}

// Example usage:
// let result = solution([1, 2, 3])
// print(result)`,
  
  rust: `fn main() {
    // Example usage:
    // let input = vec![1, 2, 3];
    // let result = solution(input);
    // println!("{:?}", result);
}

// Implement your solution here
fn solution<T>(input: Vec<T>) -> Vec<T> {
    // Your code here
    
    return vec![];
}`
};

function CodeEditor({ 
  initialCode = "", 
  language = "javascript", 
  onCodeChange,
  onRunCode,
  onSubmitCode,
  testResults = null,
  isProcessing = false,
  onCustomTest,
  onResetCode
}) {
  const [code, setCode] = useState(initialCode || CODE_TEMPLATES[language] || "");
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  
  // Update code when initialCode or language changes
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode, language]);
  
  // Get appropriate language mode for Monaco
  const getLanguageMode = (lang) => {
    const langMap = {
      javascript: "javascript",
      python: "python",
      java: "java",
      cpp: "cpp",
      csharp: "csharp",
      ruby: "ruby",
      go: "go",
      swift: "swift",
      rust: "rust"
    };
    
    return langMap[lang] || "javascript";
  };
  
  // Handle editor mount
  const editorDidMount = (editor, monaco) => {
    monacoRef.current = monaco;
    
    // Register theme
    monaco.editor.defineTheme('codingChallenge', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a202c',
        'editor.lineHighlightBackground': '#2d3748',
        'editorLineNumber.foreground': '#4a5568',
        'editorCursor.foreground': '#edf2f7',
        'editorSuggestWidget.background': '#2d3748',
        'editorSuggestWidget.border': '#4a5568',
        'editorSuggestWidget.selectedBackground': '#4299e1',
      }
    });
    
    // Set theme
    monaco.editor.setTheme('codingChallenge');
    
    // Add key binding for running code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunCode();
    });
    
    // Focus editor
    editor.focus();
  };
  
  // Handle fullscreen toggle
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    
    // Allow a moment for the DOM to update, then refresh the editor layout
    setTimeout(() => {
      if (monacoRef.current && monacoRef.current.editor) {
        const editors = monacoRef.current.editor.getEditors();
        if (editors.length > 0) {
          editors[0].layout();
        }
      }
    }, 100);
  };
  
  // Handle code change
  const handleCodeChange = (newValue) => {
    setCode(newValue);
    if (onCodeChange) {
      onCodeChange(newValue, selectedLanguage);
    }
  };
  
  // Handle language change
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    if (onCodeChange) {
      onCodeChange(code, newLang);
    }
  };
  
  // Editor options
  const editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    lineNumbersMinChars: 3,
    scrollBeyondLastLine: false,
    minimap: {
      enabled: true
    }
  };
  
  // Detect screen size
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Adjusted editor options based on screen size
  const responsiveEditorOptions = {
    ...editorOptions,
    fontSize: screenSize.width < 640 ? 12 : 14,
    lineNumbers: screenSize.width < 480 ? 'off' : 'on',
    minimap: { 
      enabled: screenSize.width >= 768 
    },
    scrollbar: {
      verticalScrollbarSize: screenSize.width < 640 ? 8 : 14,
      horizontalScrollbarSize: screenSize.width < 640 ? 8 : 14
    }
  };
  
  return (
    <div 
      ref={editorRef}
      className={`${isFullScreen ? 'fixed inset-0 z-50 bg-gray-900 p-4' : ''} h-full flex flex-col`}
    >
      <div className="bg-gray-800 border border-gray-700 rounded-t-md">
        <div className="flex flex-wrap items-center justify-between p-2 border-b border-gray-700">
          <div className="flex items-center mb-2 sm:mb-0 w-full sm:w-auto">
            <span className="text-gray-400 text-sm font-mono mr-2">Language:</span>
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 flex-grow sm:flex-grow-0"
            >
              {AVAILABLE_LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2 ml-auto mt-2 sm:mt-0">
            <button
              onClick={toggleFullScreen}
              className="p-1.5 text-gray-400 hover:text-white focus:outline-none bg-gray-700 rounded"
              title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
            >
              {isFullScreen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-grow bg-[#1a202c] overflow-hidden min-h-[200px]">
        <MonacoEditor
          width="100%"
          height="100%"
          language={getLanguageMode(selectedLanguage)}
          theme="codingChallenge"
          value={code}
          options={responsiveEditorOptions}
          onChange={handleCodeChange}
          editorDidMount={editorDidMount}
        />
      </div>
      
      <div className="bg-gray-800 border border-t-0 border-gray-700 rounded-b-md">
        <div className="p-2 text-center text-xs text-gray-400 border-b border-gray-700">
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-4 w-4 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="hidden sm:inline">Press <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Enter</kbd> to run code</span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2 p-3">
          <button
            onClick={onRunCode}
            disabled={isProcessing}
            className={`px-3 py-2.5 text-sm font-medium rounded ${isProcessing ? 'bg-blue-800 text-blue-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-1.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running...
              </span>
            ) : 'Run Code'}
          </button>
          <button
            onClick={onSubmitCode}
            disabled={isProcessing}
            className={`px-3 py-2.5 text-sm font-medium rounded ${isProcessing ? 'bg-green-800 text-green-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'} transition-colors`}
          >
            {isProcessing ? 'Processing...' : 'Submit'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 px-3 pb-3">
          <button
            onClick={onCustomTest}
            disabled={isProcessing}
            className="px-3 py-2 text-sm font-medium rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            Custom Test
          </button>
          <button
            onClick={onResetCode}
            disabled={isProcessing}
            className="px-3 py-2 text-sm font-medium rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            Reset Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor; 