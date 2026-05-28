# SPEC v3 — Atualização da Avaliação de Alunos de TI

## 1. Objetivo da atualização

Revisar a aplicação de avaliação para que ela deixe de parecer uma prova técnica de linguagem e passe a medir prontidão inicial para TI de forma mais ampla.

A avaliação deve medir:

- Raciocínio lógico.
- Raciocínio lógico-matemático.
- Resolução estruturada de problemas.
- Conhecimento conceitual prévio em programação.
- Conceitos de dados e banco de dados.
- Noções iniciais de observabilidade e operação.
- Comunicação técnica.
- Postura profissional e normas corporativas.
- Perfil de aprendizagem e comportamento psicométrico básico.

## 2. Mudanças obrigatórias

### 2.1 Resultado somente para admin

O aluno não pode ver:

- Pontuação geral.
- Nível.
- Notas por habilidade.
- Relatório individual.
- Mind map.
- Ranking.

Ao final, o aluno deve ver apenas uma confirmação de envio.

A rota pública `/api/assessment` não deve retornar o objeto completo do resultado para o cliente público. Ela deve salvar o JSON e retornar apenas confirmação simples.

Relatório, notas, respostas e mind map só podem aparecer em:

- `/admin`
- `/admin/result/[id]`
- APIs administrativas protegidas.

### 2.2 Embaralhamento de alternativas

As alternativas não podem aparecer sempre na mesma ordem.

Regras:

- Embaralhar alternativas no cliente por tentativa de avaliação.
- O embaralhamento deve ser estável enquanto o aluno responde a avaliação.
- A correção deve continuar usando `value`, nunca a posição visual da alternativa.
- Perguntas sem alternativas não são afetadas.

### 2.3 Reposicionamento da avaliação

Reduzir perguntas centradas em sintaxe de JavaScript/HTML/CSS/Git.

Manter programação como competência, mas de forma conceitual:

- Entender o que é algoritmo.
- Entender entrada, processamento e saída.
- Reconhecer sequência lógica.
- Identificar conhecimento prévio sem exigir decorar comandos.

### 2.4 Novas competências internas

Usar as chaves:

```ts
type SkillKey =
  | "logical_reasoning"
  | "numerical_reasoning"
  | "problem_solving"
  | "programming_concepts"
  | "data_concepts"
  | "observability"
  | "professional_behavior"
  | "technical_communication"
  | "learning_profile";
```

Labels:

```ts
const skillLabels = {
  logical_reasoning: "Raciocínio Lógico",
  numerical_reasoning: "Lógico-Matemático",
  problem_solving: "Resolução de Problemas",
  programming_concepts: "Conceitos de Programação",
  data_concepts: "Dados e Banco de Dados",
  observability: "Observabilidade",
  professional_behavior: "Postura Profissional",
  technical_communication: "Comunicação Técnica",
  learning_profile: "Perfil de Aprendizagem"
};
```

## 3. Banco de perguntas v3

A avaliação deve ter cerca de 40 perguntas, podendo variar entre 38 e 45.

Distribuição recomendada:

| Área | Quantidade |
|---|---:|
| Raciocínio lógico | 6 |
| Lógico-matemático e visual | 5 |
| Resolução de problemas | 5 |
| Conceitos de programação | 5 |
| Dados e banco de dados | 4 |
| Observabilidade | 4 |
| Postura profissional | 5 |
| Comunicação técnica | 4 |
| Perfil de aprendizagem | 4 |
| **Total** | **42** |

## 4. Testes visuais

Incluir perguntas visuais simples quando possível.

Exemplos:

- Sequência de formas.
- Matriz de padrões.
- Ordem de etapas em fluxo.
- Identificação visual de inconsistência.

Os testes visuais devem ser renderizados pela aplicação com HTML/CSS, sem depender de imagens externas.

## 5. Tipos e pesos

Manter os tipos existentes:

```ts
type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "code_reading"
  | "scenario"
  | "scale"
  | "short_text";
```

Pesos:

| Tipo | Peso |
|---|---:|
| single_choice | 1.0 |
| multiple_choice | 1.2 |
| code_reading | 1.4 |
| scenario | 1.5 |
| scale | 0.6 |
| short_text | 1.2 |

Adicionar metadados opcionais ao modelo:

```ts
visual?: {
  kind: "pattern" | "matrix" | "flow";
  title?: string;
  columns?: number;
  items: {
    label: string;
    tone?: "blue" | "green" | "orange" | "red" | "slate";
  }[];
};
shuffleOptions?: boolean;
reverseScale?: boolean;
```

## 6. Perguntas psicométricas

Perguntas psicométricas não devem diagnosticar saúde mental nem personalidade clínica.

Devem medir apenas tendência operacional simples:

- Persistência.
- Organização.
- Colaboração.
- Clareza sob pressão.
- Disposição para aprender.
- Reação a feedback.

Se `reverseScale` for verdadeiro:

```txt
score = 10 - valor informado
```

## 7. Relatório automático

O relatório admin deve destacar:

- Pontuação geral.
- Nível.
- Competências fortes.
- Competências de risco.
- Indícios de conhecimento prévio.
- Perfil de aprendizagem.
- Recomendações de trilha.

Trilhas recomendadas:

- Raciocínio Lógico e Matemática Aplicada
- Resolução Estruturada de Problemas
- Fundamentos Conceituais de Programação
- Dados e Modelagem
- Observabilidade e Operação
- Comunicação e Reuniões Técnicas
- Postura Profissional em Projetos
- Métodos de Estudo e Aprendizagem
- Preparação para Projetos Reais

## 8. Critérios de aceite da atualização

A atualização estará pronta quando:

- O aluno finalizar a avaliação sem ver pontuação, relatório ou mind map.
- `/api/assessment` não retornar o resultado completo.
- O admin continuar vendo dashboard, ranking, gráficos, relatório, respostas e mind map.
- As alternativas aparecerem embaralhadas durante a avaliação.
- A correção continuar correta por `value`.
- O banco tiver cerca de 42 perguntas.
- As perguntas forem mais conceituais, lógicas, comportamentais e situacionais.
- Existirem testes visuais renderizados pela UI.
- O scoring continuar gerando notas de 0 a 10 por competência.
- O build e o lint passarem.
