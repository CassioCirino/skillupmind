"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { College, StudentInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type StudentFormProps = {
  onSubmit: (student: StudentInfo) => void;
  onBack?: () => void;
};

const initialForm: StudentInfo = {
  name: "",
  email: "",
  phone: "",
  course: "",
  college: "FICR"
};

export function StudentForm({ onSubmit, onBack }: StudentFormProps) {
  const [form, setForm] = useState<StudentInfo>(initialForm);
  const [error, setError] = useState("");

  function updateField<K extends keyof StudentInfo>(field: K, value: StudentInfo[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.course.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Informe um email válido.");
      return;
    }

    if (!["FICR", "UCB"].includes(form.college)) {
      setError("Faculdade inválida.");
      return;
    }

    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      course: form.course.trim(),
      college: form.college
    });
  }

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Dados do aluno</CardTitle>
        <CardDescription>
          Essas informações são obrigatórias e serão usadas no relatório e no ranking administrativo.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              required
              autoComplete="tel"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">Curso</Label>
            <Input
              id="course"
              value={form.course}
              onChange={(event) => updateField("course", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Faculdade</Label>
            <Select
              value={form.college}
              onValueChange={(value) => updateField("college", value as College)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FICR">FICR</SelectItem>
                <SelectItem value="UCB">UCB</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {onBack ? (
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit">
            Começar perguntas
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
