'use client';

import { useState, useEffect } from 'react';

export default function CopyNotification({ isVisible, onClose, type = 'copy' }) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsAnimatingOut(true);
        // Даем время для анимации исчезновения
        setTimeout(() => {
          onClose();
          setIsAnimatingOut(false);
        }, 300);
      }, 3000); // Автоматически скрыть через 3 секунды

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
      setIsAnimatingOut(false);
    }, 300);
  };

  if (!isVisible) return null;

  // Определяем стили и текст в зависимости от типа уведомления
  const getNotificationConfig = () => {
    switch (type) {
      case 'copy':
        return {
          bgColor: 'bg-green-500',
          iconColor: 'text-green-500',
          message: 'Copied API Key to clipboard',
          icon: (
            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'edit':
        return {
          bgColor: 'bg-blue-500',
          iconColor: 'text-blue-500',
          message: 'API Key updated successfully',
          icon: (
            <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )
        };
      case 'delete':
        return {
          bgColor: 'bg-red-500',
          iconColor: 'text-red-500',
          message: 'API Key deleted successfully',
          icon: (
            <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )
        };
      default:
        return {
          bgColor: 'bg-green-500',
          iconColor: 'text-green-500',
          message: 'Operation completed successfully',
          icon: (
            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
    }
  };

  const config = getNotificationConfig();

  return (
    <div className={`fixed top-4 left-1/2 z-50 ${isAnimatingOut ? 'animate-out' : 'animate-in'}`}>
      <div className={`${config.bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px]`}>
        {/* Иконка */}
        <div className="flex-shrink-0">
          <div className={`w-5 h-5 bg-white rounded-full flex items-center justify-center`}>
            {config.icon}
          </div>
        </div>
        
        {/* Текст уведомления */}
        <div className="flex-1">
          <p className="text-sm font-medium">{config.message}</p>
        </div>
        
        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
