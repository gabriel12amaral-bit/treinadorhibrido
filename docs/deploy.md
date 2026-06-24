# Deploy e configuracao

## Variaveis obrigatorias

Configure estas variaveis no ambiente de deploy:

- `LOVABLE_API_KEY`: usada pelos recursos de IA no servidor quando usar Lovable AI Gateway.
- `OPENAI_API_KEY`: alternativa ao Lovable para rodar IA via API compativel com OpenAI.
- `OPENAI_MODEL`: modelo usado nas rotas de analise/importacao quando `OPENAI_API_KEY` estiver ativa. Padrao: `gpt-4.1-mini`.
- `OPENAI_COACH_MODEL`: modelo usado no chat do treinador quando `OPENAI_API_KEY` estiver ativa. Padrao: `OPENAI_MODEL`.
- `OPENAI_BASE_URL`: opcional para provedores compativeis com OpenAI. Padrao: `https://api.openai.com/v1`.
- `SUPABASE_URL`: URL do projeto Supabase para SSR/server functions.
- `SUPABASE_PUBLISHABLE_KEY`: chave publica do Supabase para SSR/server functions.
- `VITE_SUPABASE_URL`: URL publica exposta ao cliente.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: chave publica exposta ao cliente.

Use `LOVABLE_API_KEY` ou `OPENAI_API_KEY`; o app prioriza Lovable quando as duas existirem.

`SUPABASE_SERVICE_ROLE_KEY` so deve existir no servidor quando houver rotinas administrativas.
Nunca exponha essa chave no cliente.

## Vercel

O deploy usa `vercel.json` para forcar o build do TanStack Start/Nitro com preset da Vercel:

```json
{
  "buildCommand": "NITRO_PRESET=vercel npm run build",
  "installCommand": "npm install"
}
```

Na tela do projeto da Vercel, deixe o Build Command automatico ou igual ao do arquivo.

## Persistencia gradual

O app continua salvando em `localStorage` para compatibilidade. Quando o usuario estiver
autenticado e a tabela `public.app_state` existir, o estado tambem e sincronizado com Supabase.

Execute a migration em `supabase/migrations/20260623180000_app_state.sql` antes de depender da
persistencia remota em producao.

## Lint, formatacao e encoding

- `npm run format:check`: valida formatacao sem alterar arquivos.
- `npm run format`: aplica Prettier em lote, preferencialmente em uma tarefa separada.
- `npm run encoding:normalize`: regrava arquivos de texto selecionados como UTF-8.

Use a normalizacao de encoding em uma etapa controlada e revise o diff antes de misturar com
mudancas funcionais.
