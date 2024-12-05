import { Metadata } from "next";
import { Suspense } from "react";
import { Navigation } from "@/components/navigation/Navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Blessed.fan | Ticketer"
};

export default async function Home() {
  return (
    <div className="flex w-full flex-col items-center">
      <Suspense>
        <Navigation />
      </Suspense>
      <Dashboard />

    </div>
  );
}
