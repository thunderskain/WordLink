'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [myWord, setMyWord] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [result, setResult] = useState('');

  useEffect(() => {
    const storedWords = sessionStorage.getItem('submittedWord');
    if (storedWords) {
      setMyWord(storedWords);
    }
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const word = input.trim();
    const updatedWords = [...words, word];
    setWords(updatedWords);
    sessionStorage.setItem('submittedWord', word);
    setMyWord(word);
    setWordCount(prev => prev + 1);
    setInput('');
  };

  const handleEndRound = async () => {
    if (words.length < 2) {
      alert("Need at least 2 words to compare.");
      return;
    }

    const res = await fetch('/api/similarity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words }),
    });
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4 font-bold">WordMatch GPT Game</h1>

      {!myWord ? (
        <>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your word"
            className="border p-2 mr-2 w-64"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Word
          </button>
        </>
      ) : (
        <p className="text-green-700 font-medium">You submitted: <b>{myWord}</b></p>
      )}

      <div className="mt-4">
        <p className="text-sm text-gray-700">Words entered this session: {wordCount}</p>
      </div>

      <button
        onClick={handleEndRound}
        className="bg-red-600 text-white px-4 py-2 mt-6 rounded"
      >
        End Round (Game Master)
      </button>

      {result && (
        <div className="mt-6 text-lg font-semibold">
          GPT says the most related pair: <br />
          <span className="text-blue-700">{result}</span>
        </div>
      )}
    </main>
  );
}
