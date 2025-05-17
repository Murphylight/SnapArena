'use client';

import React, { useState, useEffect } from 'react';

interface Log {
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success';
}

export default function DebugPanel() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Intercepter les logs de la console
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    console.log = (...args) => {
      originalConsoleLog.apply(console, args);
      setLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        message: args.join(' '),
        type: 'info'
      }]);
    };

    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      setLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        message: args.join(' '),
        type: 'error'
      }]);
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700"
      >
        {isVisible ? 'Hide Debug' : 'Show Debug'}
      </button>

      {isVisible && (
        <div className="mt-2 w-96 h-64 bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div className="p-2 bg-gray-800 flex justify-between items-center">
            <h3 className="font-semibold">Debug Panel</h3>
            <button
              onClick={() => setLogs([])}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 font-mono text-sm">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`mb-1 ${
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'success' ? 'text-green-400' :
                  'text-gray-300'
                }`}
              >
                <span className="text-gray-500 text-xs">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="ml-2">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 