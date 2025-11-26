import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getHotDeals } from '@/lib/deals';
import { formatDealForTelegram, sendTelegramMessage } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const id = body.id as string | undefined;

    let deal;
    if (id) {
      deal = await prisma.deal.findUnique({ where: { id } });
    } else {
      const [latest] = await getHotDeals(1);
      deal = latest;
    }

    if (!deal) {
      return NextResponse.json({ error: 'No deal found to post' }, { status: 404 });
    }

    const message = formatDealForTelegram({
      title: deal.title,
      offerPrice: deal.offerPrice,
      originalPrice: deal.originalPrice,
      discount: deal.discount,
      affiliateLink: deal.affiliateLink ?? null,
    });

    const result = await sendTelegramMessage(message);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    await prisma.deal.update({
      where: { id: deal.id },
      data: { postedToTelegram: true },
    });

    return NextResponse.json({ success: true, dealId: deal.id });
  } catch (error: any) {
    console.error('Error syncing telegram', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
