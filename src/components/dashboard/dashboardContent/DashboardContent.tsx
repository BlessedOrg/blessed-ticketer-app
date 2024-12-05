"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { DashboardTab } from "@/components/dashboard/tabs/DashboardTab";
import { OwnedTicketsView } from "@/components/dashboard/tabs/ownedTickets/OwnedTicketsView";
import { ListOfEventsToManage } from "@/components/dashboard/tabs/management/events/ListOfEventsToManage";
import { EventManagement } from "@/components/dashboard/tabs/management/EventManagement";

const paramsIndexPerId = {
  dashboard: 0,
  tickets: 1,
  management: 2
};

const contentPerTab = {
  0: <DashboardTab />,
  1: <OwnedTicketsView />,
  2: <ListOfEventsToManage />
};

export const DashboardContent = ({ currentTabIndex, onTabChange }) => {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "tickets";

  useEffect(() => {
    const activeTabIndex = paramsIndexPerId[currentTab];
    onTabChange(activeTabIndex);
  }, [currentTab]);

  return <div className="flex flex-col gap-4 w-full min-w-0">
    {contentPerTab[currentTabIndex] || <EventManagement eventId={currentTab} />}
  </div>;
};
