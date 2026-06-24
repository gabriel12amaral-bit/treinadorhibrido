import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { askCoach } from "@/lib/coach.functions";
import { useStore } from "@/lib/store";
import { today, getExercise } from "@/lib/hybrid";
import { getClientAIErrorMessage } from "@/lib/ai-client-errors";
import { Send, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/coach")({
  head: () => ({ meta: [{ title: "Treinador IA — Hybrid Trainer" }] }),
  component: CoachPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Como executar agachamento livre?",
  "Posso progredir carga no supino?",
  "Estou estagnado, o que fazer?",
  "Devo fazer deload essa semana?",
];

function CoachPage() {
  const ask = useServerFn(askCoach);
  const { profile, plan, logs, streak, completedDates } = useStore();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Olá! Sou seu treinador virtual. Posso explicar exercícios, sugerir progressões e adaptar seu plano. O que quer hoje?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const todayPlan = plan.find((d) => d.date === today());
      const recentLogs = Object.entries(logs).slice(-7).map(([date, byEx]) => ({
        date,
        exercises: Object.entries(byEx).map(([id, sets]) => ({
          name: getExercise(id)?.name ?? id,
          sets: sets.filter(Boolean),
        })),
      }));
      const ctx = {
        profile: profile && { goal: profile.goal, level: profile.strengthLevel, daysPerWeek: profile.daysPerWeek, restrictions: profile.restrictionsList },
        todayPlan: todayPlan && { title: todayPlan.title, focus: todayPlan.focus, exercises: todayPlan.strength.map((s) => ({ id: s.exerciseId, name: getExercise(s.exerciseId)?.name, sets: s.sets, reps: s.reps })) },
        last7days: { completed: completedDates.slice(-7), streak },
        recentLogs,
      };
      const res = await ask({ data: { messages: next, context: ctx } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch (err) {
      setMessages([...next, { role: "assistant", content: getClientAIErrorMessage(err, "Tive um problema para responder agora. Tente novamente em instantes.") }]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="px-5 pt-10 pb-3 animate-reveal">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary flex items-center gap-1"><Sparkles className="size-3" /> Treinador Virtual</p>
        <h1 className="font-display text-3xl uppercase leading-none">Coach IA</h1>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-surface border border-border rounded-bl-md"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-border bg-surface px-3.5 py-2.5">
              <Loader2 className="size-4 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-5 pb-3 -mx-1 overflow-x-auto">
          <div className="flex gap-2 px-1">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground active:scale-[0.97]">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="border-t border-border bg-background/95 px-3 py-3 backdrop-blur"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-surface px-3 py-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Pergunte ao treinador…"
            rows={1}
            className="max-h-24 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
