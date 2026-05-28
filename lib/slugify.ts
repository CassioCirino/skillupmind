const pad = (value: number) => value.toString().padStart(2, "0");

export function slugifyName(value: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "aluno";
}

export function formatFileTimestamp(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

export function createResultFileName(studentName: string, date = new Date()) {
  const id = `${slugifyName(studentName)}_${formatFileTimestamp(date)}`;

  return {
    id,
    fileName: `${id}.json`
  };
}
