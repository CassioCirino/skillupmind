"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Brain, CheckCircle2, ClipboardCheck, Clock3, Loader2, Play, RotateCcw, Send, ShieldCheck } from "lucide-react";
import { questions } from "@/lib/questions";
import { AnswerValue, QuestionTiming, StudentInfo, timedOutAnswer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudentForm } from "@/components/StudentForm";
import { QuestionCard } from "@/components/QuestionCard";

type Stage = "intro" | "form" | "instructions" | "assessment" | "complete";

function initialAnswers() {
  return {};
}

function isAnswered(value: AnswerValue | undefined) {
  return value !== undefined && value !== "" && (!Array.isArray(value) || value.length > 0);
}

function getEffectiveAnswer(questionId: string, answer: AnswerValue | undefined) {
  const question = questions.find((item) => item.id === questionId);

  if (!isAnswered(answer) && question?.type === "bilateral_scale") {
    return 5;
  }

  return answer;
}

function createShuffleSeed() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

export function AssessmentWizard() {
  const [stage, setStage] = useState<Stage>("intro");
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(initialAnswers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timings, setTimings] = useState<Record<string, QuestionTiming>>({});
  const [timeRemaining, setTimeRemaining] = useState(questions[0]?.timeLimitSeconds ?? 45);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [error, setError] = useState("");
  const [submittedStudentName, setSubmittedStudentName] = useState("");
  const [shuffleSeed, setShuffleSeed] = useState(createShuffleSeed);
  const questionStartedAtRef = useRef(0);
  const timeoutHandledRef = useRef("");

  const currentQuestion = questions[currentIndex];
  const progress = useMemo(
    () => Math.round(((currentIndex + 1) / questions.length) * 100),
    [currentIndex]
  );
  const answeredCount = useMemo(
    () => questions.filter((question) => isAnswered(answers[question.id])).length,
    [answers]
  );
  const timeLimit = currentQuestion?.timeLimitSeconds ?? 45;
  const timePercent = Math.max(0, Math.min(100, (timeRemaining / timeLimit) * 100));

  function prepareQuestion(index: number) {
    const question = questions[index];
    const limit = question?.timeLimitSeconds ?? 45;
    questionStartedAtRef.current = Date.now();
    timeoutHandledRef.current = "";
    setTimeRemaining(limit);
  }

  async function handleStudentSubmit(data: StudentInfo) {
    setError("");
    setIsCheckingEligibility(true);

    try {
      const response = await fetch(
        `/api/assessment/eligibility?email=${encodeURIComponent(data.email)}`
      );
      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.allowed === false) {
        throw new Error(
          payload?.message ??
            "Nao foi possivel verificar se este email pode iniciar a avaliacao."
        );
      }

      setStudent(data);
      setAnswers(initialAnswers());
      setTimings({});
      setCurrentIndex(0);
      setShuffleSeed(createShuffleSeed());
      setStage("instructions");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nao foi possivel verificar se este email pode iniciar a avaliacao."
      );
    } finally {
      setIsCheckingEligibility(false);
    }
  }

  function startAssessment() {
    setAnswers(initialAnswers());
    setTimings({});
    setCurrentIndex(0);
    prepareQuestion(0);
    setError("");
    setStage("assessment");
  }

  function buildTiming(questionId: string, timedOut: boolean): QuestionTiming {
    const question = questions.find((item) => item.id === questionId);
    const limit = question?.timeLimitSeconds ?? 45;
    const elapsed = Math.ceil((Date.now() - questionStartedAtRef.current) / 1000);

    return {
      timeSpentSeconds: Math.max(1, Math.min(elapsed, limit)),
      timeLimitSeconds: limit,
      timedOut
    };
  }

  async function submitAssessment(
    answersToSubmit: Record<string, AnswerValue> = answers,
    timingsToSubmit: Record<string, QuestionTiming> = timings
  ) {
    if (!student) return;

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ student, answers: answersToSubmit, timings: timingsToSubmit })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message ?? "Falha ao enviar avaliação.");
      }

      setSubmittedStudentName(student.name);
      setStage("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar avaliação.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNext() {
    const effectiveAnswer = getEffectiveAnswer(currentQuestion.id, answers[currentQuestion.id]);

    if (!isAnswered(effectiveAnswer)) {
      setError("Responda a pergunta atual para continuar.");
      return;
    }

    setError("");

    const answerToSave = effectiveAnswer as AnswerValue;
    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: answerToSave
    };
    const nextTimings = {
      ...timings,
      [currentQuestion.id]: buildTiming(currentQuestion.id, false)
    };

    setAnswers(nextAnswers);
    setTimings(nextTimings);

    if (currentIndex === questions.length - 1) {
      void submitAssessment(nextAnswers, nextTimings);
      return;
    }

    const nextIndex = currentIndex + 1;
    prepareQuestion(nextIndex);
    setCurrentIndex(nextIndex);
  }

  function handleTimeout() {
    if (!currentQuestion) return;

    const nextAnswers = isAnswered(answers[currentQuestion.id])
      ? answers
      : {
          ...answers,
          [currentQuestion.id]: timedOutAnswer
        };
    const nextTimings = {
      ...timings,
      [currentQuestion.id]: buildTiming(currentQuestion.id, true)
    };

    setError("");
    setAnswers(nextAnswers);
    setTimings(nextTimings);

    if (currentIndex === questions.length - 1) {
      void submitAssessment(nextAnswers, nextTimings);
      return;
    }

    const nextIndex = currentIndex + 1;
    prepareQuestion(nextIndex);
    setCurrentIndex(nextIndex);
  }

  function resetFlow() {
    setStage("intro");
    setStudent(null);
    setAnswers(initialAnswers());
    setTimings({});
    setCurrentIndex(0);
    prepareQuestion(0);
    setSubmittedStudentName("");
    setShuffleSeed(createShuffleSeed());
    setError("");
    setIsCheckingEligibility(false);
  }

  useEffect(() => {
    if (stage !== "assessment" || !currentQuestion) return;

    const limit = currentQuestion.timeLimitSeconds ?? 45;
    const interval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - questionStartedAtRef.current) / 1000);
      setTimeRemaining(Math.max(0, limit - elapsed));
    }, 250);

    return () => window.clearInterval(interval);
  }, [currentQuestion, stage]);

  useEffect(() => {
    if (stage !== "assessment" || !currentQuestion || timeRemaining > 0 || isSubmitting) return;
    if (timeoutHandledRef.current === currentQuestion.id) return;

    timeoutHandledRef.current = currentQuestion.id;
    handleTimeout();
    // handleTimeout intentionally reads the latest state from this render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, stage, currentQuestion, isSubmitting]);

  return (
    <main className="min-h-screen">
      <div className="page-shell">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-primary">SkillUp Mind</p>
              <h1 className="section-title mt-1">SkillUp Mind</h1>
            </div>
          </div>
        </header>

        {stage === "intro" && (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            <div className="flex min-h-[520px] flex-col justify-between rounded-lg border bg-white/75 p-6 shadow-soft backdrop-blur sm:p-8">
              <div className="max-w-2xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                  <ClipboardCheck className="h-4 w-4" />
                  42 perguntas · 20 a 30 minutos
                </div>
                <h2 className="text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
                  Diagnóstico inicial de prontidão para TI
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                  A avaliação mede raciocínio lógico, noção lógico-matemática, resolução de problemas,
                  conceitos de programação, dados, observabilidade, comunicação, postura profissional
                  e perfil de aprendizagem. O resultado é analisado apenas pela equipe administrativa.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => setStage("form")}>
                  <Play className="h-4 w-4" />
                  Iniciar avaliação
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                ["Competências", "Notas de 0 a 10 por competência, com pesos por tipo de pergunta."],
                ["Avaliação ampla", "Perguntas conceituais, situacionais, visuais e psicométricas operacionais."],
                ["Resultado protegido", "Relatórios, ranking e mind map ficam disponíveis somente para admin."]
              ].map(([title, description]) => (
                <Card key={title} className="bg-white/85">
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>
        )}

        {stage === "form" && (
          <section className="mx-auto max-w-3xl">
            <StudentForm onSubmit={handleStudentSubmit} onBack={() => setStage("intro")} />
            {(isCheckingEligibility || error) && (
              <p
                className={`mt-4 rounded-md border px-4 py-3 text-sm ${
                  error
                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                    : "border-primary/20 bg-primary/10 text-primary"
                }`}
              >
                {isCheckingEligibility
                  ? "Verificando se este email pode iniciar a avaliacao..."
                  : error}
              </p>
            )}
          </section>
        )}

        {stage === "instructions" && student && (
          <section className="mx-auto max-w-3xl">
            <Card className="bg-white/90">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle>Antes de começar</CardTitle>
                <CardDescription>
                  Leia com calma. A tentativa só será registrada quando você enviar a avaliação.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">Tempo por pergunta</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Cada pergunta tem um temporizador próprio. Algumas perguntas abertas têm mais tempo para leitura do cenário.
                    </p>
                  </div>
                  <div className="rounded-md border bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">Sem voltar</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Depois de avançar, não será possível retornar para alterar respostas anteriores.
                    </p>
                  </div>
                  <div className="rounded-md border bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">Uma tentativa por email</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      O email informado poderá enviar a avaliação apenas uma vez. Se não estiver pronto, abandone agora e tente depois.
                    </p>
                  </div>
                  <div className="rounded-md border bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">Resultado protegido</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Ao finalizar, você verá apenas a confirmação de envio. Relatório e pontuação ficam disponíveis somente para o admin.
                    </p>
                  </div>
                </div>

                <div className="rounded-md border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-900">
                  Comece somente quando puder fazer a avaliação sem interrupções. Se fechar esta tela antes de começar,
                  sua tentativa não será consumida.
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStage("form");
                      setError("");
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Abandonar e tentar depois
                  </Button>
                  <Button type="button" onClick={startAssessment}>
                    <Play className="h-4 w-4" />
                    Começar agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {stage === "assessment" && currentQuestion && (
          <section className="mx-auto max-w-4xl">
            <Card className="mb-4 bg-white/90">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Avaliação em andamento</CardTitle>
                    <CardDescription>
                      Pergunta {currentIndex + 1} de {questions.length} · {answeredCount} finalizadas
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-semibold text-primary">
                    <Clock3 className="h-4 w-4" />
                    {timeRemaining}s
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={progress} />
                <Progress value={timePercent} className={timeRemaining <= 8 ? "bg-red-100 [&>div]:bg-red-600" : ""} />
              </CardContent>
            </Card>

            <QuestionCard
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              shuffleSeed={shuffleSeed}
              onChange={(value) =>
                setAnswers((current) => ({
                  ...current,
                  [currentQuestion.id]: value
                }))
              }
            />

            {error && (
              <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                A avaliação é cronometrada e não permite voltar.
              </p>
              <Button onClick={handleNext} disabled={isSubmitting || timeRemaining <= 0}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : currentIndex === questions.length - 1 ? (
                  <Send className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {currentIndex === questions.length - 1 ? "Enviar avaliação" : "Próxima"}
              </Button>
            </div>
          </section>
        )}

        {stage === "complete" && (
          <section className="mx-auto max-w-3xl">
            <div className="rounded-lg border bg-white/90 p-6 text-center shadow-soft sm:p-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <p className="text-sm font-semibold uppercase text-primary">Avaliação enviada</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
                Obrigado, {submittedStudentName || "aluno"}.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Suas respostas foram registradas com sucesso. O resultado, o relatório e o mind map são
                disponibilizados somente para a área administrativa.
              </p>
              <div className="mt-6 flex justify-center">
                <Button variant="outline" onClick={resetFlow}>
                  <RotateCcw className="h-4 w-4" />
                  Nova avaliação
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
