'use client';

import React from 'react';

interface TestResultProps {
  wpm: number;
  accuracy: number;
  onSave: () => void;
  onRestart: () => void;
}

export default function TestResult({ wpm, accuracy, onSave, onRestart }: TestResultProps) {
  return (
    <div className="text-center space-y-4">
      <p className="text-green-400 font-bold text-xl">✅ Test Complete</p>
      <p className="text-white">
        WPM: {wpm} | Accuracy: {accuracy}%
      </p>
      <button
        onClick={onSave}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold"
      >
        Save as PDF
      </button>
      <button
        onClick={onRestart}
        className="block w-full mt-4 py-2 bg-gray-700 hover:bg-gray-800 rounded font-semibold"
      >
        Restart / New Test
      </button>
    </div>
  );
}
