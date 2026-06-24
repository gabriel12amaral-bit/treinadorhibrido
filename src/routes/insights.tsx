import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { buildAISnapshot } from "@/lib/hybrid";
import { generateAIInsights } from "@/lib/ai-workouts.functions";
import { getClientAIErrorMessage } from "@/lib/ai-client-errors";
import { ArrowLeft, Brain, Loader2, Sparkles, TrendingUp, AlertTriangle, HeartPulse, Trophy } from "lucide-react";

export const Route = createFileRoute("/insights")({
  head: () => ({ meta: [{ title: "Análises IA — Hybrid Trainer" }] }),
  component: InsightsPage,
});

const ICONS: Record<string, React.ElementType> = {
  progress: TrendingUp, warning: AlertTriangle, sport: Trophy, recovery: HeartPulse, tip: Sparkles,
};

function InsightsPage() {
  const reports = useStore((s) => s.aiReports);
  const state = useStore();
  const addAIReport = useStore((s) => s.addAIReport);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    setLoading(true); setError(null);
    try {
      const snapshot = buildAISnapshot(state);
      const res = await generateAIInsights({ data: { snapshot } }) as { insights: any[]; weeklyGrade: string; recommendation: string };
      addAIReport({
        weeklyGrade: res.weeklyGrade,
        recommendation: res.recommendation,
        insights: res.insights.map((i: any, idx: number) => ({ id: `${Date.now()}-${idx}`, date: new Date().toISOString().slice(0, 10), ...i })),
      });
    } catch (e: any) {
      setError(getClientAIErrorMessage(e, "Falha ao gerar analise."));
    } finally {
      setLoading(false);
    }
  }

  const latest = reports[0];

  return (
    <div className="pb-32">
      <header className="px-5 pt-10 pb-5 animate-reveal">
        <Link to="/" className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><ArrowLeft className="size-3" /> Voltar</Link>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Inteligência Híbrida</p>
        <h1 className="font-display text-4xl uppercase leading-none tracking-tight">Análises IA</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sua evolução, recuperação e esporte analisados pelos últimos 30 dias.</p>
      </header>

      <main className="px-5 space-y-4">
        <button onClick={runAnalysis} disabled={loading} className="w-full rounded-xl bg-primary py-4 font-display text-lg uppercase tracking-widest text-primary-foreground active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="size-5 animate-spin" /> Analisando…</> : <><Brain className="size-5" /> Gerar nova análise</>}
        </button>

        {error && <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">{error}</div>}

        {latest && (
          <section className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-4 animate-reveal">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Semana atual</p>
                <p className="font-display text-5xl uppercase leading-none">{latest.weeklyGrade}</p>
              </div>
              <Sparkles className="size-6 text-primary" />
            </div>
            <p className="mt-3 text-sm text-foreground">{latest.recommendation}</p>
          </section>
        )}

        {latest && (
          <section className="space-y-2">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Insights</h2>
            <ul className="space-y-2">
              {latest.insights.map((i) => {
                const Icon = ICONS[i.icon] || Sparkles;
                return (
                  <li key={i.id} className="rounded-xl border border-border bg-surface p-3.5 flex gap-3">
                    <Icon className="size-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-display text-sm uppercase">{i.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{i.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {reports.length > 1 && (
          <section className="space-y-2 mt-6">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Histórico</h2>
            {reports.slice(1).map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-surface p-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">{r.date}</p>
                  <span className="font-display text-lg">{r.weeklyGrade}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{r.recommendation}</p>
              </div>
            ))}
          </section>
        )}

        {!latest && !loading && (
          <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
            <Brain className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Nenhuma análise ainda.</p>
            <p className="text-xs text-muted-foreground/70">Toque em "Gerar nova análise" para receber seus insights.</p>
          </div>
        )}
      </main>
    </div>
  );
}
