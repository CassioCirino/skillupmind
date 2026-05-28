import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Avaliação de Alunos de TI | SkillUpMind",
  description: "Aplicação de avaliação técnica inicial para alunos de TI."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          id="dynatrace-rum"
          src="https://js-cdn.dynatrace.com/jstag/176fb25782e/bf84867vgb/a0229cfdfb0e11_complete.js"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
