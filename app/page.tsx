'use client';
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const submitWord = async () => {
    if (!input.trim()) return;
    const res = await fetch('/api/similarity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words: [input.trim()] }),
    });
    const data = await res.json();
    setResult(data.result);
    setSubmitted(true);
    setWordCount((prev) => prev + 1);
    setInput('');
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4 font-bold">WordMatch GPT Game</h1>

      {!submitted ? (
        <>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your word"
            className="border p-2 mr-2 w-64"
          />
          <button
            onClick={submitWord}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Word
          </button>
        </>
      ) : (
        <p className="text-green-600 font-medium">Word submitted! Waiting for others…</p>
      )}

      <div className="mt-6">
        <p className="text-sm text-gray-700">Total words submitted: {wordCount}</p>
      </div>

      {result && (
        <div className="mt-6 text-lg font-semibold">
          GPT says the most related pair: <br />
          <span className="text-blue-700">{result}</span>
        </div>
      )}
    </main>
  );
}
