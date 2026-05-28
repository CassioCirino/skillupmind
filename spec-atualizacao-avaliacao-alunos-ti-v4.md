# SPEC v4 — Dilemas Bilaterais e SJT

## 1. Problema

Escalas diretas do tipo "de 0 a 10, quanto você..." são fáceis de manipular porque o aluno tende a arrastar para 10.

Essa atualização reduz autoavaliação explícita e troca escalas lineares por dilemas bilaterais e testes de julgamento situacional.

## 2. Diretriz

Usar preferencialmente:

- SJT: cenário prático com alternativas de decisão.
- Dilema bilateral: dois caminhos plausíveis em tensão.
- Bifurcação simples: escolha entre caminhos com consequências descritas.
- Perguntas visuais e lógicas com resposta objetiva.

## 2.1 Distratores plausíveis

As alternativas incorretas não devem ser caricatas. Elas devem representar erros comuns e plausíveis:

- Resposta parcialmente correta, mas incompleta.
- Decisão rápida demais sem evidência suficiente.
- Excesso de análise que atrasa ação.
- Confusão conceitual comum em iniciantes.
- Atalho corporativo aceitável em alguns contextos, mas inferior ao melhor caminho.

Evitar opções obviamente absurdas quando a pergunta não for sobre isso. Sempre que possível, usar pontuação intermediária para alternativas parcialmente defensáveis.

## 3. Novo tipo de pergunta

Adicionar:

```ts
type QuestionType = "bilateral_scale";
```

Modelo:

```ts
bilateral?: {
  leftLabel: string;
  leftDescription: string;
  rightLabel: string;
  rightDescription: string;
  idealMin: number;
  idealMax: number;
};
```

Regras:

- O aluno vê "Caminho A" e "Caminho B", não "0" e "10".
- Não mostrar nota ou valor numérico como se 10 fosse melhor.
- A resposta continua salva como número de 0 a 10.
- A nota é 10 quando a resposta cai entre `idealMin` e `idealMax`.
- Fora da faixa ideal, a nota cai proporcionalmente pela distância.

## 4. Exemplo de dilema SJT

Cenário:

```txt
Durante uma reunião, surge um problema técnico urgente. O time está dividido.
Um caminho é decidir rápido com os dados disponíveis. Outro é pausar para coletar mais evidências.
Onde você se posiciona?
```

Âncora esquerda:

```txt
Caminho A — Decidir rápido
Você assume risco para destravar a equipe imediatamente.
```

Âncora direita:

```txt
Caminho B — Coletar evidências
Você reduz risco, mas pode atrasar a decisão.
```

Faixa ideal:

```txt
5 a 7
```

Interpretação:

- Extremo esquerdo: impulsividade.
- Extremo direito: excesso de análise.
- Faixa equilibrada: decisão com evidência suficiente e consciência de tempo.

## 5. Critérios de aceite

- Escalas autoavaliativas diretas devem ser substituídas por dilemas bilaterais sempre que fizer sentido.
- A UI não deve sugerir que o lado direito vale mais.
- O scoring deve permitir que a melhor resposta seja centro, esquerda ou direita, conforme a pergunta.
- O JSON deve salvar o valor escolhido e a nota calculada.
- O admin deve continuar vendo nota, relatório e mind map.
- Lint e build devem passar.
