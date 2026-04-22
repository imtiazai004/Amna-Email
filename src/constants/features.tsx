import { 
  BookOpen, 
  Users, 
  UserSquare2, 
  FileSpreadsheet, 
  Contact, 
  Calendar, 
  Clock, 
  BarChart3, 
  CreditCard, 
  Banknote, 
  Share2, 
  CalendarDays, 
  Megaphone, 
  Image, 
  Send, 
  Globe, 
  LayoutDashboard, 
  MessageSquare, 
  Wallet, 
  History, 
  LineChart, 
  Users2, 
  Sparkles,
  Zap
} from 'lucide-react';

export const FEATURE_CATEGORIES = [
  {
    title: "Academics",
    items: [
      {
        id: "classes-management",
        title: "Classes Smart Management",
        description: "Manage class structure, sections, and scheduling efficiently",
        icon: BookOpen,
        path: "/features/classes-management"
      },
      {
        id: "student-management",
        title: "Students Management",
        description: "Complete student lifecycle management (admission to graduation)",
        icon: Users,
        path: "/features/student-management"
      },
      {
        id: "teachers-management",
        title: "Teachers Management",
        description: "Manage teacher profiles, assignments, and responsibilities",
        icon: UserSquare2,
        path: "/features/teachers-management"
      },
      {
        id: "examination-center",
        title: "Examination & Assessment Center",
        description: "Conduct exams, grading, and performance tracking",
        icon: FileSpreadsheet,
        path: "/features/examination-center"
      }
    ]
  },
  {
    title: "Management & Staff",
    items: [
      {
        id: "teachers-directory",
        title: "Teachers Directory",
        description: "Centralized teacher profiles and information",
        icon: Contact,
        path: "/features/teachers-directory"
      },
      {
        id: "teacher-schedule",
        title: "Teacher Schedule",
        description: "Manage and assign daily teaching schedules",
        icon: Calendar,
        path: "/features/teacher-schedule"
      },
      {
        id: "staff-attendance",
        title: "Staff Attendance",
        description: "Track attendance of teachers and staff",
        icon: Clock,
        path: "/features/staff-attendance"
      }
    ]
  },
  {
    title: "Finance Management",
    items: [
      {
        id: "finance-overview",
        title: "Finance Overview",
        description: "Real-time financial dashboard and insights",
        icon: BarChart3,
        path: "/features/finance-overview"
      },
      {
        id: "fee-management",
        title: "Fee Management",
        description: "Automate student fee collection and tracking",
        icon: CreditCard,
        path: "/features/fee-management"
      },
      {
        id: "salary-management",
        title: "Salary Management",
        description: "Manage payroll and staff salaries",
        icon: Banknote,
        path: "/features/salary-management"
      }
    ]
  },
  {
    title: "Social Media Management",
    items: [
      {
        id: "content-management",
        title: "Content Management",
        description: "Manage school content and posts",
        icon: Share2,
        path: "/features/content-management"
      },
      {
        id: "school-events",
        title: "School Events",
        description: "Plan and publish events",
        icon: CalendarDays,
        path: "/features/school-events"
      },
      {
        id: "announcements",
        title: "Announcements",
        description: "Share important updates",
        icon: Megaphone,
        path: "/features/announcements"
      },
      {
        id: "media-library",
        title: "Media Library",
        description: "Store images, videos, documents",
        icon: Image,
        path: "/features/media-library"
      },
      {
        id: "scheduled-posts",
        title: "Scheduled Posts",
        description: "Plan content publishing",
        icon: Send,
        path: "/features/scheduled-posts"
      },
      {
        id: "public-website",
        title: "Public Website",
        description: "Manage school’s public-facing website",
        icon: Globe,
        path: "/features/public-website"
      }
    ]
  },
  {
    title: "Guardian Management Hub",
    items: [
      {
        id: "guardian-dashboard-feature",
        title: "Dashboard",
        description: "Parent overview of child activity",
        icon: LayoutDashboard,
        path: "/features/guardian-dashboard-feature"
      },
      {
        id: "communication",
        title: "Communication",
        description: "Messaging between school and parents",
        icon: MessageSquare,
        path: "/features/communication"
      },
      {
        id: "fees-payments",
        title: "Fees & Payments",
        description: "View and pay fees",
        icon: Wallet,
        path: "/features/fees-payments"
      },
      {
        id: "attendance-history",
        title: "Attendance History",
        description: "Track student attendance",
        icon: History,
        path: "/features/attendance-history"
      },
      {
        id: "academic-performance",
        title: "Academic Performance",
        description: "View results and reports",
        icon: LineChart,
        path: "/features/academic-performance"
      },
      {
        id: "teacher-meetings",
        title: "Teacher Meetings",
        description: "Schedule meetings with teachers",
        icon: Users2,
        path: "/features/teacher-meetings"
      },
      {
        id: "upcoming-events",
        title: "Upcoming Events",
        description: "View school events",
        icon: CalendarDays,
        path: "/features/upcoming-events"
      },
      {
        id: "guardian-announcements",
        title: "Announcements",
        description: "Stay updated with notices",
        icon: Megaphone,
        path: "/features/guardian-announcements"
      }
    ]
  }
];

export const ALL_FEATURES = FEATURE_CATEGORIES.flatMap(cat => cat.items);
