import { CircleArrowOutDownLeft, MessageCircleQuestion } from "lucide-react";

export const tutorDashboardMenu = [
  {
    groupName: "Student Managment",
    subMenuItems: [
      {
        tabName: "Q & A",
        tabHref: "/qa",
        tabIcon: MessageCircleQuestion,
        subMenuItems: [{ label: "Q & A", href: "/qa" }],
      },
    ],
  },
  {
    groupName: "Financial",
    subMenuItems: [
      {
        tabName: "Settlements",
        tabHref: "/settlements",
        tabIcon: CircleArrowOutDownLeft,
        subMenuItems: [{ label: "Settlements", href: "/settlements" }],
      },
    ],
  },
];
