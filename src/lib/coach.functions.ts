import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { getAIGateway, rethrowAIError } from "./ai-errors";

const Message = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const CoachInput = z.object({
  messages: z.array(Message).min(1).max(40),
  context: z.object({
    profile: z.any().optional(),
    todayPlan: z.any().optional(),
    last7days: z.any().optional(),
    recentLogs: z.any().optional(),
    streak: z.number().optional(),
  }),
});

export const askCoach = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CoachInput.parse(d))
  .handler(async ({ data }) => {
    const ai = getAIGateway("askCoach");

    const system = `Você é o Treinador Virtual do app — um personal trainer experiente em musculação e treino híbrido. 
Responda em português brasileiro, direto, sem rodeios. Use markdown leve quando útil (listas, negrito).
Você pode:
- Explicar como executar exercícios (séries, reps, descanso, dicas e erros).
- Sugerir progressão de carga (+2.5kg em isoladores, +5kg em compostos pesados quando o usuário atinge o topo da faixa de reps).
- Detectar estagnação (3+ semanas sem progresso num composto) e recomendar deload (semana com -40% de volume).
- Ajustar volume conforme fadiga / sono / humor relatado.
- Sugerir alterações no plano atual quando fizer sentido.
- Comparar evolução semanal/mensal usando os dados fornecidos.

Contexto do atleta (JSON):
${JSON.stringify(data.context, null, 2)}

Regras:
- Seja específico: cite o exercício, a carga e a meta concreta.
- Não invente histórico que não esteja no contexto.
- Se o usuário pedir algo perigoso (carga absurda, treino com lesão grave), recuse e oriente.`;

    const { text } = await generateText({
      model: ai.gateway(ai.model("coach")),
      system,
      messages: data.messages,
    }).catch((error) => rethrowAIError("askCoach", error));
    return { reply: text };
  });
