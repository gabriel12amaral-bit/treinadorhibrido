import { createLovableAiGatewayProvider, createOpenAIProvider } from "./ai-gateway.server";

const MISSING_KEY_MESSAGE =
  "A IA nao esta configurada neste ambiente. Defina LOVABLE_API_KEY ou OPENAI_API_KEY no deploy.";

export type AIModelKind = "fast" | "coach";

export function getAIGateway(feature: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  if (lovableKey) {
    return {
      gateway: createLovableAiGatewayProvider(lovableKey),
      model: (kind: AIModelKind) =>
        kind === "coach" ? "google/gemini-3-flash-preview" : "google/gemini-2.5-flash",
    };
  }

  const openAiKey = process.env.OPENAI_API_KEY;
  if (openAiKey) {
    const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    const fallbackModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    return {
      gateway: createOpenAIProvider(openAiKey, baseURL),
      model: (kind: AIModelKind) =>
        kind === "coach" ? process.env.OPENAI_COACH_MODEL || fallbackModel : fallbackModel,
    };
  }

  logAIError(feature, new Error("Missing AI API key"), { kind: "configuration" });
  throw new Error(MISSING_KEY_MESSAGE);
}

export function getAIUserMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (
    message === MISSING_KEY_MESSAGE ||
    lower.includes("lovable_api_key") ||
    lower.includes("openai_api_key")
  ) {
    return MISSING_KEY_MESSAGE;
  }

  if (
    lower.includes("network") ||
    lower.includes("fetch failed") ||
    lower.includes("econnreset") ||
    lower.includes("etimedout")
  ) {
    return "Nao consegui conectar com a IA agora. Verifique a rede e tente novamente.";
  }

  if (
    lower.includes("401") ||
    lower.includes("403") ||
    lower.includes("unauthorized") ||
    lower.includes("forbidden")
  ) {
    return "A chave da IA foi recusada. Confira LOVABLE_API_KEY ou OPENAI_API_KEY no ambiente do deploy.";
  }

  if (lower.includes("429") || lower.includes("rate limit")) {
    return "A IA atingiu o limite de uso no momento. Tente novamente em alguns minutos.";
  }

  if (lower.includes("500") || lower.includes("502") || lower.includes("503")) {
    return "A API de IA esta instavel agora. Tente novamente em instantes.";
  }

  return "Nao consegui gerar a resposta da IA agora. Tente novamente em instantes.";
}

export function logAIError(
  feature: string,
  error: unknown,
  extra: Record<string, unknown> = {},
) {
  const err = error instanceof Error ? error : new Error(String(error));
  console.error("[AI]", {
    feature,
    message: err.message,
    name: err.name,
    stack: err.stack,
    ...extra,
  });
}

export function rethrowAIError(feature: string, error: unknown): never {
  logAIError(feature, error);
  throw new Error(getAIUserMessage(error));
}
