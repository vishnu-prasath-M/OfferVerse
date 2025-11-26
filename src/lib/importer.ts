import axios from 'axios'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { appendAffiliateParams, normalizeUrl } from '@/lib/affiliate'

const CuelinksDeal = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  merchant_name: z.string().optional().nullable(),
  store: z.string().optional().nullable(),
  url: z.string(),
  offer_price: z.number().optional().nullable(),
  original_price: z.number().optional().nullable(),
  discount: z.number().optional().nullable(),
  end_date: z.string().optional().nullable(),
  expiry: z.string().optional().nullable(),
})

type ImportResult = {
  created: number
  updated: number
  errors: number
}

export async function importDealsFromCuelinks(pages = 1, perPage = 50): Promise<ImportResult> {
  const apiKey = process.env.CUELINKS_API_KEY
  if (!apiKey) {
    throw new Error('CUELINKS_API_KEY is not set')
  }

  let created = 0
  let updated = 0
  let errors = 0

  for (let page = 1; page <= pages; page++) {
    const url = `https://www.cuelinks.com/api/v2/deals.json?page=${page}&per_page=${perPage}`
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Token token="${apiKey}"` },
        timeout: 20000,
      })
      const data = Array.isArray(res.data) ? res.data : res.data?.deals || []
      for (const item of data) {
        const parsed = CuelinksDeal.safeParse(item)
        if (!parsed.success) {
          errors++
          continue
        }
        const deal = parsed.data

        const discount = ((): number => {
          if (typeof deal.discount === 'number') return Math.round(deal.discount)
          if (deal.offer_price && deal.original_price && deal.original_price > 0) {
            return Math.round(100 - (deal.offer_price / deal.original_price) * 100)
          }
          return 0
        })()

        // Filter by price range (100 - 1000 INR) and discount > 50%
        if (deal.offer_price && (deal.offer_price < 100 || deal.offer_price > 1000)) {
          continue
        }
        if (discount <= 50) {
          continue
        }

        const source = (deal.merchant_name || deal.store || '').toUpperCase().includes('AMAZON')
          ? 'amazon'
          : (deal.merchant_name || deal.store || '').toUpperCase().includes('FLIPKART')
            ? 'flipkart'
            : 'other'

        const normalized = normalizeUrl(deal.url)
        const affiliateLink = appendAffiliateParams(deal.url, source)
        const expiryStr = deal.expiry || deal.end_date || undefined
        const expiry = expiryStr ? new Date(expiryStr) : null

        const imageUrl = deal.image_url || deal.image || null

        try {
          const existing = await prisma.deal.findFirst({
            where: { source, normalizedUrl: normalized },
          })
          if (existing) {
            await prisma.deal.update({
              where: { id: existing.id },
              data: {
                title: deal.title,
                description: deal.description || undefined,
                imageUrl: imageUrl || undefined,
                offerPrice: deal.offer_price ?? existing.offerPrice,
                originalPrice: deal.original_price ?? existing.originalPrice,
                discount,
                url: deal.url,
                affiliateLink,
                expiry: expiry ?? undefined,
              },
            })
            updated++
          } else {
            await prisma.deal.create({
              data: {
                title: deal.title,
                description: deal.description || undefined,
                imageUrl: imageUrl || undefined,
                offerPrice: deal.offer_price ?? 0,
                originalPrice: deal.original_price ?? 0,
                discount,
                source,
                category: 'general',
                tags: [],
                url: deal.url,
                normalizedUrl: normalized,
                affiliateLink,
                expiry: expiry ?? undefined,
              },
            })
            created++
          }
        } catch (e) {
          errors++
        }
      }
    } catch (e) {
      errors++
    }
  }

  return { created, updated, errors }
}