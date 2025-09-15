// Copyright (c) 2024 Mohamed Dridi. All rights reserved.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Construct a URL relative to the current module to ensure correct origin.
    // This is more robust in some environments than a root-relative path.
    const swUrl = new URL('sw.js', import.meta.url).href;
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  });
}