"use client";

import { useState } from "react";
import { subscribeJobAlerts } from "@/actions/subscribeJobAlerts";
import { Check } from "lucide-react";

export function JobAlertForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("email", email);

    const result = await subscribeJobAlerts(formData);

    setSubmitting(false);

    if (!result.success) {
      setError(result.error || "Something went wrong.");
      return;
    }

    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="font-mono text-sm text-emerald-400">
          Subscribed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <label htmlFor="alert-email" className="sr-only">
          Email address
        </label>
        <input
          id="alert-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full bg-transparent border border-white/[0.12] px-4 py-3 text-sm text-white placeholder:text-white/20 font-mono transition-all duration-300 focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_1px_#2563EB] rounded-sm"
        />
        {error && (
          <p className="mt-1.5 font-mono text-[10px] text-red-400">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className={`
          px-6 py-3 rounded-sm font-mono text-xs font-bold uppercase tracking-[0.15em]
          transition-all duration-300 interactable flex-shrink-0
          ${
            submitting
              ? "bg-emerald-800/40 text-emerald-400/40 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          }
        `}
      >
        {submitting ? "..." : "[ GET JOB ALERTS ]"}
      </button>
    </form>
  );
}
