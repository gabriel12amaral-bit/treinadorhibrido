import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { EXTRA_ACTIVITY_TYPES, INTENSITIES, today, type Intensity } from "@/lib/hybrid";
import { ChevronLeft, Check } from "lucide-react";

export const Route = createFileRoute("/atividade")({
  head: () => ({ meta: [{ title: "Registrar Atividade — Hybrid Trainer" }] }),
  component: ActivityPage,
});

function ActivityPage() {
  const navigate = useNavigate();
  const { addActivity, extraActivities, removeActivity } = useStore();
  const [type, setType] = useState<string>("Futebol");
  const [duration, setDuration] = useState<number>(60);
  const [intensity, setIntensity] = useState<Intensity>("Forte");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<string>(today());

  const save = () => {
    addActivity({ date, type, durationMin: duration, intensity, notes: notes || undefined });
    navigate({ to: "/" });
  };

  const recent = [...extraActivities].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="pb-32">
      <header className="px-5 pt-8 pb-2 animate-reveal">
        <button onClick={() => navigate({ to: "/" })} className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
          <ChevronLeft className="size-4" /> Voltar
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Fora do plano</p>
        <h1 className="font-display text-4xl uppercase leading-none">Registrar Atividade</h1>
        <p className="mt-2 text-sm text-muted-foreground">A IA usa isso pra ajustar recuperação e próximos treinos.</p>
      </header>

      <main className="px-5 mt-6 space-y-6">
        <section>
          <Label>Tipo</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {EXTRA_ACTIVITY_TYPES.map((t) => (
              <button key={t.name} onClick={() => setType(t.name)}
                className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition ${type === t.name ? "border-primary bg-primary/10" : "border-border bg-surface"}`}>
                <span className="text-2xl">{t.icon}</span>
                <span className={`text-[11px] font-bold uppercase ${type === t.name ? "text-primary" : ""}`}>{t.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <Label>Duração: <span className="text-foreground">{duration} min</span></Label>
          <input type="range" min={15} max={240} step={5} value={duration} onChange={(e) => setDuration(+e.target.value)}
            className="mt-2 w-full accent-[oklch(0.78_0.19_142)]" />
          <div className="mt-1 flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>15</span><span>60</span><span>120</span><span>240</span>
          </div>
        </section>

        <section>
          <Label>Intensidade</Label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {INTENSITIES.map((i) => (
              <button key={i.value} onClick={() => setIntensity(i.value)}
                className={`rounded-lg border py-2 text-xs font-bold uppercase transition ${intensity === i.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground"}`}>
                {i.value}
              </button>
            ))}
          </div>
        </section>

        <section>
          <Label>Data</Label>
          <input type="date" value={date} max={today()} onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-3 text-sm" />
        </section>

        <section>
          <Label>Observações (opcional)</Label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex: pelada intensa, joelho doeu no final…"
            className="mt-2 min-h-20 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
        </section>

        <button onClick={save}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-display text-lg uppercase tracking-widest text-primary-foreground active:scale-[0.98]">
          <Check className="size-5" /> Registrar Atividade
        </button>

        {recent.length > 0 && (
          <section>
            <Label>Últimas atividades</Label>
            <ul className="mt-2 space-y-2">
              {recent.map((a) => {
                const meta = EXTRA_ACTIVITY_TYPES.find((t) => t.name === a.type);
                return (
                  <li key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{meta?.icon ?? "✨"}</span>
                      <div>
                        <p className="text-sm font-bold uppercase">{a.type}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{a.date} • {a.durationMin}min • {a.intensity}</p>
                      </div>
                    </div>
                    <button onClick={() => removeActivity(a.id)} className="font-mono text-[10px] uppercase text-muted-foreground hover:text-warning">Remover</button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{children}</span>;
}
