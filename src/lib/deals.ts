import { prisma } from './prisma';

export const HOT_DISCOUNT_THRESHOLD = 60;

export function calculateDiscount(oldPrice: number, price: number): number {
  if (oldPrice <= 0) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export async function getHotDeals(limit = 5) {
  const deals = await prisma.deal.findMany({
    where: {
      discount: { gte: HOT_DISCOUNT_THRESHOLD },
      OR: [
        { expiry: null },
        { expiry: { gt: new Date() } },
      ],
    },
    orderBy: [{ discount: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  });

  return deals
    .filter((d: (typeof deals)[number]) => d.discount >= HOT_DISCOUNT_THRESHOLD)
    .sort((a: (typeof deals)[number], b: (typeof deals)[number]) => b.discount - a.discount)
    .slice(0, limit);
}
