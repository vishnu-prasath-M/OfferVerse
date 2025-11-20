import axios from 'axios'
import { prisma } from '@/lib/prisma'

function buildCaption(deal: {
  title: string
  offerPrice: number
  originalPrice: number
  discount: number
  affiliateLink?: string | null
}) {
  const price = deal.offerPrice > 0 ? `₹${Math.round(deal.offerPrice)} (MRP ₹${Math.round(deal.originalPrice)})` : ''
  const discount = deal.discount ? `🔥 ${deal.discount}% OFF` : ''
  const lines = [
    `✅ ${deal.title}`,
    [discount, price].filter(Boolean).join(' • '),
    deal.affiliateLink ? `👇 Buy: ${deal.affiliateLink}` : '',
    `#OfferVerse #Deals`,
  ]
  return lines.filter(Boolean).join('\n')
}

// Simple formatter used by API routes expecting formatDealForTelegram
export function formatDealForTelegram(deal: {
  title: string
  offerPrice: number
  originalPrice: number
  discount: number
  affiliateLink?: string | null
}) {
  return buildCaption(deal)
}

export async function sendDealToTelegram(dealId: string, maxRetries = 3) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const channel = process.env.TELEGRAM_CHANNEL
  if (!token || !channel) throw new Error('Telegram env not configured')

  const deal = await prisma.deal.findUnique({ where: { id: dealId } })
  if (!deal) throw new Error('Deal not found')

  const caption = buildCaption({
    title: deal.title,
    offerPrice: deal.offerPrice,
    originalPrice: deal.originalPrice,
    discount: deal.discount,
    affiliateLink: deal.affiliateLink ?? deal.url,
  })

  const sendPhotoUrl = `https://api.telegram.org/bot${token}/sendPhoto`
  const sendMessageUrl = `https://api.telegram.org/bot${token}/sendMessage`

  let attempt = 0
  let lastError: any = null

  while (attempt < maxRetries) {
    try {
      if (deal.imageUrl) {
        await axios.post(sendPhotoUrl, {
          chat_id: channel,
          photo: deal.imageUrl,
          caption,
          parse_mode: 'HTML',
        })
      } else {
        await axios.post(sendMessageUrl, {
          chat_id: channel,
          text: caption,
          parse_mode: 'HTML',
        })
      }

      await prisma.deal.update({
        where: { id: deal.id },
        data: { postedToTelegram: true, postedAt: new Date() },
      })
      await prisma.log.create({
        data: {
          action: 'telegram_post',
          status: 'success',
          message: `Posted deal ${deal.id}`,
          dealId: deal.id,
        },
      })
      return true
    } catch (err: any) {
      lastError = err
      attempt++
      await prisma.log.create({
        data: {
          action: 'telegram_post',
          status: 'failure',
          message: `Attempt ${attempt} failed`,
          error: err?.message || String(err),
          dealId: deal.id,
        },
      })
      await new Promise((r) => setTimeout(r, 1500 * attempt))
    }
  }

  throw lastError || new Error('Failed to post to Telegram')
}

// Lightweight wrapper used by older cron endpoints expecting sendTelegramMessage
export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const channel = process.env.TELEGRAM_CHANNEL
  if (!token || !channel) throw new Error('Telegram env not configured')

  const sendMessageUrl = `https://api.telegram.org/bot${token}/sendMessage`

  const res = await axios.post(sendMessageUrl, {
    chat_id: channel,
    text,
    parse_mode: 'HTML',
  })

  return { ok: !!res.data?.ok, error: res.data?.description as string | undefined }
}
