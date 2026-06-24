import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { exerciseHistory, personalRecords, EXERCISES, getExercise } from "@/lib/hybrid";
import { Trophy, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/evolucao")({
  head: () => ({ meta: [{ title: "Evolução — Hybrid Trainer" }] }),
  component: ProgressPage,
});

function ProgressPage() {
  const state = useStore();
  const { bodyMetrics, addBodyMetric, profile, logs, runLogs, completedDates } = state;
  const [weight, setWeight] = useState<string>("");
  const [bf, setBf] = useState<string>("");

  const totalVolume = useMemo(() => {
    let v = 0;
    Object.values(logs).forEach((day) =>
      Object.values(day).forEach((sets) => sets.forEach((s) => { if (s) v += s.weight * s.reps; })),
    );
    return v;
  }, [logs]);

  const totalKm = useMemo(() => Object.values(runLogs).reduce((a, r) => a + r.distance, 0), [runLogs]);
  const avgPace = useMemo(() => {
    const arr = Object.values(runLogs);
    if (!arr.length) return "—";
    const sec = arr.reduce((a, r) => a + (r.timeMin / r.distance) * 60, 0) / arr.length;
    const m = Math.floor(sec / 60); const s = Math.round(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}/km`;
  }, [runLogs]);

  const imc = profile ? profile.weight / Math.pow(profile.height / 100, 2) : 0;

  const series = bodyMetrics.map((m) => m.weight);
  const minW = series.length ? Math.min(...series) : 0;
  const maxW = series.length ? Math.max(...series) : 0;

  const prs = useMemo(() => personalRecords(state), [state]);
  const trackedExercises = useMemo(() => {
    const ids = new Set<string>();
    Object.values(logs).forEach((day) => Object.keys(day).forEach((id) => ids.add(id)));
    return [...ids];
  }, [logs]);
  const [selectedEx, setSelectedEx] = useState<string>(trackedExercises[0] ?? EXERCISES[0].id);
  const exHistory = useMemo(() => exerciseHistory(state, selectedEx), [state, selectedEx]);

  return (
    <div className="pb-32 px-5 pt-10">
      <header className="animate-reveal">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Sua Jornada</p>
        <h1 className="font-display text-4xl uppercase leading-none">Evolução</h1>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3 animate-reveal">
        <Tile label="Peso" value={profile ? `${profile.weight}kg` : "—"} />
        <Tile label="IMC" value={imc ? imc.toFixed(1) : "—"} />
        <Tile label="Volume total" value={`${(totalVolume / 1000).toFixed(1)}t`} sub="kg levantados" />
        <Tile label="Km corridos" value={`${totalKm.toFixed(1)}`} sub={`Pace ${avgPace}`} />
        <Tile label="Sessões" value={`${completedDates.length}`} sub="treinos completos" accent />
        <Tile label="% Gordura" value={profile?.bodyFat ? `${profile.bodyFat}%` : "—"} />
      </section>

      {/* Per-exercise progression */}
      <section className="mt-6 animate-reveal [animation-delay:80ms]">
        <h2 className="mb-2 flex items-center gap-2 font-display text-lg uppercase"><TrendingUp className="size-4 text-primary" /> Por exercício</h2>
        <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
          {(trackedExercises.length ? trackedExercises : EXERCISES.slice(0, 6).map((e) => e.id)).map((id) => {
            const ex = getExercise(id);
            if (!ex) return null;
            const active = selectedEx === id;
            return (
              <button key={id} onClick={() => setSelectedEx(id)}
                className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-bold uppercase transition ${active ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground"}`}>
                {ex.name}
              </button>
            );
          })}
        </div>
        <ProgressChart history={exHistory} />
      </section>

      {/* Personal Records */}
      <section className="mt-6 animate-reveal [animation-delay:160ms]">
        <h2 className="mb-2 flex items-center gap-2 font-display text-lg uppercase"><Trophy className="size-4 text-warning" /> Recordes</h2>
        {prs.length === 0 ? (
          <p className="rounded-xl border border-border bg-surface p-4 text-xs text-muted-foreground">Sem PRs ainda — complete séries pra registrar.</p>
        ) : (
          <ul className="space-y-2">
            {prs.slice(0, 6).map((pr) => (
              <li key={pr.exerciseId} className="flex items-center justify-between rounded-xl border border-border bg-surface p-3">
                <div>
                  <p className="text-sm font-bold uppercase">{pr.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{pr.date}</p>
                </div>
                <p className="font-display text-2xl text-warning">{pr.weight}<span className="text-xs">kg × {pr.reps}</span></p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-border bg-surface p-4 animate-reveal [animation-delay:240ms]">
        <p className="font-mono text-[10px] uppercase text-muted-foreground">Peso corporal</p>
        <div className="mt-3 flex h-32 items-end gap-1">
          {series.length === 0 && <p className="m-auto text-xs text-muted-foreground">Sem registros ainda.</p>}
          {series.map((w, i) => {
            const range = maxW - minW || 1;
            const h = 20 + ((w - minW) / range) * 80;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t bg-gradient-to-t from-primary/30 to-primary" style={{ height: `${h}%` }} />
                <span className="font-mono text-[8px] text-muted-foreground">{w}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-surface p-4 animate-reveal [animation-delay:320ms]">
        <p className="mb-3 font-mono text-[10px] uppercase text-muted-foreground">Registrar nova medida</p>
        <div className="grid grid-cols-3 gap-2">
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Peso kg"
            className="rounded-lg border border-border bg-black/40 px-3 py-2 text-sm" />
          <input type="number" value={bf} onChange={(e) => setBf(e.target.value)} placeholder="% gord."
            className="rounded-lg border border-border bg-black/40 px-3 py-2 text-sm" />
          <button onClick={() => { if (weight) { addBodyMetric(+weight, bf ? +bf : undefined); setWeight(""); setBf(""); } }}
            className="rounded-lg bg-primary font-display text-sm uppercase text-primary-foreground">Salvar</button>
        </div>
      </section>
    </div>
  );
}

function ProgressChart({ history }: { history: { date: string; maxWeight: number; volume: number }[] }) {
  if (!history.length) {
    return <div className="rounded-xl border border-border bg-surface p-4 text-xs text-muted-foreground">Sem registros desse exercício ainda.</div>;
  }
  const max = Math.max(...history.map((h) => h.maxWeight));
  const min = Math.min(...history.map((h) => h.maxWeight));
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-between font-mono text-[10px] uppercase text-muted-foreground">
        <span>Carga máxima</span>
        <span>{history.length} sessão{history.length > 1 ? "s" : ""}</span>
      </div>
      <div className="flex h-28 items-end gap-1">
        {history.map((h, i) => {
          const range = max - min || 1;
          const heightPct = 20 + ((h.maxWeight - min) / range) * 80;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1" title={`${h.date}: ${h.maxWeight}kg`}>
              <span className="font-mono text-[8px] text-foreground">{h.maxWeight}</span>
              <div className="w-full rounded-t bg-gradient-to-t from-primary/30 to-primary" style={{ height: `${heightPct}%` }} />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[9px] text-muted-foreground">
        <span>{history[0].date.slice(5)}</span>
        <span>{history[history.length - 1].date.slice(5)}</span>
      </div>
    </div>
  );
}

function Tile({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "border-primary/30 bg-primary/5" : "border-border bg-surface"}`}>
      <p className="font-mono text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-2xl ${accent ? "text-primary" : ""}`}>{value}</p>
      {sub && <p className="font-mono text-[9px] uppercase text-muted-foreground">{sub}</p>}
    </div>
  );
}
