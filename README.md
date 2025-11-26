# OfferVerse – Production-Ready Next.js 14 App

OfferVerse is a Next.js 14 (App Router) TypeScript app using Tailwind CSS + shadcn/ui, Prisma ORM with Neon PostgreSQL, Framer Motion animations, lucide-react icons, and Vercel scheduled functions. It fetches deals primarily via the Cuelinks Deals API and supports automatic Telegram posting.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + Neon PostgreSQL
- Framer Motion, lucide-react
- Vercel deployment + Scheduled Functions
- next/image optimized images

## Environment Variables
Create `.env` from `.env.example` and fill with real values:

```
DATABASE_URL="postgresql://db_user:db_pass@db.host.neon:5432/offerverse_db"
ADMIN_PASSWORD=ChangeMeNow123!
TELEGRAM_BOT_TOKEN=... 
TELEGRAM_CHANNEL=@OfferZoneTamil
CUELINKS_API_KEY=...
AMAZON_PARTNER_TAG=offerverse-21
FLIPKART_AFF_ID=flip_offer_123
POSTS_PER_DAY=10
TIMEZONE=Asia/Kolkata
SMTP_HOST=... 
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
```

## Local Development
1. Install deps: `npm install`
2. Set up Prisma:
   - `npm run prisma:generate`
   - `npm run prisma:migrate` (creates initial tables)
   - Seed data: `npm run prisma:seed`
3. Start dev server: `npm run dev` and open `http://localhost:3000`.

## Database: Neon Postgres
Use Neon for serverless Postgres. Copy the provided `DATABASE_URL` to `.env`. Ensure Prisma can connect by running `npm run prisma:generate` and `npm run prisma:migrate`.

## Importer (Cuelinks)
- Endpoint: `GET /api/import/cuelinks`
- Uses `CUELINKS_API_KEY` Authorization header. Maps fields: `title, image, offerPrice, originalPrice, discount, source, url, expiry`.
- Dedupes via `normalizedUrl + source`.

## Affiliate Params
- Amazon: appends `?tag=offerverse-21` when present.
- Flipkart: appends `?affid=flip_offer_123` when present.
- Safe handling of existing query strings.

## Cron Endpoints
- `GET /api/cron/selectHotDeals` – selects by trending score `discount*0.6 + recentClicks*0.4` and expiry.
- `GET /api/cron/postHotDeals` – posts selected deals to Telegram (`sendPhoto` with caption; fallback to `sendMessage`). Logs status in DB.

### Vercel Scheduled Functions
Configured in `vercel.json` to run at 09:00, 12:00, 15:00, 18:00, 21:00 IST.

## Telegram Setup
1. Create a bot via `@BotFather` and obtain `TELEGRAM_BOT_TOKEN`.
2. Add the bot to your channel and make it an admin.
3. Set `TELEGRAM_CHANNEL` to your channel handle (e.g., `@OfferZoneTamil`).

## Admin
- The admin endpoints use `x-admin-password` header with `ADMIN_PASSWORD`.
- Admin dashboard UI: `/admin` (to be enabled) supports CRUD, CSV import, force-post, and logs.

## Contact
- Endpoint: `POST /api/contact` stores messages and sends an SMTP email if configured. Simple per-email rate-limit (max 3/hour).

## Tests
- Run unit tests: `npm test`
- Tests include importer and posting cron smoke tests.

## Deployment (Vercel)
1. Push repo to Git.
2. Import project into Vercel.
3. Configure Environment Variables in Vercel dashboard.
4. Ensure `vercel.json` exists for crons.
5. Deploy; Next.js builds with serverless functions compatible with Neon.

## Notes
- Replace dummy URLs and images with real links when ready.
- The seed script is idempotent and inserts at least 10 sample deals with ≥60% discounts.
