import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-latest',
      max_tokens: 1024,
      system: "あなたは優秀で親しみやすいパーソナルAIアシスタント「ジャービス」です。簡潔かつ的確にユーザーをサポートします。",
      messages: messages,
    });

    const textContent = response.content.find(c => c.type === 'text');
    const reply = textContent ? textContent.text : '返答を取得できませんでした。';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'エラーが発生しました' }, { status: 500 });
  }
}