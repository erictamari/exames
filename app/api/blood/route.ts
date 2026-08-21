import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const form = await req.formData();
  const value = Number(form.get("value"));
  const minRaw = String(form.get("referenceMin") || "");
  const maxRaw = String(form.get("referenceMax") || "");
  const specialtyRaw = String(form.get("specialtyId") || "");

  const result = await prisma.bloodResult.create({
    data: {
      marker: String(form.get("marker")),
      value,
      unit: String(form.get("unit") || ""),
      referenceMin: minRaw ? Number(minRaw) : null,
      referenceMax: maxRaw ? Number(maxRaw) : null,
      date: new Date(String(form.get("date"))),
      notes: String(form.get("notes") || ""),
      specialtyId: specialtyRaw ? Number(specialtyRaw) : null
    }
  });
  return NextResponse.json(result);
}
