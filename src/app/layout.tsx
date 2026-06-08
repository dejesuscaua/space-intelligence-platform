import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Space Intelligence Platform — Infraestrutura Cognitiva Espacial',
  description:
    'The Cognitive Infrastructure for a Smarter Planet. Plataforma unificada de inteligência espacial para agronegócio, energia, logística e defesa civil.',
  keywords: 'space intelligence, satellite data, IoT, AI, orbital data, agronegocio, Azure',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
