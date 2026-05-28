import { buildAutomaticReport, buildRecommendedTracks } from "@/lib/report";
import { getLevel, scoreAssessment } from "@/lib/scoring";
import {
  AssessmentResult,
  AssessmentSubmission,
  SkillKey,
  SkillScore,
  StudentInfo,
  skillLabels,
  skillsOrder
} from "@/lib/types";

type RawStudent = StudentInfo & { classGroup?: string; course?: string };

type AnyResult = Omit<AssessmentResult, "skills"> & {
  student: RawStudent;
  skills: Record<string, SkillScore | undefined>;
};

const legacySkillMap: Record<SkillKey, string[]> = {
  logical_reasoning: ["programming_logic"],
  numerical_reasoning: ["programming_logic"],
  problem_solving: ["problem_solving"],
  programming_concepts: ["programming_logic", "javascript", "git"],
  data_concepts: ["database"],
  observability: ["problem_solving", "technical_organization"],
  professional_behavior: ["technical_organization"],
  technical_communication: ["technical_communication"],
  learning_profile: ["technical_organization", "technical_communication"]
};

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}

function normalizeStudent(student: RawStudent): StudentInfo {
  return {
    name: student.name,
    email: student.email,
    phone: student.phone,
    course: student.course ?? student.classGroup ?? "",
    college: student.college
  };
}

function scoreFromLegacy(result: AnyResult, skill: SkillKey) {
  const direct = result.skills[skill]?.score;

  if (typeof direct === "number") {
    return direct;
  }

  const scores = legacySkillMap[skill]
    .map((legacySkill) => result.skills[legacySkill]?.score)
    .filter((score): score is number => typeof score === "number");

  if (scores.length) {
    return roundOne(scores.reduce((total, score) => total + score, 0) / scores.length);
  }

  return roundOne(result.overallScore ?? 0);
}

function extremes(skills: AssessmentResult["skills"]) {
  const values = skillsOrder.map((skill) => ({
    label: skillLabels[skill],
    score: skills[skill].score
  }));
  const max = Math.max(...values.map((item) => item.score));
  const min = Math.min(...values.map((item) => item.score));

  return {
    strongestSkills: values.filter((item) => item.score === max).map((item) => item.label),
    weakestSkills: values.filter((item) => item.score === min).map((item) => item.label)
  };
}

function shouldRescoreCurrentAssessment(raw: AssessmentResult) {
  return (
    (raw.assessmentVersion === "v6" || raw.assessmentVersion === "v8") &&
    Array.isArray(raw.answers) &&
    raw.answers.length > 0
  );
}

function rescoreCurrentAssessment(raw: AssessmentResult): AssessmentResult {
  const student = normalizeStudent(raw.student as RawStudent);
  const answers = raw.answers.reduce<AssessmentSubmission["answers"]>((acc, answer) => {
    acc[answer.questionId] = answer.answer;
    return acc;
  }, {});
  const timings = raw.answers.reduce<NonNullable<AssessmentSubmission["timings"]>>(
    (acc, answer) => {
      if (
        typeof answer.timeSpentSeconds === "number" &&
        typeof answer.timeLimitSeconds === "number" &&
        typeof answer.timedOut === "boolean"
      ) {
        acc[answer.questionId] = {
          timeSpentSeconds: answer.timeSpentSeconds,
          timeLimitSeconds: answer.timeLimitSeconds,
          timedOut: answer.timedOut
        };
      }
      return acc;
    },
    {}
  );
  const rescored = scoreAssessment(
    { student, answers, timings },
    raw.id,
    raw.fileName,
    new Date(raw.createdAt)
  );

  return {
    ...rescored,
    createdAt: raw.createdAt,
    status: raw.status ?? "active",
    archivedAt: raw.archivedAt,
    archivedBy: raw.archivedBy
  };
}

export function normalizeAssessmentResult(raw: AssessmentResult): AssessmentResult {
  const result = raw as AnyResult;
  const hasV3Skills = skillsOrder.every((skill) => result.skills[skill]);

  if (shouldRescoreCurrentAssessment(raw)) {
    return rescoreCurrentAssessment(raw);
  }

  if (hasV3Skills) {
    return {
      ...raw,
      student: normalizeStudent(raw.student as RawStudent),
      assessmentVersion: raw.assessmentVersion ?? "v3",
      status: raw.status ?? "active"
    };
  }

  const normalizedSkills = skillsOrder.reduce((acc, skill) => {
    const score = scoreFromLegacy(result, skill);
    acc[skill] = {
      label: skillLabels[skill],
      score,
      level: getLevel(score)
    };
    return acc;
  }, {} as AssessmentResult["skills"]);

  const { strongestSkills, weakestSkills } = extremes(normalizedSkills);
  const skillScores = skillsOrder.reduce(
    (acc, skill) => {
      acc[skill] = normalizedSkills[skill].score;
      return acc;
    },
    {} as Record<SkillKey, number>
  );
  const recommendedTracks = buildRecommendedTracks(skillScores, raw.overallScore);
  const normalized: AssessmentResult = {
    ...raw,
    student: normalizeStudent(result.student),
    assessmentVersion: "legacy",
    status: raw.status ?? "active",
    skills: normalizedSkills,
    strongestSkills,
    weakestSkills,
    recommendedTracks
  };

  return {
    ...normalized,
    report: buildAutomaticReport(normalized)
  };
}
