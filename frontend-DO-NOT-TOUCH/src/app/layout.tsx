import type { Metadata } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo application with JWT authentication",
};

/**
 * Root layout with AuthProvider.
 * Per plan.md project structure.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
