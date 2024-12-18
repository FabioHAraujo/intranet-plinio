import type { Metadata } from "next";
import localFont from "next/font/local";
import ClientWrapper from "./ClientWrapper";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Intranet Grupo Plínio Fleck",
  description: "Criado por nós, para nós, com a sua ajuda!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <link rel="icon" href="@/assets/logo.png" sizes="any" />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
