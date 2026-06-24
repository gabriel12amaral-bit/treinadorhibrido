import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useStore } from "@/lib/store";
import { getExercise, today, computeRecovery, performanceIndex, daysUntil } from "@/lib/hybrid";
import { Flame, Play, Timer, TrendingUp, Footprints, CheckCircle2, Plus, HeartPulse, Brain, Activity, Target } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hoje — Hybrid Trainer" },
      { name: "description", content: "Seu treino híbrido do dia." },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const navigate = useNavigate();
  const state = useStore();
  const { hydrated, onboarded, plan, profile, streak, completedDates } = state;

  useEffect(() => {
    if (hydrated && !onboarded) navigate({ to: "/onboarding" });
  }, [hydrated, onboarded, navigate]);

  const day = useMemo(() => plan.find((d) => d.date === today()) ?? plan[0], [plan]);
  const recovery = useMemo(() => (hydrated ? computeRecovery(state) : null), [state, hydrated]);
  const ip = useMemo(() => (hydrated ? performanceIndex(state) : null), [state, hydrated]);
  const nextEvent = useMemo(() => state.eventGoals.filter((g) => daysUntil(g.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0], [state.eventGoals]);
  const completed = day && completedDates.includes(day.date);

  if (!hydrated || !onboarded || !day) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Carregando…</div>;
  }

  return (
    <div className="pb-32">
      <header className="px-5 pt-10 pb-5 animate-reveal">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{day.weekday}, {formatPt(day.date)}</p>
        <div className="mt-1 flex items-end justify-between gap-4">
          <h1 className="font-display text-4xl uppercase leading-none tracking-tight">{day.rest ? "Recuperação" : day.title}</h1>
          <StreakChip value={streak} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Olá, <span className="text-foreground">{profile?.name}</span> — {day.focus}.</p>
      </header>

      {/* Recovery widget */}
      {recovery && (
        <Link to="/recuperacao" className="mx-5 mb-4 flex items-center justify-between rounded-xl border border-border bg-surface p-3 animate-reveal [animation-delay:40ms]">
          <div className="flex items-center gap-3">
            <HeartPulse className="size-5 text-primary" />
            <div>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Prontidão</p>
              <p className="font-display text-base uppercase">{recovery.readiness} • Fadiga {recovery.fatigue}</p>
            </div>
          </div>
          <div className="flex gap-3 font-mono text-[10px]">
            <div className="text-right"><p className="text-muted-foreground">MUS</p><p className="text-primary">{recovery.muscular}%</p></div>
            <div className="text-right"><p className="text-muted-foreground">CAR</p><p className="text-cardio">{recovery.cardio}%</p></div>
          </div>
        </Link>
      )}

      {/* IP + Objetivos */}
      <div className="mx-5 mb-4 grid grid-cols-2 gap-2 animate-reveal [animation-delay:45ms]">
        <Link to="/desempenho" className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-3">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <p className="font-mono text-[9px] uppercase text-primary">IP</p>
          </div>
          <p className="mt-1 font-display text-2xl leading-none">{ip?.score ?? "—"}<span className="ml-1 text-sm text-primary">{ip?.grade ?? ""}</span></p>
          <p className="font-mono text-[9px] uppercase text-muted-foreground">{ip?.trend ?? ""}</p>
        </Link>
        <Link to="/objetivos" className={`rounded-xl border p-3 ${nextEvent ? "border-warning/40 bg-warning/5" : "border-border bg-surface"}`}>
          <div className="flex items-center gap-2">
            <Target className={`size-4 ${nextEvent ? "text-warning" : "text-muted-foreground"}`} />
            <p className="font-mono text-[9px] uppercase text-muted-foreground">Objetivo</p>
          </div>
          {nextEvent ? (
            <>
              <p className="mt-1 font-display text-2xl leading-none text-warning">D-{daysUntil(nextEvent.date)}</p>
              <p className="font-mono text-[9px] uppercase text-muted-foreground truncate">{nextEvent.title}</p>
            </>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">Definir evento</p>
          )}
        </Link>
      </div>

      {/* AI Insights quick access */}
      <Link to="/insights" className="mx-5 mb-4 flex items-center justify-between rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-transparent p-3 animate-reveal [animation-delay:50ms]">
        <div className="flex items-center gap-3">
          <Brain className="size-5 text-primary" />
          <div>
            <p className="font-mono text-[10px] uppercase text-primary">Análises IA</p>
            <p className="font-display text-base uppercase">Ver insights da semana</p>
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase text-muted-foreground">→</span>
      </Link>

      {day.rest ? (
        <RestCard />
      ) : (
        <main className="px-5 space-y-6">
          <section className="grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-border animate-reveal [animation-delay:80ms]">
            <Stat icon={Timer} label="Duração" value={`${day.estimatedMin}min`} />
            <Stat icon={TrendingUp} label="Foco" value={day.focus.split(" ")[0]} />
            <Stat icon={Flame} label="Status" value={completed ? "Feito" : "Pronto"} accent={completed ? "primary" : undefined} />
          </section>

          {day.strength.length > 0 && (
            <section className="space-y-3 animate-reveal [animation-delay:160ms]">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl uppercase tracking-wide">Musculação</h2>
                <span className="font-mono text-xs text-muted-foreground">{day.strength.length} exercícios</span>
              </div>
              <ul className="space-y-2.5">
                {day.strength.map((s, i) => {
                  const ex = getExercise(s.exerciseId);
                  if (!ex) return null;
                  return (
                    <li key={s.exerciseId}>
                      <Link
                        to="/exercicio/$id"
                        params={{ id: s.exerciseId }}
                        className="flex items-center justify-between rounded-xl border border-border bg-surface p-3.5 transition active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="grid size-12 place-items-center rounded-lg bg-black/40 text-2xl ring-1 ring-white/5">{ex.image}</div>
                          <div>
                            <p className="text-sm font-bold uppercase">{ex.name}</p>
                            <p className="font-mono text-[11px] text-muted-foreground">{s.sets} séries • {s.reps} reps • {s.rest}</p>
                          </div>
                        </div>
                        <span className="rounded bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold uppercase text-primary ring-1 ring-primary/20">{ex.group.slice(0, 5)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {day.cardio && (
            <section className="rounded-r-xl border-l-4 border-cardio bg-surface p-4 animate-reveal [animation-delay:240ms]">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h2 className="font-display text-xl uppercase tracking-wide text-cardio flex items-center gap-2"><Footprints className="size-5" />Corrida</h2>
                  <p className="text-xs text-muted-foreground">{day.cardio.details}</p>
                </div>
                <span className="rounded bg-cardio/20 px-2 py-1 font-mono text-[10px] font-bold uppercase text-cardio">{day.cardio.type.split(" ")[1] ?? day.cardio.type}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <MiniStat label="Duração" value={`${day.cardio.duration}'`} />
                <MiniStat label="Pace" value={day.cardio.pace ?? "—"} highlight />
                <MiniStat label="Distância" value={day.cardio.distance ? `${day.cardio.distance}km` : "—"} />
              </div>
            </section>
          )}

          {day.sport && (
            <section className="rounded-xl border border-warning/40 bg-warning/5 p-4 animate-reveal [animation-delay:300ms]">
              <h2 className="font-display text-lg uppercase tracking-wide text-warning">⚽ {day.sport.sport}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{day.sport.duration} min — {day.sport.details}</p>
            </section>
          )}

          <div className="grid grid-cols-[1fr_auto] gap-2">
            <button
              onClick={() => navigate({ to: "/exercicio/$id", params: { id: day.strength[0]?.exerciseId ?? "supino-reto" } })}
              disabled={completed}
              className="flex items-center justify-center gap-2 rounded-xl bg-foreground py-4 font-display text-xl uppercase tracking-widest text-background transition active:scale-[0.98] disabled:opacity-50"
            >
              {completed ? <><CheckCircle2 className="size-5" /> Concluído</> : <><Play className="size-5 fill-background" /> Iniciar</>}
            </button>
            <Link to="/atividade" className="grid place-items-center rounded-xl border border-border bg-surface px-4 active:scale-[0.98]" aria-label="Registrar atividade">
              <Plus className="size-5 text-primary" />
            </Link>
          </div>
        </main>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: "primary" }) {
  return (
    <div className="bg-surface p-3">
      <div className="mb-1 flex items-center gap-1.5 font-mono text-[9px] uppercase text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      <p className={`font-mono text-base font-bold ${accent === "primary" ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}

function MiniStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded bg-black/30 p-2">
      <p className="font-mono text-[9px] uppercase text-muted-foreground">{label}</p>
      <p className={`font-mono text-sm font-bold ${highlight ? "text-cardio" : ""}`}>{value}</p>
    </div>
  );
}

function StreakChip({ value }: { value: number }) {
  return (
    <div className="flex flex-col items-end gap-1.5 shrink-0">
      <span className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 font-mono text-[11px]">
        <Flame className="size-3 text-primary" /> {value}d
      </span>
    </div>
  );
}

function RestCard() {
  return (
    <main className="px-5">
      <div className="rounded-xl border border-border bg-surface p-6 text-center animate-reveal">
        <p className="text-5xl">🌙</p>
        <h2 className="mt-3 font-display text-2xl uppercase">Dia de Recuperação</h2>
        <p className="mt-2 text-sm text-muted-foreground">A recuperação faz parte do plano. Hidrate-se, durma 8h e volte mais forte.</p>
      </div>
    </main>
  );
}

function formatPt(iso: string) {
  const [, m, d] = iso.split("-");
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]}`;
}
