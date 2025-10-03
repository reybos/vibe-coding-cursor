import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useApiKeyValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);

  const validateApiKey = async (apiKey) => {
    if (!apiKey || apiKey.trim() === '') {
      setError('Please enter an API key');
      return { isValid: false, error: 'Please enter an API key' };
    }

    setIsValidating(true);
    setError(null);

    try {
      // Проверяем, существует ли API ключ в базе данных
      const { data, error: dbError } = await supabase
        .from('api_keys')
        .select('id, name, key_value, type, visible')
        .eq('key_value', apiKey.trim())
        .single();

      if (dbError) {
        if (dbError.code === 'PGRST116') {
          // Ключ не найден
          const errorMsg = 'Invalid API key. Please check your key and try again.';
          setError(errorMsg);
          return { isValid: false, error: errorMsg };
        }
        throw dbError;
      }

      if (!data) {
        setError('Invalid API key. Please check your key and try again.');
        return { isValid: false, error: 'Invalid API key. Please check your key and try again.' };
      }

      // Ключ найден и валиден
      return { 
        isValid: true, 
        keyData: data,
        error: null 
      };

    } catch (err) {
      console.error('Error validating API key:', err);
      const errorMessage = 'Failed to validate API key. Please try again.';
      setError(errorMessage);
      return { isValid: false, error: errorMessage };
    } finally {
      setIsValidating(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    validateApiKey,
    isValidating,
    error,
    clearError
  };
};
