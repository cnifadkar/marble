import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Marble — Your Spatial Canvas for Thinking',
  description: 'A beautiful spatial knowledge canvas where ideas flow freely. Capture thoughts, connect concepts, and build your second brain visually.',
  keywords: ['knowledge management', 'second brain', 'canvas', 'notes', 'productivity'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

