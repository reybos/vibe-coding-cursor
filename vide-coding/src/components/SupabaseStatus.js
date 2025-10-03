'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SupabaseStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('api_keys')
          .select('count')
          .limit(1);

        if (error) throw error;
        setIsConnected(true);
      } catch (err) {
        console.error('Supabase connection error:', err);
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
        Checking connection...
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      {isConnected ? 'Connected to Supabase' : 'Supabase connection failed'}
    </div>
  );
}
