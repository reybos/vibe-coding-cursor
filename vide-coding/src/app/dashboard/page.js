'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApiKeys } from '../../hooks/useApiKeys';
import SupabaseStatus from '../../components/SupabaseStatus';
import RLSErrorBanner from '../../components/RLSErrorBanner';
import CopyNotification from '../../components/CopyNotification';
import { useSidebar } from '../../contexts/SidebarContext';

export default function Dashboard() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { 
    apiKeys, 
    loading, 
    error, 
    createApiKey, 
    updateApiKey, 
    deleteApiKey, 
    toggleKeyVisibility 
  } = useApiKeys();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('copy');
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    type: 'dev',
    limitUsage: false,
    monthlyLimit: 1000
  });

  const showNotificationMessage = (type) => {
    setNotificationType(type);
    setShowNotification(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If type changes, regenerate the API key (both for new and editing)
    if (name === 'type') {
      const newKey = value === 'prod' ? 
        'sk-prod-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) :
        'sk-dev-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        key: newKey
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingKey) {
        // Update existing key
        await updateApiKey(editingKey.id, formData);
      } else {
        // Create new key
        await createApiKey(formData);
      }

      // Reset form and close modal
      setFormData({ name: '', key: '', description: '', type: 'dev', limitUsage: false, monthlyLimit: 1000 });
      setEditingKey(null);
      setIsModalOpen(false);
      
      // Show success notification
      showNotificationMessage(editingKey ? 'edit' : 'copy');
    } catch (err) {
      console.error('Error saving API key:', err);
      alert('Error saving API key. Please try again.');
    }
  };

  const handleEdit = (key) => {
    setEditingKey(key);
    setFormData({
      name: key.name,
      key: key.key_value,
      description: key.description,
      type: key.type || 'dev',
      limitUsage: key.limit_usage || false,
      monthlyLimit: key.monthly_limit || 1000
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      try {
        await deleteApiKey(id);
        showNotificationMessage('delete');
      } catch (err) {
        console.error('Error deleting API key:', err);
        alert('Error deleting API key. Please try again.');
      }
    }
  };

  const handleCopy = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
      showNotificationMessage('copy');
    } catch (err) {
      console.error('Failed to copy API key:', err);
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = key;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showNotificationMessage('copy');
    }
  };

  const handleView = async (key) => {
    try {
      await toggleKeyVisibility(key.id);
    } catch (err) {
      console.error('Error toggling key visibility:', err);
      alert('Error toggling key visibility. Please try again.');
    }
  };

  const generateApiKey = () => {
    const prefix = formData.type === 'prod' ? 'sk-prod-' : 'sk-dev-';
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return prefix + randomString;
  };

  const openCreateModal = () => {
    setEditingKey(null);
    const newKey = generateApiKey();
    setFormData({ name: '', key: newKey, description: '', type: 'dev', limitUsage: false, monthlyLimit: 1000 });
    setIsModalOpen(true);
  };

  const maskKey = (key) => {
    if (key.length <= 8) return key;
    return key.substring(0, 8) + '*'.repeat(key.length - 8);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900">Overview</h1>
            <SupabaseStatus />
          </div>
        </div>

        {/* Current Plan Card */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 p-8">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm font-medium text-white/80">CURRENT PLAN</div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  Manage Plan
                </button>
              </div>
              
              <h2 className="text-5xl font-bold text-white mb-6">Researcher</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-medium">API Usage</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="text-right text-white text-sm mt-1">0/1000 Credits</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">Pay as you go</span>
                  <div className="w-10 h-5 bg-white/20 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">API Keys</h3>
              <button
                onClick={openCreateModal}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-gray-600">
              The key is used to authenticate your requests to the Research API. To learn more, see the{' '}
              <a href="#" className="underline text-blue-600 hover:text-blue-700">documentation page</a>.
            </p>
            <RLSErrorBanner error={error} />
            {error && !error.includes('Access denied') && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">Error: {error}</p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading API keys...</p>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No API keys</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new API key.</p>
              <div className="mt-6">
                <button
                  onClick={openCreateModal}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add your first API key
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USAGE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KEY</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OPTIONS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {key.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {key.type || 'dev'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {key.usage || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {key.visible ? key.key_value : maskKey(key.key_value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(key)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View/Hide key"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleCopy(key.key_value)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy key"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEdit(key)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Edit key"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(key.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete key"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {editingKey ? 'Edit API Key' : 'Create a new API key'}
              </h2>
              <p className="text-gray-600 mb-6">
                {editingKey ? 'Update the details for this API key.' : 'Enter a name and limit for the new API key.'}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Key Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Key Name — A unique name to identify this key
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="Key Name"
                  />
                </div>

                {/* Key Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Key Type — Choose the environment for this key
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="type"
                        value="dev"
                        checked={formData.type === 'dev'}
                        onChange={handleInputChange}
                        className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Development</div>
                          <div className="text-sm text-gray-500">Rate limited to 100 requests/minute</div>
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="type"
                        value="prod"
                        checked={formData.type === 'prod'}
                        onChange={handleInputChange}
                        className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Production</div>
                          <div className="text-sm text-gray-500">Rate limited to 1,000 requests/minute</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Monthly Usage Limit */}
                <div>
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      name="limitUsage"
                      checked={formData.limitUsage}
                      onChange={handleInputChange}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-900">
                      Limit monthly usage*
                    </label>
                  </div>
                  {formData.limitUsage && (
                    <input
                      type="number"
                      name="monthlyLimit"
                      value={formData.monthlyLimit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="1000"
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                  </p>
                </div>

                {/* API Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    API Key
                  </label>
                  <input
                    type="text"
                    name="key"
                    value={formData.key}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-gray-900 placeholder-gray-500"
                    placeholder="sk-1234567890abcdef..."
                    readOnly={!editingKey}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {editingKey 
                      ? "The key will be regenerated when you change the type." 
                      : "This key will be generated automatically based on the selected type."
                    }
                  </p>
                </div>

                {/* Description (only for editing) */}
                {editingKey && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="Describe what this API key is used for..."
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingKey ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      
      {/* Уведомления */}
      <CopyNotification 
        isVisible={showNotification} 
        onClose={() => setShowNotification(false)}
        type={notificationType}
      />
    </div>
  );
}
