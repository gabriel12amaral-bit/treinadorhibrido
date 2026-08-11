import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import {
  type Profile,
  type WeekdayKey,
  type SportPractice,
  type SportIntensity,
  type Restriction,
  WEEKDAY_KEYS,
  WEEKDAY_LABELS,
  WEEKDAY_SHORT,
  SPORT_OPTIONS,
  RESTRICTION_OPTIONS,
} from "@/lib/hybrid";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Comece — Hybrid Trainer" }] }),
  component: Onboarding,
});

const EQUIPS = [
  "Barra",
  "Halteres",
  "Anilhas",
  "Banco",
  "Polia",
  "Máquinas",
  "Elásticos",
  "Kettlebell",
  "Nenhum",
];

type Draft = Partial<Profile> & {
  gymDays: WeekdayKey[];
  sports: SportPractice[];
  restrictionsList: Restriction[];
};

function Onboarding() {
  const navigate = useNavigate();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Draft>({
    sex: "M",
    goal: "Hibrido",
    strengthLevel: "Intermediário",
    runLevel: "Intermediário",
    timePerDay: 60,
    location: "Academia",
    equipment: [],
    gymDays: ["seg", "qua", "sex"],
    sports: [],
    restrictionsList: ["Nenhuma"],
    focoMusculacao: 60,
    focoCondicionamento: 40,
  });

  const steps = [
    { key: "intro", label: "Bem-vindo" },
    { key: "basics", label: "Você" },
    { key: "body", label: "Corpo" },
    { key: "goal", label: "Objetivo" },
    { key: "level", label: "Nível" },
    { key: "gymDays", label: "Dias academia" },
    { key: "time", label: "Tempo" },
    { key: "place", label: "Local" },
    { key: "sports", label: "Esportes" },
    { key: "sportsDays", label: "Dias dos esportes" },
    { key: "restrictions", label: "Restrições" },
    { key: "review", label: "Resumo" },
  ];

  const total = steps.length;
  const stepKey = steps[step].key;

  const canNext = validate(stepKey, p);

  const next = () => {
    if (step === total - 1) {
      const profile: Profile = {
        name: p.name!,
        sex: p.sex!,
        age: p.age!,
        height: p.height!,
        weight: p.weight!,
        bodyFat: p.bodyFat,
        goal: p.goal!,
        strengthLevel: p.strengthLevel!,
        runLevel: p.runLevel!,
        daysPerWeek: p.gymDays.length || 3,
        timePerDay: p.timePerDay!,
        location: p.location!,
        equipment: p.equipment!,
        gymDays: p.gymDays,
        sports: p.sports,
        restrictionsList: p.restrictionsList,
        sport: p.sports.map((s) => s.name).join(", ") || undefined,
        restrictions: p.restrictionsList.filter((r) => r !== "Nenhuma").join(", ") || undefined,
        focoMusculacao: p.focoMusculacao,
        focoCondicionamento: p.focoCondicionamento,
      };
      completeOnboarding(profile);
      navigate({ to: "/" });
    } else {
      let nextStep = step + 1;
      // skip sportsDays if no sports
      if (steps[nextStep]?.key === "sportsDays" && p.sports.length === 0) nextStep += 1;
      setStep(nextStep);
    }
  };

  const back = () => {
    let prev = step - 1;
    if (steps[prev]?.key === "sportsDays" && p.sports.length === 0) prev -= 1;
    setStep(Math.max(0, prev));
  };

  return (
    <div className="flex min-h-screen flex-col px-5 pt-10 pb-8">
      <div className="mb-6 flex items-center gap-1">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-white/10"}`}
          />
        ))}
      </div>

      <div className="flex-1 animate-reveal" key={step}>
        {stepKey === "intro" && <Intro />}
        {stepKey === "basics" && <Basics p={p} setP={setP} />}
        {stepKey === "body" && <Body p={p} setP={setP} />}
        {stepKey === "goal" && <Goal p={p} setP={setP} />}
        {stepKey === "level" && <Level p={p} setP={setP} />}
        {stepKey === "gymDays" && <GymDays p={p} setP={setP} />}
        {stepKey === "time" && <TimeStep p={p} setP={setP} />}
        {stepKey === "place" && <Place p={p} setP={setP} />}
        {stepKey === "sports" && <SportsPick p={p} setP={setP} />}
        {stepKey === "sportsDays" && <SportsDays p={p} setP={setP} />}
        {stepKey === "restrictions" && <Restrictions p={p} setP={setP} />}
        {stepKey === "review" && <Review p={p} />}
      </div>

      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <button
            onClick={back}
            className="flex items-center justify-center rounded-xl border border-border px-4 py-3 text-sm"
          >
            <ChevronLeft className="size-4" />
          </button>
        )}
        <button
          onClick={next}
          disabled={!canNext}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 font-display text-lg uppercase tracking-widest text-primary-foreground transition active:scale-[0.98] disabled:opacity-30"
        >
          {step === total - 1 ? (
            <>
              Gerar Plano <Sparkles className="size-4" />
            </>
          ) : (
            <>
              Continuar <ChevronRight className="size-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function validate(key: string, p: Draft): boolean {
  switch (key) {
    case "intro":
      return true;
    case "basics":
      return !!p.name && !!p.age && !!p.sex;
    case "body":
      return !!p.height && !!p.weight;
    case "goal":
      return !!p.goal;
    case "level":
      return !!p.strengthLevel && !!p.runLevel;
    case "gymDays":
      return p.gymDays.length > 0;
    case "time":
      return !!p.timePerDay;
    case "place":
      return !!p.location && (p.equipment?.length ?? 0) > 0;
    case "sports":
      return true;
    case "sportsDays":
      return p.sports.every((s) => s.days.length > 0);
    case "restrictions":
      return p.restrictionsList.length > 0;
    case "review":
      return true;
    default:
      return false;
  }
}

function Intro() {
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
        Hybrid Trainer
      </p>
      <h1 className="mt-2 font-display text-5xl uppercase leading-none">
        Treinador
        <br />
        híbrido
        <br />
        <span className="text-primary">inteligente</span>
      </h1>
      <p className="mt-6 max-w-xs text-sm text-muted-foreground">
        Musculação + corrida + esportes em um único plano semanal — adaptado à sua evolução.
      </p>
      <div className="mt-8 space-y-3">
        <Feature t="📐 Plano sob medida" d="A IA monta divisões, cargas e corridas pra você." />
        <Feature t="📈 Progressão real" d="Recalcula a semana com base no que você fez." />
        <Feature t="⚽ Híbrido de verdade" d="Encaixa pelada, futebol e esportes na rotina." />
      </div>
    </div>
  );
}
function Feature({ t, d }: { t: string; d: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <p className="text-sm font-bold">{t}</p>
      <p className="text-xs text-muted-foreground">{d}</p>
    </div>
  );
}

function H({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-3xl uppercase leading-none">{title}</h2>
      {sub && <p className="mt-2 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function inputCls(extra = "") {
  return `w-full rounded-lg border border-border bg-surface px-3 py-3 text-base outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 ${extra}`;
}

function Chips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T | undefined;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-lg border px-3 py-2 text-sm transition ${value === o ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-foreground"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function WeekdayPicker({
  value,
  onChange,
}: {
  value: WeekdayKey[];
  onChange: (v: WeekdayKey[]) => void;
}) {
  const toggle = (k: WeekdayKey) => {
    const set = new Set(value);
    if (set.has(k)) set.delete(k);
    else set.add(k);
    onChange(WEEKDAY_KEYS.filter((d) => set.has(d)));
  };
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {WEEKDAY_KEYS.map((k) => {
        const active = value.includes(k);
        return (
          <button
            key={k}
            type="button"
            onClick={() => toggle(k)}
            className={`flex flex-col items-center gap-0.5 rounded-lg border py-3 font-mono text-[10px] uppercase transition ${active ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground"}`}
          >
            <span className="font-bold">{WEEKDAY_SHORT[k]}</span>
          </button>
        );
      })}
    </div>
  );
}

function Basics({ p, setP }: { p: Draft; setP: (v: Draft) => void }) {
  return (
    <div className="space-y-4">
      <H title="Quem é você?" />
      <Field label="Nome">
        <input
          className={inputCls()}
          value={p.name ?? ""}
          onChange={(e) => setP({ ...p, name: e.target.value })}
          placeholder="Como te chamam"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Idade">
          <input
            type="number"
            inputMode="numeric"
            className={inputCls()}
            value={p.age ?? ""}
            onChange={(e) => setP({ ...p, age: +e.target.value })}
            placeholder="28"
          />
        </Field>
        <Field label="Sexo">
          <Chips
            options={["M", "F", "Outro"] as const}
            value={p.sex}
            onChange={(v) => setP({ ...p, sex: v })}
          />
        </Field>
      </div>
    </div>
  );
}

function Body({ p, setP }: { p: Draft; setP: (v: Draft) => void }) {
  return (
    <div className="space-y-4">
      <H title="Medidas" sub="Vamos usar pra calcular volume e progresso." />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Altura (cm)">
          <input
            type="number"
            className={inputCls()}
            value={p.height ?? ""}
            onChange={(e) => setP({ ...p, height: +e.target.value })}
            placeholder="178"
          />
        </Field>
        <Field label="Peso (kg)">
          <input
            type="number"
            className={inputCls()}
            value={p.weight ?? ""}
            onChange={(e) => setP({ ...p, weight: +e.target.value })}
            placeholder="78"
          />
        </Field>
      </div>
      <Field label="% de gordura (opcional)">
        <input
          type="number"
          className={inputCls()}
          value={p.bodyFat ?? ""}
          onChange={(e) => setP({ ...p, bodyFat: +e.target.value || undefined })}
          placeholder="18"
        />
      </Field>
    </div>
  );
}

function Goal({ p, setP }: { p: Draft; setP: (v: Draft) => void }) {
  const goals = [
    "Hipertrofia",
    "Emagrecimento",
    "Futebol",
    "Corrida",
    "Ciclismo",
    "Basquete",
    "Volei",
    "Natacao",
    "Funcional",
    "Hibrido",
  ] as const;
  const isHybrid = String(p.goal).toLowerCase().includes("hibrido");
  return (
    <div>
      <H
        title="Seu objetivo"
        sub="O plano vai combinar musculacao, condicionamento, core, mobilidade e recuperacao."
      />
      <div className="grid grid-cols-2 gap-2">
        {goals.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setP({ ...p, goal: g })}
            className={
              "rounded-xl border p-4 text-left transition " +
              (p.goal === g ? "border-primary bg-primary/10" : "border-border bg-surface")
            }
          >
            <p
              className={"font-display text-base uppercase " + (p.goal === g ? "text-primary" : "")}
            >
              {g}
            </p>
          </button>
        ))}
      </div>
      {isHybrid && (
        <div className="mt-5 rounded-xl border border-border bg-surface p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Distribuicao do foco
          </p>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span>Musculacao {p.focoMusculacao ?? 60}%</span>
            <span>Condicionamento {p.focoCondicionamento ?? 40}%</span>
          </div>
          <input
            type="range"
            min={30}
            max={80}
            step={10}
            value={p.focoMusculacao ?? 60}
            onChange={(event) => {
              const focoMusculacao = Number(event.target.value);
              setP({ ...p, focoMusculacao, focoCondicionamento: 100 - focoMusculacao });
            }}
            className="mt-3 w-full accent-[oklch(0.78_0.19_142)]"
          />
        </div>
      )}
    </div>
  );
}
function Level({ p, setP }: { p: Draft; setP: (v: Draft) => void }) {
  const lvls = ["Iniciante", "Intermediário", "Avançado"] as const;
  return (
    <div className="space-y-6">
      <H title="Seu nível" />
      <Field label="Musculação">
        <Chips
          options={lvls}
          value={p.strengthLevel}
          onChange={(v) => setP({ ...p, strengthLevel: v })}
        />
      </Field>
      <Field label="Corrida">
        <Chips options={lvls} value={p.runLevel} onChange={(v) => setP({ ...p, runLevel: v })} />
      </Field>
    </div>
  );
}

function GymDays({ p, setP }: { p: Draft; setP: (v: Draft) => void }) {
  return (
    <div className="space-y-6">
      <H title="Dias na academia" sub="Quais dias você consegue treinar musculação?" />
      <WeekdayPicker value={p.gymDays} onChange={(v) => setP({ ...p, gymDays: v })} />
      <p className="font-mono text-[10px] uppercase text-muted-foreground">
        {p.gymDays.length === 0
          ? "Selecione ao menos 1 dia"
          : `${p.gymDays.length} dia${p.gymDays.length > 1 ? "s" : ""} selecionado${p.gymDays.length > 1 ? "s" : ""}`}
      </p>
    </div>
  );
}

function TimeStep({ p, setP }: { p: Draft; setP: (v: Draft) => void }) {
  return (
    <div className="space-y-6">
      <H title="Tempo por sessão" />
      <Field label={`Tempo por treino: ${p.timePerDay} min`}>
        <input
          type="range"
          min={20}
          max={120}
          step={5}
          value={p.timePerDay}
          onChange={(e) => setP({ ...p, timePerDay: +e.target.value })}
          className="w-full accent-[oklch(0.78_0.19_142)]"
        />
      </Field>
    </div>
  );
}

function Place({ p, setP }: { p: Draft; setP: (v: Draft) => void }) {
  const toggle = (k: string) => {
    const set = new Set(p.equipment ?? []);
    if (set.has(k)) set.delete(k);
    else set.add(k);
    setP({ ...p, equipment: [...set] });
  };
  return (
    <div className="space-y-6">
      <H title="Onde treina?" />
      <Field label="Local">
        <Chips
          options={["Academia", "Casa"] as const}
          value={p.location}
          onChange={(v) => setP({ ...p, location: v })}
        />
      </Field>
      <Field label="Equipamentos disponíveis">
        <div className="flex flex-wrap gap-2">
          {EQUIPS.map((e) => {
            const active = p.equipment?.includes(e);
            return (
              <button
                key={e}
                type="button"
                onClick={() => toggle(e)}
                className={`rounded-lg border px-3 py-2 text-sm transition ${active ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface"}`}
              >
                {e}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

function SportsPick({ p, setP }: { p: Draft; setP: (v: Draft) => void }) {
  const toggleSport = (name: string) => {
    const exists = p.sports.find((s) => s.name === name);
    const next = exists
      ? p.sports.filter((s) => s.name !== name)
      : [...p.sports, { name, days: [], intensity: "Moderada" as SportIntensity }];
    setP({ ...p, sports: next });
  };
  return (
    <div className="space-y-4">
      <H title="Esportes" sub="Pratica algum esporte regularmente? (opcional)" />
      <div className="grid grid-cols-2 gap-2">
        {SPORT_OPTIONS.map((s) => {
          const active = !!p.sports.find((x) => x.name === s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggleSport(s)}
              className={`rounded-xl border p-3 text-left transition ${active ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface"}`}
            >
              <p className="font-display text-sm uppercase">{s}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SportsDays({ p, setP }: { p: Draft; setP: (v: Draft) => void }) {
  const update = (idx: number, patch: Partial<SportPractice>) => {
    const next = p.sports.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    setP({ ...p, sports: next });
  };
  return (
    <div className="space-y-5">
      <H title="Dias dos esportes" sub="Quando você pratica cada esporte e em qual intensidade?" />
      {p.sports.map((s, i) => (
        <div key={s.name} className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <p className="font-display text-base uppercase">{s.name}</p>
          <WeekdayPicker value={s.days} onChange={(v) => update(i, { days: v })} />
          <Field label="Intensidade">
            <Chips
              options={["Leve", "Moderada", "Alta", "Competitiva"] as const}
              value={s.intensity}
              onChange={(v) => update(i, { intensity: v })}
            />
          </Field>
        </div>
      ))}
    </div>
  );
}

function Restrictions({ p, setP }: { p: Draft; setP: (v: Draft) => void }) {
  const toggle = (r: Restriction) => {
    let next: Restriction[];
    if (r === "Nenhuma") next = ["Nenhuma"];
    else {
      const set = new Set(p.restrictionsList.filter((x) => x !== "Nenhuma"));
      if (set.has(r)) set.delete(r);
      else set.add(r);
      next = set.size === 0 ? ["Nenhuma"] : [...set];
    }
    setP({ ...p, restrictionsList: next });
  };
  return (
    <div className="space-y-4">
      <H title="Restrições e lesões" sub="Possui alguma limitação física?" />
      <div className="flex flex-wrap gap-2">
        {RESTRICTION_OPTIONS.map((r) => {
          const active = p.restrictionsList.includes(r);
          return (
            <button
              key={r}
              type="button"
              onClick={() => toggle(r)}
              className={`rounded-lg border px-3 py-2 text-sm transition ${active ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface"}`}
            >
              {r}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Review({ p }: { p: Draft }) {
  return (
    <div className="space-y-4">
      <H title="Tudo certo?" sub="Confira antes de gerar seu plano." />
      <Row label="Objetivo" value={p.goal ?? "—"} />
      <Row label="Nível" value={`Musc ${p.strengthLevel} • Corrida ${p.runLevel}`} />
      <Row
        label="Academia"
        value={p.gymDays.map((d) => WEEKDAY_SHORT[d]).join(" · ") + ` (${p.gymDays.length}x)`}
      />
      <Row label="Tempo / sessão" value={`${p.timePerDay} min`} />
      <Row label="Local" value={`${p.location} • ${p.equipment?.length ?? 0} equip.`} />
      {p.sports.length > 0 ? (
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Esportes
          </p>
          {p.sports.map((s) => (
            <div key={s.name} className="rounded-xl border border-border bg-surface p-3">
              <div className="flex items-center justify-between">
                <p className="font-display text-sm uppercase">{s.name}</p>
                <span className="font-mono text-[10px] uppercase text-primary">{s.intensity}</span>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">
                {s.days.length
                  ? s.days.map((d) => WEEKDAY_SHORT[d]).join(" · ")
                  : "sem dias definidos"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <Row label="Esportes" value="—" />
      )}
      <Row label="Restrições" value={p.restrictionsList.join(", ")} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
