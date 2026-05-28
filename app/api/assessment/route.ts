import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { questions } from "@/lib/questions";
import { scoreAssessment } from "@/lib/scoring";
import { createResultFileName } from "@/lib/slugify";
import { getStorageProvider } from "@/lib/storage";
import { evaluateShortTextAnswers } from "@/lib/ai-text-scoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const studentSchema = z
  .object({
    name: z.string().trim().min(1, "Nome obrigatório"),
    email: z.string().trim().email("Email inválido"),
    phone: z.string().trim().min(1, "Telefone obrigatório"),
    course: z.string().trim().optional(),
    classGroup: z.string().trim().optional(),
    college: z.enum(["FICR", "UCB"])
  })
  .transform((student, context) => {
    const course = student.course || student.classGroup;

    if (!course) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Curso obrigatório",
        path: ["course"]
      });
      return z.NEVER;
    }

    return {
      name: student.name,
      email: student.email,
      phone: student.phone,
      course,
      college: student.college
    };
  });

const answerValueSchema = z.union([
  z.string(),
  z.number(),
  z.array(z.string())
]);

const timingSchema = z.object({
  timeSpentSeconds: z.number().min(0),
  timeLimitSeconds: z.number().min(1),
  timedOut: z.boolean()
});

const submissionSchema = z.object({
  student: studentSchema,
  answers: z.record(z.string(), answerValueSchema),
  timings: z.record(z.string(), timingSchema).optional()
});

function isMissingAnswer(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = submissionSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Dados inválidos.", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const storage = getStorageProvider();
    const normalizedEmail = parsed.data.student.email.trim().toLowerCase();
    const submission = {
      ...parsed.data,
      student: {
        ...parsed.data.student,
        email: normalizedEmail
      }
    };
    let existingResults;

    try {
      existingResults = await storage.listResults();
    } catch (error) {
      console.error("Failed to verify duplicate assessment.", error);
      return NextResponse.json(
        {
          message:
            "A avaliação está temporariamente indisponível porque o storage de resultados não está configurado. Avise o administrador."
        },
        { status: 503 }
      );
    }

    const alreadySubmitted = existingResults.some(
      (result) =>
        result.status !== "archived" &&
        result.student.email.trim().toLowerCase() === normalizedEmail
    );

    if (alreadySubmitted) {
      return NextResponse.json(
        {
          message:
            "Este email já possui uma avaliação ativa. Procure o administrador para liberar uma nova tentativa."
        },
        { status: 409 }
      );
    }

    const missingQuestion = questions.find(
      (question) => question.required && isMissingAnswer(submission.answers[question.id])
    );

    if (missingQuestion) {
      return NextResponse.json(
        { message: `A pergunta ${missingQuestion.id.toUpperCase()} é obrigatória.` },
        { status: 400 }
      );
    }

    const createdAt = new Date();
    const { id, fileName } = createResultFileName(submission.student.name, createdAt);
    const textEvaluations = await evaluateShortTextAnswers(submission);
    const result = scoreAssessment(
      { ...submission, textEvaluations },
      id,
      fileName,
      createdAt
    );

    try {
      await storage.saveResult(fileName, result);
    } catch (error) {
      console.error("Failed to save assessment result.", error);
      return NextResponse.json(
        {
          message:
            "Não foi possível salvar a avaliação porque o storage de resultados não está configurado. Avise o administrador."
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "Avaliação registrada com sucesso." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Não foi possível salvar a avaliação." },
      { status: 500 }
    );
  }
}
