import type { AppState } from "./hybrid";
import { supabase } from "@/integrations/supabase/client";

export const APP_STATE_STORAGE_KEY = "hybrid_trainer_state_v1";

export function loadLocalState<T>(fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(APP_STATE_STORAGE_KEY);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch (error) {
    console.warn("[Persistence] Failed to read local app state", error);
    return fallback;
  }
}

export function saveLocalState(state: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state));
}

export function clearLocalState() {
  if (typeof window !== "undefined") localStorage.removeItem(APP_STATE_STORAGE_KEY);
}

async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user?.id ?? null;
  } catch (error) {
    console.warn("[Persistence] Supabase auth unavailable; using local state only", error);
    return null;
  }
}

export async function loadRemoteState(fallback: AppState): Promise<AppState> {
  const userId = await getCurrentUserId();
  if (!userId) return fallback;

  try {
    const { data, error } = await (supabase as any)
      .from("app_state")
      .select("state")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data?.state ? { ...fallback, ...(data.state as AppState) } : fallback;
  } catch (error) {
    console.warn("[Persistence] Remote state unavailable; keeping local fallback", error);
    return fallback;
  }
}

export async function saveRemoteState(state: AppState): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    const { error } = await (supabase as any).from("app_state").upsert(
      {
        user_id: userId,
        state,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) throw error;
  } catch (error) {
    console.warn("[Persistence] Remote state save failed; local state is preserved", error);
  }
}

export function persistState(state: AppState) {
  saveLocalState(state);
  void saveRemoteState(state);
}
