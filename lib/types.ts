export type GalleryCategory = "jetting" | "splicing" | "crew" | "equipment" | "closeout" | "setup";

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  location: string;
  description: string;
  src: string;
  blurDataURL: string;
  altText?: string;
}

export interface ServiceData {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  features: string[];
  icon: string;
}

export interface LeadFormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  cityState: string;
  serviceNeeded: "jetting" | "splicing" | "both" | "";
  targetStartDate: string;
  estimatedFootage: string;
  notes: string;
  website: string; // honeypot
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  company: string;
  metric: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
