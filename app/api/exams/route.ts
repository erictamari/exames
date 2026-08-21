import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const allowed = new Map([
  ["application/pdf", ".pdf"],
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"]
]);

export async function POST(req: Request) {
  const form = await req.formData();
  const specialtyId = Number(form.get("specialtyId"));
  const file = form.get("file");
  let filePath: string | null = null;
  let fileName: string | null = null;
  let fileType: string | null = null;

  if (file instanceof File && file.size > 0) {
    const ext = allowed.get(file.type);
    if (!ext) return NextResponse.json({ error: "Formato não permitido." }, { status: 400 });
    if (file.size > 15 * 1024 * 1024) return NextResponse.json({ error: "Arquivo maior que 15 MB." }, { status: 400 });

    const dir = path.join(process.cwd(), "uploads");
    await fs.mkdir(dir, { recursive: true });
    fileName = `${crypto.randomUUID()}${ext}`;
    const diskPath = path.join(dir, fileName);
    await fs.writeFile(diskPath, Buffer.from(await file.arrayBuffer()));
    filePath = `/api/files/${fileName}`;
    fileType = file.type;
  }

  const exam = await prisma.exam.create({
    data: {
      specialtyId,
      name: String(form.get("name")),
      date: new Date(String(form.get("date"))),
      notes: String(form.get("notes") || ""),
      fileName,
      filePath,
      fileType
    }
  });
  return NextResponse.json(exam);
}
