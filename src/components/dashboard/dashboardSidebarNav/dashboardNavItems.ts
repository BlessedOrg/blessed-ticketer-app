const basicNavItems = [
  // {
  //   index: 0,
  //   id: "dashboard",
  //   label: "Dashboard",
  //   href: "?tab=dashboard"
  // },
  {
    index: 1,
    id: "tickets",
    label: "My tickets",
    href: "?tab=tickets"
  }
];
export const dashboardNavItems = (isBouncer?: boolean) => !isBouncer ? basicNavItems : [...basicNavItems, {
  index: 2,
  id: "management",
  label: "Management",
  href: "?tab=management"
}];
