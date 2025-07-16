import { useState, useEffect, useRef, useCallback } from 'react';
import jsPDF from 'jspdf';

const testDuration = 60;

export function useTypingTest(rawParagraph: string) {
  const [userInput, setUserInput] = useState('');
  const [testText, setTestText] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(testDuration);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const cleanText = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const startTest = useCallback(() => {
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
  }, [rawParagraph]);

  const finishTest = useCallback(() => {
    setFinished(true);
    const words = userInput.trim().split(/\s+/).filter(Boolean).length;
    const correct = userInput
      .split('')
      .filter((ch, i) => ch === testText[i]).length;
    const totalTyped = userInput.length;
    const duration = (testDuration - timeLeft) / 60;

    setWpm(duration > 0 ? Math.round(words / duration) : 0);
    setAccuracy(totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100);
  }, [userInput, testText, timeLeft]);

  useEffect(() => {
    if (started && timeLeft > 0 && !finished) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && !finished) finishTest();
  }, [started, timeLeft, finished, finishTest]);

  const reset = useCallback(() => {
    setUserInput('');
    setTestText('');
    setStarted(false);
    setFinished(false);
    setTimeLeft(testDuration);
    setWpm(0);
    setAccuracy(100);
  }, []);

  const saveAsPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text(userInput || 'No text typed.', 10, 10, { maxWidth: 190 });
    doc.save('typed-result.pdf');
  }, [userInput]);

  return {
    userInput,
    setUserInput,
    testText,
    started,
    finished,
    timeLeft,
    wpm,
    accuracy,
    hiddenInputRef,
    startTest,
    finishTest,
    reset,
    saveAsPDF,
  };
}
