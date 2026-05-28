import { questions } from "@/lib/questions";
import { AssessmentResult, AssessmentVersion, AnswerValue, skillsOrder } from "@/lib/types";
import { formatDateTime, formatScore } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillScoreCard } from "@/components/SkillScoreCard";
import { MindMap } from "@/components/MindMap";

function answerToText(questionId: string, answer: AnswerValue, version?: AssessmentVersion) {
  if (answer === "__timeout__") {
    return "Tempo esgotado sem resposta registrada.";
  }

  if (version === "legacy") {
    return Array.isArray(answer) ? answer.join(", ") : String(answer);
  }

  const question = questions.find((item) => item.id === questionId);
  if (!question) return String(answer);

  if (Array.isArray(answer)) {
    return answer
      .map((value) => question.options?.find((option) => option.value === value)?.label ?? value)
      .join(", ");
  }

  if (question.type === "bilateral_scale" && typeof answer === "number" && question.bilateral) {
    if (answer <= 3) return `Tendência ao ${question.bilateral.leftLabel}`;
    if (answer >= 7) return `Tendência ao ${question.bilateral.rightLabel}`;
    return "Tendência equilibrada entre os dois caminhos";
  }

  return question.options?.find((option) => option.value === answer)?.label ?? String(answer);
}

function levelTone(level: string) {
  if (level === "Iniciante") return "border-red-200 bg-red-50 text-red-700";
  if (level === "Básico") return "border-orange-200 bg-orange-50 text-orange-700";
  if (level === "Intermediário") return "border-sky-200 bg-sky-50 text-sky-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export function StudentReport({
  result,
  showAnswers = false
}: {
  result: AssessmentResult;
  showAnswers?: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{result.student.name}</CardTitle>
            <CardDescription>
              {result.student.email} · {result.student.phone}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <p>Curso: <span className="font-medium text-foreground">{result.student.course}</span></p>
            <p>Faculdade: <span className="font-medium text-foreground">{result.student.college}</span></p>
            <p>Data: <span className="font-medium text-foreground">{formatDateTime(result.createdAt)}</span></p>
            <div className="flex items-center gap-2">
              <span>Status:</span>
              <Badge variant={result.status === "archived" ? "outline" : "secondary"}>
                {result.status === "archived" ? "Arquivado" : "Ativo"}
              </Badge>
            </div>
            <p>ID: <span className="font-medium text-foreground">{result.id}</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pontuação geral</CardDescription>
            <CardTitle className="text-4xl">{formatScore(result.overallScore)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Nível</CardDescription>
            <Badge variant="outline" className={levelTone(result.overallLevel)}>
              {result.overallLevel}
            </Badge>
          </CardHeader>
        </Card>
      </div>

      {result.assessmentVersion === "legacy" && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-sm text-orange-800">
            Esta avaliação foi criada antes do SPEC v3. As competências foram adaptadas para o modelo atual
            apenas para visualização e comparação administrativa.
          </CardContent>
        </Card>
      )}

      {result.status === "archived" && (
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="p-4 text-sm text-slate-700">
            Este resultado está arquivado. Ele permanece disponível para consulta administrativa,
            mas não entra no ranking ativo e libera o email para uma nova avaliação.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Relatório individual</CardTitle>
          <CardDescription>Resumo admin gerado automaticamente a partir da pontuação ponderada.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="leading-7 text-slate-700">{result.report}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Competências fortes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {result.strongestSkills.map((skill) => (
              <Badge key={skill} className="bg-emerald-600 text-white">
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Competências de atenção</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {result.weakestSkills.map((skill) => (
              <Badge key={skill} variant="destructive">
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notas por competência</CardTitle>
          <CardDescription>Notas finais de 0 a 10 após aplicação dos pesos por tipo de pergunta.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {skillsOrder.map((skill) => (
            <SkillScoreCard key={skill} skill={result.skills[skill]} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trilhas recomendadas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {result.recommendedTracks.map((track) => (
            <Badge key={track} variant="secondary">
              {track}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mind map de competências</CardTitle>
          <CardDescription>Mapa visual do nível geral e das competências avaliadas.</CardDescription>
        </CardHeader>
        <CardContent>
          <MindMap result={result} />
        </CardContent>
      </Card>

      {showAnswers && (
        <Card>
          <CardHeader>
            <CardTitle>Respostas dadas</CardTitle>
            <CardDescription>Resposta, nota calculada, peso e pontuação ponderada por pergunta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.answers.map((answer) => {
              const question = questions.find((item) => item.id === answer.questionId);
              const questionTitle =
                result.assessmentVersion === "legacy"
                  ? `Pergunta ${answer.questionId.toUpperCase()} do modelo anterior`
                  : question?.title ?? answer.questionId;
              return (
                <div key={answer.questionId} className="rounded-md border bg-white p-3">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{answer.questionId.toUpperCase()}</Badge>
                    <span className="min-w-0 text-sm font-medium text-slate-800">
                      {questionTitle}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    {answerToText(answer.questionId, answer.answer, result.assessmentVersion)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Nota calculada {formatScore(answer.rawScore)} · Peso {answer.weight} · Ponderada{" "}
                    {formatScore(answer.weightedScore)}
                    {typeof answer.timeSpentSeconds === "number" && (
                      <>
                        {" "}· Tempo {answer.timeSpentSeconds}s/{answer.timeLimitSeconds}s · Tempo-score{" "}
                        {formatScore(answer.timeScore)}
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
