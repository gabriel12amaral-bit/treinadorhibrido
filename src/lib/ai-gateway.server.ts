import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createLovableAiGatewayProvider(lovableApiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export function createOpenAIProvider(openAiApiKey: string, baseURL = "https://api.openai.com/v1") {
  return createOpenAICompatible({
    name: "openai",
    baseURL,
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
    },
  });
}
