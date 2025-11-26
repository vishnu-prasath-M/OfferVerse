import axios from 'axios'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { normalizeUrl } from '@/lib/affiliate'

// Admitad API response schema
const AdmitadDeal = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  goto_link: z.string(),
  campaign: z.object({
    name: z.string(),
  }),
  price: z.number().optional().nullable(),
  old_price: z.number().optional().nullable(),
  discount: z.string().optional().nullable(),
})

const AdmitadResponse = z.object({
  results: z.array(AdmitadDeal),
})

type ImportResult = {
  created: number
  updated: number
  errors: number
}

/**
 * Fetch deals from Admitad API
 */
async function fetchAdmitadDeals() {
  const accessToken = process.env.ADMITAD_ACCESS_TOKEN
  const dealsUrl = process.env.ADMITAD_DEALS_URL

  if (!accessToken) {
    throw new Error('ADMITAD_ACCESS_TOKEN is not set')
  }
  if (!dealsUrl) {
    throw new Error('ADMITAD_DEALS_URL is not set')
  }

  const res = await axios.get(dealsUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: 30000,
  })

  const parsed = AdmitadResponse.safeParse(res.data)
  if (!parsed.success) {
    throw new Error('Invalid Admitad API response format')
  }

  // Filter only Flipkart offers
  const flipkartDeals = parsed.data.results.filter((item) =>
    item.campaign.name.toLowerCase().includes('flipkart')
  )

  // Filter by price range (100 - 1000 INR) and discount > 50%
  const filteredDeals = flipkartDeals.filter((item) => {
    const price = item.price || 0

    // Calculate discount
    let discount = 0
    if (item.discount) {
      const match = item.discount.match(/(\d+)/)
      if (match) discount = parseInt(match[1], 10)
    } else if (item.old_price && item.price && item.old_price > 0) {
      discount = Math.round(100 - (item.price / item.old_price) * 100)
    }

    return price >= 100 && price <= 1000 && discount > 50
  })

  return filteredDeals
}

/**
 * Import deals from Admitad API into database
 */
export async function importDealsFromAdmitad(): Promise<ImportResult> {
  let created = 0
  let updated = 0
  let errors = 0

  try {
    const deals = await fetchAdmitadDeals()

    for (const item of deals) {
      try {
        // Calculate discount
        const discount = (() => {
          // Try parsing discount string if available
          if (item.discount) {
            const match = item.discount.match(/(\d+)/)
            if (match) return parseInt(match[1], 10)
          }
          // Calculate from prices if available
          if (item.old_price && item.price && item.old_price > 0) {
            return Math.round(100 - (item.price / item.old_price) * 100)
          }
          return 0
        })()

        const normalized = normalizeUrl(item.goto_link)

        // Check if deal already exists
        const existing = await prisma.deal.findFirst({
          where: {
            source: 'flipkart',
            normalizedUrl: normalized,
          },
        })

        if (existing) {
          // Update existing deal
          await prisma.deal.update({
            where: { id: existing.id },
            data: {
              title: item.name,
              description: item.description || undefined,
              imageUrl: item.image || undefined,
              offerPrice: item.price ?? existing.offerPrice,
              originalPrice: item.old_price ?? existing.originalPrice,
              discount,
              url: item.goto_link,
              affiliateLink: item.goto_link, // Admitad goto_link is already tracked
            },
          })
          updated++
        } else {
          // Create new deal
          await prisma.deal.create({
            data: {
              title: item.name,
              description: item.description || undefined,
              imageUrl: item.image || undefined,
              offerPrice: item.price ?? 0,
              originalPrice: item.old_price ?? 0,
              discount,
              source: 'flipkart',
              category: 'general',
              tags: [],
              url: item.goto_link,
              normalizedUrl: normalized,
              affiliateLink: item.goto_link, // Admitad goto_link is already tracked
            },
          })
          created++
        }
      } catch (e) {
        console.error('Error processing Admitad deal:', e)
        errors++
      }
    }
  } catch (e) {
    console.error('Error fetching Admitad deals:', e)
    throw e
  }

  return { created, updated, errors }
}
