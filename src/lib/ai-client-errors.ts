export function getClientAIErrorMessage(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (
    lower.includes("lovable_api_key") ||
    lower.includes("openai_api_key") ||
    lower.includes("ia nao esta configurada")
  ) {
    return "A IA nao esta configurada neste ambiente. Defina LOVABLE_API_KEY ou OPENAI_API_KEY no deploy.";
  }

  if (lower.includes("network") || lower.includes("fetch failed")) {
    return "Nao consegui conectar com a IA agora. Verifique a rede e tente novamente.";
  }

  if (lower.includes("401") || lower.includes("403") || lower.includes("chave da ia")) {
    return "A chave da IA foi recusada. Confira LOVABLE_API_KEY ou OPENAI_API_KEY no ambiente do deploy.";
  }

  if (lower.includes("429") || lower.includes("limite")) {
    return "A IA atingiu o limite de uso no momento. Tente novamente em alguns minutos.";
  }

  return message || fallback;
}
