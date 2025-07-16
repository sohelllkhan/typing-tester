"use client";
import { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import "../app/monkeytype.css";

const words = ["hello", "world", "typing", "speed", "test"];

export default function TypingTest() {
  const [input, setInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(" ")) {
      if (val.trim() === words[currentWordIndex]) {
        setCurrentWordIndex((prev) => prev + 1);
      }
      setInput("");
    } else {
      setInput(val);
    }
  };

  return (
    <div className="w-full max-w-4xl px-6 pt-8">
      <div className="text-2xl monkeytype-font tracking-wider text-center mb-6">
        <div className="flex flex-wrap justify-center">
          {words.map((word, index) => (
            <span
              key={index}
              className={classNames("mx-1", {
                "text-muted": index < currentWordIndex,
                "relative text-yellow-300": index === currentWordIndex,
              })}
            >
              {word}
              {index === currentWordIndex && (
                <span className="caret"></span>
              )}
            </span>
          ))}
        </div>
      </div>
      <input
        type="text"
        className="w-full px-4 py-2 bg-transparent border border-muted text-foreground text-lg monkeytype-font tracking-wide outline-none"
        value={input}
        onChange={handleInput}
        ref={inputRef}
        autoFocus
      />
    </div>
  );
}