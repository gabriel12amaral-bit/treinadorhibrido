import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ElementType } from "react";
import { useStore } from "@/lib/store";
import { today, EXTRA_ACTIVITY_TYPES, generatePlan, getExercise, type DayPlan } from "@/lib/hybrid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Dumbbell, Play, Plus, RefreshCw, Timer } from "lucide-react";

export const Route = createFileRoute("/calendario")({
  head: () => ({ meta: [{ title: "Agenda - Hybrid Trainer" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const { plan, profile, completedDates, regeneratePlan, extraActivities, updatePlanDay } =
    useStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);

  const visiblePlan = useMemo(() => {
    if (!profile || weekOffset === 0) return plan;
    const anchor = new Date();
    anchor.setDate(anchor.getDate() + weekOffset * 7);
    return generatePlan(profile, anchor);
  }, [plan, profile, weekOffset]);

  const weekStats = useMemo(() => {
    const done = visiblePlan.filter((d) => completedDates.includes(d.date)).length;
    const planned = visiblePlan.filter((d) => !d.rest).length;
    const totalMin = visiblePlan
      .filter((d) => completedDates.includes(d.date))
      .reduce((a, b) => a + b.estimatedMin, 0);
    const extrasInWeek = extraActivities.filter((a) => visiblePlan.some((d) => d.date === a.date));
    const extraMin = extrasInWeek.reduce((a, b) => a + b.durationMin, 0);
    return { done, planned, totalMin: totalMin + extraMin, extras: extrasInWeek.length };
  }, [visiblePlan, completedDates, extraActivities]);

  const byDate = useMemo(() => {
    const map: Record<string, typeof extraActivities> = {};
    extraActivities.forEach((activity) => {
      (map[activity.date] ||= []).push(activity);
    });
    return map;
  }, [extraActivities]);

  const weekLabel =
    weekOffset === 0
      ? "Esta Semana"
      : weekOffset < 0
        ? `${Math.abs(weekOffset)} sem. atras`
        : `${weekOffset} sem. a frente`;

  return (
    <div className="pb-32 px-5 pt-10">
      <header className="animate-reveal">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{weekLabel}</p>
        <h1 className="font-display text-4xl uppercase leading-none">Agenda</h1>
      </header>

      <div className="mt-5 grid grid-cols-[44px_1fr_44px] items-center gap-2 animate-reveal">
        <button
          type="button"
          onClick={() => setWeekOffset((value) => value - 1)}
          className="grid size-11 place-items-center rounded-xl border border-border bg-surface text-muted-foreground active:scale-[0.98]"
          aria-label="Semana anterior"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setWeekOffset(0)}
          className="h-11 rounded-xl border border-border bg-surface px-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground active:scale-[0.98]"
        >
          Semana atual
        </button>
        <button
          type="button"
          onClick={() => setWeekOffset((value) => value + 1)}
          className="grid size-11 place-items-center rounded-xl border border-border bg-surface text-muted-foreground active:scale-[0.98]"
          aria-label="Proxima semana"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <section className="mt-6 grid grid-cols-4 gap-px overflow-hidden rounded-xl bg-border animate-reveal">
        <Box label="Feito" value={`${weekStats.done}/${weekStats.planned}`} accent />
        <Box label="Extras" value={`${weekStats.extras}`} />
        <Box label="Min" value={`${weekStats.totalMin}`} />
        <Box
          label="Aderencia"
          value={`${weekStats.planned ? Math.round((weekStats.done / weekStats.planned) * 100) : 0}%`}
        />
      </section>

      <ul className="mt-6 space-y-2 animate-reveal [animation-delay:100ms]">
        {visiblePlan.map((day) => {
          const isToday = day.date === today();
          const done = completedDates.includes(day.date);
          const extras = byDate[day.date] ?? [];
          return (
            <li key={day.date}>
              <button
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`w-full rounded-xl border p-4 text-left active:scale-[0.99] ${
                  isToday
                    ? "border-primary/50 bg-primary/5"
                    : done
                      ? "border-primary/20 bg-surface"
                      : day.rest
                        ? "border-border bg-surface/50"
                        : "border-border bg-surface"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-mono text-[10px] uppercase tracking-widest ${
                        isToday ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {day.weekday}
                      {isToday && " - Hoje"}
                    </p>
                    <p className="mt-0.5 font-display text-lg uppercase">
                      {day.rest ? "Recuperacao" : day.title}
                    </p>
                    {!day.rest && (
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {day.estimatedMin}min - {day.strength.length} ex
                        {day.cardio ? " + corrida" : ""}
                      </p>
                    )}
                    {extras.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {extras.map((activity) => {
                          const meta = EXTRA_ACTIVITY_TYPES.find((t) => t.name === activity.type);
                          return (
                            <span
                              key={activity.id}
                              className="inline-flex items-center gap-1 rounded bg-warning/10 px-2 py-0.5 font-mono text-[10px] uppercase text-warning ring-1 ring-warning/20"
                            >
                              <span>{meta?.icon ?? "*"}</span>
                              {activity.type} - {activity.durationMin}'
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded px-2 py-1 font-mono text-[10px] font-bold uppercase ${
                      done
                        ? "bg-primary/20 text-primary"
                        : isToday
                          ? "bg-white/10 text-foreground"
                          : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    {done ? "Feito" : day.rest ? "Off" : isToday ? "Hoje" : "Pendente"}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <DayDetailsDialog
        day={selectedDay}
        extras={selectedDay ? (byDate[selectedDay.date] ?? []) : []}
        onClose={() => setSelectedDay(null)}
      />

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link
          to="/atividade"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-mono text-xs uppercase tracking-widest text-primary-foreground active:scale-[0.98]"
        >
          <Plus className="size-3.5" /> Atividade
        </Link>
        <button
          onClick={regeneratePlan}
          disabled={weekOffset !== 0}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground active:scale-[0.98] disabled:opacity-40"
        >
          <RefreshCw className="size-3.5" /> Regenerar IA
        </button>
      </div>
    </div>
  );
}

function DayDetailsDialog({
  day,
  extras,
  onClose,
  onSave,
}: {
  day: DayPlan | null;
  extras: ReturnType<typeof useStore.getState>["extraActivities"];
  onClose: () => void;
  onSave: (date: string, patch: Partial<DayPlan>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<DayPlan | null>(day);

  useEffect(() => {
    setDraft(day);
    setEditing(false);
  }, [day]);

  if (!day || !draft) {
    return <Dialog open={false} onOpenChange={() => undefined} />;
  }

  const updateSlot = (index: number, patch: Partial<DayPlan["strength"][number]>) => {
    setDraft((current) => {
      if (!current) return current;
      const strength = current.strength.map((slot, i) =>
        i === index ? { ...slot, ...patch } : slot,
      );
      return { ...current, strength, musculacao: strength };
    });
  };

  const removeSlot = (index: number) => {
    setDraft((current) => {
      if (!current) return current;
      const strength = current.strength.filter((_, i) => i !== index);
      return { ...current, strength, musculacao: strength };
    });
  };

  const addSlot = () => {
    setDraft((current) => {
      if (!current) return current;
      const strength = [
        ...current.strength,
        {
          exerciseId: "manual-" + Date.now(),
          name: "Novo exercicio",
          sets: 3,
          reps: "10",
          rest: "60s",
        },
      ];
      return { ...current, strength, musculacao: strength, rest: false };
    });
  };

  const saveEdit = () => {
    const patch: Partial<DayPlan> = {
      title: draft.title,
      focus: draft.focus,
      estimatedMin: draft.estimatedMin,
      strength: draft.strength,
      musculacao: draft.strength,
      rest: draft.rest,
    };
    onSave(draft.date, patch);
    setEditing(false);
  };

  return (
    <Dialog open={!!day} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-xl border-border bg-background p-5">
        <DialogHeader>
          <DialogDescription className="font-mono text-[10px] uppercase tracking-widest text-primary">
            {day.weekday} - {formatPt(day.date)}
          </DialogDescription>
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="font-display text-2xl uppercase leading-none">
              {draft.rest ? "Recuperacao" : draft.title}
            </DialogTitle>
            <button
              type="button"
              onClick={() => (editing ? saveEdit() : setEditing(true))}
              className="shrink-0 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-[10px] uppercase text-primary"
            >
              {editing ? "Salvar" : "Editar"}
            </button>
          </div>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Badge icon={Timer} text={String(draft.estimatedMin) + " min"} />
          <Badge icon={Dumbbell} text={String(draft.strength.length) + " exercicios"} />
          {draft.cardio && <Badge text={draft.cardio.type} />}
          {draft.sport && <Badge text={draft.sport.sport} />}
        </div>

        {editing ? (
          <section className="space-y-3 rounded-lg border border-border bg-surface p-3">
            <FieldEdit
              label="Titulo"
              value={draft.title}
              onChange={(value) => setDraft({ ...draft, title: value })}
            />
            <FieldEdit
              label="Foco"
              value={draft.focus}
              onChange={(value) => setDraft({ ...draft, focus: value })}
            />
            <label className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Minutos
              <input
                type="number"
                className="w-24 rounded border border-border bg-background px-2 py-2 text-right text-sm text-foreground"
                value={draft.estimatedMin}
                onChange={(event) =>
                  setDraft({ ...draft, estimatedMin: Number(event.target.value) || 0 })
                }
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={!!draft.rest}
                onChange={(event) => setDraft({ ...draft, rest: event.target.checked })}
              />
              Dia de recuperacao/descanso
            </label>
          </section>
        ) : (
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Foco
            </p>
            <p className="mt-1 text-sm">{draft.focus}</p>
          </div>
        )}

        {draft.strength.length > 0 && (
          <section>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Musculacao
              </h3>
              {editing && (
                <button
                  type="button"
                  onClick={addSlot}
                  className="font-mono text-[10px] uppercase text-primary"
                >
                  + Exercicio
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {draft.strength.map((slot, index) => {
                const exercise = getExercise(slot.exerciseId);
                return (
                  <li
                    key={slot.exerciseId + "-" + index}
                    className="rounded-lg border border-border bg-surface p-3"
                  >
                    {editing ? (
                      <div className="space-y-2">
                        <input
                          className="w-full rounded border border-border bg-background px-2 py-2 text-sm"
                          value={slot.name ?? exercise?.name ?? slot.exerciseId}
                          onChange={(event) => updateSlot(index, { name: event.target.value })}
                        />
                        <div className="grid grid-cols-[72px_1fr_72px_32px] gap-2">
                          <input
                            type="number"
                            className="rounded border border-border bg-background px-2 py-2 text-sm"
                            value={slot.sets}
                            onChange={(event) =>
                              updateSlot(index, { sets: Number(event.target.value) || 1 })
                            }
                          />
                          <input
                            className="rounded border border-border bg-background px-2 py-2 text-sm"
                            value={slot.reps}
                            onChange={(event) => updateSlot(index, { reps: event.target.value })}
                          />
                          <input
                            className="rounded border border-border bg-background px-2 py-2 text-sm"
                            value={slot.rest}
                            onChange={(event) => updateSlot(index, { rest: event.target.value })}
                          />
                          <button
                            type="button"
                            onClick={() => removeSlot(index)}
                            className="rounded border border-destructive/30 text-destructive"
                          >
                            x
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              to="/exercicio/$id"
                              params={{ id: slot.exerciseId }}
                              search={{ date: draft.date }}
                              className="font-display text-sm uppercase text-foreground underline-offset-4 hover:underline"
                            >
                              {slot.name ?? exercise?.name ?? slot.exerciseId}
                            </Link>
                            {exercise?.group && (
                              <p className="mt-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                                {exercise.group}
                              </p>
                            )}
                          </div>
                          <span className="shrink-0 rounded bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase text-primary">
                            {slot.sets}x{slot.reps}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">Descanso: {slot.rest}</p>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {editing && draft.strength.length === 0 && (
          <button
            type="button"
            onClick={addSlot}
            className="rounded-lg border border-border bg-surface px-3 py-3 font-mono text-[10px] uppercase text-primary"
          >
            + Adicionar exercicio
          </button>
        )}

        {draft.condicionamento?.length ? (
          <BlockList title="Condicionamento" blocks={draft.condicionamento} />
        ) : null}
        {draft.core?.length ? <BlockList title="Core" blocks={draft.core} /> : null}
        {draft.mobilidade?.length ? (
          <BlockList title="Mobilidade" blocks={draft.mobilidade} />
        ) : null}
        {draft.recuperacao?.length ? (
          <BlockList title="Recuperacao" blocks={draft.recuperacao} />
        ) : null}

        {extras.length > 0 && (
          <section>
            <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Atividades extras
            </h3>
            <ul className="space-y-2">
              {extras.map((activity) => (
                <li
                  key={activity.id}
                  className="rounded-lg border border-warning/20 bg-warning/10 p-3 text-sm"
                >
                  <p className="font-display text-sm uppercase">{activity.type}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activity.durationMin}min - {activity.intensity}
                  </p>
                  {activity.notes && <p className="mt-2 text-xs">{activity.notes}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FieldEdit({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        className="mt-1 w-full rounded border border-border bg-background px-2 py-2 text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function BlockList({
  title,
  blocks,
}: {
  title: string;
  blocks: { nome: string; duracao?: string; prescricao?: string }[];
}) {
  return (
    <section className="rounded-lg border border-border bg-surface p-3">
      <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      <ul className="mt-2 space-y-1.5">
        {blocks.map((block, index) => (
          <li key={block.nome + "-" + index} className="text-sm">
            <span className="font-medium">{block.nome}</span>
            {(block.prescricao || block.duracao) && (
              <span className="text-muted-foreground"> - {block.prescricao ?? block.duracao}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
function Badge({ text, icon: Icon }: { text: string; icon?: ElementType }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-1 font-mono text-[10px] uppercase text-muted-foreground ring-1 ring-border">
      {Icon && <Icon className="size-3" />}
      {text}
    </span>
  );
}

function Box({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-surface p-3">
      <p className="font-mono text-[9px] uppercase text-muted-foreground">{label}</p>
      <p className={`font-display text-xl ${accent ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}

function formatPt(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}
