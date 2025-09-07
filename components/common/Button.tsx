import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps {
  type: 'submit' | 'button';
  loading: boolean;
  disabled: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type, loading, disabled, children }) => (
  <button
    type={type}
    disabled={disabled}
    className="w-full flex justify-center items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
  >
    {loading ? <LoadingSpinner /> : children}
  </button>
);

export default Button;