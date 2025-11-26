import { NextResponse } from 'next/server'
import { importDealsFromAdmitad } from '@/lib/admitad-importer'

export async function GET() {
    console.log('========================================')
    console.log('Main Import Route - All Sources')
    console.log('========================================')

    const results = {
        admitad: { created: 0, updated: 0, errors: 0 },
        amazon: { created: 0, updated: 0, errors: 0 },
        totalTime: 0,
    }

    const startTime = Date.now()

    try {
        // Import from Admitad (currently active)
        console.log('Starting Admitad import...')
        try {
            const admitadResult = await importDealsFromAdmitad()
            results.admitad = admitadResult
            console.log(`Admitad: Created ${admitadResult.created}, Updated ${admitadResult.updated}`)
        } catch (e: any) {
            console.error('Admitad import failed:', e.message)
            results.admitad.errors = 1
        }

        // Import from Amazon
        console.log('Starting Amazon import...')
        try {
            const amazonResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/import/amazon`)
            const amazonResult = await amazonResponse.json()
            if (amazonResult.ok) {
                results.amazon = {
                    created: amazonResult.created || 0,
                    updated: amazonResult.updated || 0,
                    errors: amazonResult.errors || 0,
                }
                console.log(`Amazon: Created ${results.amazon.created}, Updated ${results.amazon.updated}`)
            }
        } catch (e: any) {
            console.error('Amazon import failed:', e.message)
            results.amazon.errors = 1
        }

        results.totalTime = Date.now() - startTime

        console.log('========================================')
        console.log('All imports completed')
        console.log(`Total time: ${results.totalTime}ms`)
        console.log('========================================')

        return NextResponse.json({
            ok: true,
            results,
            message: 'Import completed for all sources',
        })
    } catch (e: any) {
        console.error('========================================')
        console.error('Error in main import:', e)
        console.error('========================================')
        return NextResponse.json(
            { ok: false, error: e?.message || String(e) },
            { status: 500 }
        )
    }
}
