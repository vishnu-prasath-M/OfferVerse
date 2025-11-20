import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

function isValidEmail(email: string) {
  return /.+@.+\..+/.test(email)
}

export async function POST(req: Request) {
  const body = await req.json()
  const name = body.name || ''
  const email = body.email || ''
  const subject = body.subject || ''
  const message = body.message || ''
  const ip = (body.ip as string | undefined) || undefined

  if (!isValidEmail(email) || !message) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  const recentCount = await prisma.message.count({
    where: { email, createdAt: { gt: oneHourAgo } },
  })
  if (recentCount > 3) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const saved = await prisma.message.create({
    data: { name, email, subject, body: message, ip },
  })

  try {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: false,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      })
      await transporter.sendMail({
        from: SMTP_USER,
        to: SMTP_USER,
        subject: `[OfferVerse] Contact: ${subject || 'Message'}`,
        text: `From: ${name} <${email}>\nIP: ${ip || 'n/a'}\n\n${message}`,
      })
    }
  } catch (e) {
    // swallow email errors but keep DB insert
  }

  return NextResponse.json({ ok: true, message: saved })
}