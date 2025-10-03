'use client';

import { useState } from 'react';

export default function RLSErrorBanner({ error }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!error || !error.includes('Access denied') || !isVisible) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Supabase RLS Policy Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>Your Supabase table has Row Level Security enabled, but no user is authenticated.</p>
            <p className="mt-1">Quick fixes:</p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Go to Supabase SQL Editor</li>
              <li>Run: <code className="bg-red-100 px-1 rounded">ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;</code></li>
              <li>Or create a policy: <code className="bg-red-100 px-1 rounded">CREATE POLICY "Allow all" ON api_keys FOR ALL USING (true);</code></li>
            </ol>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => setIsVisible(false)}
            className="text-red-400 hover:text-red-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
