# Midias dos exercicios

Esta pasta inclui animacoes SVG leves para praticamente todo o banco local de exercicios. Atualmente existem 158 arquivos SVG, incluindo os 149 exercicios cadastrados e alguns aliases usados em fichas importadas por PDF.

Padrao usado pelo app:

- exercicios do banco procuram `/exercises/<id-do-exercicio>.svg` automaticamente
- exercicios importados por PDF tambem tentam bater pelo nome normalizado
- aliases comuns continuam mapeados em `src/lib/hybrid.ts`

O app tambem aceita videos reais. Para trocar uma animacao por video, coloque um arquivo `.mp4` ou `.webm` aqui e altere o campo `media` do exercicio em `src/lib/hybrid.ts`.

Formato recomendado para videos reais:

- `.mp4` ou `.webm` curto
- 3 a 6 segundos
- loop limpo
- enquadramento quadrado ou vertical
- fundo simples
