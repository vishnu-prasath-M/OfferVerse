import { NextResponse } from 'next/server'
import { importDealsFromAdmitad } from '@/lib/admitad-importer'

export async function GET() {
    try {
        const result = await importDealsFromAdmitad()
        return NextResponse.json({ ok: true, ...result })
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
    }
}
