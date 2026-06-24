import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Brain, FilePlus2, FileText, ImageIcon, Sheet, Trash2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/treinos/")({
  head: () => ({
    meta: [
      { title: "Treinos — Hybrid Trainer" },
      { name: "description", content: "Importe ou crie seus treinos com análise por IA." },
    ],
  }),
  component: TreinosPage,
});

function TreinosPage() {
  const imported = useStore((s) => s.importedWorkouts);
  const remove = useStore((s) => s.removeImportedWorkout);

  return (
    <div className="pb-32">
      <header className="px-5 pt-10 pb-5 animate-reveal">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Biblioteca</p>
        <h1 className="font-display text-4xl uppercase leading-none tracking-tight">Meus Treinos</h1>
        <p className="mt-2 text-sm text-muted-foreground">Importe sua ficha por PDF, imagem ou Excel — a IA entende tudo.</p>
      </header>

      <section className="px-5 space-y-3 animate-reveal [animation-delay:60ms]">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Adicionar treino</h2>
        <div className="grid grid-cols-2 gap-2">
          <AddCard to="/treinos/importar" params={{ kind: "pdf" }} icon={FileText} label="PDF" hint="Ficha em PDF" />
          <AddCard to="/treinos/importar" params={{ kind: "image" }} icon={ImageIcon} label="Imagem" hint="Foto da ficha" />
          <AddCard to="/treinos/importar" params={{ kind: "excel" }} icon={Sheet} label="Excel" hint="Planilha .xlsx" />
          <AddCard to="/treinos/importar" params={{ kind: "manual" }} icon={FilePlus2} label="Do zero" hint="Criar manual" />
        </div>
      </section>

      <section className="px-5 mt-8 animate-reveal [animation-delay:120ms]">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Meus treinos importados</h2>
        {imported.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center">
            <Brain className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Nenhum treino importado ainda.</p>
            <p className="text-xs text-muted-foreground/70">Importe para a IA analisar e adaptar.</p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {imported.map((w) => (
              <li key={w.id} className="rounded-xl border border-border bg-surface p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold uppercase">{w.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{w.split} • {w.days.length} treinos • {w.weeklyVolume.totalSets} séries/sem</p>
                    {w.mode && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase text-primary ring-1 ring-primary/20">
                        <Sparkles className="size-3" /> {w.mode}
                      </span>
                    )}
                  </div>
                  <button onClick={() => remove(w.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-4" />
                  </button>
                </div>
                {w.summary && <p className="mt-2 text-xs text-muted-foreground">{w.summary}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function AddCard({ to, params, icon: Icon, label, hint }: { to: string; params: { kind: string }; icon: React.ElementType; label: string; hint: string }) {
  return (
    <Link to={to} search={params as any} className="flex flex-col items-start gap-2 rounded-xl border border-border bg-surface p-4 transition active:scale-[0.98]">
      <Icon className="size-5 text-primary" />
      <div>
        <p className="font-display text-sm uppercase tracking-wide">{label}</p>
        <p className="font-mono text-[10px] text-muted-foreground">{hint}</p>
      </div>
    </Link>
  );
}
