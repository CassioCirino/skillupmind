# SPEC v9 - Avaliação Opcional de Texto Curto com IA

## 1. Objetivo

Melhorar a avaliação das perguntas abertas sem depender exclusivamente de palavras-chave.

A aplicação deve manter uma rubrica local conservadora e permitir, opcionalmente, o uso de uma API OpenAI-compatible, como NVIDIA NIM, para avaliar respostas textuais com mais contexto.

## 2. Regras de Segurança

- A IA não deve ser chamada para respostas sem sinais mínimos de conteúdo.
- Respostas como risadas, texto aleatório, frases muito curtas ou culpa sem evidência devem ser barradas pela rubrica local.
- Quando a nota local de texto curto for menor ou igual a 1, a resposta deve permanecer local.
- Se a IA falhar, a aplicação deve continuar funcionando com a rubrica local.
- O bônus de tempo continua zerado para texto curto com conteúdo menor que 4.

## 3. Variáveis de Ambiente

```env
AI_TEXT_SCORING_ENABLED=true
AI_TEXT_SCORING_BASE_URL=https://integrate.api.nvidia.com/v1
AI_TEXT_SCORING_API_KEY=
AI_TEXT_SCORING_MODEL=
NVIDIA_API_KEY=
```

Regras:

- `AI_TEXT_SCORING_ENABLED` deve ser `true` para ativar IA.
- `AI_TEXT_SCORING_API_KEY` tem prioridade.
- `NVIDIA_API_KEY` pode ser usado como alternativa.
- `AI_TEXT_SCORING_MODEL` é obrigatório quando IA estiver ativa.

## 4. Resultado Salvo

Cada resposta textual pode registrar:

- `evaluationSource`: `deterministic` ou `ai`.
- `evaluationReason`: justificativa curta.
- `evaluationModel`: modelo usado, quando houver IA.

## 5. Critérios de Aceite

- Sem variáveis de IA, o app continua funcionando pela rubrica local.
- Com IA configurada, respostas abertas válidas podem ser avaliadas por API.
- Respostas sem sentido continuam com nota baixa mesmo com IA ativada.
- Lint, TypeScript e build passam.
