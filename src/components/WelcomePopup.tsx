import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const WelcomePopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { state } = useAuth();

  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state.isAuthenticated]);

  if (!isVisible || !state.user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-800">Welcome Back!</h2>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Hello, <span className="font-semibold text-blue-600">{state.user.username}</span>! 
            Great to see you again.
          </p>
          <p className="text-sm text-gray-500">
            You have access to {state.user.permissions.length} websites.
          </p>
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            Your dashboard is ready with all your favorite tools.
          </p>
        </div>
      </div>
    </div>
  );
};