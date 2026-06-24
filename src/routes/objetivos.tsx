import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { daysUntil } from "@/lib/hybrid";
import { ArrowLeft, Target, Trash2, Plus, Calendar, Trophy } from "lucide-react";

export const Route = createFileRoute("/objetivos")({
  head: () => ({ meta: [{ title: "Objetivos — Hybrid Trainer" }] }),
  component: GoalsPage,
});

const TYPES = [
  { value: "jogo", label: "Jogo", icon: "⚽" },
  { value: "campeonato", label: "Campeonato", icon: "🏆" },
  { value: "prova", label: "Prova / Corrida", icon: "🏃" },
  { value: "outro", label: "Outro", icon: "🎯" },
] as const;

function GoalsPage() {
  const goals = useStore((s) => s.eventGoals);
  const addEventGoal = useStore((s) => s.addEventGoal);
  const removeEventGoal = useStore((s) => s.removeEventGoal);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<typeof TYPES[number]["value"]>("jogo");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  function save() {
    if (!title.trim() || !date) return;
    addEventGoal({ title: title.trim(), type, date, notes: notes.trim() || undefined });
    setTitle(""); setDate(""); setNotes(""); setOpen(false);
  }

  return (
    <div className="pb-32">
      <header className="px-5 pt-10 pb-5 animate-reveal">
        <Link to="/" className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <ArrowLeft className="size-3" /> Voltar
        </Link>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Preparação Específica</p>
        <h1 className="font-display text-4xl uppercase leading-none">Objetivos</h1>
        <p className="mt-2 text-sm text-muted-foreground">Aponte para um jogo, campeonato ou prova e a IA ajusta o planejamento.</p>
      </header>

      <main className="px-5 space-y-4">
        <button onClick={() => setOpen(!open)} className="w-full rounded-xl border border-primary/40 bg-primary/10 py-3 font-display text-sm uppercase tracking-widest text-primary flex items-center justify-center gap-2">
          <Plus className="size-4" /> {open ? "Cancelar" : "Novo objetivo"}
        </button>

        {open && (
          <section className="rounded-xl border border-border bg-surface p-4 space-y-3 animate-reveal">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Final do campeonato"
              className="w-full rounded-lg border border-border bg-black/40 px-3 py-2 text-sm" />
            <div className="grid grid-cols-4 gap-2">
              {TYPES.map((t) => (
                <button key={t.value} onClick={() => setType(t.value)}
                  className={`rounded-lg border px-2 py-2 text-[10px] font-bold uppercase ${type === t.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-black/40 text-muted-foreground"}`}>
                  <span className="block text-base">{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-black/40 px-3 py-2 text-sm" />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas (opcional)" rows={2}
              className="w-full rounded-lg border border-border bg-black/40 px-3 py-2 text-sm" />
            <button onClick={save} className="w-full rounded-lg bg-primary py-2 font-display text-sm uppercase text-primary-foreground">Salvar objetivo</button>
          </section>
        )}

        {goals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
            <Target className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Nenhum objetivo cadastrado.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {goals.map((g) => {
              const d = daysUntil(g.date);
              const t = TYPES.find((x) => x.value === g.type);
              const past = d < 0;
              return (
                <li key={g.id} className={`rounded-xl border p-4 ${past ? "border-border bg-surface opacity-60" : d <= 7 ? "border-warning/40 bg-warning/5" : "border-border bg-surface"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="grid size-12 place-items-center rounded-lg bg-black/40 text-2xl">{t?.icon}</div>
                      <div>
                        <p className="font-display text-base uppercase">{g.title}</p>
                        <p className="font-mono text-[10px] uppercase text-muted-foreground flex items-center gap-1"><Calendar className="size-3" /> {g.date}</p>
                        {g.notes && <p className="mt-1 text-xs text-muted-foreground">{g.notes}</p>}
                      </div>
                    </div>
                    <button onClick={() => removeEventGoal(g.id)} className="text-muted-foreground"><Trash2 className="size-4" /></button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`font-display text-2xl ${past ? "" : d <= 7 ? "text-warning" : "text-primary"}`}>
                      {past ? "Concluído" : d === 0 ? "Hoje!" : `D-${d}`}
                    </span>
                    {!past && <Trophy className="size-4 text-warning" />}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
