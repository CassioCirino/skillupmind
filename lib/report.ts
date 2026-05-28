import {
  AssessmentResult,
  SkillKey,
  skillLabels,
  skillsOrder
} from "@/lib/types";

type ReportInput = Pick<
  AssessmentResult,
  "student" | "skills" | "overallScore" | "overallLevel" | "strongestSkills" | "weakestSkills" | "recommendedTracks"
>;

export function buildRecommendedTracks(scores: Record<SkillKey, number>, overallScore: number) {
  const tracks: string[] = [];

  if (scores.logical_reasoning < 6 || scores.numerical_reasoning < 6) {
    tracks.push("Raciocínio Lógico e Matemática Aplicada");
  }
  if (scores.problem_solving < 6) tracks.push("Resolução Estruturada de Problemas");
  if (scores.programming_concepts < 6) tracks.push("Fundamentos Conceituais de Programação");
  if (scores.data_concepts < 6) tracks.push("Dados e Modelagem");
  if (scores.observability < 6) tracks.push("Observabilidade e Operação");
  if (scores.professional_behavior < 6) tracks.push("Postura Profissional em Projetos");
  if (scores.technical_communication < 6) tracks.push("Comunicação Técnica");
  if (scores.learning_profile < 6) tracks.push("Métodos de Estudo e Aprendizagem");
  if (overallScore >= 8) tracks.push("Preparação para Projetos Reais");

  if (tracks.length === 0) {
    tracks.push("Preparação para Projetos Reais");
  }

  return tracks;
}

export function buildAutomaticReport(result: ReportInput) {
  const strongText = result.strongestSkills.length
    ? result.strongestSkills.join(", ")
    : "nenhuma competência destacada";
  const weakText = result.weakestSkills.length
    ? result.weakestSkills.join(", ")
    : "nenhuma competência crítica";
  const tracks = result.recommendedTracks.join(", ");
  const orderedScores = skillsOrder
    .map((skill) => `${skillLabels[skill]}: ${result.skills[skill].score}`)
    .join("; ");
  const priorKnowledge =
    result.skills.programming_concepts.score >= 7
      ? "há indícios de conhecimento prévio em programação conceitual"
      : "há oportunidade de reforçar fundamentos conceituais de programação";
  const learningProfile =
    result.skills.learning_profile.score >= 7
      ? "o perfil de aprendizagem sugere boa autonomia para evoluir com prática orientada"
      : "o perfil de aprendizagem indica necessidade de acompanhamento, rotina e feedback frequente";

  return `${result.student.name} obteve pontuação geral ${result.overallScore}/10, classificada como ${result.overallLevel}. O diagnóstico indica melhor desempenho em ${strongText} e maior necessidade de reforço em ${weakText}. Em conhecimento prévio, ${priorKnowledge}. Sobre comportamento de evolução, ${learningProfile}. Notas por competência: ${orderedScores}. A recomendação de estudos é priorizar: ${tracks}.`;
}
