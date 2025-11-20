import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const updated = await prisma.deal.update({
      where: { id },
      data: { recentClicks: { increment: 1 } } as any,
    })
    return NextResponse.json({ ok: true, clicks: (updated as any).recentClicks })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}