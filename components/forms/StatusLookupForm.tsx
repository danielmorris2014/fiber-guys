"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/Spinner";
import { checkApplicationStatus } from "@/actions/checkApplicationStatus";
import { Search, Clock, CheckCircle2, XCircle, Users, MessageSquare, Briefcase } from "lucide-react";

interface ApplicationStatus {
  trackingNumber: string;
  position: string;
  status: string;
  createdAt: string;
  statusUpdatedAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  submitted: { label: "Submitted", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Clock },
  under_review: { label: "Under Review", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: Search },
  interview: { label: "Interview", color: "text-purple-400 bg-purple-500/10 border-purple-500/20", icon: MessageSquare },
  offered: { label: "Offered", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: Briefcase },
  hired: { label: "Hired", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  not_selected: { label: "Not Selected", color: "text-white/40 bg-white/5 border-white/10", icon: XCircle },
};

export function StatusLookupForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ApplicationStatus[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      const result = await checkApplicationStatus(formData);

      if (!result.success) {
        toast.error("Lookup failed", { description: result.error });
        setResults([]);
        return;
      }

      setResults(result.applications || []);
    } catch {
      toast.error("Connection error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="status-email" className="sr-only">
            Email address
          </label>
          <input
            id="status-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter the email you applied with"
            className="w-full bg-transparent border border-white/[0.12] rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/20 transition-all duration-300 focus:outline-none focus:border-blue-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className={`
            px-6 py-3 rounded-sm font-mono text-xs font-bold uppercase tracking-[0.15em]
            transition-all duration-300 interactable flex items-center gap-2
            ${
              loading
                ? "bg-blue-600/40 text-blue-300/50 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }
          `}
        >
          {loading ? <Spinner size="sm" /> : <Search className="w-4 h-4" />}
          Look Up
        </button>
      </form>

      {/* Results */}
      {searched && results !== null && (
        <div className="mt-8">
          {results.length === 0 ? (
            <div className="border border-white/[0.06] rounded-sm bg-white/[0.01] p-8 text-center">
              <Users className="w-8 h-8 text-white/15 mx-auto mb-4" />
              <p className="font-mono text-sm text-white/40 mb-1">No applications found</p>
              <p className="font-mono text-[10px] text-white/20">
                Make sure you entered the same email used during application
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
                {results.length} Application{results.length !== 1 ? "s" : ""} Found
              </p>
              {results.map((app) => {
                const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;
                const StatusIcon = config.icon;
                return (
                  <div
                    key={app.trackingNumber}
                    className="border border-white/[0.06] rounded-sm bg-white/[0.01] p-5"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="font-heading text-base font-bold text-white">
                          {app.position}
                        </p>
                        <p className="font-mono text-[10px] text-white/25 mt-0.5">
                          {app.trackingNumber}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-sm border ${config.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 font-mono text-[10px] text-white/25">
                      <span>
                        Applied{" "}
                        {new Date(app.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {app.statusUpdatedAt && app.statusUpdatedAt !== app.createdAt && (
                        <span>
                          Updated{" "}
                          {new Date(app.statusUpdatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
