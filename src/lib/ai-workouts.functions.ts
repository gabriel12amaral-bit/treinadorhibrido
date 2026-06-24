import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { getAIGateway, rethrowAIError } from "./ai-errors";

const ImportInput = z.object({
  kind: z.enum(["text", "image", "pdf"]),
  payload: z.string().min(1),
  mime: z.string().optional(),
  filename: z.string().optional(),
});

const WorkoutSchema = z.object({
  name: z.string(),
  frequency: z.string(),
  split: z.string(),
  days: z.array(
    z.object({
      name: z.string(),
      exercises: z.array(
        z.object({
          name: z.string(),
          sets: z.number().int().min(1).max(20),
          reps: z.string(),
          notes: z.string().optional(),
        }),
      ),
    }),
  ),
  weeklyVolume: z.object({
    totalSets: z.number(),
    byMuscle: z.array(z.object({ muscle: z.string(), sets: z.number() })),
  }),
  hasStrength: z.boolean(),
  hasCardio: z.boolean(),
});

export const parseWorkoutImport = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ImportInput.parse(d))
  .handler(async ({ data }) => {
    const ai = getAIGateway("parseWorkoutImport");

    const system = `Você é um treinador esportivo. Analise o conteúdo (ficha de treino) e extraia:
- Lista de treinos (Treino A, B, C…) com nome.
- Cada exercício com séries e repetições.
- Frequência semanal e divisão (ex: A/B/C, push/pull/legs, full body).
- Volume semanal total e por grupo muscular (peito, costas, pernas, ombros, braços, core).
- Detecte se há musculação e se há treino cardiovascular.
Use português. Seja objetivo. Se algo não estiver claro, infira de forma conservadora.`;

    let content: any;
    if (data.kind === "text") {
      content = [{ type: "text", text: `Conteúdo da planilha/treino:\n\n${data.payload}` }];
    } else if (data.kind === "image") {
      content = [
        { type: "text", text: "Extraia o treino desta imagem." },
        { type: "image_url", image_url: { url: data.payload.startsWith("data:") ? data.payload : `data:${data.mime || "image/png"};base64,${data.payload}` } },
      ];
    } else {
      content = [
        { type: "text", text: "Extraia o treino deste PDF." },
        { type: "file", file: { filename: data.filename || "treino.pdf", file_data: data.payload.startsWith("data:") ? data.payload : `data:application/pdf;base64,${data.payload}` } },
      ];
    }

    const { experimental_output } = await generateText({
      model: ai.gateway(ai.model("fast")),
      system,
      messages: [{ role: "user", content }],
      experimental_output: Output.object({ schema: WorkoutSchema }),
    }).catch((error) => rethrowAIError("parseWorkoutImport", error));

    return experimental_output;
  });

const ModeInput = z.object({
  workout: z.any(),
  mode: z.enum(["manter", "complementar", "otimizar"]),
  context: z.object({
    goal: z.string(),
    sport: z.string().optional(),
    daysPerWeek: z.number(),
    runLevel: z.string().optional(),
  }),
});

const SuggestionSchema = z.object({
  summary: z.string(),
  suggestions: z.array(
    z.object({
      type: z.enum(["cardio", "musculacao", "recuperacao", "esporte", "ajuste"]),
      title: z.string(),
      detail: z.string(),
    }),
  ),
});

export const analyzeWorkoutMode = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ModeInput.parse(d))
  .handler(async ({ data }) => {
    const ai = getAIGateway("analyzeWorkoutMode");

    const modeGuide = {
      manter: "Apenas confirme o treino. Não sugira mudanças. Resuma a estrutura em 2 frases.",
      complementar: "Sugira complementos que estão faltando (ex: cardio, mobilidade, esporte) sem alterar o treino existente. Máx 4 sugestões.",
      otimizar: "Analise frequência, recuperação, volume e o esporte do usuário. Sugira melhorias concretas. Máx 5 sugestões.",
    } as const;

    const { experimental_output } = await generateText({
      model: ai.gateway(ai.model("fast")),
      system: `Você é um treinador híbrido de elite. Modo: ${data.mode}. ${modeGuide[data.mode]}\nUsuário: objetivo=${data.context.goal}, esporte=${data.context.sport ?? "nenhum"}, frequência=${data.context.daysPerWeek}x/semana, nível corrida=${data.context.runLevel ?? "—"}.`,
      prompt: `Treino importado:\n${JSON.stringify(data.workout, null, 2)}\n\nResponda em português.`,
      experimental_output: Output.object({ schema: SuggestionSchema }),
    }).catch((error) => rethrowAIError("analyzeWorkoutMode", error));

    return experimental_output;
  });

const InsightsInput = z.object({
  snapshot: z.object({
    profile: z.any().optional(),
    last30days: z.object({
      strengthSessions: z.number(),
      cardioKm: z.number(),
      extraActivities: z.array(z.object({ type: z.string(), durationMin: z.number(), intensity: z.string(), date: z.string() })),
      checkIns: z.array(z.object({ date: z.string(), mood: z.string() })),
      topExercises: z.array(z.object({ name: z.string(), progressionPct: z.number() })),
      streak: z.number(),
    }),
    recovery: z.object({ muscular: z.number(), cardio: z.number(), readiness: z.string(), fatigue: z.string() }),
    importedWorkouts: z.array(z.any()).optional(),
  }),
});

const InsightsSchema = z.object({
  insights: z.array(
    z.object({
      icon: z.enum(["progress", "warning", "sport", "recovery", "tip"]),
      title: z.string(),
      detail: z.string(),
    }),
  ),
  weeklyGrade: z.string(),
  recommendation: z.string(),
});

export const generateAIInsights = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InsightsInput.parse(d))
  .handler(async ({ data }) => {
    const ai = getAIGateway("generateAIInsights");

    const { experimental_output } = await generateText({
      model: ai.gateway(ai.model("fast")),
      system: `Você é um treinador esportivo analisando os últimos 30 dias do atleta. Gere 3 a 6 insights curtos (1 frase cada), uma nota semanal (A+/A/B/C/D) e uma recomendação principal para a próxima semana. Use emojis e dados quando fizer sentido. Português brasileiro.`,
      prompt: JSON.stringify(data.snapshot, null, 2),
      experimental_output: Output.object({ schema: InsightsSchema }),
    }).catch((error) => rethrowAIError("generateAIInsights", error));

    return experimental_output;
  });

const ReplanInput = z.object({
  snapshot: z.any(),
  currentPlan: z.array(z.any()),
  event: z.object({ title: z.string(), type: z.string(), date: z.string(), daysUntil: z.number() }).optional(),
  imbalances: z.array(z.string()).optional(),
  weeklyLoad: z.object({ status: z.string(), acwr: z.number() }).optional(),
});

const ReplanSchema = z.object({
  summary: z.string(),
  changes: z.array(z.object({
    date: z.string(),
    weekday: z.string(),
    title: z.string(),
    focus: z.string(),
    reason: z.string(),
  })),
  priorityAdvice: z.string(),
});

export const replanWeek = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ReplanInput.parse(d))
  .handler(async ({ data }) => {
    const ai = getAIGateway("replanWeek");

    const eventCtx = data.event ? `Evento alvo: ${data.event.title} (${data.event.type}) em ${data.event.daysUntil} dias.` : "Sem evento alvo definido.";
    const imbCtx = data.imbalances?.length ? `Desequilíbrios detectados: ${data.imbalances.join("; ")}.` : "Sem desequilíbrios graves.";
    const loadCtx = data.weeklyLoad ? `Carga atual: ${data.weeklyLoad.status} (ACWR ${data.weeklyLoad.acwr}).` : "";

    const { experimental_output } = await generateText({
      model: ai.gateway(ai.model("fast")),
      system: `Você é um treinador híbrido que reorganiza a semana do atleta com base em recuperação, carga, desequilíbrios e evento alvo. Para cada dia da próxima semana, sugira título, foco e razão (1 frase). Seja prático. Português brasileiro.`,
      prompt: `${eventCtx}\n${imbCtx}\n${loadCtx}\n\nPlano atual:\n${JSON.stringify(data.currentPlan.map((d: any) => ({ date: d.date, weekday: d.weekday, title: d.title, focus: d.focus })), null, 2)}\n\nSnapshot:\n${JSON.stringify(data.snapshot, null, 2)}`,
      experimental_output: Output.object({ schema: ReplanSchema }),
    }).catch((error) => rethrowAIError("replanWeek", error));

    return experimental_output;
  });
