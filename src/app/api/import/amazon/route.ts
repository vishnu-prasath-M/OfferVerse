import { NextResponse } from 'next/server'
import { fetchAmazonDeals } from '@/lib/fetchAmazonDeals'
import { prisma } from '@/lib/prisma'
import { normalizeUrl } from '@/lib/affiliate'

export async function GET() {
    console.log('========================================')
    console.log('Import started - Amazon Apify')
    console.log('========================================')

    try {
        const amazonDeals = await fetchAmazonDeals()
        console.log(`Amazon fetched: ${amazonDeals.length} deals`)

        if (amazonDeals.length === 0) {
            console.warn('No Amazon deals to import')
            return NextResponse.json({
                ok: true,
                created: 0,
                updated: 0,
                errors: 0,
                message: 'No Amazon deals to import',
            })
        }

        let created = 0
        let updated = 0
        let errors = 0

        console.log('Starting database operations...')

        for (const deal of amazonDeals) {
            try {
                const normalized = normalizeUrl(deal.affiliateLink)

                // Check if deal already exists
                const existing = await prisma.deal.findFirst({
                    where: {
                        source: 'amazon',
                        normalizedUrl: normalized,
                    },
                })

                if (existing) {
                    // Update existing deal
                    await prisma.deal.update({
                        where: { id: existing.id },
                        data: {
                            title: deal.title,
                            imageUrl: deal.image || undefined,
                            offerPrice: deal.price,
                            originalPrice: deal.oldPrice,
                            discount: deal.discount ? Math.round((deal.discount / deal.oldPrice) * 100) : 0,
                            url: deal.affiliateLink,
                            affiliateLink: deal.affiliateLink,
                        },
                    })
                    updated++
                } else {
                    // Create new deal
                    await prisma.deal.create({
                        data: {
                            title: deal.title,
                            imageUrl: deal.image || undefined,
                            offerPrice: deal.price,
                            originalPrice: deal.oldPrice,
                            discount: deal.discount ? Math.round((deal.discount / deal.oldPrice) * 100) : 0,
                            source: 'amazon',
                            category: 'general',
                            tags: [],
                            url: deal.affiliateLink,
                            normalizedUrl: normalized,
                            affiliateLink: deal.affiliateLink,
                        },
                    })
                    created++
                }
            } catch (e) {
                console.error('Error processing Amazon deal:', e)
                errors++
            }
        }

        console.log('========================================')
        console.log('Amazon DB insert complete')
        console.log(`Created: ${created}, Updated: ${updated}, Errors: ${errors}`)
        console.log('========================================')

        return NextResponse.json({
            ok: true,
            created,
            updated,
            errors,
            message: 'Amazon Apify import completed',
        })
    } catch (e: any) {
        console.error('========================================')
        console.error('Error importing Amazon deals:', e)
        console.error('========================================')
        return NextResponse.json(
            { ok: false, error: e?.message || String(e) },
            { status: 500 }
        )
    }
}
