import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { words } = await req.json();
  if (!words || words.length < 2) {
    return NextResponse.json({ result: 'Need at least 2 words' });
  }

  const prompt = `Find the two most semantically related words in this list: ${words.join(', ')}. Just return the two words.`;
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4',
  });

  const answer = completion.choices[0].message.content || 'No answer';
  return NextResponse.json({ result: answer });
}
