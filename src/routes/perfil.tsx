import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { ACHIEVEMENTS } from "@/lib/hybrid";
import { Award, Flame, LogOut, Settings, Sparkles, Target } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Hybrid Trainer" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { profile, streak, completedDates, achievements, reset } = useStore();
  const state = useStore();

  if (!profile) return null;
  const unlocked = new Set(achievements);

  return (
    <div className="pb-32 px-5 pt-10">
      <header className="animate-reveal">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Atleta</p>
        <h1 className="font-display text-4xl uppercase leading-none">{profile.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{profile.goal} • {profile.location}</p>
      </header>

      <section className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-border animate-reveal">
        <Tile icon={Flame} value={`${streak}d`} label="Sequência" accent />
        <Tile icon={Target} value={`${completedDates.length}`} label="Sessões" />
        <Tile icon={Sparkles} value={`${profile.daysPerWeek}x`} label="Por semana" />
      </section>

      <section className="mt-6 rounded-xl border border-border bg-surface p-4 animate-reveal [animation-delay:80ms]">
        <p className="font-mono text-[10px] uppercase text-muted-foreground">Dados</p>
        <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
          <Row k="Idade" v={`${profile.age} anos`} />
          <Row k="Sexo" v={profile.sex} />
          <Row k="Altura" v={`${profile.height} cm`} />
          <Row k="Peso" v={`${profile.weight} kg`} />
          <Row k="Musculação" v={profile.strengthLevel} />
          <Row k="Corrida" v={profile.runLevel} />
        </div>
      </section>

      <section className="mt-6 animate-reveal [animation-delay:160ms]">
        <h2 className="mb-3 flex items-center gap-2 font-display text-xl uppercase"><Award className="size-5 text-primary" /> Conquistas</h2>
        <div className="grid grid-cols-3 gap-2">
          {ACHIEVEMENTS.map((a) => {
            const ok = unlocked.has(a.id) || a.check(state);
            return (
              <div key={a.id} className={`rounded-xl border p-3 text-center ${ok ? "border-primary/40 bg-primary/10" : "border-border bg-surface/50 opacity-50"}`}>
                <p className="text-2xl">{ok ? "🏆" : "🔒"}</p>
                <p className={`mt-1 font-mono text-[9px] uppercase leading-tight ${ok ? "text-primary" : "text-muted-foreground"}`}>{a.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 space-y-2 animate-reveal [animation-delay:240ms]">
        <button onClick={() => navigate({ to: "/onboarding" })} className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-4 text-sm">
          <Settings className="size-4 text-muted-foreground" /> Refazer cadastro / ajustar plano
        </button>
        <button onClick={() => { reset(); navigate({ to: "/onboarding" }); }} className="flex w-full items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <LogOut className="size-4" /> Resetar todos os dados
        </button>
      </section>

      <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Hybrid Trainer v1.0</p>
    </div>
  );
}

function Tile({ icon: Icon, value, label, accent }: { icon: React.ElementType; value: string; label: string; accent?: boolean }) {
  return (
    <div className="bg-surface p-3 text-center">
      <Icon className={`mx-auto size-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      <p className={`mt-1 font-display text-2xl ${accent ? "text-primary" : ""}`}>{value}</p>
      <p className="font-mono text-[9px] uppercase text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase text-muted-foreground">{k}</p>
      <p className="font-medium">{v}</p>
    </div>
  );
}
