import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const form = await req.formData();
  const specialtyId = Number(form.get("specialtyId"));
  const date = new Date(String(form.get("date")));
  const appointment = await prisma.appointment.create({
    data: {
      specialtyId,
      date,
      doctor: String(form.get("doctor") || ""),
      location: String(form.get("location") || ""),
      notes: String(form.get("notes") || ""),
      status: String(form.get("status") || "AGENDADA")
    }
  });
  await prisma.specialty.update({
    where: { id: specialtyId },
    data: { nextAppointment: date }
  });
  return NextResponse.json(appointment);
}
