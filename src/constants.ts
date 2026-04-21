import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  Share2, 
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  CreditCard,
  FileText,
  Video,
  Settings,
  Bell,
  Search,
  School
} from 'lucide-react';

export const PORTALS = [
  {
    id: 'academics',
    name: 'Academics',
    icon: GraduationCap,
    subPortals: [
      { id: 'classes', name: 'Classes Smart Management', icon: ClipboardList },
      { id: 'students', name: 'Student Management Portal', icon: Users },
      { id: 'teachers', name: 'Teacher Management Portal', icon: GraduationCap },
      { id: 'exams', name: 'Examination & Assessment Center', icon: FileText }
    ]
  },
  {
    id: 'staff',
    name: 'Management & Staff',
    icon: Users,
    subPortals: [
      { id: 'directory', name: 'Teachers Directory', icon: Search },
      { id: 'schedule', name: 'Teacher Schedule', icon: Calendar },
      { id: 'attendance', name: 'Staff Attendance', icon: UserCheck }
    ]
  },
  {
    id: 'finance',
    name: 'Finance Management',
    icon: DollarSign,
    subPortals: [
      { id: 'finance-overview', name: 'Finance Overview', icon: LayoutDashboard },
      { id: 'fee-management', name: 'Fee Management', icon: CreditCard },
      { id: 'fee-tracking', name: 'Fee Tracking', icon: Search },
      { id: 'salary-management', name: 'Salary Management', icon: FileText }
    ]
  },
  {
    id: 'guardian',
    name: 'Guardian Engagement',
    icon: MessageSquare,
    subPortals: [
      { id: 'guardian-dashboard', name: 'Dashboard', icon: LayoutDashboard },
      { id: 'communication', name: 'Communication', icon: MessageSquare },
      { id: 'fees', name: 'Fees & Payments', icon: DollarSign },
      { id: 'attendance-history', name: 'Attendance History', icon: Calendar },
      { id: 'performance', name: 'Academic Performance', icon: GraduationCap },
      { id: 'meetings', name: 'Teacher Meetings', icon: Video }
    ]
  },
  {
    id: 'social',
    name: 'Social Media',
    icon: Share2,
    subPortals: [
      { id: 'content', name: 'Content Management', icon: FileText },
      { id: 'events', name: 'School Events', icon: Calendar },
      { id: 'announcements', name: 'Announcements', icon: Bell },
      { id: 'media', name: 'Media Library', icon: Video },
      { id: 'scheduler', name: 'Scheduled Posts', icon: Calendar },
      { id: 'website', name: 'Public Website', icon: School }
    ]
  }
];
