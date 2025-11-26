import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function toNumber(val: string | null | undefined) {
  const n = Number(val)
  return Number.isFinite(n) ? n : undefined
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const source = searchParams.get('source') || undefined
  const category = searchParams.get('category') || undefined
  const minPrice = toNumber(searchParams.get('minPrice'))
  const maxPrice = toNumber(searchParams.get('maxPrice'))
  const minDiscount = toNumber(searchParams.get('minDiscount'))
  const maxDiscount = toNumber(searchParams.get('maxDiscount'))
  const sort = searchParams.get('sort') || 'latest'
  const page = toNumber(searchParams.get('page')) || 1
  const perPage = Math.min(toNumber(searchParams.get('perPage')) || 24, 50)

  const where: any = {}
  if (source) where.source = source
  if (category) where.category = category
  if (minPrice || maxPrice) where.offerPrice = { gte: minPrice, lte: maxPrice }
  if (minDiscount || maxDiscount) where.discount = { gte: minDiscount, lte: maxDiscount }

  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'discount') orderBy = { discount: 'desc' }
  if (sort === 'price-asc') orderBy = { offerPrice: 'asc' }

  const skip = (page - 1) * perPage
  const [items, total] = await Promise.all([
    prisma.deal.findMany({ where, orderBy, take: perPage, skip }),
    prisma.deal.count({ where }),
  ])
  return NextResponse.json({ items, page, perPage, total })
}

export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD
  const header = req.headers.get('x-admin-password')
  if (!adminPassword || header !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const data: any = {
    title: body.title,
    description: body.description,
    imageUrl: body.imageUrl,
    offerPrice: body.offerPrice,
    originalPrice: body.originalPrice,
    discount: body.discount,
    source: body.source,
    category: body.category,
    tags: body.tags || [],
    url: body.url,
    normalizedUrl: body.normalizedUrl || body.url,
    affiliateLink: body.affiliateLink,
    expiry: body.expiry ? new Date(body.expiry) : undefined,
  }

  const created = await prisma.deal.create({ data })
  return NextResponse.json({ ok: true, item: created })
}
