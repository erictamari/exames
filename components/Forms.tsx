"use client";

import { useState } from "react";

export function AppointmentForm({ specialtyId }: { specialtyId: number }) {
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/appointments", { method: "POST", body: form });
    window.location.reload();
  }
  return <form className="form" onSubmit={submit}>
    <div className="grid grid-2">
      <div className="field"><label>Data e hora</label><input name="date" type="datetime-local" required /></div>
      <div className="field"><label>Médico</label><input name="doctor" placeholder="Nome do profissional" /></div>
    </div>
    <div className="grid grid-2">
      <div className="field"><label>Local</label><input name="location" /></div>
      <div className="field"><label>Status</label><select name="status"><option>AGENDADA</option><option>REALIZADA</option><option>CANCELADA</option></select></div>
    </div>
    <div className="field"><label>Observações</label><textarea name="notes" /></div>
    <input type="hidden" name="specialtyId" value={specialtyId} />
    <button className="btn" disabled={loading}>{loading ? "Salvando..." : "Agendar consulta"}</button>
  </form>;
}

export function ExamForm({ specialtyId }: { specialtyId: number }) {
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/exams", { method: "POST", body: form });
    window.location.reload();
  }
  return <form className="form" onSubmit={submit}>
    <div className="grid grid-2">
      <div className="field"><label>Nome do exame</label><input name="name" required placeholder="Ex.: Ecocardiograma" /></div>
      <div className="field"><label>Data</label><input name="date" type="date" required /></div>
    </div>
    <div className="field"><label>Arquivo (PDF, PNG, JPG/JPEG)</label><input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" /></div>
    <div className="field"><label>Observações</label><textarea name="notes" /></div>
    <input type="hidden" name="specialtyId" value={specialtyId} />
    <button className="btn" disabled={loading}>{loading ? "Enviando..." : "Salvar exame"}</button>
  </form>;
}

export function NotesForm({ specialtyId, improvement = "", actions = "", medications = "" }: { specialtyId: number; improvement?: string; actions?: string; medications?: string }) {
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/specialties", { method: "PUT", body: form });
    setLoading(false);
    alert("Acompanhamento salvo.");
  }
  return <form className="form" onSubmit={submit}>
    <div className="field"><label>O que melhorar</label><textarea name="improvement" defaultValue={improvement} /></div>
    <div className="field"><label>O que fazer</label><textarea name="actions" defaultValue={actions} /></div>
    <div className="field"><label>Medicamentos / condutas registradas</label><textarea name="medications" defaultValue={medications} /></div>
    <input type="hidden" name="specialtyId" value={specialtyId} />
    <div className="alert">Use esta área para registrar orientações profissionais. O sistema não prescreve medicamentos.</div>
    <button className="btn" disabled={loading}>{loading ? "Salvando..." : "Salvar acompanhamento"}</button>
  </form>;
}

export function BloodForm({ specialties }: { specialties: { id: number; name: string }[] }) {
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("/api/blood", { method: "POST", body: form });
    window.location.reload();
  }
  return <form className="form" onSubmit={submit}>
    <div className="grid grid-3">
      <div className="field"><label>Marcador</label><input name="marker" required placeholder="Ex.: Hemoglobina" /></div>
      <div className="field"><label>Resultado</label><input name="value" type="number" step="any" required /></div>
      <div className="field"><label>Unidade</label><input name="unit" placeholder="g/dL" /></div>
    </div>
    <div className="grid grid-3">
      <div className="field"><label>Data</label><input name="date" type="date" required /></div>
      <div className="field"><label>Referência mínima</label><input name="referenceMin" type="number" step="any" /></div>
      <div className="field"><label>Referência máxima</label><input name="referenceMax" type="number" step="any" /></div>
    </div>
    <div className="grid grid-2">
      <div className="field"><label>Especialidade relacionada</label><select name="specialtyId"><option value="">Não especificada</option>{specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
      <div className="field"><label>Observações</label><input name="notes" /></div>
    </div>
    <button className="btn">Adicionar resultado</button>
  </form>;
}
