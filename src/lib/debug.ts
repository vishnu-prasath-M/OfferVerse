// Debug script to inspect Deal fields
import { prisma } from './prisma';

async function main() {
    const deal = await prisma.deal.findFirst();
    console.log('Deal fields:', deal ? Object.keys(deal) : 'No deals');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
