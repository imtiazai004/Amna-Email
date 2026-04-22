import { 
  Globe, 
  Code2, 
  BookOpen, 
  Tag, 
  Smartphone, 
  Building2, 
  GraduationCap, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  FileCode2, 
  Rocket, 
  Compass, 
  LifeBuoy, 
  Library, 
  History, 
  CheckCircle2,
  Users2,
  BarChart4,
  Server
} from 'lucide-react';

export const MARKETING_SECTIONS = {
  solutions: {
    id: 'solutions',
    title: 'Solutions',
    subtitle: 'Modular infrastructure for every institutional tier',
    heroDescription: 'From local training centers to global university networks, EduFlow provides the baseline intelligence required to operate at scale.',
    items: [
      {
        title: "K-12 Education",
        description: "Comprehensive management for primary and secondary institutions focusing on student safety and developmental tracking.",
        icon: GraduationCap
      },
      {
        title: "Higher Education",
        description: "Scalable infrastructure for universities with complex multi-departmental financial and academic hierarchies.",
        icon: Building2
      },
      {
        title: "Professional Training",
        description: "Dynamic scheduling and certification pipelines for vocational centers and corporate training nodes.",
        icon: Smartphone
      },
      {
        title: "Institutional Groups",
        description: "Centralized authority dashboard for governing boards managing multiple school campuses.",
        icon: Globe
      }
    ]
  },
  developers: {
    id: 'developers',
    title: 'Developers',
    subtitle: 'The API for Institutional Intelligence',
    heroDescription: 'Build custom integrations, automate data pipelines, and extend the core EduFlow engine with our robust API and SDKs.',
    items: [
      {
        title: "REST API",
        description: "Programmatic access to students, staff, and financial records via secure, documented endpoints.",
        icon: Code2
      },
      {
        title: "Webhooks",
        description: "Real-time event notifications for attendance logs, fee payments, and exam result publication.",
        icon: Zap
      },
      {
        title: "Auth & Identity",
        description: "Enterprise-grade OAuth2 and SAML integration for seamless institutional identity management.",
        icon: ShieldCheck
      },
      {
        title: "Edge Implementation",
        description: "Deploy custom logic at the edge to handle regional data residency and low-latency local requirements.",
        icon: Cpu
      }
    ]
  },
  resources: {
    id: 'resources',
    title: 'Resources',
    subtitle: 'Institutional Knowledge Base',
    heroDescription: 'Expert guides, implementation frameworks, and the latest research on institutional operational efficiency.',
    items: [
      {
        title: "Documentation",
        description: "Step-by-step technical guides for configuring your institutional distributed node.",
        icon: BookOpen
      },
      {
        title: "Success Stories",
        description: "Deep-dives into how leading schools transformed their financial performance with EduFlow.",
        icon: Library
      },
      {
        title: "Help Center",
        description: "24/7 technical support and community forums for institutional IT staff.",
        icon: LifeBuoy
      },
      {
        title: "Changelog",
        description: "Stay updated with the latest deployments to the EduFlow global core.",
        icon: History
      }
    ]
  },
  pricing: {
    id: 'pricing',
    title: 'Pricing',
    subtitle: 'Transparent, scalable investment',
    heroDescription: 'Pricing that grows with your student population. No hidden fees, just pure institutional logic.',
    plans: [
      {
        name: "Starter",
        price: "49",
        description: "Perfect for local training centers and small private schools.",
        features: ["Up to 200 Students", "Academic Core", "Basic Finance", "1 Admin Node", "Community Support"],
        icon: Rocket
      },
      {
        name: "Professional",
        price: "199",
        description: "The standard for growing K-12 and specialized institutions.",
        features: ["Unlimited Students", "Full Academic Suite", "Advanced Finance", "10 Staff Nodes", "Priority Support", "Public Website"],
        icon: Compass,
        popular: true
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "Custom infrastructure for university networks and global boards.",
        features: ["Global Node Deployment", "SSO/SAML Integration", "Unlimited Staff Nodes", "Dedicated Success Manager", "24/7 Phone Support", "White-label Portal"],
        icon: Server
      }
    ]
  }
};
