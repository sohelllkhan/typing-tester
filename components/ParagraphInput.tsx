'use client';

import React from 'react';

interface ParagraphInputProps {
  rawParagraph: string;
  setRawParagraph: (text: string) => void;
  onStart: () => void;
}

export default function ParagraphInput({ rawParagraph, setRawParagraph, onStart }: ParagraphInputProps) {
  return (
    <div className="w-full max-w-3xl text-center">
      <textarea
        className="w-full h-40 p-4 rounded bg-gray-800 text-white resize-none focus:outline-none mb-4"
        placeholder="Paste or type your paragraph here (letters only)..."
        value={rawParagraph}
        onChange={(e) => setRawParagraph(e.target.value)}
      />
      <button
        onClick={onStart}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
      >
        Start Typing Test
      </button>
    </div>
  );
}
