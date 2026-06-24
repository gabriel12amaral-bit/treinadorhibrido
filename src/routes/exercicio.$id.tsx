import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { getExercise, getLastLog, suggestNextLoad, findAlternatives, today, type CheckInMood } from "@/lib/hybrid";
import { ChevronLeft, CheckCircle2, Plus, Minus, Timer, Sparkles, Shuffle } from "lucide-react";

export const Route = createFileRoute("/exercicio/$id")({
  head: () => ({ meta: [{ title: "Exercício — Hybrid Trainer" }] }),
  component: ExercisePage,
});

function parseRestSec(rest: string | undefined): number {
  if (!rest) return 60;
  const m = rest.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 60;
}

function ExercisePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const exercise = getExercise(id);
  const { plan, logs, profile, logSet, completeDay, addCheckIn } = useStore();
  const [showCheckIn, setShowCheckIn] = useState(false);

  const day = useMemo(() => plan.find((d) => d.date === today()) ?? plan[0], [plan]);
  const slot = day?.strength.find((s) => s.exerciseId === id);
  const sets = slot?.sets ?? exercise?.defaultSets ?? 4;
  const reps = slot?.reps ?? exercise?.defaultReps ?? "8-10";
  const restSec = parseRestSec(slot?.rest);

  const todayLog = logs[today()]?.[id] ?? [];
  const last = useMemo(() => getLastLog(logs, id), [logs, id]);
  const suggestion = useMemo(() => suggestNextLoad(id, last?.sets, reps), [id, last, reps]);
  const alternatives = useMemo(() => findAlternatives(id, { level: profile?.strengthLevel }), [id, profile]);

  const [active, setActive] = useState(0);
  const [weight, setWeight] = useState<number>(suggestion?.suggested ?? last?.sets[0]?.weight ?? 0);
  const [r, setR] = useState<number>(last?.sets[0]?.reps ?? 10);

  // Rest timer
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  if (!exercise) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Exercício não encontrado.</div>;
  }

  const saveSet = (idx: number) => {
    logSet(today(), id, idx, weight, r);
    setTimeLeft(restSec);
    const nextIdx = idx + 1;
    if (nextIdx < sets) {
      setActive(nextIdx);
      const prev = last?.sets[nextIdx];
      if (prev) { setWeight(prev.weight); setR(prev.reps); }
    }
  };

  const allDone = todayLog.length >= sets && todayLog.slice(0, sets).every(Boolean);
  const exIdx = day?.strength.findIndex((s) => s.exerciseId === id) ?? 0;
  const nextExercise = day?.strength[exIdx + 1];

  const finishWorkout = () => setShowCheckIn(true);
  const submitCheckIn = (mood: CheckInMood) => {
    addCheckIn(mood);
    if (day) completeDay(day.date);
    navigate({ to: "/" });
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="pb-32">
      <header className="px-5 pt-8 pb-4 animate-reveal">
        <button onClick={() => navigate({ to: "/" })} className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
          <ChevronLeft className="size-4" /> Voltar
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{exercise.group} • {exercise.equipment}</p>
        <h1 className="mt-1 font-display text-4xl uppercase leading-none">{exercise.name}</h1>
        {exercise.pattern && <p className="mt-2 font-mono text-[10px] uppercase text-muted-foreground">Padrão: {exercise.pattern.replace(/-/g, " ")} • {exercise.type}</p>}
      </header>

      <div className="px-5">
        <div className="grid h-44 place-items-center rounded-2xl border border-border bg-gradient-to-br from-surface to-black/40 text-7xl">
          {exercise.image}
        </div>
      </div>

      <main className="mt-6 px-5 space-y-6">
        <section className="grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-border">
          <Stat label="Séries" value={String(sets)} />
          <Stat label="Reps" value={reps} />
          <Stat label="Descanso" value={`${restSec}s`} />
        </section>

        {suggestion && last && (
          <section className="rounded-xl border border-primary/30 bg-primary/10 p-4">
            <p className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-primary">
              <Sparkles className="size-3" /> Sugestão IA
            </p>
            <p className="mt-1 font-display text-lg">{suggestion.suggested}kg <span className="text-sm text-muted-foreground">({suggestion.delta > 0 ? "+" : ""}{suggestion.delta}kg)</span></p>
            <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
          </section>
        )}

        {timeLeft > 0 && (
          <section className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-center">
            <p className="flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-widest text-warning"><Timer className="size-3" /> Descanso</p>
            <p className="mt-1 font-display text-4xl text-warning">{mins}:{secs.toString().padStart(2, "0")}</p>
            <button onClick={() => setTimeLeft(0)} className="mt-2 text-xs text-muted-foreground underline">Pular</button>
          </section>
        )}

        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            <h3 className="font-display text-lg uppercase">Registro</h3>
          </div>
          <div className="space-y-2">
            {Array.from({ length: sets }).map((_, i) => {
              const entry = todayLog[i];
              const isActive = i === active && !entry;
              return (
                <div key={i} className={`rounded-lg border p-3 transition ${entry ? "border-primary/30 bg-primary/5" : isActive ? "border-primary/40 bg-primary/10 ring-1 ring-primary/30" : "border-border bg-surface"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`grid size-8 place-items-center rounded font-mono text-sm font-bold ${entry ? "bg-primary text-primary-foreground" : isActive ? "bg-primary/20 text-primary" : "bg-black/40 text-muted-foreground"}`}>
                        {entry ? <CheckCircle2 className="size-4" /> : i + 1}
                      </span>
                      {entry ? (
                        <p className="font-mono text-sm">{entry.weight}kg × {entry.reps}</p>
                      ) : isActive ? (
                        <div className="flex items-center gap-2">
                          <Stepper label="kg" value={weight} onChange={setWeight} step={2.5} />
                          <Stepper label="reps" value={r} onChange={setR} step={1} />
                        </div>
                      ) : (
                        <p className="font-mono text-xs text-muted-foreground">Aguardando…</p>
                      )}
                    </div>
                    {isActive && (
                      <button onClick={() => saveSet(i)} className="rounded-lg bg-primary px-3 py-1.5 font-display text-xs uppercase tracking-wider text-primary-foreground">Salvar</button>
                    )}
                    {!entry && !isActive && last?.sets[i] && (
                      <span className="font-mono text-[10px] text-muted-foreground">{last.sets[i].weight}kg × {last.sets[i].reps}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {last && (
          <section className="rounded-xl border border-white/5 bg-black/30 p-4">
            <p className="font-mono text-[10px] uppercase text-muted-foreground">Última sessão • {last.date}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
              {last.sets.map((s, i) => s && (
                <span key={i}>S{i + 1}: <span className="text-foreground">{s.weight}kg × {s.reps}</span></span>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <Card title="Como executar">
            <p className="text-sm text-muted-foreground">{exercise.description}</p>
            <ul className="mt-2 space-y-1">{exercise.cues.map((c) => <li key={c} className="text-sm">• {c}</li>)}</ul>
          </Card>
          {exercise.safety?.length ? (
            <Card title="Segurança">
              <ul className="space-y-1">{exercise.safety.map((c) => <li key={c} className="text-sm">🛡 {c}</li>)}</ul>
            </Card>
          ) : null}
          <Card title="Erros comuns" tone="warning">
            <ul className="space-y-1">{exercise.mistakes.map((c) => <li key={c} className="text-sm">⚠ {c}</li>)}</ul>
          </Card>
          {alternatives.length > 0 && (
            <Card title="Alternativas (mesmo padrão)">
              <div className="-mx-1 mt-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {alternatives.map((alt) => (
                  <Link key={alt.id} to="/exercicio/$id" params={{ id: alt.id }}
                    className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-black/30 px-2.5 py-2">
                    <span className="text-xl">{alt.image}</span>
                    <div>
                      <p className="text-xs font-bold uppercase">{alt.name}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">{alt.equipment}</p>
                    </div>
                    <Shuffle className="size-3 text-primary" />
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </section>

        {allDone && (
          nextExercise ? (
            <Link to="/exercicio/$id" params={{ id: nextExercise.exerciseId }}
              className="block w-full rounded-xl bg-foreground py-4 text-center font-display text-lg uppercase tracking-widest text-background">
              Próximo: {getExercise(nextExercise.exerciseId)?.name}
            </Link>
          ) : (
            <button onClick={finishWorkout} className="w-full rounded-xl bg-primary py-4 font-display text-lg uppercase tracking-widest text-primary-foreground">
              Concluir Treino do Dia
            </button>
          )
        )}
      </main>

      {showCheckIn && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/70 backdrop-blur-sm animate-reveal">
          <div className="w-full max-w-[430px] rounded-t-3xl border-t border-border bg-background px-5 pb-8 pt-6">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/20" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Check-in pós-treino</p>
            <h3 className="mt-1 font-display text-2xl uppercase">Como você está?</h3>
            <p className="mt-1 text-sm text-muted-foreground">A IA usa isso pra calibrar volume e recuperação.</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {([
                { mood: "Excelente" as const, emoji: "😁", tone: "border-primary/40 bg-primary/10 text-primary" },
                { mood: "Bem" as const, emoji: "🙂", tone: "border-primary/20 bg-surface" },
                { mood: "Cansado" as const, emoji: "😐", tone: "border-warning/30 bg-warning/5 text-warning" },
                { mood: "Exausto" as const, emoji: "😫", tone: "border-red-500/30 bg-red-500/5 text-red-400" },
              ]).map((m) => (
                <button key={m.mood} onClick={() => submitCheckIn(m.mood)}
                  className={`flex flex-col items-center gap-1 rounded-xl border py-4 transition active:scale-[0.97] ${m.tone}`}>
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="font-display text-sm uppercase">{m.mood}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface p-3">
      <p className="font-mono text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="font-display text-xl">{value}</p>
    </div>
  );
}

function Stepper({ label, value, onChange, step }: { label: string; value: number; onChange: (v: number) => void; step: number }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-black/40 px-1">
      <button onClick={() => onChange(Math.max(0, value - step))} className="grid size-7 place-items-center text-muted-foreground"><Minus className="size-3" /></button>
      <div className="min-w-12 text-center font-mono font-bold">{value}<span className="ml-1 text-[9px] text-muted-foreground">{label}</span></div>
      <button onClick={() => onChange(value + step)} className="grid size-7 place-items-center text-primary"><Plus className="size-3" /></button>
    </div>
  );
}

function Card({ title, children, tone }: { title: string; children: React.ReactNode; tone?: "warning" }) {
  return (
    <div className={`rounded-xl border p-4 ${tone === "warning" ? "border-warning/30 bg-warning/5" : "border-border bg-surface"}`}>
      <p className={`mb-2 font-mono text-[10px] uppercase tracking-widest ${tone === "warning" ? "text-warning" : "text-muted-foreground"}`}>{title}</p>
      {children}
    </div>
  );
}
