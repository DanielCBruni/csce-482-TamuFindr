import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: 'Electronics & Gadgets' },
  { name: 'Water Bottles & Tumblers' },
  { name: 'Keys & Keychains' },
  { name: 'Backpacks & Bags' },
  { name: 'Wallets & IDs' },
  { name: 'Apparel & Accessories' },
  { name: 'Eyewear & Sunglasses' },
  { name: 'Books & Course Materials' },
  { name: 'Jewelry & Watches' },
];

const locations = [
  { name: 'Academic Building', abbreviation: 'ACAD', latitude: 30.6151, longitude: -96.3385 },
  { name: 'Memorial Student Center', abbreviation: 'MSCB', latitude: 30.6123, longitude: -96.3414 },
  { name: 'Zachry Engineering Education Complex', abbreviation: 'ZACH', latitude: 30.6212, longitude: -96.3403 },
  { name: 'Sterling C. Evans Library', abbreviation: 'EVAN', latitude: 30.6166, longitude: -96.3398 },
  { name: 'Blocker Building', abbreviation: 'BLOC', latitude: 30.6196, longitude: -96.3388 },
  { name: 'Wisenbaker Engineering Building', abbreviation: 'WEB', latitude: 30.6218, longitude: -96.3392 },
  { name: 'Emerging Technologies Building', abbreviation: 'ETB', latitude: 30.6224, longitude: -96.3364 },
  { name: 'Jack E. Brown Chemical Engineering Building', abbreviation: 'CHEN', latitude: 30.6210, longitude: -96.3387 },
  { name: 'Student Recreation Center', abbreviation: 'REC', latitude: 30.6083, longitude: -96.3435 },
  { name: 'Heldenfels Hall', abbreviation: 'HELD', latitude: 30.6143, longitude: -96.3403 },
  { name: 'Harrington Education Center', abbreviation: 'HECC', latitude: 30.6133, longitude: -96.3386 },
  { name: 'Agriculture and Life Sciences Building', abbreviation: 'AGLS', latitude: 30.6105, longitude: -96.3508 },
  { name: 'Interdisciplinary Life Sciences Building', abbreviation: 'ILSB', latitude: 30.6115, longitude: -96.3423 },
  { name: 'Mitchell Physics Building', abbreviation: 'MPHY', latitude: 30.6180, longitude: -96.3410 },
  { name: 'Wehner Building', abbreviation: 'WCBA', latitude: 30.6119, longitude: -96.3486 },
  { name: 'Allen Building', abbreviation: 'ALLN', latitude: 30.6053, longitude: -96.3502 },
  { name: 'John J. Koldus Building', abbreviation: 'KOLD', latitude: 30.6118, longitude: -96.3405 },
  { name: 'Polo Road Garage', abbreviation: 'PRG', latitude: 30.6216, longitude: -96.3371 },
  { name: 'Central Campus Parking Garage', abbreviation: 'CCPG', latitude: 30.6153, longitude: -96.3415 },
  { name: 'Northside Parking Garage', abbreviation: 'NSPG', latitude: 30.6217, longitude: -96.3413 },
  { name: 'Harvey R. Bright Building', abbreviation: 'HRBB', latitude: 30.6189, longitude: -96.3383 },
  { name: 'Halbouty Geosciences Building', abbreviation: 'HALB', latitude: 30.6163, longitude: -96.3374 },
  { name: 'A.P. Beutel Health Center', abbreviation: 'BEUT', latitude: 30.6152, longitude: -96.3431 },
  { name: 'Sbisa Dining Hall', abbreviation: 'SBIS', latitude: 30.6171, longitude: -96.3423 },
  { name: 'The Commons', abbreviation: 'COMM', latitude: 30.6094, longitude: -96.3388 },
];

async function main() {
  const userId = process.env.DEFAULT_USER_ID;
  if (!userId?.trim()) {
    throw new Error('DEFAULT_USER_ID must be configured.');
  }

  console.log('Seeding categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Seeding locations...');
  for (const loc of locations) {
    await prisma.location.upsert({
      where: { name: loc.name },
      update: {
        abbreviation: loc.abbreviation,
        latitude: loc.latitude,
        longitude: loc.longitude,
      },
      create: loc,
    });
  }

  await prisma.user.upsert({
    where: { email: 'testuser@tamu.edu' },
    update: { id: userId },
    create: {
      id: userId,
      email: 'testuser@tamu.edu',
      firstName: 'Miss',
      lastName: 'Rev',
      passwordHash: 'hashed_password_here',
      role: 'USER',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
