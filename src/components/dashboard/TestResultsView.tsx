import React from 'react';
import { FileText } from 'lucide-react';

// Simple test component to verify rendering works
export function TestResultsView() {
  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
      <div className="text-center">
        <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Results View</h2>
        <p className="text-gray-600 mb-4">This is a simple test to verify the Results tab is working.</p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ If you can see this message, the Results tab is rendering correctly!
        </div>
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <p>Current time: {new Date().toLocaleString()}</p>
          <p>Component: TestResultsView</p>
          <p>Status: Rendering successfully</p>
        </div>
      </div>
    </div>
  );
}
