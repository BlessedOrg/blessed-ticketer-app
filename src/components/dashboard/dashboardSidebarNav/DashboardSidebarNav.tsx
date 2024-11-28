"use client";
import Link from "next/link";
import { dashboardNavItems } from "./dashboardNavItems";
import { useUserContext } from "@/store/UserContext";

export const DashboardSidebarNav = ({ currentTabIndex, className }: { currentTabIndex: number; className?: string }) => {
  const { userEventsPermissions } = useUserContext();

  const isBouncer = !!userEventsPermissions?.length;
  const items = dashboardNavItems(isBouncer);
  return (
    <div className={`flex flex-col gap-4 lg:sticky lg:top-[6.25rem] lg:h-[calc(100vh-6.25rem)] lg:min-w-[13rem] ${className || ""}`}>
      <ul className="bg-white p-2 rounded-3xl">
        {items.map((nav) => {
          const isActive = nav.index === currentTabIndex;
          return (
            <li key={nav.id}>
              <Link
                href={nav.href}
                className={`rounded-full px-5 py-2 font-semibold hover:bg-gray-300 ${
                  isActive ? "bg-root-background" : ""
                } w-full text-left my-1 block`}
              >
                {nav.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
