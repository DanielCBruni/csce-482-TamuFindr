import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: 'Electronics & Gadgets' },
  { name: 'Phones & Accessories' },
  { name: 'Keys & Access Cards' },
  { name: 'Wallets, IDs & Cards' },
  { name: 'Bags & Backpacks' },
  { name: 'Water Bottles & Containers' },
  { name: 'Apparel & Accessories' },
  { name: 'Eyewear & Sunglasses' },
  { name: 'Jewelry & Watches' },
  { name: 'Books & School Supplies' },
  { name: 'Sports & Athletic Gear' },
  { name: 'Other / Miscellaneous' },
];

// Comprehensive list of Texas A&M Main Campus, West Campus, Gyms, Dining, and Parking Facilities
const locations = [
  // --- Academic & Administration Buildings ---
  { name: 'Academic Building', abbreviation: 'ACAD', latitude: 30.6151, longitude: -96.3385 },
  { name: 'Zachry Engineering Education Complex', abbreviation: 'ZACH', latitude: 30.6212, longitude: -96.3403 },
  { name: 'Sterling C. Evans Library', abbreviation: 'EVAN', latitude: 30.6166, longitude: -96.3398 },
  { name: 'Annex Library', abbreviation: 'LIBN', latitude: 30.6161, longitude: -96.3395 },
  { name: 'Blocker Building', abbreviation: 'BLOC', latitude: 30.6196, longitude: -96.3388 },
  { name: 'Wisenbaker Engineering Building', abbreviation: 'WEB', latitude: 30.6218, longitude: -96.3392 },
  { name: 'Emerging Technologies Building', abbreviation: 'ETB', latitude: 30.6224, longitude: -96.3364 },
  { name: 'Jack E. Brown Chemical Engineering Building', abbreviation: 'CHEN', latitude: 30.6210, longitude: -96.3387 },
  { name: 'Heldenfels Hall', abbreviation: 'HELD', latitude: 30.6143, longitude: -96.3403 },
  { name: 'Harrington Education Center', abbreviation: 'HECC', latitude: 30.6133, longitude: -96.3386 },
  { name: 'Agriculture and Life Sciences Building', abbreviation: 'AGLS', latitude: 30.6105, longitude: -96.3508 },
  { name: 'Interdisciplinary Life Sciences Building', abbreviation: 'ILSB', latitude: 30.6115, longitude: -96.3423 },
  { name: 'Mitchell Physics Building', abbreviation: 'MPHY', latitude: 30.6180, longitude: -96.3410 },
  { name: 'Wehner Building (Mays Business School)', abbreviation: 'WCBA', latitude: 30.6119, longitude: -96.3486 },
  { name: 'Allen Building (Bush School)', abbreviation: 'ALLN', latitude: 30.6053, longitude: -96.3502 },
  { name: 'Harvey R. Bright Building', abbreviation: 'HRBB', latitude: 30.6189, longitude: -96.3383 },
  { name: 'Halbouty Geosciences Building', abbreviation: 'HALB', latitude: 30.6163, longitude: -96.3374 },
  { name: 'Annenberg Presidential Conference Center', abbreviation: 'APCC', latitude: 30.6059, longitude: -96.3518 },
  { name: 'Chemistry Building', abbreviation: 'CHEM', latitude: 30.6158, longitude: -96.3408 },
  { name: 'Biological Sciences Building East', abbreviation: 'BSBE', latitude: 30.6148, longitude: -96.3419 },

  // --- Student Life, Centers & Dining ---
  { name: 'Memorial Student Center', abbreviation: 'MSCB', latitude: 30.6123, longitude: -96.3414 },
  { name: 'John J. Koldus Building', abbreviation: 'KOLD', latitude: 30.6118, longitude: -96.3405 },
  { name: 'Sbisa Dining Hall', abbreviation: 'SBIS', latitude: 30.6171, longitude: -96.3423 },
  { name: 'The Commons', abbreviation: 'COMM', latitude: 30.6094, longitude: -96.3388 },
  { name: 'White Creek Community Center', abbreviation: 'WCCC', latitude: 30.6062, longitude: -96.3551 },
  { name: 'A.P. Beutel Health Center', abbreviation: 'BEUT', latitude: 30.6152, longitude: -96.3431 },

  // --- Gyms, Recreation & Sports Facilities ---
  { name: 'Student Recreation Center', abbreviation: 'REC', latitude: 30.6083, longitude: -96.3435 },
  { name: 'Polo Road Rec Center', abbreviation: 'PRRC', latitude: 30.6215, longitude: -96.3368 },
  { name: 'Penberthy Rec Sports Complex', abbreviation: 'PENB', latitude: 30.6055, longitude: -96.3448 },
  { name: 'Kyle Field', abbreviation: 'KYLE', latitude: 30.6102, longitude: -96.3407 },
  { name: 'Reed Arena', abbreviation: 'REED', latitude: 30.6063, longitude: -96.3468 },
  { name: 'Olsen Field at Blue Bell Park', abbreviation: 'BLUE', latitude: 30.6042, longitude: -96.3441 },

  // --- Parking Garages & Major Parking Lots --
  { name: 'Polo Road Parking Garage', abbreviation: 'PRG', latitude: 30.6216, longitude: -96.3371 },
  { name: 'Central Campus Parking Garage', abbreviation: 'CCPG', latitude: 30.6153, longitude: -96.3415 },
  { name: 'Northside Parking Garage', abbreviation: 'NSPG', latitude: 30.6217, longitude: -96.3413 },
  { name: 'West Campus Parking Garage', abbreviation: 'WCPG', latitude: 30.6127, longitude: -96.3473 },
  { name: 'Gene Stallings Blvd Parking Garage', abbreviation: 'SBG', latitude: 30.6110, longitude: -96.3428 },
  { name: 'University Center Parking Garage', abbreviation: 'UCPG', latitude: 30.6133, longitude: -96.3430 },
  { name: 'Lot 100 (Reed Arena Parking)', abbreviation: 'LOT100', latitude: 30.6071, longitude: -96.3475 },
  { name: 'Lot 50 (Northside Parking Lot)', abbreviation: 'LOT50', latitude: 30.6230, longitude: -96.3380 },
  { name: 'Lot 40 (AgriLife Parking)', abbreviation: 'LOT40', latitude: 30.6095, longitude: -96.3512 },
  { name: 'Lot 15 (Equestrian/West Lot)', abbreviation: 'LOT15', latitude: 30.6035, longitude: -96.3530 },
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
