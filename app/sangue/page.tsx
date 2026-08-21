import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { BloodForm } from "@/components/Forms";

export const dynamic = "force-dynamic";

export default async function BloodPage() {
  const [results, specialties] = await Promise.all([
    prisma.bloodResult.findMany({ include: { specialty: true }, orderBy: [{ marker: "asc" }, { date: "desc" }] }),
    prisma.specialty.findMany({ orderBy: { name: "asc" } })
  ]);

  const grouped = results.reduce<Record<string, typeof results>>((acc, r) => {
    (acc[r.marker] ||= []).push(r);
    return acc;
  }, {});

  return <>
    <div className="topbar"><div><h1>🧪 Exames de sangue</h1><div className="subtitle">Resultados, referências e comparação com exames anteriores.</div></div></div>
    <section className="card"><div className="section-title"><h2>Novo resultado</h2></div><BloodForm specialties={specialties} /></section>
    <div style={{height:18}} />
    <section className="card">
      <div className="section-title"><h2>Histórico comparativo</h2></div>
      {Object.keys(grouped).length === 0 ? <p className="muted">Nenhum resultado cadastrado.</p> :
      Object.entries(grouped).map(([marker, items]) => {
        const sorted = [...items].sort((a,b) => new Date(b.date).getTime()-new Date(a.date).getTime());
        const latest = sorted[0];
        const previous = sorted[1];
        const delta = previous ? latest.value - previous.value : null;
        return <div className="card" style={{marginBottom:14}} key={marker}>
          <div className="section-title"><div><h2>{marker}</h2><span className="muted">{latest.specialty?.name || "Sem especialidade"}</span></div><span className="badge">{previous ? `Variação: ${delta! >= 0 ? "+" : ""}${delta}` : "Primeiro registro"}</span></div>
          <div className="table-wrap"><table><thead><tr><th>Data</th><th>Resultado</th><th>Referência</th><th>Comparação</th><th>Observações</th></tr></thead><tbody>
          {sorted.map((r,i) => <tr key={r.id}><td>{formatDate(r.date)}</td><td><b>{r.value}</b> {r.unit || ""}</td><td>{r.referenceMin != null && r.referenceMax != null ? `${r.referenceMin} — ${r.referenceMax}` : "—"}</td><td>{i === 0 ? <span className="badge success">Mais recente</span> : previous && i === 1 ? `${delta! >= 0 ? "+" : ""}${delta} vs. anterior` : "—"}</td><td>{r.notes || "—"}</td></tr>)}
          </tbody></table></div>
        </div>
      })}
    </section>
  </>;
}
