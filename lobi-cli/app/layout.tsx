"use client"
import './globals.css'
import {Inter} from 'next/font/google'
import {cn} from "@/lib/utils";
import {Header} from "@/components/header/header";
import {Footer} from "@/components/footer/footer";
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({subsets: ['latin']})

// export const metadata: Metadata = {
//   title: 'Find your next match',
//   description: 'Find your next match',
// }

export default function RootLayout({children,}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body className={
      cn(inter.className)}>
    <Header/>
    {children}
    <Footer/>
    <Toaster/>
    </body>
    </html>
  )
}
