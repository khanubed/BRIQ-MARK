import { Metadata } from "next";
import { generatePageMetadata } from "../../../lib/seo";
import { Badge } from "../../../components/ui/Badge";
import { ContactForm } from "./ContactForm";
import { Mail, MapPin, PhoneCall, ShieldCheck } from "lucide-react";

import { ContactHeader } from "./ContactHeader";

export const metadata: Metadata = generatePageMetadata({
  title: "Book Strategic Growth Briefing",
  description:
    "Schedule a confidential discovery consultation with our senior growth directors. We partner with select brands across the US, Canada, and Dubai.",
  canonical: "/contact",
});

export default function ContactPage() {
  return (
    <main className="flex-1 pt-32 md:pl-48 pb-32 px-6  bg-[#08080a] text-white min-h-screen">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Animated Center Headline */}
        <ContactHeader />

        {/* Contact Form Area */}
        <div className="w-full max-w-5xl">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
