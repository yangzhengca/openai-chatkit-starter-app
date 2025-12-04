"use client";

import { useCallback } from "react";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/context/AuthContext";
import { UserMenu } from "@/components/UserMenu";

export default function App() {
  const { scheme, setScheme } = useColorScheme();
  const { user, isLoading } = useAuth();

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[ChatKitPanel] widget action", action);
    }
  }, []);

  const handleResponseEnd = useCallback(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[ChatKitPanel] response end");
    }
  }, []);

  if (isLoading) {
    return (
      <main className="flex h-screen flex-col items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex h-screen flex-col items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="text-slate-600 dark:text-slate-400">Redirecting to login...</div>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col items-center justify-end bg-slate-100 dark:bg-slate-950 overflow-hidden">
      <header className="w-full max-w-5xl mx-auto p-4 flex items-center justify-between px-4">
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            BigGeo Marketplace Agent Demo
          </h1>
          {/* <a
            href="https://marketplace.biggeo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            marketplace.biggeo.com
          </a> */}
        </div>
        <UserMenu />
      </header>
      <div className="mx-auto w-full max-w-5xl">
        <ChatKitPanel
          theme={scheme}
          onWidgetAction={handleWidgetAction}
          onResponseEnd={handleResponseEnd}
          onThemeRequest={setScheme}
        />
      </div>
    </main>
  );
}
