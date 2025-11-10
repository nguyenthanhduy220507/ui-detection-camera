import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Camera Surveillance System',
  description: 'Real-time camera surveillance with object detection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

