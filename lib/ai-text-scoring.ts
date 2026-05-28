import { questions } from "@/lib/questions";
import { scoreShortText } from "@/lib/scoring";
import { AssessmentSubmission, Question, TextEvaluation } from "@/lib/types";

type ChatCompletionResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

type AiGrade = {
  score?: number;
  reason?: string;
};

function getAiConfig() {
  return {
    enabled: process.env.AI_TEXT_SCORING_ENABLED === "true",
    apiKey: process.env.AI_TEXT_SCORING_API_KEY ?? process.env.NVIDIA_API_KEY,
    baseUrl:
      process.env.AI_TEXT_SCORING_BASE_URL ??
      "https://integrate.api.nvidia.com/v1",
    model: process.env.AI_TEXT_SCORING_MODEL
  };
}

function clampScore(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(10, Math.round(value * 10) / 10));
}

function extractJson(content: string): AiGrade | null {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    return JSON.parse(jsonMatch[0]) as AiGrade;
  } catch {
    return null;
  }
}

function visualContext(question: Question) {
  if (!question.visual?.items.length) return "";

  return question.visual.items.map((item) => `- ${item.label}`).join("\n");
}

async function scoreWithAi(question: Question, answer: string): Promise<TextEvaluation | null> {
  const config = getAiConfig();
  if (!config.enabled || !config.apiKey || !config.model) return null;

  const endpoint = `${config.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0,
      max_tokens: 120,
      messages: [
        {
          role: "system",
          content:
            "Voce e um avaliador rigoroso de respostas curtas em portugues. Responda somente JSON valido no formato {\"score\": number, \"reason\": string}. Use nota 0 a 10. Respostas vagas, risadas, frases sem evidencia, culpa sem acao ou texto sem relacao com o cenario devem receber 0 a 2."
        },
        {
          role: "user",
          content: [
            `Pergunta: ${question.title}`,
            question.rubric ? `Rubrica: ${question.rubric}` : "",
            visualContext(question) ? `Cenario:\n${visualContext(question)}` : "",
            `Resposta do aluno: ${answer}`,
            "Avalie se a resposta usa evidencias do cenario, acao objetiva, impacto e proximo passo. Seja conservador."
          ]
            .filter(Boolean)
            .join("\n\n")
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`AI text scoring failed with ${response.status}`);
  }

  const payload = (await response.json()) as ChatCompletionResponse;
  const content = payload.choices?.[0]?.message?.content ?? "";
  const parsed = extractJson(content);
  if (typeof parsed?.score !== "number") return null;

  return {
    score: clampScore(parsed.score),
    source: "ai",
    reason: parsed.reason?.slice(0, 180),
    model: config.model
  };
}

export async function evaluateShortTextAnswers(
  submission: AssessmentSubmission
): Promise<Record<string, TextEvaluation>> {
  const evaluations: Record<string, TextEvaluation> = {};
  const shortTextQuestions = questions.filter((question) => question.type === "short_text");

  for (const question of shortTextQuestions) {
    const answer = submission.answers[question.id];
    if (typeof answer !== "string") continue;

    const deterministicScore = scoreShortText(answer);

    if (deterministicScore <= 1) {
      evaluations[question.id] = {
        score: deterministicScore,
        source: "deterministic",
        reason: "Resposta sem sinais mínimos de conteúdo técnico ou relação com o cenário."
      };
      continue;
    }

    try {
      const aiEvaluation = await scoreWithAi(question, answer);
      evaluations[question.id] = aiEvaluation ?? {
        score: deterministicScore,
        source: "deterministic",
        reason: "IA indisponível; aplicada rubrica local."
      };
    } catch (error) {
      console.error("AI text scoring unavailable.", error);
      evaluations[question.id] = {
        score: deterministicScore,
        source: "deterministic",
        reason: "IA indisponível; aplicada rubrica local."
      };
    }
  }

  return evaluations;
}
