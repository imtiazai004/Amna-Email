import { 
  GraduationCap, 
  Building2, 
  Smartphone, 
  Globe, 
  Code2, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  BookOpen, 
  Library, 
  LifeBuoy, 
  History,
  Rocket,
  Compass,
  Server,
  Target,
  Users,
  BarChart4,
  Layout,
  Terminal,
  Webhook,
  Activity,
  FileText,
  MessageSquare
} from 'lucide-react';

export const SOLUTIONS_NAV = [
  {
    title: "By Institution",
    items: [
      { id: "k12", title: "K-12 Education", description: "Safeguard and track developmental growth.", icon: GraduationCap, path: "/marketing/solutions" },
      { id: "higher-ed", title: "Higher Education", description: "Complex academic hierarchies solved.", icon: Building2, path: "/marketing/solutions" },
      { id: "training", title: "Professional Training", description: "Certification and vocational mastery.", icon: Smartphone, path: "/marketing/solutions" },
      { id: "govt", title: "Government Boards", description: "Centralized regional management.", icon: Globe, path: "/marketing/solutions" }
    ]
  },
  {
    title: "By Use Case",
    items: [
      { id: "remote", title: "Hybrid Learning", description: "Sync classroom and digital nodes.", icon: Target, path: "/marketing/solutions" },
      { id: "financial-ops", title: "Financial Ops", description: "Institutional payment automation.", icon: BarChart4, path: "/marketing/solutions" },
      { id: "admin-hub", title: "Admin Efficiency", description: "Streamline institutional overhead.", icon: Layout, path: "/marketing/solutions" }
    ]
  }
];

export const DEVELOPERS_NAV = [
  {
    title: "Platform API",
    items: [
      { id: "api-docs", title: "Documentation", description: "Explore our REST and GraphQL APIs.", icon: BookOpen, path: "/marketing/developers" },
      { id: "api-reference", title: "API Reference", description: "Complete endpoint and model specs.", icon: Terminal, path: "/marketing/developers" },
      { id: "sdk", title: "Platform SDKs", description: "Pre-built logic for JS, Python, Go.", icon: Code2, path: "/marketing/developers" }
    ]
  },
  {
    title: "Infrastructure",
    items: [
      { id: "webhooks", title: "Webhooks", description: "Real-time institutional event bus.", icon: Webhook, path: "/marketing/developers" },
      { id: "security", title: "Auth & IAM", description: "SSO, SAML and OIDC integrations.", icon: ShieldCheck, path: "/marketing/developers" },
      { id: "status", title: "Edge Network", description: "Deploy nodes on local infrastructure.", icon: Cpu, path: "/marketing/developers" }
    ]
  }
];

export const RESOURCES_NAV = [
  {
    title: "Learning Center",
    items: [
      { id: "guides", title: "Platform Guides", description: "Deep dives into core EduFlow logic.", icon: FileText, path: "/marketing/resources" },
      { id: "academy", title: "EduFlow Academy", description: "Certified institutional training.", icon: Library, path: "/marketing/resources" },
      { id: "research", title: "EdTech Research", description: "Latest whitepapers on education.", icon: Activity, path: "/marketing/resources" }
    ]
  },
  {
    title: "Support",
    items: [
      { id: "help", title: "Help Center", description: "24/7 technical documentation.", icon: LifeBuoy, path: "/marketing/resources" },
      { id: "community", title: "Community Forum", description: "Connect with platform engineers.", icon: MessageSquare, path: "/marketing/resources" },
      { id: "changelog", title: "Changelog", description: "Recent core engine updates.", icon: History, path: "/marketing/resources" }
    ]
  }
];

export const PRICING_NAV = [
  {
    title: "Strategic Plans",
    items: [
      { id: "starter", title: "Starter Node", description: "Entry-level local infrastructure.", icon: Rocket, path: "/marketing/pricing" },
      { id: "pro", title: "Professional Cluster", description: "Scale across multiple campuses.", icon: Compass, path: "/marketing/pricing" },
      { id: "enterprise", title: "Global Grid", description: "Sovereign institutional networks.", icon: Server, path: "/marketing/pricing" }
    ]
  }
];
