import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const categories = [
  "Electronics",
  "Keys",
  "Wallets",
  "Water Bottles",
];

const locations = [
  { name: "Zachary", abbreviation: "ZACH" },
  { name: "Peterson", abbreviation: "PETR" },
  { name: "Mays", abbreviation: "MAYS" },
];

async function main() {
  await Promise.all(
    categories.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  await Promise.all(
    locations.map(({ name, abbreviation }) =>
      prisma.location.upsert({
        where: { name },
        update: { abbreviation },
        create: { name, abbreviation },
      }),
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });