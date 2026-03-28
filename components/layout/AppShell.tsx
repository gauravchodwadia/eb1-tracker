"use client";

import { usePathname } from "next/navigation";
import DesktopSidebar from "./DesktopSidebar";
import BottomTabBar from "./BottomTabBar";

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
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
      <BottomTabBar />
    </div>
  );
}
