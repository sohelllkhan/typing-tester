'use client';

import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

const testDuration = 300;

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [testText, setTestText] = useState('');
  const [rawParagraph, setRawParagraph] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(testDuration);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (started && timeLeft > 0 && !finished) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && !finished) finishTest();
  }, [started, timeLeft, finished]);

  const cleanText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const startTest = () => {
    const cleaned = cleanText(rawParagraph);
    if (!cleaned) return alert('Please enter a valid paragraph (letters only)');
    setTestText(cleaned);
    setUserInput('');
    setStarted(true);
    setFinished(false);
    setTimeLeft(testDuration);
    setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 100);
  };

  const finishTest = () => {
    setFinished(true);
    const words = userInput.trim().split(/\s+/).filter((w) => w).length;
    const correct = userInput
      .split('')
      .filter((ch, i) => ch === testText[i]).length;
    const totalTyped = userInput.length;
    const duration = (testDuration - timeLeft) / 60;

    setWpm(duration > 0 ? Math.round(words / duration) : 0);
    setAccuracy(totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100);
  };

  const reset = () => {
    setRawParagraph('');
    setUserInput('');
    setTestText('');
    setStarted(false);
    setFinished(false);
    setTimeLeft(testDuration);
    setWpm(0);
    setAccuracy(100);
  };

  const saveAsPDF = () => {
    const doc = new jsPDF();
    doc.text(userInput || 'No text typed.', 10, 10, { maxWidth: 190 });
    doc.save('typed-result.pdf');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!started || finished) return;
    const clean = e.target.value.toLowerCase().replace(/[^a-z\s]/g, '');
    setUserInput(clean);
  };

  const getCharClass = (char: string, index: number) => {
    if (index >= userInput.length) return 'text-gray-500';
    if (userInput[index] === char) return 'text-green-400';
    return 'text-red-400';
  };

  return (
    <main
      className="min-h-screen bg-black text-white flex items-center justify-center px-6"
      onClick={() => hiddenInputRef.current?.focus()}
    >
      {!started ? (
        <div className="w-full max-w-3xl text-center">
          <textarea
            className="w-full h-40 p-4 rounded bg-gray-800 text-white resize-none focus:outline-none mb-4"
            placeholder="Paste or type your paragraph here (letters only)..."
            value={rawParagraph}
            onChange={(e) => setRawParagraph(e.target.value)}
          />
          <button
            onClick={startTest}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
          >
            Start Typing Test
          </button>
        </div>
      ) : !finished ? (
        <div
          className="relative p-4 text-xl font-mono leading-relaxed bg-black focus:outline-none cursor-text w-full max-w-4xl"
          onClick={() => hiddenInputRef.current?.focus()}
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {testText.split('').map((char, i) => {
            const isCursor = i === userInput.length;

            return (
              <React.Fragment key={i}>
                {isCursor && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '2px',
                      height: '1em',
                      backgroundColor: 'white',
                      marginRight: '2px',
                      position: 'relative',
                      top: 2,
                    }}
                  />
                )}
                <span className={`${getCharClass(char, i)}`}>{char}</span>
              </React.Fragment>
            );
          })}

          <input
            ref={hiddenInputRef}
            type="text"
            value={userInput}
            onChange={handleTyping}
            className="absolute opacity-0 pointer-events-none"
          />
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-green-400 font-bold text-xl">✅ Test Complete</p>
          <p className="text-white">WPM: {wpm} | Accuracy: {accuracy}%</p>
          <button
            onClick={saveAsPDF}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold"
          >
            Save as PDF
          </button>
          <button
            onClick={reset}
            className="block w-full mt-4 py-2 bg-gray-700 hover:bg-gray-800 rounded font-semibold"
          >
            Restart / New Test
          </button>
        </div>
      )}
    </main>
  );
}
//oroginal code 