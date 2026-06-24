import { create } from "zustand";
import { type AppState, type Profile, type ExtraActivity, type CheckInMood, type ImportedWorkout, type AIReport, type EventGoal, type DayPlan, loadState, saveState, generatePlan, computeStreak, today, ACHIEVEMENTS, uid } from "./hybrid";
import { clearLocalState, loadRemoteState, persistState } from "./app-persistence";

type Store = AppState & {
  hydrated: boolean;
  hydrate: () => void;
  completeOnboarding: (p: Profile) => void;
  regeneratePlan: () => void;
  replaceWeekPlan: (plan: DayPlan[]) => void;
  logSet: (date: string, exerciseId: string, setIdx: number, weight: number, reps: number) => void;
  logRun: (date: string, distance: number, timeMin: number) => void;
  completeDay: (date: string) => void;
  addBodyMetric: (weight: number, bodyFat?: number) => void;
  addActivity: (a: Omit<ExtraActivity, "id">) => void;
  removeActivity: (id: string) => void;
  addCheckIn: (mood: CheckInMood, note?: string) => void;
  addImportedWorkout: (w: Omit<ImportedWorkout, "id" | "createdAt" | "mode" | "suggestions">) => string;
  updateImportedWorkout: (id: string, patch: Partial<ImportedWorkout>) => void;
  removeImportedWorkout: (id: string) => void;
  addAIReport: (r: Omit<AIReport, "id" | "date">) => void;
  addEventGoal: (g: Omit<EventGoal, "id" | "createdAt">) => void;
  removeEventGoal: (id: string) => void;
  reset: () => void;
};

export const useStore = create<Store>((set, get) => ({
  ...loadState(),
  hydrated: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const s = loadState();
    set({ ...s, hydrated: true });
    void loadRemoteState(s).then((remote) => {
      saveState(remote);
      set({ ...remote, hydrated: true });
    });
  },
  completeOnboarding: (profile) => {
    const plan = generatePlan(profile);
    const next: AppState = {
      ...get(),
      onboarded: true,
      profile,
      plan,
      bodyMetrics: [{ date: today(), weight: profile.weight, bodyFat: profile.bodyFat }],
    };
    persistState(next);
    set(next);
  },
  regeneratePlan: () => {
    const { profile } = get();
    if (!profile) return;
    const plan = generatePlan(profile);
    const next = { ...get(), plan };
    persistState(next);
    set(next);
  },
  logSet: (date, exerciseId, setIdx, weight, reps) => {
    const logs = { ...get().logs };
    logs[date] = { ...(logs[date] || {}) };
    const arr = [...(logs[date][exerciseId] || [])];
    arr[setIdx] = { weight, reps };
    logs[date][exerciseId] = arr;
    const next = { ...get(), logs };
    persistState(next);
    set(next);
  },
  logRun: (date, distance, timeMin) => {
    const paceMin = timeMin / distance;
    const m = Math.floor(paceMin);
    const s = Math.round((paceMin - m) * 60);
    const pace = `${m}:${s.toString().padStart(2, "0")}/km`;
    const runLogs = { ...get().runLogs, [date]: { distance, timeMin, pace } };
    const next = { ...get(), runLogs };
    persistState(next);
    set(next);
  },
  completeDay: (date) => {
    const completedDates = Array.from(new Set([...get().completedDates, date]));
    const streak = computeStreak(completedDates);
    const plan = get().plan.map((d) => d.date === date ? { ...d, status: "concluido" as const } : d);
    const achievements = ACHIEVEMENTS.filter((a) => a.check({ ...get(), completedDates, streak, plan })).map((a) => a.id);
    const next = { ...get(), completedDates, streak, plan, achievements };
    persistState(next);
    set(next);
  },
  addBodyMetric: (weight, bodyFat) => {
    const bodyMetrics = [...get().bodyMetrics, { date: today(), weight, bodyFat }];
    const profile = get().profile ? { ...get().profile!, weight, bodyFat } : get().profile;
    const next = { ...get(), bodyMetrics, profile };
    persistState(next);
    set(next);
  },
  addActivity: (a) => {
    const extraActivities = [...get().extraActivities, { ...a, id: uid() }];
    const next = { ...get(), extraActivities };
    persistState(next); set(next);
  },
  removeActivity: (id) => {
    const extraActivities = get().extraActivities.filter((x) => x.id !== id);
    const next = { ...get(), extraActivities };
    persistState(next); set(next);
  },
  addCheckIn: (mood, note) => {
    const checkIns = [...get().checkIns.filter((c) => c.date !== today()), { date: today(), mood, note }];
    const next = { ...get(), checkIns };
    persistState(next); set(next);
  },
  addImportedWorkout: (w) => {
    const id = uid();
    const item: ImportedWorkout = { ...w, id, createdAt: today(), mode: null, suggestions: [] };
    const importedWorkouts = [...get().importedWorkouts, item];
    const next = { ...get(), importedWorkouts };
    persistState(next); set(next);
    return id;
  },
  updateImportedWorkout: (id, patch) => {
    const importedWorkouts = get().importedWorkouts.map((w) => (w.id === id ? { ...w, ...patch } : w));
    const next = { ...get(), importedWorkouts };
    persistState(next); set(next);
  },
  removeImportedWorkout: (id) => {
    const importedWorkouts = get().importedWorkouts.filter((w) => w.id !== id);
    const next = { ...get(), importedWorkouts };
    persistState(next); set(next);
  },
  addAIReport: (r) => {
    const report: AIReport = { ...r, id: uid(), date: today() };
    const aiReports = [report, ...get().aiReports].slice(0, 30);
    const next = { ...get(), aiReports };
    persistState(next); set(next);
  },
  replaceWeekPlan: (plan) => {
    const next = { ...get(), plan };
    persistState(next); set(next);
  },
  addEventGoal: (g) => {
    const item: EventGoal = { ...g, id: uid(), createdAt: today() };
    const eventGoals = [...get().eventGoals, item].sort((a, b) => a.date.localeCompare(b.date));
    const next = { ...get(), eventGoals };
    persistState(next); set(next);
  },
  removeEventGoal: (id) => {
    const eventGoals = get().eventGoals.filter((g) => g.id !== id);
    const next = { ...get(), eventGoals };
    persistState(next); set(next);
  },
  reset: () => {
    clearLocalState();
    set({ ...loadState(), hydrated: true });
  },
}));
