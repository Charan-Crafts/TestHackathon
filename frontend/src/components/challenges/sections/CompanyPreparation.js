import React from 'react';
import { Link } from 'react-router-dom';

// Mock company data
const COMPANIES = [
  {
    id: 'google',
    name: 'Google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png',
    successRate: '18%',
    questionCount: 245
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png',
    successRate: '23%',
    questionCount: 189
  },
  {
    id: 'meta',
    name: 'Meta',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/800px-Meta_Platforms_Inc._logo.svg.png',
    successRate: '15%',
    questionCount: 210
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/800px-Microsoft_logo.svg.png',
    successRate: '22%',
    questionCount: 178
  }
];

function CompanyPreparation() {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Company Preparation</h2>
          <p className="text-gray-300">Master technical interviews at top tech companies</p>
        </div>
        <Link 
          to="/challenges/company-prep"
          className="text-blue-400 text-sm hover:text-blue-300 flex items-center"
        >
          View All
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {COMPANIES.map((company) => (
          <Link
            key={company.id}
            to={`/challenges/company-prep/${company.id}`}
            className="bg-gray-800 border border-gray-700 hover:border-blue-600 rounded-lg p-4 transition-all hover:translate-y-[-4px]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-white rounded-lg w-12 h-12 p-2 flex items-center justify-center mb-3">
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`} 
                  className="max-h-full max-w-full"
                />
              </div>
              <h3 className="font-medium text-white mb-1">{company.name}</h3>
              <div className="text-xs text-gray-400 mb-2">
                {company.questionCount} questions
              </div>
              <div className="text-sm font-medium text-blue-400">
                {company.successRate} success rate
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center text-gray-300">
          <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm">Ace your next tech interview with company-specific practice</span>
        </div>
      </div>
    </div>
  );
}

export default CompanyPreparation; 