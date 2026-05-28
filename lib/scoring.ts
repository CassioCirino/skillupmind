import { questions } from "@/lib/questions";
import { buildAutomaticReport, buildRecommendedTracks } from "@/lib/report";
import {
  AnswerValue,
  AssessmentResult,
  AssessmentSubmission,
  Level,
  Question,
  QuestionTiming,
  ScoredAnswer,
  SkillKey,
  skillLabels,
  skillsOrder,
  timedOutAnswer
} from "@/lib/types";

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}

export function getLevel(score: number): Level {
  if (score < 4) return "Iniciante";
  if (score < 6) return "Básico";
  if (score < 8) return "Intermediário";
  return "Avançado";
}

function clampScore(value: number, min = 0, max = 10) {
  if (Number.isNaN(value)) return 0;
  return Math.max(min, Math.min(max, value));
}

function isTimedOutAnswer(answer: AnswerValue) {
  return answer === timedOutAnswer;
}

function scoreBilateralScale(question: Question, answer: AnswerValue) {
  const value = clampScore(Number(answer), question.min ?? 0, question.max ?? 10);

  if (!question.bilateral) {
    return value;
  }

  const { idealMin, idealMax } = question.bilateral;
  if (value >= idealMin && value <= idealMax) {
    return 10;
  }

  const distance = value < idealMin ? idealMin - value : value - idealMax;
  const maxDistance = Math.max(idealMin - (question.min ?? 0), (question.max ?? 10) - idealMax, 1);

  return clampScore(10 - (distance / maxDistance) * 8);
}

function scoreChoice(question: Question, answer: AnswerValue) {
  const option = question.options?.find((item) => item.value === answer);
  return option?.score ?? 0;
}

function scoreMultipleChoice(question: Question, answer: AnswerValue) {
  if (!Array.isArray(answer) || !question.options?.length) return 0;

  const correctOptions = question.options.filter((option) => option.score >= 8);
  const correctValues = new Set(correctOptions.map((option) => option.value));
  const selected = new Set(answer);
  const selectedCorrect = [...selected].filter((value) => correctValues.has(value)).length;
  const selectedWrong = [...selected].filter((value) => !correctValues.has(value)).length;

  if (!correctOptions.length || !selected.size) return 0;

  return clampScore(((selectedCorrect - selectedWrong) / correctOptions.length) * 10);
}

export function scoreShortText(answer: AnswerValue) {
  if (typeof answer !== "string") return 0;

  const text = answer.trim().toLowerCase();
  if (text.length < 8) return 2;

  const keywords = [
    "erro",
    "evidência",
    "evidencias",
    "impacto",
    "horário",
    "horario",
    "console",
    "network",
    "rede",
    "api",
    "requisição",
    "requisicao",
    "dados",
    "log",
    "logs",
    "debug",
    "testar",
    "teste",
    "hipótese",
    "hipotese",
    "inspecionar",
    "bloqueio",
    "próximo",
    "proximo",
    "passo",
    "contexto"
  ];

  const matches = new Set(
    keywords.filter((keyword) => text.includes(keyword))
  );

  const hasStepByStep =
    /(primeiro|depois|em seguida|passo|1\.|2\.|verificaria|checaria)/i.test(text) &&
    text.length >= 80;

  if (matches.size >= 3 && hasStepByStep) return 10;
  if (matches.size >= 3) return 9;
  if (matches.size === 2) return 7;
  if (matches.size === 1) return 5;

  return 3;
}

export function scoreQuestion(question: Question, answer: AnswerValue): number {
  if (isTimedOutAnswer(answer)) {
    return 0;
  }

  switch (question.type) {
    case "single_choice":
    case "code_reading":
    case "scenario":
      return clampScore(scoreChoice(question, answer));
    case "multiple_choice":
      return scoreMultipleChoice(question, answer);
    case "scale":
      return question.reverseScale
        ? 10 - clampScore(Number(answer), question.min ?? 0, question.max ?? 10)
        : clampScore(Number(answer), question.min ?? 0, question.max ?? 10);
    case "bilateral_scale":
      return scoreBilateralScale(question, answer);
    case "short_text":
      return scoreShortText(answer);
    default:
      return 0;
  }
}

function scoreTime(timing: QuestionTiming | undefined, question: Question, answer: AnswerValue) {
  const limit = question.timeLimitSeconds ?? 45;
  const spent = Math.max(0, Math.min(timing?.timeSpentSeconds ?? limit, limit));
  const timedOut = Boolean(timing?.timedOut) || isTimedOutAnswer(answer);

  if (timedOut && isTimedOutAnswer(answer)) {
    return {
      timeSpentSeconds: limit,
      timeLimitSeconds: limit,
      timedOut: true,
      timeScore: 0
    };
  }

  const ratio = limit > 0 ? spent / limit : 1;
  const timeScore = clampScore(10 - Math.max(0, ratio - 0.35) * 8);

  return {
    timeSpentSeconds: roundOne(spent),
    timeLimitSeconds: limit,
    timedOut,
    timeScore: roundOne(timeScore)
  };
}

function getSkillExtremes(scores: Record<SkillKey, number>) {
  const values = skillsOrder.map((skill) => ({
    skill,
    label: skillLabels[skill],
    score: scores[skill]
  }));
  const max = Math.max(...values.map((item) => item.score));
  const min = Math.min(...values.map((item) => item.score));

  return {
    strongestSkills: values
      .filter((item) => item.score === max)
      .map((item) => item.label),
    weakestSkills: values
      .filter((item) => item.score === min)
      .map((item) => item.label)
  };
}

export function scoreAssessment(
  submission: AssessmentSubmission,
  id: string,
  fileName: string,
  createdAt: Date
): AssessmentResult {
  const scoredAnswers: ScoredAnswer[] = questions.map((question) => {
    const answer = submission.answers[question.id] ?? "";
    const contentScore = roundOne(scoreQuestion(question, answer));
    const timingScore = scoreTime(submission.timings?.[question.id], question, answer);
    const rawScore = isTimedOutAnswer(answer)
      ? 0
      : roundOne(contentScore * 0.85 + timingScore.timeScore * 0.15);

    return {
      questionId: question.id,
      skill: question.skill,
      type: question.type,
      answer,
      contentScore,
      timeScore: timingScore.timeScore,
      timeSpentSeconds: timingScore.timeSpentSeconds,
      timeLimitSeconds: timingScore.timeLimitSeconds,
      timedOut: timingScore.timedOut,
      rawScore,
      weight: question.weight,
      weightedScore: roundOne(rawScore * question.weight)
    };
  });

  const skillNumericScores = skillsOrder.reduce(
    (acc, skill) => {
      const skillAnswers = scoredAnswers.filter((answer) => answer.skill === skill);
      const weightedTotal = skillAnswers.reduce((total, answer) => total + answer.weightedScore, 0);
      const weightTotal = questions
        .filter((question) => question.skill === skill)
        .reduce((total, question) => total + question.weight, 0);

      acc[skill] = roundOne(weightTotal > 0 ? weightedTotal / weightTotal : 0);
      return acc;
    },
    {} as Record<SkillKey, number>
  );

  const skills = skillsOrder.reduce(
    (acc, skill) => {
      acc[skill] = {
        label: skillLabels[skill],
        score: skillNumericScores[skill],
        level: getLevel(skillNumericScores[skill])
      };

      return acc;
    },
    {} as AssessmentResult["skills"]
  );

  const overallScore = roundOne(
    skillsOrder.reduce((total, skill) => total + skillNumericScores[skill], 0) /
      skillsOrder.length
  );
  const overallLevel = getLevel(overallScore);
  const { strongestSkills, weakestSkills } = getSkillExtremes(skillNumericScores);
  const recommendedTracks = buildRecommendedTracks(skillNumericScores, overallScore);

  const resultWithoutReport: Omit<AssessmentResult, "report"> = {
    assessmentVersion: "v6",
    status: "active",
    id,
    fileName,
    createdAt: createdAt.toISOString(),
    student: submission.student,
    answers: scoredAnswers,
    skills,
    overallScore,
    overallLevel,
    strongestSkills,
    weakestSkills,
    recommendedTracks
  };

  return {
    ...resultWithoutReport,
    report: buildAutomaticReport(resultWithoutReport)
  };
}

export function buildRanking(results: AssessmentResult[]) {
  return [...results]
    .sort((a, b) => {
      if (b.overallScore !== a.overallScore) return b.overallScore - a.overallScore;
      if (b.skills.logical_reasoning.score !== a.skills.logical_reasoning.score) {
        return b.skills.logical_reasoning.score - a.skills.logical_reasoning.score;
      }
      if (b.skills.problem_solving.score !== a.skills.problem_solving.score) {
        return b.skills.problem_solving.score - a.skills.problem_solving.score;
      }
      if (b.skills.professional_behavior.score !== a.skills.professional_behavior.score) {
        return b.skills.professional_behavior.score - a.skills.professional_behavior.score;
      }
      return a.student.name.localeCompare(b.student.name, "pt-BR");
    })
    .map((result, index) => ({
      position: index + 1,
      id: result.id,
      name: result.student.name,
      email: result.student.email,
      phone: result.student.phone,
      course: result.student.course,
      college: result.student.college,
      overallScore: result.overallScore,
      overallLevel: result.overallLevel,
      bestSkill: result.strongestSkills[0] ?? "-",
      weakestSkill: result.weakestSkills[0] ?? "-",
      createdAt: result.createdAt
    }));
}
