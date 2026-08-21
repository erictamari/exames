import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const types: Record<string,string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

export async function GET(_: Request, { params }: { params: Promise<{name:string}> }) {
  const { name } = await params;
  const safe = path.basename(name);
  const ext = path.extname(safe).toLowerCase();
  if (!types[ext]) return new NextResponse("Formato não permitido", { status: 400 });
  try {
    const data = await fs.readFile(path.join(process.cwd(), "uploads", safe));
    return new NextResponse(data, { headers: { "Content-Type": types[ext], "Content-Disposition": `inline; filename="${safe}"` }});
  } catch {
    return new NextResponse("Arquivo não encontrado", { status: 404 });
  }
}
