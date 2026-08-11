import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import * as XLSX from "xlsx";
import { useStore } from "@/lib/store";
import { parseWorkoutImport, analyzeWorkoutMode } from "@/lib/ai-workouts.functions";
import { getClientAIErrorMessage } from "@/lib/ai-client-errors";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  Edit2,
  FileText,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({ kind: z.enum(["pdf", "image", "excel", "manual"]).default("pdf") });

export const Route = createFileRoute("/treinos/importar")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Importar Treino — Hybrid Trainer" }] }),
  component: ImportarPage,
});

type Workout = {
  name: string;
  frequency: string;
  split: string;
  days: {
    name: string;
    weekday?: "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";
    exercises: { name: string; sets: number; reps: string; notes?: string }[];
  }[];
  weeklyVolume: { totalSets: number; byMuscle: { muscle: string; sets: number }[] };
  hasStrength: boolean;
  hasCardio: boolean;
};

function ImportarPage() {
  const { kind } = Route.useSearch();
  const navigate = useNavigate();
  const profile = useStore((s) => s.profile);
  const addImported = useStore((s) => s.addImportedWorkout);
  const updateImported = useStore((s) => s.updateImportedWorkout);
  const applyImportedToPlan = useStore((s) => s.applyImportedWorkoutToPlan);

  const [step, setStep] = useState<
    "upload" | "analyzing" | "review" | "mode" | "modeLoading" | "done"
  >("upload");
  const [error, setError] = useState<string | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [editing, setEditing] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{
    summary: string;
    suggestions: { type: string; title: string; detail: string }[];
  } | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setStep("analyzing");
    try {
      let result: Workout;
      if (kind === "excel") {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const text = wb.SheetNames.map(
          (sn) => `=== ${sn} ===\n${XLSX.utils.sheet_to_csv(wb.Sheets[sn])}`,
        ).join("\n\n");
        result = (await parseWorkoutImport({ data: { kind: "text", payload: text } })) as Workout;
      } else if (kind === "image") {
        const b64 = await toBase64(file);
        result = (await parseWorkoutImport({
          data: { kind: "image", payload: b64, mime: file.type },
        })) as Workout;
      } else {
        const b64 = await toBase64(file);
        result = (await parseWorkoutImport({
          data: { kind: "pdf", payload: b64, mime: file.type, filename: file.name },
        })) as Workout;
      }
      setWorkout(result);
      setStep("review");
    } catch (e: any) {
      console.error(e);
      setError(getClientAIErrorMessage(e, "Falha ao analisar o arquivo."));
      setStep("upload");
    }
  }

  function confirmAndSave() {
    if (!workout) return;
    const source = kind === "manual" ? "manual" : kind;
    const id = addImported({ source: source as any, ...workout });
    applyImportedToPlan(id);
    setSavedId(id);
    setStep("mode");
  }

  async function applyMode(mode: "manter" | "complementar" | "otimizar") {
    if (!workout || !savedId) return;
    setStep("modeLoading");
    try {
      const res = await analyzeWorkoutMode({
        data: {
          workout,
          mode,
          context: {
            goal: profile?.goal || "Performance Híbrida",
            sport: profile?.sport,
            daysPerWeek: profile?.daysPerWeek || 4,
            runLevel: profile?.runLevel,
          },
        },
      });
      setSuggestion(res as any);
      updateImported(savedId, {
        mode,
        suggestions: (res as any).suggestions,
        summary: (res as any).summary,
      });
      setStep("done");
    } catch (e: any) {
      setError(getClientAIErrorMessage(e, "Falha ao gerar sugestoes."));
      setStep("mode");
    }
  }

  return (
    <div className="pb-32">
      <header className="px-5 pt-10 pb-3 animate-reveal">
        <Link
          to="/treinos"
          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
        >
          <ArrowLeft className="size-3" /> Voltar
        </Link>
        <h1 className="mt-2 font-display text-3xl uppercase leading-none tracking-tight">
          Importar Treino
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {kind === "pdf"
            ? "Envie um PDF da sua ficha"
            : kind === "image"
              ? "Foto/print da ficha"
              : kind === "excel"
                ? "Planilha .xlsx ou .xls"
                : "Crie manualmente"}
        </p>
      </header>

      <Stepper step={step} />

      {error && (
        <div className="mx-5 mb-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </div>
      )}

      <main className="px-5">
        {step === "upload" && kind !== "manual" && <UploadBox kind={kind} onFile={handleFile} />}

        {step === "upload" && kind === "manual" && (
          <ManualForm
            onCreate={(w) => {
              setWorkout(w);
              setStep("review");
            }}
          />
        )}

        {step === "analyzing" && (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <Loader2 className="mx-auto size-8 animate-spin text-primary" />
            <p className="mt-4 font-display text-lg uppercase">IA analisando…</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Identificando exercícios, séries e volume
            </p>
          </div>
        )}

        {step === "review" && workout && (
          <ReviewWorkout
            workout={workout}
            editing={editing}
            setEditing={setEditing}
            setWorkout={setWorkout}
            onConfirm={confirmAndSave}
          />
        )}

        {step === "mode" && workout && <ModeChooser onChoose={applyMode} />}

        {step === "modeLoading" && (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <Sparkles className="mx-auto size-8 animate-pulse text-primary" />
            <p className="mt-4 font-display text-lg uppercase">IA pensando no seu plano…</p>
          </div>
        )}

        {step === "done" && suggestion && (
          <DoneScreen suggestion={suggestion} onFinish={() => navigate({ to: "/treinos" })} />
        )}
      </main>
    </div>
  );
}

function Stepper({ step }: { step: string }) {
  const order = ["upload", "review", "mode", "done"];
  const current = step === "analyzing" ? 0 : step === "modeLoading" ? 2 : order.indexOf(step);
  return (
    <div className="px-5 mb-4 flex items-center gap-1">
      {["Upload", "Análise", "Modo", "Pronto"].map((label, i) => (
        <div key={label} className="flex flex-1 items-center gap-1">
          <div className={`h-1 flex-1 rounded ${i <= current ? "bg-primary" : "bg-border"}`} />
        </div>
      ))}
    </div>
  );
}

function UploadBox({ kind, onFile }: { kind: string; onFile: (f: File) => void }) {
  const accept =
    kind === "pdf" ? "application/pdf" : kind === "image" ? "image/*" : ".xlsx,.xls,.csv";
  return (
    <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-surface p-10 text-center cursor-pointer hover:border-primary transition">
      <Upload className="size-8 text-primary" />
      <div>
        <p className="font-display text-lg uppercase">Tocar para enviar</p>
        <p className="font-mono text-[11px] text-muted-foreground">{accept}</p>
      </div>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </label>
  );
}

function ReviewWorkout({
  workout,
  editing,
  setEditing,
  setWorkout,
  onConfirm,
}: {
  workout: Workout;
  editing: boolean;
  setEditing: (b: boolean) => void;
  setWorkout: (w: Workout) => void;
  onConfirm: () => void;
}) {
  return (
    <div className="space-y-4 animate-reveal">
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Detectamos
            </p>
            <h2 className="font-display text-xl uppercase">{workout.name}</h2>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="rounded border border-border bg-background px-2 py-1 font-mono text-[10px] uppercase"
          >
            <Edit2 className="inline size-3 mr-1" />
            {editing ? "Pronto" : "Editar"}
          </button>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[10px]">
          <Field label="Frequência" value={workout.frequency} />
          <Field label="Divisão" value={workout.split} />
          <Field label="Volume" value={`${workout.weeklyVolume.totalSets}s/sem`} />
        </div>
      </div>

      <div className="space-y-3">
        {workout.days.map((d, di) => (
          <div key={di} className="rounded-xl border border-border bg-surface p-3.5">
            {editing ? (
              <input
                className="w-full bg-transparent font-display text-base uppercase outline-none border-b border-border pb-1 mb-2"
                value={d.name}
                onChange={(e) => {
                  const next = structuredClone(workout);
                  next.days[di].name = e.target.value;
                  setWorkout(next);
                }}
              />
            ) : (
              <p className="font-display text-base uppercase mb-2">{d.name}</p>
            )}
            <ul className="space-y-1.5">
              {d.exercises.map((ex, ei) => (
                <li key={ei} className="flex items-center justify-between gap-2 text-xs">
                  {editing ? (
                    <>
                      <input
                        className="flex-1 bg-background rounded border border-border px-2 py-1"
                        value={ex.name}
                        onChange={(e) => {
                          const n = structuredClone(workout);
                          n.days[di].exercises[ei].name = e.target.value;
                          setWorkout(n);
                        }}
                      />
                      <input
                        className="w-12 bg-background rounded border border-border px-2 py-1 text-center"
                        type="number"
                        value={ex.sets}
                        onChange={(e) => {
                          const n = structuredClone(workout);
                          n.days[di].exercises[ei].sets = Number(e.target.value);
                          setWorkout(n);
                        }}
                      />
                      <input
                        className="w-16 bg-background rounded border border-border px-2 py-1 text-center"
                        value={ex.reps}
                        onChange={(e) => {
                          const n = structuredClone(workout);
                          n.days[di].exercises[ei].reps = e.target.value;
                          setWorkout(n);
                        }}
                      />
                      <button
                        onClick={() => {
                          const n = structuredClone(workout);
                          n.days[di].exercises.splice(ei, 1);
                          setWorkout(n);
                        }}
                        className="text-destructive"
                      >
                        <X className="size-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">{ex.name}</span>
                      <span className="font-mono text-muted-foreground">
                        {ex.sets}x{ex.reps}
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button
        onClick={onConfirm}
        className="w-full rounded-xl bg-primary py-4 font-display text-lg uppercase tracking-widest text-primary-foreground active:scale-[0.98]"
      >
        <CheckCircle2 className="inline size-5 mr-2" /> Confirmar
      </button>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-black/30 p-2">
      <p className="uppercase text-muted-foreground">{label}</p>
      <p className="font-bold text-foreground">{value}</p>
    </div>
  );
}

function ModeChooser({
  onChoose,
}: {
  onChoose: (m: "manter" | "complementar" | "otimizar") => void;
}) {
  const modes = [
    {
      id: "manter",
      title: "Manter",
      desc: "Apenas acompanhar este treino sem mudanças.",
      icon: "🛡️",
    },
    {
      id: "complementar",
      title: "Complementar",
      desc: "A IA sugere o que falta (cardio, mobilidade, esporte).",
      icon: "➕",
    },
    {
      id: "otimizar",
      title: "Otimizar",
      desc: "A IA analisa frequência, recuperação e esporte e sugere melhorias.",
      icon: "🚀",
    },
  ] as const;
  return (
    <div className="space-y-3 animate-reveal">
      <p className="font-mono text-[11px] uppercase text-muted-foreground">
        Como você quer usar este treino?
      </p>
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => onChoose(m.id)}
          className="w-full text-left rounded-xl border border-border bg-surface p-4 transition active:scale-[0.99] hover:border-primary"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{m.icon}</span>
            <div>
              <p className="font-display text-lg uppercase">{m.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{m.desc}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function DoneScreen({
  suggestion,
  onFinish,
}: {
  suggestion: { summary: string; suggestions: { type: string; title: string; detail: string }[] };
  onFinish: () => void;
}) {
  return (
    <div className="space-y-4 animate-reveal">
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">
          Análise IA
        </p>
        <p className="text-sm text-foreground">{suggestion.summary}</p>
      </div>
      {suggestion.suggestions.length > 0 && (
        <ul className="space-y-2">
          {suggestion.suggestions.map((s, i) => (
            <li key={i} className="rounded-xl border border-border bg-surface p-3.5">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">{s.type}</p>
              <p className="mt-1 font-display text-sm uppercase">{s.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={onFinish}
        className="w-full rounded-xl bg-foreground py-4 font-display text-lg uppercase tracking-widest text-background"
      >
        Concluir
      </button>
    </div>
  );
}

function ManualForm({ onCreate }: { onCreate: (w: Workout) => void }) {
  const [name, setName] = useState("Meu Treino");
  const [days, setDays] = useState([
    { name: "Treino A", exercises: [{ name: "", sets: 4, reps: "10" }] },
  ]);
  return (
    <div className="space-y-3 animate-reveal">
      <input
        className="w-full rounded-xl border border-border bg-surface px-3 py-3 font-display text-lg uppercase"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {days.map((d, di) => (
        <div key={di} className="rounded-xl border border-border bg-surface p-3.5 space-y-2">
          <input
            className="w-full bg-transparent font-display text-base uppercase outline-none border-b border-border pb-1"
            value={d.name}
            onChange={(e) => {
              const n = [...days];
              n[di] = { ...n[di], name: e.target.value };
              setDays(n);
            }}
          />
          {d.exercises.map((ex, ei) => (
            <div key={ei} className="flex gap-1">
              <input
                className="flex-1 bg-background rounded border border-border px-2 py-1 text-xs"
                placeholder="Exercício"
                value={ex.name}
                onChange={(e) => {
                  const n = [...days];
                  n[di].exercises[ei] = { ...ex, name: e.target.value };
                  setDays(n);
                }}
              />
              <input
                type="number"
                className="w-12 bg-background rounded border border-border px-2 py-1 text-xs text-center"
                value={ex.sets}
                onChange={(e) => {
                  const n = [...days];
                  n[di].exercises[ei] = { ...ex, sets: Number(e.target.value) };
                  setDays(n);
                }}
              />
              <input
                className="w-14 bg-background rounded border border-border px-2 py-1 text-xs text-center"
                value={ex.reps}
                onChange={(e) => {
                  const n = [...days];
                  n[di].exercises[ei] = { ...ex, reps: e.target.value };
                  setDays(n);
                }}
              />
            </div>
          ))}
          <button
            onClick={() => {
              const n = [...days];
              n[di].exercises.push({ name: "", sets: 4, reps: "10" });
              setDays(n);
            }}
            className="font-mono text-[10px] uppercase text-primary"
          >
            + Exercício
          </button>
        </div>
      ))}
      <button
        onClick={() =>
          setDays([
            ...days,
            {
              name: `Treino ${String.fromCharCode(65 + days.length)}`,
              exercises: [{ name: "", sets: 4, reps: "10" }],
            },
          ])
        }
        className="w-full rounded-xl border border-dashed border-border bg-surface py-3 font-mono text-[10px] uppercase text-muted-foreground"
      >
        + Adicionar treino
      </button>
      <button
        onClick={() => {
          const totalSets = days.reduce(
            (a, d) => a + d.exercises.reduce((b, e) => b + e.sets, 0),
            0,
          );
          onCreate({
            name,
            frequency: `${days.length}x/semana`,
            split: days.length <= 2 ? "Full Body" : "A/B/C",
            days,
            weeklyVolume: { totalSets, byMuscle: [] },
            hasStrength: true,
            hasCardio: false,
          });
        }}
        className="w-full rounded-xl bg-primary py-4 font-display text-lg uppercase tracking-widest text-primary-foreground"
      >
        <FileText className="inline size-5 mr-2" /> Criar treino
      </button>
    </div>
  );
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
