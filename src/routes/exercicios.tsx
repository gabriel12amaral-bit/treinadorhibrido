import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EXERCISES, type MuscleGroup } from "@/lib/hybrid";
import { Search } from "lucide-react";

export const Route = createFileRoute("/exercicios")({
  head: () => ({ meta: [{ title: "Exercícios — Hybrid Trainer" }] }),
  component: ExercisesPage,
});

const GROUPS: ("Todos" | MuscleGroup)[] = ["Todos", "Peito", "Costas", "Ombros", "Bíceps", "Tríceps", "Quadríceps", "Posterior", "Glúteos", "Panturrilhas", "Abdômen", "Antebraço", "Cardio"];

function ExercisesPage() {
  const [q, setQ] = useState("");
  const [g, setG] = useState<"Todos" | MuscleGroup>("Todos");

  const list = useMemo(
    () => EXERCISES.filter((e) => (g === "Todos" || e.group === g) && e.name.toLowerCase().includes(q.toLowerCase())),
    [q, g]
  );

  return (
    <div className="pb-32 px-5 pt-10">
      <header className="animate-reveal">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Banco de Exercícios</p>
        <h1 className="font-display text-4xl uppercase leading-none">Treinos</h1>
      </header>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar exercício…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>

      <div className="mt-4 -mx-5 overflow-x-auto px-5">
        <div className="flex gap-2 pb-2">
          {GROUPS.map((grp) => (
            <button key={grp} onClick={() => setG(grp)}
              className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest ${g === grp ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground"}`}>
              {grp}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-4 space-y-2 animate-reveal">
        {list.map((e) => (
          <li key={e.id}>
            <Link to="/exercicio/$id" params={{ id: e.id }} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 active:scale-[0.99]">
              <div className="grid size-14 place-items-center rounded-lg bg-black/40 text-3xl ring-1 ring-white/5">{e.image}</div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-bold uppercase">{e.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{e.group} • {e.equipment}</p>
              </div>
              <span className="rounded bg-white/5 px-2 py-1 font-mono text-[9px] uppercase text-muted-foreground">{e.difficulty}</span>
            </Link>
          </li>
        ))}
        {!list.length && <p className="py-10 text-center text-sm text-muted-foreground">Nenhum exercício encontrado.</p>}
      </ul>
    </div>
  );
}
