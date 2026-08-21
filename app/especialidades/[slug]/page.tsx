import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Countdown from "@/components/Countdown";
import { AppointmentForm, ExamForm, NotesForm } from "@/components/Forms";

export const dynamic = "force-dynamic";

export default async function SpecialtyPage({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const s = await prisma.specialty.findUnique({
    where: { slug },
    include: {
      appointments: { orderBy: { date: "desc" } },
      exams: { orderBy: { date: "desc" } }
    }
  });
  if (!s) notFound();
  const next = s.appointments.filter(a => new Date(a.date) >= new Date() && a.status !== "CANCELADA")
    .sort((a,b) => new Date(a.date).getTime()-new Date(b.date).getTime())[0];

  return <>
    <div className="topbar">
      <div><h1>{s.icon} {s.name}</h1><div className="subtitle">Histórico, exames, agenda e acompanhamento.</div></div>
      <Link className="btn secondary" href="/">← Dashboard</Link>
    </div>

    <div className="grid grid-4">
      <div className="card"><div className="label">Última visita</div><div className="metric" style={{fontSize:20}}>{formatDate(s.lastVisit)}</div></div>
      <div className="card"><div className="label">Próxima consulta</div><div className="metric" style={{fontSize:20}}>{next ? formatDate(next.date) : "—"}</div></div>
      <div className="card"><div className="label">Contador</div><div className="metric" style={{fontSize:20}}>{next ? <Countdown date={next.date.toISOString()} /> : "—"}</div></div>
      <div className="card"><div className="label">Exames registrados</div><div className="metric">{s.exams.length}</div></div>
    </div>

    <div style={{height:18}} />

    <div className="grid grid-2">
      <section className="card">
        <div className="section-title"><h2>Acompanhamento de saúde</h2></div>
        <NotesForm specialtyId={s.id} improvement={s.improvement || ""} actions={s.actions || ""} medications={s.medications || ""} />
      </section>
      <section className="card">
        <div className="section-title"><h2>Agendar consulta</h2></div>
        <AppointmentForm specialtyId={s.id} />
      </section>
    </div>

    <div style={{height:18}} />

    <section className="card">
      <div className="section-title"><h2>Histórico de consultas</h2></div>
      {s.appointments.length === 0 ? <p className="muted">Nenhuma consulta cadastrada.</p> :
      <div className="table-wrap"><table><thead><tr><th>Data</th><th>Profissional</th><th>Local</th><th>Status</th><th>Observações</th></tr></thead><tbody>
        {s.appointments.map(a => <tr key={a.id}><td>{formatDate(a.date)}</td><td>{a.doctor || "—"}</td><td>{a.location || "—"}</td><td><span className="badge">{a.status}</span></td><td>{a.notes || "—"}</td></tr>)}
      </tbody></table></div>}
    </section>

    <div style={{height:18}} />

    <section className="card">
      <div className="section-title"><h2>Exames e documentos</h2></div>
      <ExamForm specialtyId={s.id} />
      <div style={{height:18}} />
      {s.exams.length === 0 ? <p className="muted">Nenhum exame cadastrado.</p> :
      <div className="table-wrap"><table><thead><tr><th>Exame</th><th>Data</th><th>Arquivo</th><th>Observações</th></tr></thead><tbody>
        {s.exams.map(e => <tr key={e.id}><td>{e.name}</td><td>{formatDate(e.date)}</td><td>{e.filePath ? <a className="btn secondary" href={e.filePath} target="_blank">Abrir arquivo</a> : "—"}</td><td>{e.notes || "—"}</td></tr>)}
      </tbody></table></div>}
    </section>
  </>;
}
