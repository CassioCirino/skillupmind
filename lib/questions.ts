import { Question, questionWeights } from "@/lib/types";

const baseQuestions: Question[] = [
  {
    id: "q1",
    skill: "logical_reasoning",
    type: "single_choice",
    title: "Observe a sequência visual. Qual item completa melhor o padrão?",
    visual: {
      kind: "pattern",
      title: "Sequência",
      items: [
        { label: "Azul", tone: "blue" },
        { label: "Verde", tone: "green" },
        { label: "Azul", tone: "blue" },
        { label: "Verde", tone: "green" },
        { label: "?", tone: "slate" }
      ]
    },
    options: [
      { label: "Verde, mantendo o último item observado.", value: "green_repeat_last", score: 4 },
      { label: "Azul.", value: "blue", score: 10 },
      { label: "Uma terceira cor, pois a sequência pode mudar após dois pares.", value: "third_color", score: 3 },
      { label: "Verde, formando dois verdes seguidos antes de reiniciar.", value: "green_pair", score: 5 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q2",
    skill: "logical_reasoning",
    type: "scenario",
    title: "Todos os chamados críticos precisam de análise. Um chamado recebeu análise. O que é logicamente correto concluir?",
    options: [
      { label: "Ele pode ou não ser crítico; só sabemos que recebeu análise.", value: "may_or_may_not_be_critical", score: 10 },
      { label: "Ele provavelmente é crítico, porque recebeu uma etapa comum em chamados críticos.", value: "probably_critical", score: 5 },
      { label: "Ele só pode ser classificado após comparar prioridade, impacto e regra de triagem.", value: "needs_more_context", score: 7 },
      { label: "Ele deve ser tratado como crítico automaticamente para evitar risco.", value: "treat_as_critical", score: 4 }
    ],
    weight: questionWeights.scenario,
    required: true
  },
  {
    id: "q3",
    skill: "logical_reasoning",
    type: "single_choice",
    title: "Antes de propor uma solução, qual atitude mostra melhor raciocínio lógico?",
    options: [
      { label: "Escolher a ferramenta que a equipe já usa para ganhar velocidade.", value: "team_tool", score: 5 },
      { label: "Buscar uma solução parecida e adaptar ao caso atual.", value: "adapt_existing_solution", score: 6 },
      { label: "Entender o problema, entradas, restrições e resultado esperado.", value: "understand_problem", score: 10 },
      { label: "Pedir direcionamento ao líder antes de levantar hipóteses próprias.", value: "ask_leader_first", score: 4 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q4",
    skill: "logical_reasoning",
    type: "single_choice",
    title: "Qual etapa está faltando no fluxo lógico abaixo?",
    visual: {
      kind: "flow",
      title: "Problema → Dados disponíveis → ? → Decisão",
      items: [
        { label: "Problema", tone: "blue" },
        { label: "Dados", tone: "green" },
        { label: "?", tone: "slate" },
        { label: "Decisão", tone: "orange" }
      ]
    },
    options: [
      { label: "Análise das informações.", value: "analysis", score: 10 },
      { label: "Validação dos dados coletados.", value: "data_validation", score: 7 },
      { label: "Execução imediata da primeira solução possível.", value: "first_solution", score: 4 },
      { label: "Registro da decisão final.", value: "decision_record", score: 3 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q5",
    skill: "logical_reasoning",
    type: "multiple_choice",
    title: "Quais atitudes ajudam a transformar um problema confuso em um problema resolvível?",
    options: [
      { label: "Listar fatos conhecidos.", value: "known_facts", score: 10 },
      { label: "Separar hipóteses de certezas.", value: "hypotheses_vs_facts", score: 10 },
      { label: "Definir o que precisa ser descoberto.", value: "define_unknown", score: 10 },
      { label: "Começar pela hipótese mais provável antes de validar fatos.", value: "assume_without_test", score: 4 }
    ],
    weight: questionWeights.multiple_choice,
    required: true
  },
  {
    id: "q6",
    skill: "logical_reasoning",
    type: "bilateral_scale",
    title: "Dilema SJT: durante uma reunião, surge uma decisão urgente com informações incompletas. Onde você se posiciona?",
    bilateral: {
      leftLabel: "Caminho A — Decidir rápido",
      leftDescription: "Você destrava a equipe com o que já sabe, aceitando mais risco.",
      rightLabel: "Caminho B — Mapear melhor",
      rightDescription: "Você pede mais evidências antes de decidir, aceitando possível atraso.",
      idealMin: 5,
      idealMax: 7
    },
    min: 0,
    max: 10,
    weight: questionWeights.bilateral_scale,
    required: true
  },
  {
    id: "q7",
    skill: "numerical_reasoning",
    type: "single_choice",
    title: "Qual número completa a sequência: 2, 4, 8, 16, ?",
    options: [
      { label: "24.", value: "24", score: 5 },
      { label: "18.", value: "18", score: 2 },
      { label: "32.", value: "32", score: 10 },
      { label: "30.", value: "30", score: 4 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q8",
    skill: "numerical_reasoning",
    type: "scenario",
    title: "Um relatório mostra 80 tarefas concluídas de um total de 100. Qual é a taxa de conclusão?",
    options: [
      { label: "20%.", value: "20", score: 2 },
      { label: "80%.", value: "80", score: 10 },
      { label: "100%.", value: "100", score: 4 },
      { label: "8%.", value: "8", score: 1 }
    ],
    weight: questionWeights.scenario,
    required: true
  },
  {
    id: "q9",
    skill: "numerical_reasoning",
    type: "single_choice",
    title: "Observe a matriz. Qual célula parece quebrar o padrão de alternância?",
    visual: {
      kind: "matrix",
      columns: 3,
      items: [
        { label: "A", tone: "blue" },
        { label: "B", tone: "green" },
        { label: "A", tone: "blue" },
        { label: "B", tone: "green" },
        { label: "B", tone: "green" },
        { label: "B", tone: "green" }
      ]
    },
    options: [
      { label: "Linha 1, coluna 2.", value: "r1c2", score: 2 },
      { label: "Linha 2, coluna 2.", value: "r2c2", score: 10 },
      { label: "Linha 1, coluna 1.", value: "r1c1", score: 0 },
      { label: "Nenhuma célula quebra o padrão.", value: "none", score: 1 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q10",
    skill: "numerical_reasoning",
    type: "scenario",
    title: "Se uma atividade leva 15 minutos e você precisa repetir 4 vezes, qual estimativa de tempo é mais adequada?",
    options: [
      { label: "Aproximadamente 1 hora.", value: "one_hour", score: 10 },
      { label: "15 minutos no total.", value: "fifteen_total", score: 2 },
      { label: "45 minutos, considerando uma repetição a menos.", value: "forty_five", score: 5 },
      { label: "75 minutos, adicionando margem sem separar estimativa e contingência.", value: "seventy_five", score: 6 }
    ],
    weight: questionWeights.scenario,
    required: true
  },
  {
    id: "q11",
    skill: "numerical_reasoning",
    type: "bilateral_scale",
    title: "Dilema SJT: você precisa tomar uma decisão com poucos indicadores numéricos. Qual tendência combina mais com sua reação?",
    bilateral: {
      leftLabel: "Caminho A — Intuição primeiro",
      leftDescription: "Você decide pela percepção geral e usa números só como apoio.",
      rightLabel: "Caminho B — Evidência numérica",
      rightDescription: "Você compara percentuais, volume e tendência antes de recomendar algo.",
      idealMin: 6,
      idealMax: 8
    },
    min: 0,
    max: 10,
    weight: questionWeights.bilateral_scale,
    required: true
  },
  {
    id: "q12",
    skill: "problem_solving",
    type: "scenario",
    title: "Um processo falhou. Qual é a primeira atitude mais adequada?",
    options: [
      { label: "Procurar evidências: mensagem, horário, impacto e última alteração.", value: "collect_evidence", score: 10 },
      { label: "Reiniciar o processo para reduzir impacto e depois investigar.", value: "restart_then_investigate", score: 7 },
      { label: "Abrir chamado para outro time com descrição curta do erro.", value: "delegate_with_short_context", score: 5 },
      { label: "Comparar com ocorrências anteriores antes de olhar evidências atuais.", value: "history_first", score: 6 }
    ],
    weight: questionWeights.scenario,
    required: true
  },
  {
    id: "q13",
    skill: "problem_solving",
    type: "single_choice",
    title: "Ao investigar um problema, por que mudar uma coisa por vez ajuda?",
    options: [
      { label: "Porque facilita identificar o que causou mudança no resultado.", value: "isolate_cause", score: 10 },
      { label: "Porque reduz variáveis, mesmo que aumente o tempo da investigação.", value: "reduce_variables", score: 8 },
      { label: "Porque ajuda a documentar melhor, mas não necessariamente identifica causa.", value: "documentation_focus", score: 5 },
      { label: "Porque padroniza a execução, mesmo sem confirmar hipótese.", value: "standardize_execution", score: 4 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q14",
    skill: "problem_solving",
    type: "single_choice",
    title: "Qual etapa falta no ciclo visual de investigação?",
    visual: {
      kind: "flow",
      items: [
        { label: "Observar", tone: "blue" },
        { label: "Hipótese", tone: "orange" },
        { label: "Testar", tone: "green" },
        { label: "?", tone: "slate" }
      ]
    },
    options: [
      { label: "Registrar o resultado e aprender com ele.", value: "record_result", score: 10 },
      { label: "Acionar outro time com o que foi observado até ali.", value: "escalate_observations", score: 6 },
      { label: "Executar uma correção rápida e observar se melhora.", value: "quick_fix_observe", score: 5 },
      { label: "Voltar para a hipótese inicial sem registrar o teste.", value: "return_without_record", score: 3 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q15",
    skill: "problem_solving",
    type: "scenario",
    title: "Você tem três problemas ao mesmo tempo. Qual critério é melhor para priorizar?",
    options: [
      { label: "O que parece mais rápido de resolver para gerar avanço visível.", value: "quickest_visible_progress", score: 5 },
      { label: "O impacto para usuários, urgência e risco.", value: "impact_urgency_risk", score: 10 },
      { label: "O que desbloqueia mais pessoas da equipe no curto prazo.", value: "unblocks_team", score: 8 },
      { label: "O pedido do stakeholder mais sênior, se houver pressão externa.", value: "senior_stakeholder", score: 6 }
    ],
    weight: questionWeights.scenario,
    required: true
  },
  {
    id: "q16",
    skill: "problem_solving",
    type: "short_text",
    title: "Em até 300 caracteres, descreva como você investigaria uma tela que parou de carregar.",
    visual: {
      kind: "dashboard",
      title: "Cenário para leitura: indicadores do portal no momento da falha",
      items: [
        { label: "Usuários relatam tela em branco desde 10:45.", tone: "red" },
        { label: "Erros 5xx aumentaram após mudança às 10:42.", tone: "orange" },
        { label: "Volume de acessos está normal para o horário.", tone: "green" },
        { label: "API /matriculas aparece nos logs recentes.", tone: "blue" }
      ]
    },
    weight: questionWeights.short_text,
    required: true,
    timeLimitSeconds: 180,
    rubric: "Valoriza passos, evidências, erro, impacto, rede/API, dados, logs, hipótese e teste."
  },
  {
    id: "q17",
    skill: "programming_concepts",
    type: "single_choice",
    title: "Conceitualmente, o que é um algoritmo?",
    options: [
      { label: "Uma sequência organizada de passos para resolver um problema.", value: "ordered_steps", score: 10 },
      { label: "Um desenho visual que pode representar passos, mas não é obrigatório.", value: "visual_flow", score: 6 },
      { label: "Uma linguagem de programação específica usada para criar sistemas.", value: "specific_language", score: 4 },
      { label: "O resultado final esperado depois que o sistema executa.", value: "final_output", score: 3 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q18",
    skill: "programming_concepts",
    type: "scenario",
    title: "Em um sistema simples de cadastro, qual trio representa melhor entrada, processamento e saída?",
    options: [
      { label: "Formulário, botão de salvar e tela de confirmação.", value: "form_button_confirmation", score: 6 },
      { label: "Nome digitado, validação dos dados e confirmação de cadastro.", value: "input_process_output", score: 10 },
      { label: "Banco de dados, tela inicial e usuário logado.", value: "database_screen_user", score: 4 },
      { label: "Campo obrigatório, mensagem de erro e atualização visual.", value: "required_error_visual", score: 7 }
    ],
    weight: questionWeights.scenario,
    required: true
  },
  {
    id: "q19",
    skill: "programming_concepts",
    type: "single_choice",
    title: "Para que serve uma condição do tipo 'se... então...' em programação?",
    options: [
      { label: "Para escolher entre caminhos possíveis conforme uma regra.", value: "choose_paths", score: 8 },
      { label: "Para executar uma ação dependendo de uma regra.", value: "conditional_rule", score: 10 },
      { label: "Para validar dados antes de gravar uma informação.", value: "validate_before_save", score: 7 },
      { label: "Para organizar instruções em uma sequência fixa.", value: "fixed_sequence", score: 4 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q20",
    skill: "programming_concepts",
    type: "single_choice",
    title: "Qual exemplo melhor representa repetição?",
    options: [
      { label: "Verificar uma lista de alunos, um por um, até terminar.", value: "iterate_students", score: 10 },
      { label: "Validar apenas o primeiro aluno da lista antes de salvar.", value: "validate_first_only", score: 4 },
      { label: "Executar uma regra quando a média for maior que 7.", value: "conditional_average", score: 5 },
      { label: "Organizar os dados de um aluno em campos nome, email e curso.", value: "structure_student", score: 3 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q21",
    skill: "programming_concepts",
    type: "bilateral_scale",
    title: "Dilema SJT: você recebe uma tarefa simples que envolve lógica de programação, mas ainda não conhece a ferramenta usada. O que tende a fazer?",
    bilateral: {
      leftLabel: "Caminho A — Começar pela tentativa",
      leftDescription: "Você mexe direto na solução e aprende pelo erro, mesmo sem organizar conceitos.",
      rightLabel: "Caminho B — Conceituar antes",
      rightDescription: "Você identifica entradas, regras e saídas antes de escolher a ferramenta.",
      idealMin: 6,
      idealMax: 8
    },
    min: 0,
    max: 10,
    weight: questionWeights.bilateral_scale,
    required: true
  },
  {
    id: "q22",
    skill: "data_concepts",
    type: "single_choice",
    title: "Em banco de dados, por que um identificador único é importante?",
    options: [
      { label: "Para facilitar buscas e evitar misturar registros parecidos.", value: "search_and_avoid_mix", score: 8 },
      { label: "Para diferenciar registros parecidos sem confusão.", value: "differentiate_records", score: 10 },
      { label: "Para padronizar relatórios, mesmo quando nomes mudam.", value: "standardize_reports", score: 6 },
      { label: "Para reduzir duplicidades, embora ainda precise de validação de dados.", value: "reduce_duplicates", score: 7 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q23",
    skill: "data_concepts",
    type: "scenario",
    title: "Uma planilha tem o mesmo aluno escrito de três formas diferentes. Qual risco isso gera?",
    options: [
      { label: "Pode parecer detalhe visual, mas tende a afetar apenas a tela.", value: "visual_detail", score: 2 },
      { label: "Pode causar duplicidade e análises incorretas.", value: "duplicates_wrong_analysis", score: 10 },
      { label: "Pode ser resolvido no relatório final, sem mexer na origem.", value: "fix_in_report", score: 5 },
      { label: "Pode dificultar busca, mas não necessariamente impactar indicadores.", value: "search_only", score: 4 }
    ],
    weight: questionWeights.scenario,
    required: true
  },
  {
    id: "q24",
    skill: "data_concepts",
    type: "single_choice",
    title: "Qual pergunta é mais útil antes de criar uma estrutura de dados?",
    options: [
      { label: "Quais telas vão consumir esses dados primeiro?", value: "consumer_screens", score: 6 },
      { label: "Quais informações preciso guardar e como elas se relacionam?", value: "data_and_relationships", score: 10 },
      { label: "Qual relatório final será apresentado ao gestor?", value: "final_report", score: 7 },
      { label: "Qual ferramenta será usada para armazenar os dados?", value: "storage_tool", score: 5 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q25",
    skill: "data_concepts",
    type: "bilateral_scale",
    title: "Dilema SJT: você recebeu uma lista de alunos com nomes duplicados, telefones faltando e cursos inconsistentes. Qual caminho você tende a escolher?",
    bilateral: {
      leftLabel: "Caminho A — Usar como veio",
      leftDescription: "Você gera uma primeira versão do relatório e corrige inconsistências se elas aparecerem na análise.",
      rightLabel: "Caminho B — Tratar os dados",
      rightDescription: "Você valida duplicidades, campos obrigatórios e padrões antes de analisar.",
      idealMin: 7,
      idealMax: 9
    },
    min: 0,
    max: 10,
    weight: questionWeights.bilateral_scale,
    required: true
  },
  {
    id: "q26",
    skill: "observability",
    type: "single_choice",
    title: "Em tecnologia, observabilidade ajuda principalmente a quê?",
    options: [
      { label: "Entender o comportamento de sistemas por evidências como métricas, logs e eventos.", value: "understand_by_signals", score: 10 },
      { label: "Acompanhar indicadores técnicos para perceber mudanças de comportamento.", value: "track_indicators", score: 8 },
      { label: "Centralizar alertas para reduzir tempo de reação.", value: "centralize_alerts", score: 7 },
      { label: "Automatizar respostas para incidentes conhecidos.", value: "automate_known_incidents", score: 5 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q27",
    skill: "observability",
    type: "scenario",
    title: "Um sistema ficou lento às 10h. Qual informação é mais útil para começar a investigar?",
    options: [
      { label: "Métricas de tempo de resposta, volume, erros e alterações próximas ao horário.", value: "metrics_errors_changes", score: 10 },
      { label: "Relato dos usuários impactados e horário aproximado de início.", value: "user_reports_time", score: 7 },
      { label: "Comparação com incidentes parecidos ocorridos no passado.", value: "past_incidents", score: 6 },
      { label: "Lista de mudanças planejadas para os próximos dias.", value: "future_changes", score: 3 }
    ],
    weight: questionWeights.scenario,
    required: true
  },
  {
    id: "q28",
    skill: "observability",
    type: "single_choice",
    title: "Qual frase diferencia melhor sintoma e causa?",
    options: [
      { label: "Sintoma é o que aparece; causa é o motivo provável por trás do sintoma.", value: "symptom_vs_cause", score: 10 },
      { label: "Sintoma é a percepção do usuário; causa é uma hipótese que precisa ser validada.", value: "validated_hypothesis", score: 8 },
      { label: "Sintoma é o alerta; causa é o componente indicado pelo alerta.", value: "alert_component", score: 5 },
      { label: "Sintoma é o erro mais recente; causa é a última mudança feita.", value: "latest_change", score: 4 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q29",
    skill: "observability",
    type: "bilateral_scale",
    title: "Dilema SJT: um sistema crítico ficou lento. O gestor quer uma ação rápida, mas a causa ainda não está clara. Como você equilibra?",
    bilateral: {
      leftLabel: "Caminho A — Aliviar o sintoma",
      leftDescription: "Você age rápido para reduzir impacto, mesmo sem entender totalmente a causa.",
      rightLabel: "Caminho B — Investigar a causa",
      rightDescription: "Você coleta métricas, logs e eventos para evitar agir sem evidência.",
      idealMin: 5,
      idealMax: 8
    },
    min: 0,
    max: 10,
    weight: questionWeights.bilateral_scale,
    required: true
  },
  {
    id: "q30",
    skill: "professional_behavior",
    type: "scenario",
    title: "Em uma reunião técnica, você discorda de uma proposta. Qual postura é mais adequada?",
    options: [
      { label: "Levantar a preocupação no momento, mesmo sem organizar todos os dados.", value: "raise_concern_early", score: 6 },
      { label: "Apresentar evidências, perguntar premissas e propor alternativa com respeito.", value: "respectful_evidence", score: 10 },
      { label: "Aguardar o fim da reunião e enviar sua discordância por mensagem.", value: "message_after", score: 5 },
      { label: "Pedir mais tempo para analisar antes de validar a proposta.", value: "ask_time_to_analyze", score: 7 }
    ],
    weight: questionWeights.scenario,
    required: true
  },
  {
    id: "q31",
    skill: "professional_behavior",
    type: "single_choice",
    title: "Qual atitude demonstra melhor norma corporativa sobre confidencialidade?",
    options: [
      { label: "Compartilhar evidências apenas em canais internos do projeto, com cuidado para dados sensíveis.", value: "internal_evidence", score: 7 },
      { label: "Usar dados reais em teste quando houver autorização e necessidade clara.", value: "authorized_real_data", score: 8 },
      { label: "Tratar informações internas como restritas e compartilhar apenas com quem precisa.", value: "need_to_know", score: 10 },
      { label: "Remover nomes e documentos antes de circular exemplos para estudo.", value: "anonymize_examples", score: 9 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q32",
    skill: "professional_behavior",
    type: "scenario",
    title: "Você percebe que não conseguirá entregar uma atividade no prazo. O que fazer?",
    options: [
      { label: "Avisar cedo, explicar o risco e negociar prioridade ou apoio.", value: "early_warning", score: 10 },
      { label: "Entregar uma versão parcial validada e combinar o restante.", value: "partial_delivery", score: 8 },
      { label: "Pedir ajuda técnica sem revisar o escopo ou prazo.", value: "ask_help_only", score: 5 },
      { label: "Trabalhar mais tempo em silêncio e avisar apenas se realmente atrasar.", value: "silent_overtime", score: 4 }
    ],
    weight: questionWeights.scenario,
    required: true
  },
  {
    id: "q33",
    skill: "professional_behavior",
    type: "scenario",
    title: "Você recebe feedback sobre um erro. Qual reação favorece aprendizado e confiança?",
    options: [
      { label: "Ouvir, entender o ponto, corrigir e combinar prevenção.", value: "listen_correct_prevent", score: 10 },
      { label: "Explicar seu raciocínio primeiro e depois avaliar a correção.", value: "explain_then_evaluate", score: 6 },
      { label: "Corrigir rapidamente sem discutir a causa para evitar exposição.", value: "fix_without_cause", score: 5 },
      { label: "Pedir exemplos concretos antes de aceitar o feedback.", value: "ask_examples", score: 7 }
    ],
    weight: questionWeights.scenario,
    required: true
  },
  {
    id: "q34",
    skill: "professional_behavior",
    type: "bilateral_scale",
    title: "Dilema SJT: em uma reunião, você percebe uma possível falha no plano enquanto outra pessoa ainda explica. O que tende a fazer?",
    bilateral: {
      leftLabel: "Caminho A — Intervir cedo",
      leftDescription: "Você interrompe rapidamente para evitar que o grupo siga no caminho errado.",
      rightLabel: "Caminho B — Ouvir até o fim",
      rightDescription: "Você espera a pessoa concluir para garantir que entendeu todo o contexto.",
      idealMin: 5,
      idealMax: 7
    },
    min: 0,
    max: 10,
    weight: questionWeights.bilateral_scale,
    required: true
  },
  {
    id: "q35",
    skill: "technical_communication",
    type: "scenario",
    title: "Qual mensagem comunica melhor um problema técnico?",
    options: [
      { label: "A tela de salvar falhou para alguns usuários; ainda estou confirmando horário e impacto.", value: "partial_context", score: 6 },
      { label: "Ao tentar salvar às 14h, aparece erro 500 para três usuários. Anexei evidências e passos.", value: "specific_evidence", score: 10 },
      { label: "O sistema apresenta erro ao salvar; acredito que seja algo na API.", value: "probable_api", score: 5 },
      { label: "Usuários relataram falha, mas ainda não tenho evidências técnicas.", value: "user_report_no_evidence", score: 4 }
    ],
    weight: questionWeights.scenario,
    required: true
  },
  {
    id: "q36",
    skill: "technical_communication",
    type: "single_choice",
    title: "Ao pedir ajuda, qual informação aumenta a chance de uma resposta útil?",
    options: [
      { label: "O que você tentou, o erro observado e o resultado esperado.", value: "attempt_error_expected", score: 10 },
      { label: "Um print, o horário e a ação que gerou o erro.", value: "print_time_action", score: 7 },
      { label: "A mensagem de erro e o link da tela afetada.", value: "error_and_link", score: 6 },
      { label: "Um resumo do problema e a urgência do pedido.", value: "summary_urgency", score: 5 }
    ],
    weight: questionWeights.single_choice,
    required: true
  },
  {
    id: "q37",
    skill: "technical_communication",
    type: "short_text",
    title: "Em até 300 caracteres, escreva uma atualização de status para uma tarefa que está bloqueada.",
    visual: {
      kind: "ticket",
      title: "Cenário para leitura: tarefa bloqueada no quadro do projeto",
      items: [
        { label: "Erro 422: campo courseId ausente na requisição.", tone: "red" },
        { label: "Arquivo CSV foi validado manualmente.", tone: "green" },
        { label: "Bloqueio impede importação de 48 matrículas.", tone: "orange" },
        { label: "Próximo apoio necessário: confirmar contrato da API.", tone: "blue" }
      ]
    },
    weight: questionWeights.short_text,
    required: true,
    timeLimitSeconds: 180,
    rubric: "Valoriza contexto, bloqueio, impacto, tentativa feita, próximo passo e pedido claro."
  },
  {
    id: "q38",
    skill: "technical_communication",
    type: "bilateral_scale",
    title: "Dilema SJT: você precisa explicar um problema técnico para pessoas técnicas e não técnicas na mesma reunião. Como ajusta a comunicação?",
    bilateral: {
      leftLabel: "Caminho A — Simplificar muito",
      leftDescription: "Você evita termos técnicos para garantir que todos acompanhem.",
      rightLabel: "Caminho B — Ser técnico",
      rightDescription: "Você usa termos precisos para não perder rigor na explicação.",
      idealMin: 5,
      idealMax: 7
    },
    min: 0,
    max: 10,
    weight: questionWeights.bilateral_scale,
    required: true
  },
  {
    id: "q39",
    skill: "learning_profile",
    type: "bilateral_scale",
    title: "Dilema SJT: você precisa aprender uma ferramenta nova para entregar uma atividade nesta semana. Qual tendência pesa mais?",
    bilateral: {
      leftLabel: "Caminho A — Praticar logo",
      leftDescription: "Você abre a ferramenta e aprende executando exemplos pequenos.",
      rightLabel: "Caminho B — Estudar primeiro",
      rightDescription: "Você lê conceitos, documentação e anota dúvidas antes de praticar.",
      idealMin: 4,
      idealMax: 7
    },
    min: 0,
    max: 10,
    weight: questionWeights.bilateral_scale,
    required: true
  },
  {
    id: "q40",
    skill: "learning_profile",
    type: "bilateral_scale",
    title: "Dilema SJT: a primeira tentativa de resolver um exercício falhou. Qual reação tende a aparecer?",
    bilateral: {
      leftLabel: "Caminho A — Persistir no caminho",
      leftDescription: "Você insiste mais um pouco na mesma hipótese para ver se faltou detalhe.",
      rightLabel: "Caminho B — Trocar de abordagem",
      rightDescription: "Você muda a estratégia rapidamente para evitar perder tempo.",
      idealMin: 4,
      idealMax: 6
    },
    min: 0,
    max: 10,
    weight: questionWeights.bilateral_scale,
    required: true
  },
  {
    id: "q41",
    skill: "learning_profile",
    type: "scenario",
    title: "Você precisa aprender uma ferramenta nova para uma atividade. Qual abordagem tende a funcionar melhor?",
    options: [
      { label: "Ler objetivo básico, fazer um teste simples, registrar dúvidas e evoluir por partes.", value: "incremental_learning", score: 10 },
      { label: "Assistir a um tutorial completo antes de tocar na ferramenta.", value: "tutorial_first", score: 5 },
      { label: "Pedir um exemplo pronto e adaptar para o seu caso.", value: "adapt_example", score: 7 },
      { label: "Explorar a ferramenta livremente e anotar dúvidas depois.", value: "explore_then_notes", score: 6 }
    ],
    weight: questionWeights.scenario,
    required: true
  },
  {
    id: "q42",
    skill: "learning_profile",
    type: "scenario",
    title: "Qual comportamento indica melhor colaboração em um grupo de estudo ou projeto?",
    options: [
      { label: "Compartilhar aprendizados, perguntar com clareza e ajudar a organizar próximos passos.", value: "collaborative_learning", score: 10 },
      { label: "Assumir a parte mais difícil para acelerar, mesmo comunicando pouco.", value: "take_hard_part", score: 5 },
      { label: "Dividir tarefas rapidamente e alinhar apenas no final.", value: "split_align_later", score: 6 },
      { label: "Ajudar quando perguntam, mas focar primeiro na sua própria entrega.", value: "help_when_asked", score: 7 }
    ],
    weight: questionWeights.scenario,
    required: true
  }
];

function getDefaultTimeLimitSeconds(question: Question) {
  if (question.type === "short_text") return 90;
  if (question.type === "bilateral_scale") return 35;
  if (question.type === "multiple_choice") return 50;
  if (question.type === "scenario") return 45;
  if (question.visual) return 45;
  return 35;
}

export const questions: Question[] = baseQuestions.map((question) => ({
  shuffleOptions: question.options ? true : undefined,
  ...question,
  timeLimitSeconds: question.timeLimitSeconds ?? getDefaultTimeLimitSeconds(question)
}));
