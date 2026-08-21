import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Countdown from "@/components/Countdown";

export const dynamic = "force-dynamic";

export default async function Agenda() {
  const appointments = await prisma.appointment.findMany({
    include: { specialty: true },
    orderBy: { date: "asc" }
  });
  return <>
    <div className="topbar"><div><h1>Agenda</h1><div className="subtitle">Todas as consultas em um só lugar.</div></div><Link href="/" className="btn secondary">← Dashboard</Link></div>
    <section className="card"><div className="table-wrap"><table><thead><tr><th>Especialidade</th><th>Data</th><th>Contagem regressiva</th><th>Profissional</th><th>Status</th><th></th></tr></thead><tbody>
      {appointments.map(a => <tr key={a.id}><td>{a.specialty.icon} {a.specialty.name}</td><td>{formatDate(a.date)}</td><td>{new Date(a.date) >= new Date() ? <Countdown date={a.date.toISOString()} /> : <span className="badge">Passada</span>}</td><td>{a.doctor || "—"}</td><td><span className="badge">{a.status}</span></td><td><Link className="btn secondary" href={`/especialidades/${a.specialty.slug}`}>Abrir</Link></td></tr>)}
    </tbody></table></div></section>
  </>;
}
