"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import DesktopSidebar from "./DesktopSidebar";
import BottomTabBar from "./BottomTabBar";
import ViewingBanner from "./ViewingBanner";
import ProfileSwitcher from "./ProfileSwitcher";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname === "/login" || pathname === "/setup";

  if (hideNav) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <div className="lg:hidden sticky top-0 z-40 bg-zinc-950/80 backdrop-blur border-b border-zinc-800 px-4 py-2">
          <Suspense fallback={null}>
            <ProfileSwitcher />
          </Suspense>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Suspense fallback={null}>
            <ViewingBanner />
          </Suspense>
          {children}
        </div>
      </main>
      <BottomTabBar />
    </div>
  );
}
