"use client";

import { useMemo } from "react";
import { AnswerValue, Question, QuestionOption, VisualPrompt } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type QuestionCardProps = {
  question: Question;
  answer: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  shuffleSeed: string;
};

const typeLabels: Record<Question["type"], string> = {
  single_choice: "Escolha única",
  multiple_choice: "Múltipla escolha",
  code_reading: "Leitura de código",
  scenario: "Cenário prático",
  scale: "Escala",
  bilateral_scale: "Dilema bilateral",
  short_text: "Texto curto"
};

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle<T>(items: T[], seed: string) {
  let state = hashString(seed);
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function VisualPromptView({ visual }: { visual: VisualPrompt }) {
  const toneClasses: Record<NonNullable<VisualPrompt["items"][number]["tone"]>, string> = {
    blue: "border-sky-200 bg-sky-50 text-sky-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
    red: "border-red-200 bg-red-50 text-red-700",
    slate: "border-slate-200 bg-slate-50 text-slate-600"
  };

  if (visual.kind === "flow") {
    return (
      <div className="rounded-md border bg-slate-50 p-4">
        {visual.title && <p className="mb-3 text-sm font-medium text-slate-700">{visual.title}</p>}
        <div className="flex flex-wrap items-center gap-2">
          {visual.items.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex items-center gap-2">
              <div
                className={cn(
                  "min-w-20 rounded-md border px-3 py-2 text-center text-sm font-semibold",
                  toneClasses[item.tone ?? "slate"]
                )}
              >
                {item.label}
              </div>
              {index < visual.items.length - 1 && <span className="text-muted-foreground">→</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visual.kind === "dashboard") {
    return (
      <div className="rounded-md border bg-slate-50 p-4">
        {visual.title && <p className="mb-3 text-sm font-medium text-slate-700">{visual.title}</p>}
        <div className="rounded-md border bg-white p-4">
          <svg viewBox="0 0 720 330" role="img" aria-label={visual.title ?? "Cenário visual"} className="h-auto w-full">
            <rect x="0" y="0" width="720" height="330" rx="10" fill="#f8fafc" />
            <rect x="24" y="24" width="672" height="48" rx="8" fill="#e0f2fe" />
            <text x="44" y="55" fill="#075985" fontSize="18" fontWeight="700">
              /portal-aluno - tela não carrega
            </text>
            <rect x="24" y="92" width="150" height="74" rx="8" fill="#fee2e2" stroke="#fca5a5" />
            <text x="42" y="122" fill="#991b1b" fontSize="14" fontWeight="700">Erros 5xx</text>
            <text x="42" y="150" fill="#991b1b" fontSize="24" fontWeight="800">18%</text>
            <rect x="194" y="92" width="150" height="74" rx="8" fill="#ffedd5" stroke="#fdba74" />
            <text x="212" y="122" fill="#9a3412" fontSize="14" fontWeight="700">Tempo resp.</text>
            <text x="212" y="150" fill="#9a3412" fontSize="24" fontWeight="800">9.8s</text>
            <rect x="364" y="92" width="150" height="74" rx="8" fill="#dcfce7" stroke="#86efac" />
            <text x="382" y="122" fill="#166534" fontSize="14" fontWeight="700">Usuários</text>
            <text x="382" y="150" fill="#166534" fontSize="24" fontWeight="800">42</text>
            <rect x="534" y="92" width="162" height="74" rx="8" fill="#dbeafe" stroke="#93c5fd" />
            <text x="552" y="122" fill="#1d4ed8" fontSize="14" fontWeight="700">Última mudança</text>
            <text x="552" y="150" fill="#1d4ed8" fontSize="20" fontWeight="800">10:42</text>
            <rect x="24" y="188" width="672" height="118" rx="8" fill="#ffffff" stroke="#e2e8f0" />
            <line x1="56" y1="284" x2="664" y2="284" stroke="#e2e8f0" />
            <line x1="56" y1="246" x2="664" y2="246" stroke="#e2e8f0" />
            <line x1="56" y1="208" x2="664" y2="208" stroke="#e2e8f0" />
            <text x="44" y="182" fill="#475569" fontSize="12" fontWeight="700">Evolução dos erros 5xx</text>
            <polyline points="56,286 150,276 252,281 344,260 448,216 552,222 656,210" fill="none" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="448" y1="198" x2="448" y2="300" stroke="#ef4444" strokeDasharray="6 6" />
            <rect x="462" y="252" width="146" height="26" rx="5" fill="#ffffff" stroke="#fecaca" />
            <text x="474" y="270" fill="#991b1b" fontSize="13" fontWeight="700">pico após mudança</text>
          </svg>
        </div>
        <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          {visual.items.map((item, index) => (
            <div key={`${item.label}-${index}`} className={cn("rounded-md border px-3 py-2", toneClasses[item.tone ?? "slate"])}>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visual.kind === "ticket") {
    return (
      <div className="rounded-md border bg-slate-50 p-4">
        {visual.title && <p className="mb-3 text-sm font-medium text-slate-700">{visual.title}</p>}
        <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
          <div className="rounded-md border bg-white p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Cartão da tarefa</p>
            <h4 className="mt-2 text-lg font-semibold text-slate-900">Integração de matrículas</h4>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p><strong>Status:</strong> Bloqueada</p>
              <p><strong>Prazo:</strong> hoje 17:00</p>
              <p><strong>Impacto:</strong> 2 turmas aguardando importação</p>
              <p><strong>Tentativa:</strong> CSV validado, API retornou 422</p>
            </div>
          </div>
          <div className="rounded-md border bg-white p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Evidências</p>
            <div className="mt-3 space-y-2">
              {visual.items.map((item, index) => (
                <div key={`${item.label}-${index}`} className={cn("rounded-md border px-3 py-2 text-sm", toneClasses[item.tone ?? "slate"])}>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (visual.kind === "matrix") {
    return (
      <div className="rounded-md border bg-slate-50 p-4">
        {visual.title && <p className="mb-3 text-sm font-medium text-slate-700">{visual.title}</p>}
        <div
          className="grid max-w-sm gap-2"
          style={{ gridTemplateColumns: `repeat(${visual.columns ?? 3}, minmax(0, 1fr))` }}
        >
          {visual.items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className={cn(
                "flex aspect-square items-center justify-center rounded-md border text-lg font-bold",
                toneClasses[item.tone ?? "slate"]
              )}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-slate-50 p-4">
      {visual.title && <p className="mb-3 text-sm font-medium text-slate-700">{visual.title}</p>}
      <div className="flex flex-wrap gap-2">
        {visual.items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className={cn(
              "flex h-16 min-w-16 items-center justify-center rounded-md border px-4 text-sm font-bold",
              toneClasses[item.tone ?? "slate"]
            )}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuestionCard({ question, answer, onChange, shuffleSeed }: QuestionCardProps) {
  const scaleValue = typeof answer === "number" ? answer : 5;
  const displayOptions = useMemo<QuestionOption[]>(() => {
    if (!question.options?.length) return [];
    if (question.shuffleOptions === false) return question.options;
    return seededShuffle(question.options, `${shuffleSeed}-${question.id}`);
  }, [question, shuffleSeed]);

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{question.id.toUpperCase()}</Badge>
          <Badge variant="outline">{typeLabels[question.type]}</Badge>
          <Badge variant="outline">Peso {question.weight}</Badge>
        </div>
        <CardTitle className="pt-2 leading-7">{question.title}</CardTitle>
        {question.rubric && <CardDescription>{question.rubric}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {question.visual && <VisualPromptView visual={question.visual} />}

        {question.code && (
          <pre className="overflow-x-auto rounded-md border bg-slate-950 p-4 text-sm leading-6 text-slate-50">
            <code>{question.code}</code>
          </pre>
        )}

        {["single_choice", "code_reading", "scenario"].includes(question.type) && (
          <div className="grid gap-3">
            {displayOptions.map((option) => {
              const checked = answer === option.value;
              return (
                <Label
                  key={option.value}
                  className={cn(
                    "flex min-h-12 cursor-pointer items-start gap-3 rounded-md border bg-background p-3 text-sm leading-5 transition-colors",
                    checked && "border-primary bg-primary/5 text-primary"
                  )}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={checked}
                    onChange={() => onChange(option.value)}
                    className="mt-1 h-4 w-4 accent-sky-700"
                  />
                  <span>{option.label}</span>
                </Label>
              );
            })}
          </div>
        )}

        {question.type === "multiple_choice" && (
          <div className="grid gap-3">
            {displayOptions.map((option) => {
              const selected = Array.isArray(answer) ? answer : [];
              const checked = selected.includes(option.value);
              return (
                <Label
                  key={option.value}
                  className={cn(
                    "flex min-h-12 cursor-pointer items-start gap-3 rounded-md border bg-background p-3 text-sm leading-5 transition-colors",
                    checked && "border-primary bg-primary/5 text-primary"
                  )}
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={checked}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onChange([...selected, option.value]);
                      } else {
                        onChange(selected.filter((value) => value !== option.value));
                      }
                    }}
                    className="mt-1 h-4 w-4 rounded accent-sky-700"
                  />
                  <span>{option.label}</span>
                </Label>
              );
            })}
          </div>
        )}

        {question.type === "scale" && (
          <div className="rounded-md border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{question.min ?? 0}</span>
              <span className="rounded-md bg-primary px-3 py-1 text-lg font-semibold text-primary-foreground">
                {scaleValue}
              </span>
              <span className="text-sm text-muted-foreground">{question.max ?? 10}</span>
            </div>
            <input
              type="range"
              min={question.min ?? 0}
              max={question.max ?? 10}
              step={1}
              value={scaleValue}
              onChange={(event) => onChange(Number(event.target.value))}
              className="w-full accent-sky-700"
            />
          </div>
        )}

        {question.type === "bilateral_scale" && question.bilateral && (
          <div className="space-y-4 rounded-md border bg-background p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
              <div className="rounded-md border border-sky-200 bg-sky-50 p-3">
                <p className="text-sm font-semibold text-sky-800">{question.bilateral.leftLabel}</p>
                <p className="mt-1 text-sm leading-5 text-sky-700">
                  {question.bilateral.leftDescription}
                </p>
              </div>
              <div className="hidden items-center px-2 text-sm font-medium text-muted-foreground md:flex">
                ou
              </div>
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-sm font-semibold text-emerald-800">{question.bilateral.rightLabel}</p>
                <p className="mt-1 text-sm leading-5 text-emerald-700">
                  {question.bilateral.rightDescription}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase text-muted-foreground">
                <span>Mais A</span>
                <span>Equilíbrio</span>
                <span>Mais B</span>
              </div>
              <input
                type="range"
                min={question.min ?? 0}
                max={question.max ?? 10}
                step={1}
                value={scaleValue}
                onChange={(event) => onChange(Number(event.target.value))}
                className="w-full accent-sky-700"
                aria-label="Escolha sua tendência entre o caminho A e o caminho B"
              />
              <div className="mt-2 text-center text-xs text-muted-foreground">
                Marque a tendência mais próxima da sua decisão no cenário.
              </div>
            </div>
          </div>
        )}

        {question.type === "short_text" && (
          <div className="space-y-2">
            <Textarea
              maxLength={300}
              value={typeof answer === "string" ? answer : ""}
              onChange={(event) => onChange(event.target.value)}
              placeholder={question.type === "short_text" ? "Use as evidências do cenário: contexto, impacto, hipótese, próxima ação e pedido." : "Descreva sua investigação de forma objetiva."}
            />
            <p className="text-right text-xs text-muted-foreground">
              {(typeof answer === "string" ? answer.length : 0)}/300
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
