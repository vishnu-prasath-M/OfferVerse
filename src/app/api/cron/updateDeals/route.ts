import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getHotDeals } from '@/lib/deals';
import { formatDealForTelegram, sendTelegramMessage } from '@/lib/telegram';

export async function GET(_req: NextRequest) {
  try {
    const now = new Date();
    const hotDeals = await getHotDeals(5);

    let postedCount = 0;
    for (const deal of hotDeals) {
      if (deal.postedToTelegram) continue;

      const message = formatDealForTelegram({
        title: deal.title,
        offerPrice: deal.offerPrice,
        originalPrice: deal.originalPrice,
        discount: deal.discount,
        affiliateLink: deal.affiliateLink ?? null,
      });

      const result = await sendTelegramMessage(message);
      if (result.ok) {
        postedCount += 1;
        await prisma.deal.update({
          where: { id: deal.id },
          data: { postedToTelegram: true },
        });
      }
    }

    await prisma.log.create({
      data: {
        action: 'cron_update_deals',
        status: 'success',
        message: `Ran cron at ${now.toISOString()}, posted ${postedCount} deals.`,
      } as any,
    });

    return NextResponse.json({ success: true, postedCount });
  } catch (error: any) {
    console.error('Error in cron updateDeals', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
