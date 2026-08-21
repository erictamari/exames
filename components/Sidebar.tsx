import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Sidebar() {
  const specialties = await prisma.specialty.findMany({ orderBy: { name: "asc" } });
  return (
    <aside className="sidebar">
      <div className="logo">HEALTH OS<small>Seu painel pessoal de saúde</small></div>
      <div className="nav-title">Principal</div>
      <nav className="nav">
        <Link href="/">🏠 Dashboard</Link>
        <Link href="/sangue">🧪 Exames de sangue</Link>
        <Link href="/agenda">📅 Agenda</Link>
      </nav>
      <div className="nav-title">Especialidades</div>
      <nav className="nav">
        {specialties.map((s) => (
          <Link key={s.id} href={`/especialidades/${s.slug}`}>
            <span>{s.icon || "•"}</span>{s.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
