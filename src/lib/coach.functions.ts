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
    return {
      reply: `🔒 Coach IA Premium

Este recurso está disponível apenas para assinantes Premium.

✨ O que você desbloqueia:
• Análise inteligente dos seus treinos
• Sugestões de progressão de carga
• Correção de execução de exercícios
• Ajustes automáticos de volume e intensidade
• Recomendações personalizadas

🚀 Assine o Premium para liberar o Coach IA completo e receber orientação personalizada para acelerar seus resultados.`
    };
  });
