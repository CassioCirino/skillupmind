"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { AssessmentResult, skillLabels, skillsOrder } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const levelColors: Record<string, string> = {
  Iniciante: "#ef4444",
  Básico: "#f97316",
  Intermediário: "#3b82f6",
  Avançado: "#22c55e"
};

const collegeColors: Record<string, string> = {
  FICR: "#0284c7",
  UCB: "#16a34a"
};

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round((values.reduce((total, value) => total + value, 0) / values.length) * 10) / 10;
}

function countBy(results: AssessmentResult[], key: "overallLevel" | "college") {
  const counts = new Map<string, number>();

  results.forEach((result) => {
    const value = key === "college" ? result.student.college : result.overallLevel;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
}

export function SkillChart({ results }: { results: AssessmentResult[] }) {
  const skillData = skillsOrder.map((skill) => ({
    name: skillLabels[skill],
    score: average(results.map((result) => result.skills[skill].score))
  }));
  const levelData = countBy(results, "overallLevel");
  const collegeData = countBy(results, "college");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráficos de desempenho</CardTitle>
        <CardDescription>Médias por competência e distribuição de níveis e faculdades.</CardDescription>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            Nenhum dado disponível para gráficos.
          </div>
        ) : (
          <Tabs defaultValue="skills">
            <TabsList className="mb-4">
              <TabsTrigger value="skills">Competências</TabsTrigger>
              <TabsTrigger value="levels">Níveis</TabsTrigger>
              <TabsTrigger value="colleges">Faculdades</TabsTrigger>
            </TabsList>

            <TabsContent value="skills">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillData} margin={{ top: 12, right: 12, left: 0, bottom: 72 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" interval={0} angle={-35} textAnchor="end" height={90} fontSize={12} />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="score" name="Média" fill="#0284c7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="levels">
              <PieView data={levelData} colors={levelColors} />
            </TabsContent>

            <TabsContent value="colleges">
              <PieView data={collegeData} colors={collegeColors} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

function PieView({
  data,
  colors
}: {
  data: { name: string; value: number }[];
  colors: Record<string, string>;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label>
              {data.map((item) => (
                <Cell key={item.name} fill={colors[item.name] ?? "#64748b"} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid content-center gap-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-md border bg-white p-3 text-sm">
            <span className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: colors[item.name] ?? "#64748b" }}
              />
              {item.name}
            </span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
