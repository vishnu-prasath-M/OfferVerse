import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function trendingScore(discount: number) {
  return discount
}

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
    })

    const scored = candidates
      .map((d) => ({ deal: d, score: trendingScore(d.discount) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, postsPerDay)

    await prisma.log.create({
      data: {
        action: 'select_hot_deals',
        status: 'success',
        message: `Selected ${scored.length} hot deals`,
        meta: { ids: scored.map((s) => s.deal.id) },
      } as any,
    })

    return NextResponse.json({ ok: true, ids: scored.map((s) => s.deal.id) })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}