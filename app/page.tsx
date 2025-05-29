'use client';
import { useState } from 'react';

export default function Home() {
  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const addWord = () => {
    if (input.trim()) {
      setWords([...words, input.trim()]);
      setInput('');
    }
  };

  const endRound = async () => {
    const res = await fetch('/api/similarity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words }),
    });
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl mb-4">WordMatch GPT Game</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a word"
        className="border p-2 mr-2"
      />
      <button onClick={addWord} className="bg-blue-500 text-white px-4 py-2 rounded">Add Word</button>
      <div className="mt-4">
        <h2 className="font-semibold">Words this round:</h2>
        <ul>{words.map((w, i) => <li key={i}>{w}</li>)}</ul>
      </div>
      <button onClick={endRound} className="bg-green-600 text-white px-4 py-2 mt-4 rounded">End Round</button>
      {result && <div className="mt-6 text-lg font-bold">Most related pair: {result}</div>}
    </main>
  );
}
