import { prisma } from '../src/lib/prisma'
import { appendAffiliateParams } from '../src/lib/affiliate'

async function upsertDeal({ title, url, imageUrl, offerPrice, originalPrice, discount, source, category, expiry }: any) {
  const affiliateLink = appendAffiliateParams(url, source)
  const existing = await prisma.deal.findFirst({ where: { source, url } as any })
  if (existing) {
    await prisma.deal.update({
      where: { id: existing.id },
      data: { title, imageUrl, offerPrice, originalPrice, discount, url, affiliateLink, category, expiry } as any,
    })
    return 'updated'
  } else {
    await prisma.deal.create({
      data: { title, imageUrl, offerPrice, originalPrice, discount, source, category, tags: [], url, affiliateLink, expiry } as any,
    })
    return 'created'
  }
}

async function main() {
  const now = new Date()
  const soon = new Date(now.getTime() + 6 * 60 * 60 * 1000)
  const later = new Date(now.getTime() + 36 * 60 * 60 * 1000)
  const deals = [
    { title: 'Wireless Earbuds ANC', source: 'amazon', url: 'https://www.amazon.in/dp/B0EXAMPLE', imageUrl: 'https://m.media-amazon.com/images/I/71kEXAMPLE.jpg', offerPrice: 1499, originalPrice: 3999, discount: 63, category: 'electronics', expiry: soon },
    { title: 'Smart LED Strip 5m', source: 'amazon', url: 'https://www.amazon.in/dp/B0LEDSTRIP', imageUrl: 'https://m.media-amazon.com/images/I/61EXAMPLE.jpg', offerPrice: 499, originalPrice: 1999, discount: 75, category: 'home', expiry: soon },
    { title: 'Steel Bottle Set of 3', source: 'flipkart', url: 'https://www.flipkart.com/steel-bottle/p/itmEXAMPLE', imageUrl: 'https://rukminim1.flixcart.com/image/416/416/kpcy5jk0/bottle/EXAMPLE.jpg', offerPrice: 499, originalPrice: 1399, discount: 64, category: 'home', expiry: later },
    { title: 'Gaming Mouse RGB', source: 'flipkart', url: 'https://www.flipkart.com/gaming-mouse/p/itmEXAMPLE', imageUrl: 'https://rukminim1.flixcart.com/image/416/416/mouse/EXAMPLE.jpg', offerPrice: 699, originalPrice: 1999, discount: 65, category: 'electronics', expiry: later },
    { title: 'Men T-Shirt Pack', source: 'amazon', url: 'https://www.amazon.in/gp/product/B0TSHIRT', imageUrl: 'https://m.media-amazon.com/images/I/71TSHIRT.jpg', offerPrice: 349, originalPrice: 999, discount: 65, category: 'fashion' },
    { title: 'Kitchen Mixer Grinder', source: 'flipkart', url: 'https://www.flipkart.com/mixer-grinder/p/itmMIXER', imageUrl: 'https://rukminim1.flixcart.com/image/416/416/mixer/EXAMPLE.jpg', offerPrice: 1899, originalPrice: 4999, discount: 62, category: 'home' },
    { title: 'Power Bank 20000mAh', source: 'amazon', url: 'https://www.amazon.in/dp/B0POWERBANK', imageUrl: 'https://m.media-amazon.com/images/I/71PBANK.jpg', offerPrice: 1299, originalPrice: 2999, discount: 57, category: 'electronics' },
    { title: 'Office Chair Ergonomic', source: 'flipkart', url: 'https://www.flipkart.com/office-chair/p/itmCHAIR', imageUrl: 'https://rukminim1.flixcart.com/image/416/416/chair/EXAMPLE.jpg', offerPrice: 3999, originalPrice: 9999, discount: 60, category: 'home' },
    { title: 'Bluetooth Speaker', source: 'amazon', url: 'https://www.amazon.in/dp/B0SPEAKER', imageUrl: 'https://m.media-amazon.com/images/I/71SPK.jpg', offerPrice: 799, originalPrice: 2499, discount: 68, category: 'electronics' },
    { title: 'Running Shoes', source: 'flipkart', url: 'https://www.flipkart.com/shoes/p/itmSHOES', imageUrl: 'https://rukminim1.flixcart.com/image/416/416/shoes/EXAMPLE.jpg', offerPrice: 899, originalPrice: 2999, discount: 70, category: 'fashion' },
  ]

  let created = 0
  let updated = 0
  for (const d of deals) {
    const result = await upsertDeal(d)
    if (result === 'created') created++
    else updated++
  }

  console.log(`Seed complete: created=${created}, updated=${updated}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })