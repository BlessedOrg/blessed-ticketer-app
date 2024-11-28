export const dashboardNavItems = (isBouncer?: boolean) => [
  {
    index: 0,
    id: "dashboard",
    label: "Dashboard",
    href: "?tab=dashboard"
  },
  {
    index: 1,
    id: "tickets",
    label: "My tickets",
    href: "?tab=tickets"
  },
  isBouncer && {
    index: 2,
    id: "management",
    label: "Management",
    href: "?tab=management"
  }
];
