import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateDealSchema } from '@/lib/validation';
import { calculateDiscount } from '@/lib/deals';

export async function PATCH(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = updateDealSchema.parse(json);

    const existing = await prisma.deal.findUnique({ where: { id: parsed.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const offerPrice = parsed.offerPrice ?? existing.offerPrice;
    const originalPrice = parsed.originalPrice ?? existing.originalPrice;
    const discount = calculateDiscount(originalPrice, offerPrice);

    const expiry = parsed.expiry
      ? typeof parsed.expiry === 'string'
        ? new Date(parsed.expiry)
        : parsed.expiry
      : existing.expiry;

    const deal = await prisma.deal.update({
      where: { id: parsed.id },
      data: {
        ...parsed,
        offerPrice,
        originalPrice,
        discount,
        expiry,
      },
    });

    return NextResponse.json({ deal });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating deal', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
