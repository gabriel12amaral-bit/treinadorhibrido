import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { computeWeeklyLoad, muscleBalance, performanceIndex, buildAISnapshot, daysUntil } from "@/lib/hybrid";
import { replanWeek } from "@/lib/ai-workouts.functions";
import { getClientAIErrorMessage } from "@/lib/ai-client-errors";
import { ArrowLeft, Activity, TrendingUp, TrendingDown, Minus, AlertTriangle, Sparkles, Loader2, Calendar } from "lucide-react";

export const Route = createFileRoute("/desempenho")({
  head: () => ({ meta: [{ title: "Desempenho — Hybrid Trainer" }] }),
  component: PerformancePage,
});

function PerformancePage() {
  const state = useStore();
  const ip = useMemo(() => performanceIndex(state), [state]);
  const wl = useMemo(() => computeWeeklyLoad(state), [state]);
  const bal = useMemo(() => muscleBalance(state), [state]);
  const nextEvent = useMemo(() => state.eventGoals.filter((g) => daysUntil(g.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0], [state.eventGoals]);

  const [replan, setReplan] = useState<{ summary: string; changes: any[]; priorityAdvice: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runReplan() {
    setLoading(true); setError(null);
    try {
      const snapshot = buildAISnapshot(state);
      const imbalances = bal.warnings.filter((w) => w.kind !== "deficit" || w.group).map((w) => w.detail);
      const event = nextEvent ? { title: nextEvent.title, type: nextEvent.type, date: nextEvent.date, daysUntil: daysUntil(nextEvent.date) } : undefined;
      const res = await replanWeek({ data: { snapshot, currentPlan: state.plan, event, imbalances, weeklyLoad: { status: wl.status, acwr: wl.acwr } } }) as any;
      setReplan(res);
    } catch (e: any) {
      setError(getClientAIErrorMessage(e, "Falha ao reorganizar."));
    } finally { setLoading(false); }
  }

  const TrendIcon = ip.trend === "subindo" ? TrendingUp : ip.trend === "caindo" ? TrendingDown : Minus;
  const gradeColor = ip.grade === "S" || ip.grade === "A" ? "text-primary" : ip.grade === "B" ? "text-warning" : "text-destructive";
  const loadColor = wl.status === "Ótima" ? "text-primary" : wl.status === "Alta" ? "text-warning" : wl.status === "Excessiva" ? "text-destructive" : "text-muted-foreground";
  const maxDaily = Math.max(1, ...wl.daily.map((d) => d.load));

  return (
    <div className="pb-32">
      <header className="px-5 pt-10 pb-5 animate-reveal">
        <Link to="/" className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><ArrowLeft className="size-3" /> Voltar</Link>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Painel do Atleta</p>
        <h1 className="font-display text-4xl uppercase leading-none">Desempenho</h1>
      </header>

      <main className="px-5 space-y-4">
        {/* IP */}
        <section className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/15 to-transparent p-5 animate-reveal">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Índice de Performance</p>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="font-display text-6xl leading-none">{ip.score}</p>
                <p className={`font-display text-3xl ${gradeColor}`}>{ip.grade}</p>
              </div>
              <p className="mt-1 flex items-center gap-1 font-mono text-[10px] uppercase text-muted-foreground">
                <TrendIcon className="size-3" /> {ip.trend}
              </p>
            </div>
            <Activity className="size-6 text-primary" />
          </div>
          <div className="mt-4 space-y-2">
            {ip.breakdown.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between font-mono text-[10px] uppercase text-muted-foreground">
                  <span>{b.label}</span><span>{b.value}/{b.max}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded bg-black/40">
                  <div className="h-full bg-primary" style={{ width: `${(b.value / b.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Carga Semanal */}
        <section className="rounded-xl border border-border bg-surface p-4 animate-reveal [animation-delay:60ms]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg uppercase">Carga Semanal</h2>
            <span className={`rounded bg-black/40 px-2 py-1 font-mono text-[10px] uppercase ${loadColor}`}>{wl.status}</span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            <Tile label="Total" value={wl.total.toString()} />
            <Tile label="Força" value={wl.strength.toString()} />
            <Tile label="Cardio" value={wl.cardio.toString()} />
            <Tile label="Esporte" value={wl.sport.toString()} />
          </div>
          <div className="mt-4">
            <p className="font-mono text-[10px] uppercase text-muted-foreground">7 dias • ACWR {wl.acwr}</p>
            <div className="mt-2 flex h-20 items-end gap-1">
              {wl.daily.map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1" title={`${d.date}: ${d.load}`}>
                  <div className="w-full rounded-t bg-gradient-to-t from-primary/30 to-primary" style={{ height: `${20 + (d.load / maxDaily) * 80}%` }} />
                  <span className="font-mono text-[8px] text-muted-foreground">{d.date.slice(8)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Próximo evento */}
        {nextEvent ? (
          <Link to="/objetivos" className="block rounded-xl border border-warning/40 bg-warning/5 p-4 animate-reveal [animation-delay:120ms]">
            <p className="font-mono text-[10px] uppercase text-warning flex items-center gap-1"><Calendar className="size-3" /> Próximo objetivo</p>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="font-display text-lg uppercase">{nextEvent.title}</p>
              <p className="font-display text-2xl text-warning">D-{daysUntil(nextEvent.date)}</p>
            </div>
          </Link>
        ) : (
          <Link to="/objetivos" className="block rounded-xl border border-dashed border-border bg-surface p-4 text-center animate-reveal [animation-delay:120ms]">
            <p className="text-sm text-muted-foreground">Adicione um jogo, campeonato ou prova →</p>
          </Link>
        )}

        {/* Desequilíbrios */}
        <section className="rounded-xl border border-border bg-surface p-4 animate-reveal [animation-delay:180ms]">
          <h2 className="font-display text-lg uppercase flex items-center gap-2"><AlertTriangle className="size-4 text-warning" /> Desequilíbrios</h2>
          {bal.byGroup.length > 0 && (
            <div className="mt-3 space-y-1">
              {bal.byGroup.slice(0, 6).map((b) => (
                <div key={b.group}>
                  <div className="flex justify-between font-mono text-[10px] uppercase text-muted-foreground">
                    <span>{b.group}</span><span>{b.sets} séries · {b.pct}%</span>
                  </div>
                  <div className="mt-0.5 h-1 overflow-hidden rounded bg-black/40">
                    <div className="h-full bg-primary/70" style={{ width: `${Math.min(100, b.pct * 2)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <ul className="mt-3 space-y-2">
            {bal.warnings.map((w, i) => (
              <li key={i} className="rounded-lg bg-black/30 p-2 text-xs text-foreground">{w.detail}</li>
            ))}
          </ul>
        </section>

        {/* Replan */}
        <section className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-4 animate-reveal [animation-delay:240ms]">
          <h2 className="font-display text-lg uppercase flex items-center gap-2"><Sparkles className="size-4 text-primary" /> Planejamento Inteligente</h2>
          <p className="mt-1 text-xs text-muted-foreground">A IA reorganiza sua semana com base em recuperação, carga, desequilíbrios{nextEvent ? " e seu próximo evento" : ""}.</p>
          <button onClick={runReplan} disabled={loading} className="mt-3 w-full rounded-lg bg-primary py-3 font-display text-sm uppercase text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <><Loader2 className="size-4 animate-spin" /> Analisando…</> : <>Reorganizar semana</>}
          </button>
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          {replan && (
            <div className="mt-3 space-y-3">
              <p className="rounded-lg bg-black/40 p-3 text-xs">{replan.summary}</p>
              <ul className="space-y-1.5">
                {replan.changes.map((c, i) => (
                  <li key={i} className="rounded-lg border border-border bg-black/30 p-3">
                    <div className="flex justify-between">
                      <p className="font-display text-sm uppercase">{c.weekday}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{c.date.slice(5)}</p>
                    </div>
                    <p className="text-sm text-primary">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground">{c.reason}</p>
                  </li>
                ))}
              </ul>
              <p className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs text-foreground"><span className="font-bold uppercase text-primary">Prioridade: </span>{replan.priorityAdvice}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-black/30 p-2 text-center">
      <p className="font-mono text-[9px] uppercase text-muted-foreground">{label}</p>
      <p className="font-display text-lg">{value}</p>
    </div>
  );
}
