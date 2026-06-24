# Plataforma Completa de Treino com IA

Vou expandir o app em quatro frentes: banco de exercícios robusto, gerador inteligente baseado em regras reais, registro com progressão de carga e treinador virtual por IA.

## 1. Banco de Exercícios (~150)

Expandir `src/lib/hybrid.ts` (constante `EXERCISES`) de 42 para ~150 exercícios cobrindo todas as listas pedidas (Peito, Costas, Ombros, Bíceps, Tríceps, Quadríceps, Posterior, Glúteos, Panturrilhas, Abdômen, Antebraço, Cardio).

Cada exercício passa a ter:
- `id`, `name`, `image` (emoji por enquanto — placeholder p/ GIF futuro)
- `group` (principal) + `secondary` (array opcional)
- `pattern`: `"push-horizontal" | "push-vertical" | "pull-vertical" | "pull-horizontal" | "squat" | "hinge" | "lunge" | "isolation-*" | "core" | "carry" | "cardio"`
- `type`: `"composto" | "isolador"`
- `equipment`, `difficulty`, `cues` (execução), `safety` (dicas), `defaultSets`, `defaultReps`, `defaultRestSec`

Substituições inteligentes: função `findAlternatives(exerciseId, { equipment, level })` retorna exercícios do mesmo `pattern` compatíveis.

## 2. Geração Inteligente

Reescrever `generatePlan` / `pickStrength` / `assignSplits` em `src/lib/hybrid.ts` para seguir as regras:

**Divisões por frequência**
- 2d: Full Body A/B
- 3d: Push / Pull / Legs
- 4d: Upper / Lower / Upper / Lower
- 5d: Push / Pull / Legs / Upper / Lower
- 6d: PPL x2

**Volume mínimo por sessão**
- Push: 3-5 peito + 2-3 ombro + 2-3 tríceps
- Pull: 4-5 costas + 2-3 bíceps
- Legs: quad + posterior + glúteos + panturrilha + core
- Upper/Lower e Full Body com cotas equivalentes
- Mínimo absoluto: 6 exercícios

**Regras**
- Compostos primeiro, isoladores depois (ordem por `type`)
- Variação ao regenerar: shuffle determinístico semeado por semana para que regenerar dê treinos diferentes
- Filtragem por `equipment` (`Academia completa | básica | Casa halteres | Casa sem equip`) — novo campo no perfil
- Filtragem por `difficulty` ≤ nível do usuário
- Respeito a `noLegOn` (esportes adjacentes) e restrições físicas — mantém lógica atual
- Séries/reps/descanso por objetivo: força 5x4-6/150s, hipertrofia 4x8-12/75s, emagrecimento 3x12-15/45s, condicionamento misto

Adicionar campo `equipment` ao `Profile` e step correspondente em `src/routes/onboarding.tsx`.

## 3. Registro de Treino com Progressão

Atualizar a tela de execução (rota do treino do dia):
- Por exercício: nome, emoji/imagem, séries x reps prescritas, descanso, grupo muscular, dicas (collapsible)
- Por série: campos `carga` e `reps realizadas`, botão "Concluir série" e cronômetro de descanso (countdown)
- Histórico: mostrar última carga registrada do mesmo exercício
- Sugestão automática: se atingiu/excedeu o topo da faixa de reps em todas as séries → sugerir +2.5kg (ou +5kg em compostos pesados). Se ficou abaixo → manter. Lógica em `suggestNextLoad(exerciseId, history)`.

Já existe `logSet` no store; estender com `getLastLog(exerciseId)` e `getSuggestedLoad(exerciseId, target)`.

## 4. Treinador Virtual (IA)

Nova rota `src/routes/coach.tsx` — chat com a IA usando server function `askCoach` (createServerFn) que chama Lovable AI Gateway com contexto: perfil, últimos 30 dias de logs, treino atual, evolução.

Capabilities do prompt do sistema:
- Explicar execução de exercícios (consulta o banco)
- Sugerir progressões/deload com base no histórico
- Detectar estagnação (3+ semanas sem progressão num composto)
- Ajustar volume / sugerir alterações no plano

## 5. UI / Navegação

- Atualizar `/exercicios` para mostrar os novos campos (filtro por padrão de movimento, equipamento, nível)
- Página `/exercicio/$id` com cues, safety, alternativas
- Adicionar entrada do Coach na navegação

## Arquivos afetados

- `src/lib/hybrid.ts` — expansão do banco, novos tipos, novo gerador, helpers de progressão e alternativas
- `src/lib/store.ts` — `getLastLog`, `getSuggestedLoad`
- `src/lib/coach.functions.ts` (novo) — server fn IA
- `src/routes/onboarding.tsx` — step de equipamento
- `src/routes/exercicios.tsx` — filtros novos
- `src/routes/exercicio.$id.tsx` — campos novos
- `src/routes/index.tsx` ou rota de execução — UI de série + cronômetro + sugestão
- `src/routes/coach.tsx` (novo) — chat IA
- `src/routes/__root.tsx` — link de navegação

## Escopo e tempo

É um pacote grande. Vou implementar tudo numa sequência só após sua aprovação, mas avise se prefere fatiar:

1. Banco + gerador (núcleo)
2. Registro com cronômetro + progressão
3. Coach IA
4. Polimento de UI

Quer que eu execute o pacote completo de uma vez, ou prefere começar pela fatia 1?
