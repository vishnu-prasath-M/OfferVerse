import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addDealSchema } from '@/lib/validation';
import { calculateDiscount } from '@/lib/deals';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = addDealSchema.parse(json);

    const offerPrice = parsed.offerPrice;
    const originalPrice = parsed.originalPrice;
    const discount = calculateDiscount(originalPrice, offerPrice);

    const expiry = parsed.expiry
      ? typeof parsed.expiry === 'string'
        ? new Date(parsed.expiry)
        : parsed.expiry
      : null;

    // prevent duplicates by title + source + affiliateLink
    const existing = await prisma.deal.findFirst({
      where: {
        title: parsed.title,
        source: parsed.source,
        affiliateLink: parsed.affiliateLink,
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Duplicate deal' }, { status: 409 });
    }

    const deal = await prisma.deal.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        imageUrl: parsed.image,
        offerPrice,
        originalPrice,
        discount,
        category: parsed.category,
        source: parsed.source,
        affiliateLink: parsed.affiliateLink,
        tags: parsed.tags,
        expiry: expiry ?? undefined,
      },
    });

    return NextResponse.json({ deal }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error adding deal', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
