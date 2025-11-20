import { NextResponse } from 'next/server'
import { importDealsFromCuelinks } from '@/lib/importer'

export async function GET() {
  try {
    const result = await importDealsFromCuelinks(2, 50)
    return NextResponse.json({ ok: true, ...result })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}