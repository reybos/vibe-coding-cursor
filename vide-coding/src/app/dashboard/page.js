'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: ''
  });

  // Load API keys from localStorage on component mount
  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
  }, []);

  // Save API keys to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingKey) {
      // Update existing key
      setApiKeys(prev => prev.map(key => 
        key.id === editingKey.id 
          ? { ...key, ...formData, updatedAt: new Date().toISOString() }
          : key
      ));
    } else {
      // Create new key
      const newKey = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setApiKeys(prev => [...prev, newKey]);
    }

    // Reset form and close modal
    setFormData({ name: '', key: '', description: '' });
    setEditingKey(null);
    setIsModalOpen(false);
  };

  const handleEdit = (key) => {
    setEditingKey(key);
    setFormData({
      name: key.name,
      key: key.key,
      description: key.description
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      setApiKeys(prev => prev.filter(key => key.id !== id));
    }
  };

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    // You could add a toast notification here
    alert('API key copied to clipboard!');
  };

  const openCreateModal = () => {
    setEditingKey(null);
    setFormData({ name: '', key: '', description: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                API Key Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your API keys and access credentials
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to Home
              </Link>
              <button
                onClick={openCreateModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add API Key
              </button>
            </div>
          </div>
        </div>

        {/* API Keys Grid */}
        {apiKeys.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No API keys</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new API key.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiKeys.map((key) => (
              <div key={key.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {key.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {key.description || 'No description'}
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-gray-800 dark:text-gray-200 truncate flex-1">
                          {key.key}
                        </code>
                        <button
                          onClick={() => handleCopy(key.key)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Copy to clipboard"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                      Created: {new Date(key.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(key)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(key.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingKey ? 'Edit API Key' : 'Add New API Key'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Production API Key"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    API Key
                  </label>
                  <input
                    type="text"
                    name="key"
                    value={formData.key}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono"
                    placeholder="sk-1234567890abcdef..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Describe what this API key is used for..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingKey ? 'Update' : 'Create'} API Key
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
