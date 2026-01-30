import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "팀 루틴",
  description: "운동 출석 · 논문 스터디",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
