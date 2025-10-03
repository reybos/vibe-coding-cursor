'use client';

import { useSidebar } from '../../contexts/SidebarContext';

export default function Protected() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900">Protected Area</h1>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800">
                API Key Validated Successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your API key is valid and you have been granted access to the protected area.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Welcome to the Protected Area
            </h3>
            <div className="text-sm text-gray-500">
              <p className="mb-4">
                This is a protected area that requires a valid API key to access. 
                Since you're here, it means your API key has been successfully validated.
              </p>
              <p className="mb-4">
                You can now access all the premium features and protected resources.
              </p>
              <div className="bg-gray-50 rounded-md p-4">
                <h4 className="font-medium text-gray-900 mb-2">Available Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Advanced API endpoints</li>
                  <li>Premium data access</li>
                  <li>Priority support</li>
                  <li>Extended rate limits</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8">
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
