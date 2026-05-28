# SPEC v6 — Temporizador e Tentativa Única

## 1. Temporizador por pergunta

Cada pergunta deve ter tempo individual e curto.

Regras:

- Exibir contagem regressiva durante a pergunta.
- Não permitir voltar para perguntas anteriores durante a avaliação.
- Se o tempo acabar, a pergunta é finalizada automaticamente.
- Se não houver resposta ao acabar o tempo, salvar a resposta como `__timeout__`.
- O tempo gasto deve ser salvo por pergunta.
- A nota final da pergunta deve considerar conteúdo e eficiência de tempo.

## 2. Pontuação temporal

Cada pergunta tem:

```ts
timeLimitSeconds?: number;
```

Cada resposta salva:

```ts
timeSpentSeconds: number;
timeLimitSeconds: number;
timeScore: number;
timedOut: boolean;
```

Regra:

- `contentScore` mede a resposta.
- `timeScore` mede a eficiência dentro do limite.
- `rawScore` final = `contentScore * 0.85 + timeScore * 0.15`.
- Se a pergunta expirar sem resposta, `rawScore = 0`.

## 3. Tentativa única por email

Cada email pode enviar apenas uma avaliação.

Regras:

- Normalizar email com `trim().toLowerCase()`.
- Antes de salvar, consultar resultados existentes.
- Se o email já existir, retornar `409`.
- A regra vale para resultados novos e antigos lidos pelo storage.

## 4. Critérios de aceite

- Toda pergunta mostra temporizador.
- O aluno não consegue voltar durante a avaliação.
- Tempo esgotado avança automaticamente.
- O JSON salva dados de tempo por resposta.
- A pontuação considera tempo.
- O mesmo email não consegue enviar duas avaliações.
- Lint e build passam.
