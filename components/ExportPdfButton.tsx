"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportPdfButton() {
  return (
    <Button type="button" onClick={() => window.print()}>
      <FileDown className="h-4 w-4" />
      Exportar PDF
    </Button>
  );
}
