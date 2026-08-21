import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const form = await req.formData();
  const id = Number(form.get("specialtyId"));
  const specialty = await prisma.specialty.update({
    where: { id },
    data: {
      improvement: String(form.get("improvement") || ""),
      actions: String(form.get("actions") || ""),
      medications: String(form.get("medications") || "")
    }
  });
  return NextResponse.json(specialty);
}
