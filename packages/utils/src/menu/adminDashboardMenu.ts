import {
  BookOpen,
  ChartBarBig,
  ChartNoAxesCombined,
  Download,
  FileDown,
  GalleryHorizontal,
  GraduationCap,
  MessageCircle,
  MessageCircleQuestion,
  Percent,
  Phone,
  TvMinimalPlay,
  UserPlus,
  UserRoundCheck,
  Users,
  Wallet,
} from "lucide-react";

export const sideBarMenuItems = [
  {
    groupName: "Content Management",
    subMenuItems: [
      {
        tabName: "Posts",
        tabHref: "/posts/list",
        tabIcon: BookOpen,
        subMenuItems: [
          { label: "new", href: "/posts/new" },
          { label: "List", href: "/posts/list" },
          { label: "Categories", href: "/posts/categories" },
          { label: "Comments", href: "/posts/comments" },
        ],
      },
      {
        tabName: "Assets",
        tabHref: "/assets/list",
        tabIcon: Download,
        subMenuItems: [
          { label: "new", href: "/assets/new" },
          { label: "List", href: "/assets/list" },
          { label: "Categories", href: "/assets/categories" },
        ],
      },
      {
        tabName: "Courses",
        tabHref: "/courses/list",
        tabIcon: TvMinimalPlay,
        subMenuItems: [
          { label: "new", href: "/courses/new" },
          { label: "List", href: "/courses/list" },
          { label: "Categories", href: "/courses/categories" },
          { label: "Reviews", href: "/courses/reviews" },
        ],
      },
      {
        tabName: "Announcements",
        tabHref: "/announcements",
        tabIcon: GalleryHorizontal,
        subMenuItems: [],
      },
    ],
  },

  {
    groupName: "Enrollment & Financial",
    subMenuItems: [
      {
        tabName: "Enrollment",
        tabHref: "/enrollments/list",
        tabIcon: UserPlus,
        subMenuItems: [
          { label: "New", href: "/enrollments/new" },
          { label: "List", href: "/enrollments/list" },
          { label: "Payments", href: "/enrollments/payments" },
        ],
      },
      {
        tabName: "Marketing",
        tabHref: "/marketing/coupons",
        tabIcon: Percent,
        subMenuItems: [
          { label: "Coupons", href: "/marketing/coupons" },
          { label: "Campaigns", href: "/marketing/campaigns" },
          { label: "Overall Off", href: "/marketing/overall-off" },
        ],
      },
      {
        tabName: "Wallet",
        tabHref: "/wallet",
        tabIcon: Wallet,
        subMenuItems: [],
      },
    ],
  },

  {
    groupName: "Support & Communication",
    subMenuItems: [
      {
        tabName: "Tickets",
        tabHref: "/tickets/list",
        tabIcon: MessageCircle,
        subMenuItems: [
          { label: "New", href: "/tickets/new" },
          { label: "List", href: "/tickets/list" },
        ],
      },
      {
        tabName: "Q & A",
        tabHref: "/qa",
        tabIcon: MessageCircleQuestion,
        subMenuItems: [],
      },
      {
        tabName: "Contact",
        tabHref: "/contact",
        tabIcon: Phone,
        subMenuItems: [],
      },
    ],
  },

  {
    groupName: "User Management",
    subMenuItems: [
      {
        tabName: "Students",
        tabHref: "/students",
        tabIcon: Users,
        subMenuItems: [],
      },
      {
        tabName: "Tutors",
        tabHref: "/tutors",
        tabIcon: GraduationCap,
        subMenuItems: [{ label: "Settlements", href: "/tutors/settlements" }],
      },
      {
        tabName: "Admins",
        tabHref: "/admins",
        tabIcon: UserRoundCheck,
        subMenuItems: [],
      },
    ],
  },

  {
    groupName: "Data Analysis & Export",
    subMenuItems: [
      {
        tabName: "Analysis",
        tabHref: "/analysis",
        tabIcon: ChartBarBig,
        subMenuItems: [
          { label: "Overview", href: "/analysis" },
          { label: "Earnings", href: "/statistics/earnings" },
          { label: "Coupons", href: "/statistics/coupons" },
          { label: "Registrations", href: "/statistics/registrations" },
          { label: "Ratings", href: "/statistics/ratings" },
          { label: "Instructors", href: "/statistics/instructors" },
          { label: "Students", href: "/statistics/students" },
          { label: "Tickets", href: "/statistics/tickets" },
        ],
      },

      {
        tabName: "Statistics",
        tabHref: "/statistics",
        tabIcon: ChartNoAxesCombined,
        subMenuItems: [
          { label: "Overview", href: "/statistics" },
          { label: "Views", href: "/statistics/views" },
          { label: "Pages", href: "/statistics/pages" },
          { label: "Courses", href: "/statistics/courses" },
          { label: "Refers", href: "/statistics/refers" },
          { label: "Devices", href: "/statistics/refers" },
        ],
      },

      {
        tabName: "Export",
        tabHref: "/export/users",
        tabIcon: FileDown,
        subMenuItems: [{ label: "Users", href: "/export/users" }],
      },
    ],
  },
];
