import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ElementType } from "react";
import { useStore } from "@/lib/store";
import {
  today,
  EXTRA_ACTIVITY_TYPES,
  generatePlan,
  getExercise,
  type DayPlan,
} from "@/lib/hybrid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Dumbbell, Plus, RefreshCw, Timer } from "lucide-react";

export const Route = createFileRoute("/calendario")({
  head: () => ({ meta: [{ title: "Agenda - Hybrid Trainer" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const { plan, profile, completedDates, regeneratePlan, extraActivities } = useStore();
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
    const extrasInWeek = extraActivities.filter((a) =>
      visiblePlan.some((d) => d.date === a.date),
    );
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
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          {weekLabel}
        </p>
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
}: {
  day: DayPlan | null;
  extras: ReturnType<typeof useStore.getState>["extraActivities"];
  onClose: () => void;
}) {
  return (
    <Dialog open={!!day} onOpenChange={(open) => !open && onClose()}>
      {day && (
        <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-xl border-border bg-background p-5">
          <DialogHeader>
            <DialogDescription className="font-mono text-[10px] uppercase tracking-widest text-primary">
              {day.weekday} - {formatPt(day.date)}
            </DialogDescription>
            <DialogTitle className="font-display text-2xl uppercase leading-none">
              {day.rest ? "Recuperacao" : day.title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            <Badge icon={Timer} text={`${day.estimatedMin} min`} />
            <Badge icon={Dumbbell} text={`${day.strength.length} exercicios`} />
            {day.cardio && <Badge text={day.cardio.type} />}
            {day.sport && <Badge text={day.sport.sport} />}
          </div>

          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Foco
            </p>
            <p className="mt-1 text-sm">{day.focus}</p>
          </div>

          {day.strength.length > 0 && (
            <section>
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Musculacao
              </h3>
              <ul className="space-y-2">
                {day.strength.map((slot, index) => {
                  const exercise = getExercise(slot.exerciseId);
                  return (
                    <li
                      key={`${slot.exerciseId}-${index}`}
                      className="rounded-lg border border-border bg-surface p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-sm uppercase">
                            {exercise?.name ?? slot.exerciseId}
                          </p>
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
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {day.cardio && (
            <section className="rounded-lg border border-border bg-surface p-3">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Cardio
              </h3>
              <p className="mt-1 font-display text-sm uppercase">{day.cardio.type}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {day.cardio.duration}min
                {day.cardio.distance ? ` - ${day.cardio.distance}km` : ""}
                {day.cardio.pace ? ` - ${day.cardio.pace}` : ""}
              </p>
              <p className="mt-2 text-sm">{day.cardio.details}</p>
            </section>
          )}

          {day.sport && (
            <section className="rounded-lg border border-border bg-surface p-3">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Esporte
              </h3>
              <p className="mt-1 font-display text-sm uppercase">{day.sport.sport}</p>
              <p className="mt-1 text-xs text-muted-foreground">{day.sport.duration}min</p>
              <p className="mt-2 text-sm">{day.sport.details}</p>
            </section>
          )}

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
      )}
    </Dialog>
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
