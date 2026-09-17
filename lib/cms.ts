import caseStudiesData from "../content/case-studies.json";
import servicesData from "../content/services.json";
import testimonialsData from "../content/testimonials.json";
import teamData from "../content/team.json";

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  industry: string;
  market: "US" | "Canada" | "UAE";
  coverImage: string;
  results: CaseStudyMetric[];
  tagline: string;
  challenge: string;
  approach: string;
  outcome: string;
}

export interface ServiceCapability {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  outcomeMetric: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  location: string;
  metric: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  market: string;
  bio: string;
  specialty: string;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return caseStudiesData as CaseStudy[];
}

export async function getCaseStudyBySlug(
  slug: string
): Promise<CaseStudy | undefined> {
  const all = await getCaseStudies();
  return all.find((item) => item.slug === slug);
}

export async function getServices(): Promise<ServiceCapability[]> {
  return servicesData as ServiceCapability[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonialsData as Testimonial[];
}

export async function getTeam(): Promise<TeamMember[]> {
  return teamData as TeamMember[];
}
