'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiKeyValidation } from '../../hooks/useApiKeyValidation';
import CopyNotification from '../../components/CopyNotification';

export default function ApiPlayground() {
  const [apiKey, setApiKey] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('error');
  const { validateApiKey, isValidating, error, clearError } = useApiKeyValidation();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const result = await validateApiKey(apiKey);
    
    if (result.isValid) {
      // Сохраняем информацию о ключе в localStorage для использования
      localStorage.setItem('validatedApiKey', JSON.stringify(result.keyData));
      // Показываем уведомление об успехе
      setNotificationType('success');
      setShowNotification(true);
      // Перенаправляем на защищенную страницу через небольшую задержку
      setTimeout(() => {
        router.push('/protected');
      }, 1500);
    } else {
      // Показываем уведомление об ошибке
      setNotificationType('error');
      setShowNotification(true);
    }
  };

  const handleInputChange = (e) => {
    setApiKey(e.target.value);
    if (error) {
      clearError();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">API Playground</h1>
          <p className="text-gray-600">
            Enter your API key to access protected features and test your integration.
          </p>
        </div>


        {/* API Key Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="api-key" className="block text-sm font-medium text-gray-900 mb-2">
                  API Key
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="api-key"
                    name="api-key"
                    value={apiKey}
                    onChange={handleInputChange}
                    placeholder="Enter your API key (e.g., sk-dev-... or sk-prod-...)"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={isValidating}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Enter a valid API key to access protected features. You can find your API keys in the{' '}
                  <a href="/dashboard" className="text-blue-600 hover:text-blue-500">
                    Overview page
                  </a>.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  {isValidating ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Validating API key...
                    </div>
                  ) : (
                    'Ready to validate your API key'
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isValidating || !apiKey.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isValidating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Validating...
                    </>
                  ) : (
                    'Validate API Key'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                How to get your API key
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to the <a href="/dashboard" className="underline hover:text-blue-600">Overview page</a></li>
                  <li>Create a new API key or use an existing one</li>
                  <li>Copy the API key and paste it in the field above</li>
                  <li>Click "Validate API Key" to test your integration</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Всплывающие уведомления */}
      <CopyNotification 
        isVisible={showNotification} 
        onClose={() => setShowNotification(false)}
        type={notificationType}
      />
    </div>
  );
}
