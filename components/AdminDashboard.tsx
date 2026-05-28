"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Award, BarChart3, Building2, GraduationCap, LogOut, Users } from "lucide-react";
import { buildRanking } from "@/lib/scoring";
import { AssessmentResult, College, skillLabels, skillsOrder } from "@/lib/types";
import { formatScore } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiltersBar, SortBy } from "@/components/FiltersBar";
import { RankingTable } from "@/components/RankingTable";
import { ResultsTable } from "@/components/ResultsTable";
import { SkillChart } from "@/components/SkillChart";

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function countBy<T extends string>(items: AssessmentResult[], getKey: (item: AssessmentResult) => T) {
  return items.reduce<Record<T, number>>((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

function sortResults(results: AssessmentResult[], sortBy: SortBy) {
  return [...results].sort((a, b) => {
    if (sortBy === "score") return b.overallScore - a.overallScore;
    if (sortBy === "name") return a.student.name.localeCompare(b.student.name, "pt-BR");
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function filterResults(
  results: AssessmentResult[],
  search: string,
  course: string,
  college: string
) {
  const normalizedSearch = search.trim().toLowerCase();

  return results.filter((result) => {
    const matchesName = normalizedSearch
      ? result.student.name.toLowerCase().includes(normalizedSearch)
      : true;
    const matchesCourse = course === "all" ? true : result.student.course === course;
    const matchesCollege = college === "all" ? true : result.student.college === college;

    return matchesName && matchesCourse && matchesCollege;
  });
}

function buildSkillAverages(results: AssessmentResult[]) {
  return skillsOrder.map((skill) => ({
    skill,
    label: skillLabels[skill],
    score: Number(formatScore(average(results.map((result) => result.skills[skill].score))).replace(",", "."))
  }));
}

export function AdminDashboard({ results }: { results: AssessmentResult[] }) {
  const router = useRouter();
  const [items, setItems] = useState(results);
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("all");
  const [college, setCollege] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("score");

  const activeResults = useMemo(
    () => items.filter((result) => result.status !== "archived"),
    [items]
  );
  const archivedResults = useMemo(
    () => items.filter((result) => result.status === "archived"),
    [items]
  );
  const courseOptions = useMemo(
    () => Array.from(new Set(items.map((result) => result.student.course))).sort(),
    [items]
  );

  const filteredResults = useMemo(
    () => sortResults(filterResults(items, search, course, college), sortBy),
    [items, search, course, college, sortBy]
  );
  const filteredActiveResults = useMemo(
    () => sortResults(filterResults(activeResults, search, course, college), sortBy),
    [activeResults, search, course, college, sortBy]
  );

  const ranking = useMemo(() => buildRanking(filteredActiveResults), [filteredActiveResults]);
  const allRanking = useMemo(() => buildRanking(activeResults), [activeResults]);
  const bestStudent = allRanking[0];
  const collegeCounts = countBy<College>(activeResults, (result) => result.student.college);
  const courseCounts = countBy<string>(activeResults, (result) => result.student.course);
  const skillAverages = buildSkillAverages(activeResults);

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  async function refreshResults() {
    const response = await fetch("/api/admin/results", { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    setItems(payload.results ?? []);
    router.refresh();
  }

  return (
    <main className="min-h-screen">
      <div className="page-shell space-y-6">
        <header className="flex flex-col gap-4 rounded-lg border bg-white/85 p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Admin</p>
            <h1 className="section-title">Dashboard de avaliações</h1>
            <p className="subtle-text mt-1">
              Busca, filtros, ranking, gráficos e relatórios individuais admin-only.
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <StatCard icon={Users} label="Testes ativos" value={String(activeResults.length)} />
          <StatCard
            icon={BarChart3}
            label="Média geral"
            value={formatScore(average(activeResults.map((result) => result.overallScore)))}
          />
          <StatCard icon={Award} label="Melhor aluno" value={bestStudent?.name ?? "-"} />
          <StatCard
            icon={Building2}
            label="Por faculdade"
            value={`FICR ${collegeCounts.FICR ?? 0} · UCB ${collegeCounts.UCB ?? 0}`}
          />
          <StatCard
            icon={GraduationCap}
            label="Cursos"
            value={Object.keys(courseCounts).length ? Object.keys(courseCounts).length.toString() : "0"}
          />
          <StatCard icon={Archive} label="Arquivados" value={String(archivedResults.length)} />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Média por competência</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {skillAverages.map((item) => (
              <div key={item.skill} className="rounded-md border bg-white p-3">
                <p className="truncate text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-semibold">{formatScore(item.score)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <FiltersBar
          search={search}
          course={course}
          college={college}
          sortBy={sortBy}
          courseOptions={courseOptions}
          onSearchChange={setSearch}
          onCourseChange={setCourse}
          onCollegeChange={setCollege}
          onSortByChange={setSortBy}
        />

        <SkillChart results={filteredActiveResults} />

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <RankingTable rows={ranking} />
          <ResultsTable results={filteredResults} onChanged={refreshResults} />
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex h-full items-center gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
          <p className="truncate text-xl font-semibold text-slate-950">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
