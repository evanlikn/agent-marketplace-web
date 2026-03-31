import "./globals.css";
import type { Metadata } from "next";
import { TopNav } from "../components/TopNav";

export const metadata: Metadata = {
  title: "OpenClaw Agent Marketplace",
  description: "Discover and invoke published OpenClaw agents"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <div className="page-shell">{children}</div>
      </body>
    </html>
  );
}
