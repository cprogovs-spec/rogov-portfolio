import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, contact, message } = await req.json()

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  const text = [
    '📩 *Новая заявка с сайта*',
    '',
    `*Имя:* ${name}`,
    `*Контакт:* ${contact}`,
    '',
    `*Задача:*\n${message}`,
  ].join('\n')

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
