import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Milo J: La Vida Era Mas Corta - Pixel Run",
  description: "Un juego pixel local inspirado en el album La Vida Era Mas Corta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
