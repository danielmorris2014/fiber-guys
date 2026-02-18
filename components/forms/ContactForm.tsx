"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent", { description: "We'll get back to you shortly." });
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-line bg-bg-2 p-8 text-center">
        <p className="text-lg font-heading font-bold text-text">Message sent.</p>
        <p className="text-sm text-muted mt-2">We&apos;ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-text mb-1.5">
          Name <span className="text-orange">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-line bg-bg px-4 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-text mb-1.5">
          Email <span className="text-orange">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-line bg-bg px-4 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-text mb-1.5">
          Message <span className="text-orange">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-line bg-bg px-4 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent resize-y"
          placeholder="How can we help?"
        />
      </div>
      <button
        type="submit"
        disabled={!name || !email || !message}
        className={cn(
          "px-6 py-3 rounded-lg bg-orange text-bg font-semibold text-sm transition-all",
          !name || !email || !message
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-orange-hard"
        )}
      >
        Send Message
      </button>
    </form>
  );
}
