import { SkillScore } from "@/lib/types";
import { formatScore } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function scoreTone(score: number) {
  if (score < 4) return "border-red-200 bg-red-50 text-red-700";
  if (score < 6) return "border-orange-200 bg-orange-50 text-orange-700";
  if (score < 8) return "border-sky-200 bg-sky-50 text-sky-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export function SkillScoreCard({ skill }: { skill: SkillScore }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex h-full items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-950">{skill.label}</p>
          <Badge variant="outline" className={scoreTone(skill.score)}>
            {skill.level}
          </Badge>
        </div>
        <div className="text-2xl font-semibold text-slate-950">{formatScore(skill.score)}</div>
      </CardContent>
    </Card>
  );
}
