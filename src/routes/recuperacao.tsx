import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { computeRecovery, EXTRA_ACTIVITY_TYPES } from "@/lib/hybrid";
import { Activity, Droplets, Moon, Beef, Sparkles, Plus } from "lucide-react";

export const Route = createFileRoute("/recuperacao")({
  head: () => ({ meta: [{ title: "Recuperação — Hybrid Trainer" }] }),
  component: RecoveryPage,
});

function RecoveryPage() {
  const state = useStore();
  const r = useMemo(() => computeRecovery(state), [state]);
  const profile = state.profile;
  const sleep = 8;
  const protein = profile ? Math.round(profile.weight * 1.6) : 120;
  const water = profile ? (profile.weight * 0.035).toFixed(1) : "3.0";

  const recentExtras = useMemo(
    () => [...state.extraActivities].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3),
    [state.extraActivities],
  );

  return (
    <div className="pb-32 px-5 pt-10">
      <header className="animate-reveal">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Status do corpo</p>
        <h1 className="font-display text-4xl uppercase leading-none">Recuperação</h1>
        <p className="mt-2 text-sm text-muted-foreground">Calculada a partir de treinos, atividades extras e check-ins.</p>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3 animate-reveal">
        <RingCard label="Muscular" value={r.muscular} />
        <RingCard label="Cardio" value={r.cardio} />
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3 animate-reveal [animation-delay:80ms]">
        <StatusCard icon={Activity} label="Fadiga" value={r.fatigue}
          tone={r.fatigue === "Baixa" ? "good" : r.fatigue === "Moderada" ? "warn" : "bad"} />
        <StatusCard icon={Sparkles} label="Prontidão" value={r.readiness}
          tone={r.readiness === "Alta" ? "good" : r.readiness === "Média" ? "warn" : "bad"} />
      </section>

      <section className="mt-6 animate-reveal [animation-delay:160ms]">
        <h2 className="mb-2 font-display text-lg uppercase">Recomendações da IA</h2>
        <ul className="space-y-2">
          {r.recommendations.map((rec, i) => (
            <li key={i} className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm">
              <span className="mr-2 text-primary">→</span>{rec}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 animate-reveal [animation-delay:240ms]">
        <h2 className="mb-2 font-display text-lg uppercase">Metas diárias</h2>
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-border">
          <DailyMeta icon={Moon} label="Sono" value={`${sleep}h`} />
          <DailyMeta icon={Beef} label="Proteína" value={`${protein}g`} />
          <DailyMeta icon={Droplets} label="Água" value={`${water}L`} />
        </div>
      </section>

      <section className="mt-6 animate-reveal [animation-delay:320ms]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg uppercase">Atividades extras</h2>
          <Link to="/atividade" className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-primary ring-1 ring-primary/20">
            <Plus className="size-3" /> Registrar
          </Link>
        </div>
        {recentExtras.length === 0 ? (
          <p className="mt-2 rounded-xl border border-border bg-surface p-4 text-xs text-muted-foreground">Nenhuma atividade registrada ainda. Joguei bola hoje? Toque em registrar.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {recentExtras.map((a) => {
              const meta = EXTRA_ACTIVITY_TYPES.find((t) => t.name === a.type);
              return (
                <li key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{meta?.icon ?? "✨"}</span>
                    <div>
                      <p className="text-sm font-bold uppercase">{a.type}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{a.date} • {a.durationMin}min • {a.intensity}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function RingCard({ label, value }: { label: string; value: number }) {
  const color = value > 75 ? "oklch(0.78 0.19 142)" : value > 55 ? "oklch(0.78 0.16 80)" : "oklch(0.68 0.20 25)";
  const circ = 2 * Math.PI * 36;
  const dash = (value / 100) * circ;
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="font-mono text-[10px] uppercase text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-center gap-3">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`} transform="rotate(-90 40 40)" />
        </svg>
        <div>
          <p className="font-display text-3xl" style={{ color }}>{value}%</p>
          <p className="font-mono text-[9px] uppercase text-muted-foreground">{value > 75 ? "Pronto" : value > 55 ? "Parcial" : "Recupere"}</p>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, label, value, tone }: { icon: React.ElementType; label: string; value: string; tone: "good" | "warn" | "bad" }) {
  const cls = tone === "good" ? "border-primary/30 bg-primary/5 text-primary" : tone === "warn" ? "border-warning/30 bg-warning/5 text-warning" : "border-red-500/30 bg-red-500/5 text-red-400";
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase opacity-80">
        <Icon className="size-3" /> {label}
      </div>
      <p className="mt-1 font-display text-2xl uppercase">{value}</p>
    </div>
  );
}

function DailyMeta({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-surface p-3">
      <div className="flex items-center gap-1 font-mono text-[9px] uppercase text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      <p className="mt-1 font-display text-xl">{value}</p>
    </div>
  );
}
