import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "내용증명 자동 작성기",
  description: "법적 형식에 맞는 내용증명서 초안을 즉시 생성합니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
