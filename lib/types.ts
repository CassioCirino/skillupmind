export type College = "FICR" | "UCB";

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "code_reading"
  | "scenario"
  | "scale"
  | "bilateral_scale"
  | "short_text";

export type SkillKey =
  | "logical_reasoning"
  | "numerical_reasoning"
  | "problem_solving"
  | "programming_concepts"
  | "data_concepts"
  | "observability"
  | "professional_behavior"
  | "technical_communication"
  | "learning_profile";

export type Level = "Iniciante" | "Básico" | "Intermediário" | "Avançado";

export type StudentInfo = {
  name: string;
  email: string;
  phone: string;
  course: string;
  college: College;
};

export type QuestionOption = {
  label: string;
  value: string;
  score: number;
};

export type VisualPrompt = {
  kind: "pattern" | "matrix" | "flow" | "dashboard" | "ticket";
  title?: string;
  columns?: number;
  items: {
    label: string;
    tone?: "blue" | "green" | "orange" | "red" | "slate";
  }[];
};

export type BilateralPrompt = {
  leftLabel: string;
  leftDescription: string;
  rightLabel: string;
  rightDescription: string;
  idealMin: number;
  idealMax: number;
};

export type Question = {
  id: string;
  skill: SkillKey;
  type: QuestionType;
  title: string;
  code?: string;
  visual?: VisualPrompt;
  bilateral?: BilateralPrompt;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  timeLimitSeconds?: number;
  weight: number;
  required: boolean;
  rubric?: string;
  shuffleOptions?: boolean;
  reverseScale?: boolean;
};

export type AnswerValue = string | number | string[];

export const timedOutAnswer = "__timeout__";

export type QuestionTiming = {
  timeSpentSeconds: number;
  timeLimitSeconds: number;
  timedOut: boolean;
};

export type TextEvaluationSource = "deterministic" | "ai";

export type TextEvaluation = {
  score: number;
  source: TextEvaluationSource;
  reason?: string;
  model?: string;
};

export type AssessmentSubmission = {
  student: StudentInfo;
  answers: Record<string, AnswerValue>;
  timings?: Record<string, QuestionTiming>;
  textEvaluations?: Record<string, TextEvaluation>;
};

export type ScoredAnswer = {
  questionId: string;
  skill: SkillKey;
  type: QuestionType;
  answer: AnswerValue;
  contentScore: number;
  timeScore: number;
  timeSpentSeconds: number;
  timeLimitSeconds: number;
  timedOut: boolean;
  rawScore: number;
  weight: number;
  weightedScore: number;
  evaluationSource?: TextEvaluationSource;
  evaluationReason?: string;
  evaluationModel?: string;
};

export type SkillScore = {
  label: string;
  score: number;
  level: Level;
};

export type AssessmentVersion = "legacy" | "v3" | "v4" | "v6" | "v8" | "v9";
export type AssessmentStatus = "active" | "archived";

export type AssessmentResult = {
  assessmentVersion?: AssessmentVersion;
  status?: AssessmentStatus;
  archivedAt?: string;
  archivedBy?: string;
  id: string;
  fileName: string;
  createdAt: string;
  student: StudentInfo;
  answers: ScoredAnswer[];
  skills: Record<SkillKey, SkillScore>;
  overallScore: number;
  overallLevel: Level;
  strongestSkills: string[];
  weakestSkills: string[];
  recommendedTracks: string[];
  report: string;
};

export type RankingRow = {
  position: number;
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  college: College;
  overallScore: number;
  overallLevel: Level;
  bestSkill: string;
  weakestSkill: string;
  createdAt: string;
};

export const skillsOrder: SkillKey[] = [
  "logical_reasoning",
  "numerical_reasoning",
  "problem_solving",
  "programming_concepts",
  "data_concepts",
  "observability",
  "professional_behavior",
  "technical_communication",
  "learning_profile"
];

export const skillLabels: Record<SkillKey, string> = {
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

export const skillShortLabels: Record<SkillKey, string> = {
  logical_reasoning: "Lógica",
  numerical_reasoning: "Matemática",
  problem_solving: "Problemas",
  programming_concepts: "Programação",
  data_concepts: "Dados",
  observability: "Observabilidade",
  professional_behavior: "Postura",
  technical_communication: "Comunicação",
  learning_profile: "Aprendizagem"
};

export const questionWeights: Record<QuestionType, number> = {
  single_choice: 1,
  multiple_choice: 1.2,
  code_reading: 1.4,
  scenario: 1.5,
  scale: 0.6,
  bilateral_scale: 1,
  short_text: 1.2
};
