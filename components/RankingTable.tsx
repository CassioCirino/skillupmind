import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { RankingRow } from "@/lib/types";
import { formatDateTime, formatScore } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RankingTable({ rows }: { rows: RankingRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking geral</CardTitle>
        <CardDescription>Ordenado por pontuação, lógica, resolução de problemas e nome.</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posição</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Geral</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Melhor</TableHead>
                <TableHead>Fraca</TableHead>
                <TableHead>Data</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-semibold">#{row.position}</TableCell>
                  <TableCell>
                    <div className="font-medium">{row.name}</div>
                    <div className="text-xs text-muted-foreground">{row.email}</div>
                    <div className="text-xs text-muted-foreground">{row.phone}</div>
                  </TableCell>
                  <TableCell>{row.course}</TableCell>
                  <TableCell className="font-semibold">{formatScore(row.overallScore)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.overallLevel}</Badge>
                  </TableCell>
                  <TableCell>{row.bestSkill}</TableCell>
                  <TableCell>{row.weakestSkill}</TableCell>
                  <TableCell>{formatDateTime(row.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon" aria-label={`Abrir relatório de ${row.name}`}>
                      <Link href={`/admin/result/${encodeURIComponent(row.id)}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
      Nenhum resultado encontrado.
    </div>
  );
}
