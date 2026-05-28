# SPEC v7 - Arquivamento, Exclusao e Liberacao de Email

## 1. Bloqueio antes de iniciar

O email do aluno deve ser validado antes da tela de instrucoes.

Regras:

- Normalizar email com `trim().toLowerCase()`.
- Consultar resultados existentes antes de liberar a tela "Antes de começar".
- Se existir avaliacao ativa para o email, bloquear o inicio e exibir mensagem clara.
- A tentativa so continua sendo consumida quando a avaliacao e enviada.
- Se o aluno abandonar na tela de instrucoes, o email nao deve ser bloqueado.

## 2. Status de resultado

Cada resultado pode ter status:

```ts
type AssessmentStatus = "active" | "archived";
```

Regras:

- Resultados antigos sem status devem ser tratados como `active`.
- Resultados novos devem ser salvos como `active`.
- Resultados `archived` permanecem disponiveis para consulta administrativa.
- Resultados `archived` nao entram em ranking, medias, graficos e cards ativos.

## 3. Acoes administrativas

O dashboard admin deve permitir:

- Arquivar uma avaliacao.
- Desarquivar uma avaliacao.
- Apagar definitivamente uma avaliacao.

Regras:

- Arquivar adiciona `status: "archived"`, `archivedAt` e `archivedBy`.
- Desarquivar retorna o status para `active`.
- Apagar remove o JSON individual do storage.
- Acoes destrutivas devem pedir confirmacao visual.

## 4. Liberacao para refazer

O mesmo email so pode fazer nova avaliacao quando nao houver resultado ativo.

Regras:

- Resultado ativo bloqueia nova tentativa.
- Resultado arquivado nao bloqueia nova tentativa.
- Resultado apagado nao bloqueia nova tentativa.
- A API de envio tambem deve validar essa regra para evitar bypass do frontend.

## 5. Storage abstrato

A interface de storage deve expor operacoes para:

- `saveResult`
- `listResults`
- `getResult`
- `archiveResult`
- `deleteResult`

As implementacoes local e Vercel Blob devem preservar o mesmo contrato.

## 6. Criterios de aceite

- Email ativo nao chega na tela de instrucoes.
- Admin consegue arquivar e desarquivar.
- Admin consegue apagar resultado.
- Resultado arquivado libera o email para refazer.
- Ranking, graficos e estatisticas consideram apenas resultados ativos.
- Lista administrativa mostra ativos e arquivados com status visivel.
- Lint, TypeScript e build passam.
