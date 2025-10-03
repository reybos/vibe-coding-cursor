import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка API ключей из Supabase
  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42501') {
          throw new Error('Access denied. Please check your Supabase RLS policies. See SUPABASE_FIX.md for solutions.');
        }
        throw error;
      }
      setApiKeys(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching API keys:', err);
    } finally {
      setLoading(false);
    }
  };

  // Создание нового API ключа
  const createApiKey = async (keyData) => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .insert([{
          name: keyData.name,
          key_value: keyData.key,
          description: keyData.description,
          type: keyData.type,
          limit_usage: keyData.limitUsage,
          monthly_limit: keyData.monthlyLimit,
          visible: false
        }])
        .select();

      if (error) {
        // Более детальная обработка ошибок RLS
        if (error.code === '42501') {
          throw new Error('Access denied. Please check your Supabase RLS policies. See SUPABASE_FIX.md for solutions.');
        }
        throw error;
      }
      
      setApiKeys(prev => [data[0], ...prev]);
      return data[0];
    } catch (err) {
      setError(err.message);
      console.error('Error creating API key:', err);
      throw err;
    }
  };

  // Обновление API ключа
  const updateApiKey = async (id, keyData) => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update({
          name: keyData.name,
          key_value: keyData.key,
          description: keyData.description,
          type: keyData.type,
          limit_usage: keyData.limitUsage,
          monthly_limit: keyData.monthlyLimit,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      setApiKeys(prev => prev.map(key => 
        key.id === id ? data[0] : key
      ));
      return data[0];
    } catch (err) {
      setError(err.message);
      console.error('Error updating API key:', err);
      throw err;
    }
  };

  // Удаление API ключа
  const deleteApiKey = async (id) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setApiKeys(prev => prev.filter(key => key.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting API key:', err);
      throw err;
    }
  };

  // Переключение видимости ключа
  const toggleKeyVisibility = async (id) => {
    try {
      const key = apiKeys.find(k => k.id === id);
      if (!key) return;

      const { data, error } = await supabase
        .from('api_keys')
        .update({ visible: !key.visible })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      setApiKeys(prev => prev.map(k => 
        k.id === id ? data[0] : k
      ));
    } catch (err) {
      setError(err.message);
      console.error('Error toggling key visibility:', err);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchApiKeys();
  }, []);

  return {
    apiKeys,
    loading,
    error,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    toggleKeyVisibility,
    refetch: fetchApiKeys
  };
};
