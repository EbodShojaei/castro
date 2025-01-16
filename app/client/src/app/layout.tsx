import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import Navbar from '@/components/shared/layout/Navbar';
import Background from '@/components/shared/layout/Background';
import './globals.css';

export const metadata: Metadata = {
  title: 'Castro Chat',
  description: 'Web3 Chat Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ErrorBoundary>
          <AuthProvider>
            <div className="relative z-10">
              <Background />
              <Navbar />
              <main>{children}</main>
            </div>
          </AuthProvider>
        </ErrorBoundary>
        <SpeedInsights />
      </body>
    </html>
  );
}
