import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from './screens/Header'
const inter = Inter({ subsets: ['latin'] })
import { AxiomWebVitals } from 'next-axiom';
export const metadata: Metadata = {
  title: 'VareyaShip',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="">
      <AxiomWebVitals/>
        <Header ></Header>
        {children}
        </body>
    </html>
  )
}
