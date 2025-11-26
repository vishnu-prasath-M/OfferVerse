import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendDealToTelegram } from '@/lib/telegram'

export async function GET() {
  try {
    const postsPerDay = Number(process.env.POSTS_PER_DAY || '10')
    const now = new Date()
    const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    const candidates = await prisma.deal.findMany({
      where: {
        postedToTelegram: false,
        OR: [{ expiry: null }, { expiry: { gt: now, lt: soon } }],
      },
      orderBy: { discount: 'desc' },
      take: postsPerDay,
    })

    const results: { id: string; ok: boolean; error?: string }[] = []
    for (const deal of candidates) {
      try {
        await sendDealToTelegram(deal.id)
        results.push({ id: deal.id, ok: true })
      } catch (e: any) {
        results.push({ id: deal.id, ok: false, error: e?.message || String(e) })
      }
    }

    return NextResponse.json({ ok: true, results })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}