import './globals.css'
import Sidebar from '@/components/Sidebar'
import { ThemeProvider } from '@/components/ThemeProvider'
import AuthProvider from '@/components/AuthProvider'

export const metadata = {
  title: 'LearnSync - AI Learning Path Recommender',
  description: 'AI-Powered Personalized Learning Path Recommender for HCLTech AMPlified',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="aurora-bg">
              <div className="aurora-orb orb-1"></div>
              <div className="aurora-orb orb-2"></div>
              <div className="aurora-orb orb-3"></div>
            </div>
            <div className="app-layout">
              <Sidebar />
              <main className="main-content">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
