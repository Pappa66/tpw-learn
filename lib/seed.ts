import prisma from "@/lib/prisma";

async function main() {
  const existing = await prisma.user.findFirst();
  if (existing) {
    console.log("User already exists:", existing.userId);
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: "Daniel Tan",
      userId: "TPW-2026-0505",
      program: "Mandarin - Taiwan",
      level: 12,
    },
  });

  console.log("Seeded user:", user.userId);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
