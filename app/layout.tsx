import Script from "next/script";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "BigGeo Marketing Agent",
  description: "Demo of BigGeo Marketing Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
