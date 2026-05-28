"use client";

import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SortBy = "score" | "name" | "date";

type FiltersBarProps = {
  search: string;
  course: string;
  college: string;
  sortBy: SortBy;
  courseOptions: string[];
  onSearchChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onCollegeChange: (value: string) => void;
  onSortByChange: (value: SortBy) => void;
};

export function FiltersBar({
  search,
  course,
  college,
  sortBy,
  courseOptions,
  onSearchChange,
  onCourseChange,
  onCollegeChange,
  onSortByChange
}: FiltersBarProps) {
  return (
    <Card>
      <CardContent className="grid gap-4 p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-2">
          <Label>Buscar por nome</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="pl-9"
              placeholder="Nome do aluno"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Curso</Label>
          <Select value={course} onValueChange={onCourseChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {courseOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Faculdade</Label>
          <Select value={college} onValueChange={onCollegeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="FICR">FICR</SelectItem>
              <SelectItem value="UCB">UCB</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Ordenação</Label>
          <Select value={sortBy} onValueChange={(value) => onSortByChange(value as SortBy)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Pontuação</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="date">Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
