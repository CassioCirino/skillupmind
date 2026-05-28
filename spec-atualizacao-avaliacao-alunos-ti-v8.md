# SPEC v8 - Rubrica Mais Rigorosa para Texto Curto

## 1. Problema

As perguntas abertas de texto curto aceitavam respostas sem conteúdo suficiente com pontuação inicial alta.

Exemplos que não devem receber nota útil:

- `ahahahah`
- `Aluno não sabe usar`
- Frases genéricas sem evidência, ação ou relação com o cenário.

## 2. Regra de sentido mínimo

A pontuação de texto curto deve validar sinais mínimos de conteúdo antes de aplicar nota.

Critérios:

- Rejeitar ruído, risada, repetição e texto muito curto.
- Exigir quantidade mínima de palavras e diversidade mínima.
- Penalizar resposta culpabilizante sem evidência ou ação.
- Não conceder bônus de tempo quando o conteúdo textual for insuficiente.

## 3. Sinais positivos

Uma resposta deve pontuar melhor quando apresentar:

- Evidências do cenário, como erro, API, logs, horário, 5xx, 422, CSV, courseId, matrículas.
- Ações de investigação ou comunicação, como verificar, checar, analisar, testar, validar, confirmar.
- Impacto e próximo passo, como bloqueio, impacto, apoio necessário, contrato, tentativa, prazo.
- Estrutura clara, como primeiro passo, depois, status, próximo passo.

## 4. Pontuação temporal

Para perguntas `short_text`:

- Se a nota de conteúdo for menor que 4, o bônus de tempo deve ser zerado.
- Resposta rápida sem conteúdo não deve aumentar a nota final.

## 5. Reprocessamento de resultados

Resultados salvos em versões `v6` ou `v8` devem ser recalculados ao serem lidos pelo storage.

Objetivo:

- Corrigir relatórios antigos sem editar manualmente os JSONs.
- Aplicar a rubrica atual no dashboard, ranking e relatório individual.

## 6. Critérios de aceite

- `ahahahah` recebe 0 em texto curto.
- `Aluno não sabe usar` recebe nota baixa.
- Resposta curta com apenas uma pista recebe nota limitada.
- Resposta com evidência, ação, impacto e próximo passo pode chegar a 10.
- Lint, TypeScript e build passam.
