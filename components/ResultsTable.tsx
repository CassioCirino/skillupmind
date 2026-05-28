"use client";

import { useState } from "react";
import Link from "next/link";
import { Archive, ArchiveRestore, ExternalLink, Loader2, Trash2 } from "lucide-react";
import { AssessmentResult } from "@/lib/types";
import { formatDateTime, formatScore } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ResultsTableProps = {
  results: AssessmentResult[];
  onChanged?: () => void | Promise<void>;
};

export function ResultsTable({ results, onChanged }: ResultsTableProps) {
  const [busyAction, setBusyAction] = useState("");
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<AssessmentResult | null>(null);

  async function toggleArchive(result: AssessmentResult) {
    const archived = result.status !== "archived";
    const action = `${archived ? "archive" : "restore"}:${result.id}`;

    if (
      archived &&
      !window.confirm(
        `Arquivar a avaliação de ${result.student.name}? O email poderá refazer o teste depois disso.`
      )
    ) {
      return;
    }

    setError("");
    setBusyAction(action);

    try {
      const response = await fetch(`/api/admin/results/${encodeURIComponent(result.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived })
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message ?? "Não foi possível atualizar o resultado.");
      }

      await onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o resultado.");
    } finally {
      setBusyAction("");
    }
  }

  async function deleteResult(result: AssessmentResult) {
    setError("");
    setBusyAction(`delete:${result.id}`);

    try {
      const response = await fetch(`/api/admin/results/${encodeURIComponent(result.id)}`, {
        method: "DELETE"
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message ?? "Não foi possível apagar o resultado.");
      }

      await onChanged?.();
      setPendingDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível apagar o resultado.");
    } finally {
      setBusyAction("");
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de alunos</CardTitle>
          <CardDescription>
            Todas as avaliações com dados de contato, curso, faculdade e status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {results.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Nenhuma avaliação encontrada.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Faculdade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => {
                  const archived = result.status === "archived";
                  const archiveBusy =
                    busyAction === `archive:${result.id}` ||
                    busyAction === `restore:${result.id}`;
                  const deleteBusy = busyAction === `delete:${result.id}`;

                  return (
                    <TableRow key={result.id} className={archived ? "bg-slate-50" : ""}>
                      <TableCell>
                        <div className="font-medium">{result.student.name}</div>
                        <div className="text-xs text-muted-foreground">{result.student.email}</div>
                        <div className="text-xs text-muted-foreground">{result.student.phone}</div>
                      </TableCell>
                      <TableCell>{result.student.course}</TableCell>
                      <TableCell>{result.student.college}</TableCell>
                      <TableCell>
                        <Badge variant={archived ? "outline" : "secondary"}>
                          {archived ? "Arquivado" : "Ativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{formatScore(result.overallScore)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{result.overallLevel}</Badge>
                      </TableCell>
                      <TableCell>{formatDateTime(result.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            aria-label={`Abrir relatório de ${result.student.name}`}
                            title="Abrir relatório"
                          >
                            <Link href={`/admin/result/${encodeURIComponent(result.id)}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => void toggleArchive(result)}
                            disabled={Boolean(busyAction)}
                            aria-label={
                              archived
                                ? `Desarquivar avaliação de ${result.student.name}`
                                : `Arquivar avaliação de ${result.student.name}`
                            }
                            title={archived ? "Desarquivar" : "Arquivar"}
                          >
                            {archiveBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : archived ? (
                              <ArchiveRestore className="h-4 w-4" />
                            ) : (
                              <Archive className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setPendingDelete(result)}
                            disabled={Boolean(busyAction)}
                            aria-label={`Apagar avaliação de ${result.student.name}`}
                            title="Apagar"
                          >
                            {deleteBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-result-title"
            aria-describedby="delete-result-description"
            className="w-full max-w-md rounded-lg border bg-white p-5 shadow-2xl"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-destructive/10 text-destructive">
              <Trash2 className="h-5 w-5" />
            </div>
            <h3 id="delete-result-title" className="text-lg font-semibold text-slate-950">
              Tem certeza que deseja apagar?
            </h3>
            <p id="delete-result-description" className="mt-2 text-sm leading-6 text-muted-foreground">
              Esta ação vai remover definitivamente o JSON da avaliação de{" "}
              <span className="font-medium text-slate-950">{pendingDelete.student.name}</span>.
            </p>
            <div className="mt-4 rounded-md border bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-medium text-slate-900">{pendingDelete.student.email}</p>
              <p>
                {pendingDelete.student.course} · {pendingDelete.student.college}
              </p>
              <p>{formatDateTime(pendingDelete.createdAt)}</p>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPendingDelete(null)}
                disabled={Boolean(busyAction)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => void deleteResult(pendingDelete)}
                disabled={Boolean(busyAction)}
              >
                {busyAction === `delete:${pendingDelete.id}` && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Sim, apagar dados
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
