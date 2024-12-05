"use client";
import { Suspense, useState } from "react";
import { DashboardContent } from "@/components/dashboard/dashboardContent/DashboardContent";
import { DashboardSidebarNav } from "@/components/dashboard/dashboardSidebarNav/DashboardSidebarNav";
import { LoadingDashboardSkeleton } from "@/components/ui/loading-dashboard-skeleton";
import { DashboardSidebar } from "@/components/dashboard/views/DashboardSidebar";

export const Dashboard = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const onTabChange = (index) => {
    setCurrentTabIndex(index);
  };

  return (
    <main className="flex lg:flex-row flex-col-reverse md:flex-col gap-6 w-full px-[1.5rem] max-w-[90rem] overflow-hidden">
      <DashboardSidebarNav currentTabIndex={currentTabIndex || 0} className="hidden md:block" />
      <Suspense fallback={<LoadingDashboardSkeleton />}>
        <DashboardContent currentTabIndex={currentTabIndex} onTabChange={onTabChange} />
      </Suspense>
      <DashboardSidebar />
    </main>
  );
};
