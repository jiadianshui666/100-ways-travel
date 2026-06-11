import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { travelExperiences: { where: { published: true } } },
      },
    },
  });

  return NextResponse.json(
    categories.map(({ _count, ...c }) => ({
      ...c,
      experienceCount: _count.travelExperiences,
    }))
  );
}
