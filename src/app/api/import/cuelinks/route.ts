import { NextResponse } from 'next/server'
import { importDealsFromCuelinks } from '@/lib/importer'

// Feature flag: Set to true to re-enable Cuelinks import
const CUELINKS_ENABLED = false

export async function GET() {
  // Cuelinks is temporarily disabled - Admitad is now the active data source
  if (!CUELINKS_ENABLED) {
    return NextResponse.json({
      ok: false,
      message: 'Cuelinks import is currently disabled. Using Admitad as data source.',
      enabled: false
    })
  }

  try {
    const result = await importDealsFromCuelinks(2, 50)
    return NextResponse.json({ ok: true, ...result })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}