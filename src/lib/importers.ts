import axios from 'axios';
import { prisma } from './prisma';
import { calculateDiscount } from './deals';

const FLIPKART_FEED_URL = 'https://affiliate-api.flipkart.net/affiliate/offers/v1/all/json';

export async function importFlipkartDeals() {
  const affId = process.env.FLIPKART_AFF_ID;
  if (!affId) return;

  // NOTE: In production you must include proper Flipkart affiliate headers.
  const res = await axios.get(FLIPKART_FEED_URL, {
    headers: {
      // 'Fk-Affiliate-Id': affId,
      // 'Fk-Affiliate-Token': process.env.FLIPKART_AFF_TOKEN ?? '',
    },
  });

  const data = res.data as any;
  const offers = data?.allOffersList ?? [];

  for (const offer of offers.slice(0, 100)) {
    const title: string = offer?.title;
    const url: string = offer?.url;
    const image: string | undefined = offer?.imageUrls?.[0]?.url;
    const offerPrice: number | undefined = offer?.price?.finalPrice;
    const originalPrice: number | undefined = offer?.price?.mrp;

    if (!title || !url || !image || !offerPrice || !originalPrice) continue;

    const affiliateLink = `${url}?affid=${affId}`;
    const discount = calculateDiscount(originalPrice, offerPrice);

    await prisma.deal.upsert({
      where: {
        // Composite-like uniqueness via stable synthetic id pattern
        id: offer.id ?? `${title}-FLIPKART`,
      },
      update: {
        offerPrice,
        originalPrice,
        discount,
      },
      create: {
        title,
        description: offer.description ?? title,
        imageUrl: image,
        offerPrice,
        originalPrice,
        discount,
        category: offer.category ?? 'General',
        source: 'flipkart',
        affiliateLink,
        tags: [],
        expiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }
}

// Placeholder for Amazon + Keepa-like sources
export async function importAmazonDeals() {
  const partnerTag = process.env.AMAZON_PARTNER_TAG;
  if (!partnerTag) return;

  // You would fetch from Amazon/Keepa here. For now this is a stub to show wiring.
  // Example of attaching tag: `${url}?tag=${partnerTag}`
}
