import { prisma } from "./src/lib/prisma";

async function checkPrisma() {
  console.log("Prisma keys:", Object.keys(prisma));
  if ((prisma as any).freeKeySession) {
    console.log("SUCCESS: freeKeySession found!");
  } else {
    console.log("FAILURE: freeKeySession NOT found.");
  }
  process.exit(0);
}

checkPrisma();
