import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { daysUntil, formatDate } from "@/lib/utils";
import Countdown from "@/components/Countdown";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const specialties = await prisma.specialty.findMany({
    include: { appointments: { orderBy: { date: "desc" }, take: 5 } },
    orderBy: { name: "asc" }
  });
  const upcoming = specialties.flatMap(s => s.appointments.filter(a => new Date(a.date) >= new Date()).map(a => ({...a, specialty: s})))
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 8);
  const nextCount = specialties.filter(s => s.appointments.some(a => new Date(a.date) >= new Date())).length;
  const visited = specialties.filter(s => s.lastVisit).length;

  return <>
    <div className="topbar"><div><h1>Dashboard</h1><div className="subtitle">Visão geral da sua saúde e agenda.</div></div><Link className="btn" href="/agenda">+ Nova consulta</Link></div>

    <div className="grid grid-4">
      <div className="card"><div className="label">Especialidades cadastradas</div><div className="metric">{specialties.length}</div></div>
      <div className="card"><div className="label">Com próxima consulta</div><div className="metric">{nextCount}</div></div>
      <div className="card"><div className="label">Últimas visitas registradas</div><div className="metric">{visited}</div></div>
      <div className="card"><div className="label">Próximos compromissos</div><div className="metric">{upcoming.length}</div></div>
    </div>

    <div style={{height:18}} />

    <div className="grid grid-2">
      <section className="card">
        <div className="section-title"><h2>Próximas consultas</h2><Link className="btn secondary" href="/agenda">Ver agenda</Link></div>
        {upcoming.length === 0 ? <p className="muted">Nenhuma consulta futura cadastrada.</p> :
          <div className="table-wrap"><table><thead><tr><th>Especialidade</th><th>Data</th><th>Contador</th></tr></thead><tbody>
            {upcoming.map(a => <tr key={a.id}><td><Link href={`/especialidades/${a.specialty.slug}`}><b>{a.specialty.icon} {a.specialty.name}</b></Link><br/><span className="muted">{a.doctor || "Profissional não informado"}</span></td><td>{formatDate(a.date)}</td><td><Countdown date={a.date.toISOString()} /></td></tr>)}
          </tbody></table></div>}
      </section>

      <section className="card">
        <div className="section-title"><h2>Status por especialidade</h2></div>
        <div className="grid grid-2">
          {specialties.map(s => {
            const next = s.appointments.filter(a => new Date(a.date) >= new Date()).sort((a,b) => new Date(a.date).getTime()-new Date(b.date).getTime())[0];
            const days = daysUntil(next?.date);
            return <Link className="specialty-card card" style={{padding:14}} key={s.id} href={`/especialidades/${s.slug}`}>
              <div className="specialty-head"><div className="iconbox">{s.icon}</div><div><b>{s.name}</b><div className="label">Última visita: {formatDate(s.lastVisit)}</div></div></div>
              <div style={{marginTop:12}}>{next ? <><span className="badge success">Próxima: {formatDate(next.date)}</span><div style={{marginTop:7}}><b>{days === 0 ? "Hoje" : `${days} dias restantes`}</b></div></> : <span className="badge">Sem próxima consulta</span>}</div>
            </Link>
          })}
        </div>
      </section>
    </div>
  </>;
}
