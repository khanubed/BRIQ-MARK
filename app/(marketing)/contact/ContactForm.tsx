"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  setFormField,
  toggleServiceNeeded,
  setStatus,
  setErrorMessage,
  resetContactForm,
} from "../../../store/slices/contactSlice";
import {
  SmoothInput,
  Textarea,
} from "../../../components/ui/skiper-ui/skiper106";
import TextRoll from "../../../components/ui/skiper-ui/skiper58";
import { trackEvent } from "../../../lib/analytics";
import { CheckCircle2, Paperclip } from "lucide-react";
import { cn } from "../../../lib/utils";
import { GuitarString } from "../../../components/ui/GuitarString";

const availableServices = [
  "Brand & Growth Strategy",
  "Performance-Driven Creative",
  "Enterprise Demand & ABM",
  "Technical Revenue Infrastructure",
];

const budgetTiers = ["$10k-$25k", "$25k-$50k", "$50k-$100k", "$100k+"] as const;
const targetMarkets = ["US", "Canada", "UAE", "Other"] as const;

export function ContactForm() {
  const dispatch = useAppDispatch();
  const contact = useAppSelector((state) => state.contact);
  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!contact.fullName.trim()) errs.fullName = "Full name is required.";
    if (!contact.email.trim()) {
      errs.email = "Corporate email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!contact.company.trim()) errs.company = "Company name is required.";
    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(setStatus("submitting"));
    dispatch(setErrorMessage(null));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: contact.fullName,
          email: contact.email,
          company: contact.company,
          targetMarket: contact.targetMarket,
          budgetTier: contact.budgetTier,
          servicesNeeded: contact.servicesNeeded,
          message: contact.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      dispatch(setStatus("success"));
      trackEvent("form_submit", {
        market: contact.targetMarket,
        budget: contact.budgetTier,
      });
    } catch (err: any) {
      dispatch(setStatus("error"));
      dispatch(setErrorMessage(err.message || "An unexpected error occurred."));
    }
  };

  if (contact.status === "success") {
    return (
      <div className="p-12 text-left space-y-6 flex flex-col items-start">
        <div className="w-16 h-16 mr-auto rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-bold text-white font-spacegrotesk">
            Request Confirmed
          </h3>
          <p className="text-neutral-400 text-base max-w-md mr-auto font-archivo">
            Thank you, {contact.fullName}. Your confidential discovery brief has
            been routed directly to our Managing Partner. Expect a response
            within 48 hours.
          </p>
        </div>
        <button
          className="mt-6 px-8 py-4 rounded-full border border-neutral-800 text-white hover:bg-white/5 transition-colors font-medium text-base"
          onClick={() => dispatch(resetContactForm())}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-12 w-full max-w-full mr-auto text-left"
    >
      {/* 1. Services Pills */}
      <div className="space-y-6">
        <h3 className="text-2xl font-medium text-white font-archivo">
          I'm interested in...
        </h3>
        <div className="flex flex-wrap gap-3 justify-start">
          {availableServices.map((service) => {
            const isSelected = contact.servicesNeeded.includes(service);
            return (
              <button
                type="button"
                key={service}
                onClick={() => dispatch(toggleServiceNeeded(service))}
                className={cn(
                  "px-8 py-4 rounded-full text-lg border transition-all duration-300 font-archivo",
                  isSelected
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/20 hover:border-white",
                )}
              >
                <TextRoll>{service}</TextRoll>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Target Market Pills */}
      <div className="space-y-6">
        <h3 className="text-2xl font-medium text-white font-archivo">
          Primary Market Focus
        </h3>
        <div className="flex flex-wrap gap-3 justify-start">
          {targetMarkets.map((market) => (
            <button
              type="button"
              key={market}
              onClick={() =>
                dispatch(setFormField({ field: "targetMarket", value: market }))
              }
              className={cn(
                "px-8 py-4 rounded-full text-lg border transition-all duration-300 font-archivo",
                contact.targetMarket === market
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-white/20 hover:border-white",
              )}
            >
              <TextRoll>{market === "Other" ? "Global" : market}</TextRoll>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Smooth Inputs */}
      <div className="space-y-8 max-w-4xl mr-auto">
        <div className="relative group">
          <SmoothInput
            placeholder="Your name *"
            value={contact.fullName}
            onChange={(e: any) =>
              dispatch(
                setFormField({ field: "fullName", value: e.target.value }),
              )
            }
            wrapperClassName="max-w-full bg-transparent p-0 rounded-none border-none focus-within:outline-none"
            className="text-white placeholder:text-neutral-500 font-archivo text-xl md:text-2xl py-3 px-0 text-left bg-transparent outline-none focus:outline-none ring-0 border-none relative z-10"
          />
          <div className="absolute bottom-[-10px] left-0 right-0 w-full z-20">
            <GuitarString
              height={40}
              activeColor="#ffffff"
              strokeColor="rgba(255,255,255,0.4)"
              showEndpoints={false}
            />
          </div>
          {localErrors.fullName && (
            <p className="text-base font-archivo text-red-500 text-left mt-2 relative z-30">
              {localErrors.fullName}
            </p>
          )}
        </div>

        <div className="relative group pt-4">
          <SmoothInput
            placeholder="Email *"
            type="email"
            value={contact.email}
            onChange={(e: any) =>
              dispatch(setFormField({ field: "email", value: e.target.value }))
            }
            wrapperClassName="max-w-full bg-transparent p-0 rounded-none border-none focus-within:outline-none"
            className="text-white placeholder:text-neutral-500 font-archivo text-xl md:text-2xl py-3 px-0 text-left bg-transparent outline-none focus:outline-none ring-0 border-none relative z-10"
          />
          <div className="absolute bottom-[-10px] left-0 right-0 w-full z-20">
            <GuitarString
              height={40}
              activeColor="#ffffff"
              strokeColor="rgba(255,255,255,0.4)"
              showEndpoints={false}
            />
          </div>
          {localErrors.email && (
            <p className="text-base text-red-500 font-archivo text-left mt-2 relative z-30">
              {localErrors.email}
            </p>
          )}
        </div>

        <div className="relative group pt-4">
          <SmoothInput
            placeholder="Company Name *"
            value={contact.company}
            onChange={(e: any) =>
              dispatch(
                setFormField({ field: "company", value: e.target.value }),
              )
            }
            wrapperClassName="max-w-full bg-transparent p-0 rounded-none border-none focus-within:outline-none"
            className="text-white placeholder:text-neutral-500 font-archivo text-xl md:text-2xl py-3 px-0 text-left bg-transparent outline-none focus:outline-none ring-0 border-none relative z-10"
          />
          <div className="absolute bottom-[-10px] left-0 right-0 w-full z-20">
            <GuitarString
              height={40}
              activeColor="#ffffff"
              strokeColor="rgba(255,255,255,0.4)"
              showEndpoints={false}
            />
          </div>
          {localErrors.company && (
            <p className="text-base font-archivo text-red-500 text-left mt-2 relative z-30">
              {localErrors.company}
            </p>
          )}
        </div>

        <div className="relative group pt-8">
          <Textarea
            placeholder="Tell us about your project"
            value={contact.message}
            onChange={(e: any) =>
              dispatch(
                setFormField({ field: "message", value: e.target.value }),
              )
            }
            wrapperClassName="max-w-full bg-transparent p-0 rounded-none border-none focus-within:outline-none min-h-[80px]"
            className="text-white placeholder:text-neutral-500 font-archivo text-xl md:text-2xl py-3 px-0 text-left bg-transparent outline-none focus:outline-none ring-0 border-none relative z-10 min-h-[80px]"
          />
          <div className="absolute bottom-[-20px] left-0 right-0 w-full z-20">
            <GuitarString
              height={40}
              activeColor="#ffffff"
              strokeColor="rgba(255,255,255,0.4)"
              showEndpoints={false}
            />
          </div>
        </div>
      </div>

      {/* 4. Budget Pills */}
      <div className="space-y-6 pt-4">
        <h3 className="text-2xl font-medium text-white font-archivo">
          Project budget (USD)
        </h3>
        <div className="flex flex-wrap gap-3 justify-start">
          {budgetTiers.map((tier) => (
            <button
              type="button"
              key={tier}
              onClick={() =>
                dispatch(setFormField({ field: "budgetTier", value: tier }))
              }
              className={cn(
                "px-8 py-4 rounded-full text-lg border transition-all duration-300 font-archivo",
                contact.budgetTier === tier
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-white/20 hover:border-white",
              )}
            >
              <TextRoll>{tier}</TextRoll>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Attachment & Submit */}
      <div className="space-y-10 pt-4 flex flex-col items-start">
        <button
          type="button"
          className="flex flex-row items-center gap-2 text-white hover:text-neutral-300 transition-colors font-archivo font-medium text-lg"
        >
          <Paperclip className="w-5 h-5" />
          Add attachment
        </button>

        {contact.errorMessage && (
          <p className="text-base text-red-500 font-archivo text-left">
            {contact.errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={contact.status === "submitting"}
          className="bg-white font-archivo text-black px-12 py-6 rounded-full font-semibold text-xl md:text-2xl hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:hover:scale-100 group flex items-center justify-center overflow-hidden min-w-[240px]"
        >
          {contact.status === "submitting" ? (
            "Sending..."
          ) : (
            <TextRoll>Send request</TextRoll>
          )}
        </button>
      </div>
    </form>
  );
}
