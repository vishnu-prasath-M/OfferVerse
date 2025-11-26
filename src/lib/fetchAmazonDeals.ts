import axios from 'axios'

type ApifyItem = {
    title?: string
    image?: string
    priceToPay?: number
    basisPrice?: number
    url?: string
    productUrl?: string
    link?: string
    asin?: string
}

type AmazonDeal = {
    title: string
    image: string
    price: number
    oldPrice: number
    discount: number | null
    affiliateLink: string
    source: string
    createdAt: Date
}

/**
 * Fetch USD to INR exchange rate once
 * This is called ONCE before processing items to avoid API rate limits
 */
async function getINRRate(): Promise<number> {
    try {
        const response = await fetch('https://api.exchangerate.host/convert?from=USD&to=INR&amount=1')
        const json = await response.json()
        const rate = json.result || 83 // fallback to 83 if API fails
        console.log(`USD to INR rate: ${rate}`)
        return rate
    } catch (error) {
        console.warn('Failed to fetch exchange rate, using fallback rate of 83')
        return 83 // fallback rate
    }
}

/**
 * Fetch and process Amazon deals from Apify dataset
 */
export async function fetchAmazonDeals(): Promise<AmazonDeal[]> {
    const dealsUrl = process.env.AMAZON_DEALS_URL

    if (!dealsUrl) {
        throw new Error('AMAZON_DEALS_URL is not set')
    }

    try {
        console.log('Fetching Amazon deals from Apify...')
        const res = await axios.get(dealsUrl, {
            timeout: 30000,
        })

        const data: ApifyItem[] = Array.isArray(res.data) ? res.data : []
        console.log(`Fetched ${data.length} items from Apify`)

        // CRITICAL FIX: Fetch exchange rate ONCE before loop
        const rate = await getINRRate()

        const processedDeals: AmazonDeal[] = []

        for (const item of data) {
            try {
                // DEBUG: Log first item to see structure
                if (processedDeals.length === 0) {
                    console.log('Sample Apify item structure:', JSON.stringify(item, null, 2))
                }

                // Extract prices in USD
                const priceUSD = item.priceToPay || item.basisPrice || 0
                const oldPriceUSD = item.basisPrice || 0

                // Convert to INR using pre-fetched rate (NO API CALL)
                const priceINR = Math.round(priceUSD * rate)
                const oldPriceINR = Math.round(oldPriceUSD * rate)

                // Apply price filter: only keep items between ₹50 and ₹3000
                if (priceINR < 50 || priceINR > 3000) {
                    continue
                }

                // Calculate discount
                const discount = oldPriceINR && priceINR ? oldPriceINR - priceINR : null

                // Extract URL - try multiple field names
                const productUrl = item.url || item.productUrl || item.link || item.asin || ''

                if (!productUrl) {
                    console.warn('No URL found for item:', item.title)
                }

                // Map to our deal format
                processedDeals.push({
                    title: item.title || '',
                    image: item.image || '',
                    price: priceINR,
                    oldPrice: oldPriceINR,
                    discount,
                    affiliateLink: productUrl,
                    source: 'amazon',
                    createdAt: new Date(),
                })
            } catch (e) {
                console.error('Error processing Amazon item:', e)
                // Continue processing other items
            }
        }

        console.log(`Processed ${processedDeals.length} Amazon deals after filtering`)
        return processedDeals
    } catch (e) {
        console.error('Error fetching Amazon deals:', e)
        throw e
    }
}
