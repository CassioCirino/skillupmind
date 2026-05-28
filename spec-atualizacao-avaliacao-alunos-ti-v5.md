# SPEC v5 — Curso e Distratores Plausíveis

## 1. Curso no lugar de turma

O formulário público e o admin devem usar `Curso`, não `Turma`.

Novas avaliações devem salvar:

```json
"student": {
  "course": "Análise e Desenvolvimento de Sistemas"
}
```

Para compatibilidade, JSONs antigos com `classGroup` devem continuar legíveis no admin e devem ser normalizados em memória para `course`.

## 2. Qualidade dos distratores

As alternativas incorretas devem ser plausíveis, com erros comuns de raciocínio, e não respostas obviamente erradas.

Critérios:

- Cada alternativa deve parecer defensável para um iniciante.
- Evitar humor, absurdos ou respostas fora do domínio.
- Usar notas intermediárias para respostas parcialmente corretas.
- Em perguntas SJT, alternativas devem representar escolhas reais em contexto corporativo.

## 3. Critérios de aceite

- O formulário mostra `Curso`.
- O admin filtra por `Curso`.
- Tabelas e relatório mostram `Curso`.
- `/api/assessment` aceita `course` e mantém compatibilidade com `classGroup`.
- JSONs antigos continuam visíveis.
- Distratores do banco de perguntas são plausíveis.
- Lint e build passam.
