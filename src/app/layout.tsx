import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "DA Operations Suite",
  description: "BD Pipeline & Utilization Tracker for Delivery Associates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Sidebar />
        <main className="ml-[220px] min-h-screen px-9 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
