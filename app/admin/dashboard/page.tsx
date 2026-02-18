"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

type Tab = "map" | "content" | "faq";

interface MapData {
  activeStates: string[];
  pastStates: string[];
}

interface SiteContent {
  coverage: { description: string };
  hero: { subtitle: string };
  cta: { heading1: string; heading2: string; description: string };
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("map");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const [mapData, setMapData] = useState<MapData>({
    activeStates: [],
    pastStates: [],
  });
  const [newActiveState, setNewActiveState] = useState("");
  const [newPastState, setNewPastState] = useState("");

  const [siteContent, setSiteContent] = useState<SiteContent>({
    coverage: { description: "" },
    hero: { subtitle: "" },
    cta: { heading1: "", heading2: "", description: "" },
  });

  const [faq, setFaq] = useState<FAQItem[]>([]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [mapRes, siteRes, faqRes] = await Promise.all([
        fetch("/api/content/map"),
        fetch("/api/content/site"),
        fetch("/api/content/faq"),
      ]);
      if (mapRes.ok) setMapData(await mapRes.json());
      if (siteRes.ok) setSiteContent(await siteRes.json());
      if (faqRes.ok) setFaq(await faqRes.json());
    } catch (err) {
      console.error("Failed to load content:", err);
    } finally {
      setLoading(false);
    }
  };

  const save = async (key: string, data: unknown) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Saved successfully" });
      } else {
        const err = await res.json();
        setMessage({ type: "error", text: err.error || "Failed to save" });
      }
    } catch {
      setMessage({ type: "error", text: "Connection error" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const addState = (type: "active" | "past") => {
    const state = type === "active" ? newActiveState : newPastState;
    if (!state) return;

    setMapData((prev) => {
      const key = type === "active" ? "activeStates" : "pastStates";
      const otherKey = type === "active" ? "pastStates" : "activeStates";
      if (prev[key].includes(state)) return prev;
      return {
        ...prev,
        [key]: [...prev[key], state].sort(),
        [otherKey]: prev[otherKey].filter((s) => s !== state),
      };
    });

    if (type === "active") setNewActiveState("");
    else setNewPastState("");
  };

  const removeState = (type: "active" | "past", state: string) => {
    setMapData((prev) => ({
      ...prev,
      [type === "active" ? "activeStates" : "pastStates"]: prev[
        type === "active" ? "activeStates" : "pastStates"
      ].filter((s) => s !== state),
    }));
  };

  const addFaqItem = () => {
    setFaq((prev) => [
      ...prev,
      { id: `faq${Date.now()}`, question: "", answer: "" },
    ]);
  };

  const updateFaqItem = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    setFaq((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeFaqItem = (index: number) => {
    setFaq((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const availableForActive = US_STATES.filter(
    (s) => !mapData.activeStates.includes(s) && !mapData.pastStates.includes(s)
  );
  const availableForPast = US_STATES.filter(
    (s) => !mapData.pastStates.includes(s) && !mapData.activeStates.includes(s)
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold">Fiber Guys Admin</h1>
          <p className="text-sm text-gray-500">Manage site content</p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            View Site &nearr;
          </a>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Status message */}
      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded text-sm ${
            message.type === "success"
              ? "bg-green-900/50 text-green-300 border border-green-800"
              : "bg-red-900/50 text-red-300 border border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-white/10">
        {(["map", "content", "faq"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-blue-600 text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {t === "map"
              ? "Coverage Map"
              : t === "content"
                ? "Site Content"
                : "FAQ"}
          </button>
        ))}
      </div>

      {/* ─── Map Tab ─── */}
      {tab === "map" && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-1">
              Coverage Map States
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Manage which states appear as active or past work on the coverage
              map.
            </p>

            {/* Active States */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-3">
                Currently Active
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {mapData.activeStates.length === 0 && (
                  <p className="text-sm text-gray-600">No active states</p>
                )}
                {mapData.activeStates.map((state) => (
                  <span
                    key={state}
                    className="inline-flex items-center gap-1.5 bg-blue-600/20 border border-blue-600/30 text-blue-300 px-3 py-1 rounded text-sm"
                  >
                    {state}
                    <button
                      onClick={() => removeState("active", state)}
                      className="hover:text-red-400 transition-colors ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={newActiveState}
                  onChange={(e) => setNewActiveState(e.target.value)}
                  className="bg-[#111] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-600"
                >
                  <option value="">Select state...</option>
                  {availableForActive.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => addState("active")}
                  disabled={!newActiveState}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white text-sm px-4 py-2 rounded transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Past States */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-blue-300/60 uppercase tracking-wider mb-3">
                Previous Work
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {mapData.pastStates.length === 0 && (
                  <p className="text-sm text-gray-600">No past states</p>
                )}
                {mapData.pastStates.map((state) => (
                  <span
                    key={state}
                    className="inline-flex items-center gap-1.5 bg-blue-400/10 border border-blue-400/20 text-blue-200/60 px-3 py-1 rounded text-sm"
                  >
                    {state}
                    <button
                      onClick={() => removeState("past", state)}
                      className="hover:text-red-400 transition-colors ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={newPastState}
                  onChange={(e) => setNewPastState(e.target.value)}
                  className="bg-[#111] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-600"
                >
                  <option value="">Select state...</option>
                  {availableForPast.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => addState("past")}
                  disabled={!newPastState}
                  className="bg-blue-600/50 hover:bg-blue-600 disabled:opacity-30 text-white text-sm px-4 py-2 rounded transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => save("map", mapData)}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded transition-colors"
          >
            {saving ? "Saving..." : "Save Map"}
          </button>
        </div>
      )}

      {/* ─── Content Tab ─── */}
      {tab === "content" && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-1">Site Content</h2>
            <p className="text-sm text-gray-500 mb-6">
              Edit key text sections across the site.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Coverage Description
                </label>
                <textarea
                  value={siteContent.coverage.description}
                  onChange={(e) =>
                    setSiteContent((prev) => ({
                      ...prev,
                      coverage: { description: e.target.value },
                    }))
                  }
                  rows={3}
                  className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-600 resize-vertical"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Shown on the homepage and contact page coverage sections.
                </p>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Hero Subtitle
                </label>
                <textarea
                  value={siteContent.hero.subtitle}
                  onChange={(e) =>
                    setSiteContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, subtitle: e.target.value },
                    }))
                  }
                  rows={2}
                  className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-600 resize-vertical"
                />
              </div>

              <div className="border-t border-white/5 pt-6">
                <h3 className="text-sm font-medium text-gray-300 mb-4">
                  CTA Section
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Heading Line 1
                    </label>
                    <input
                      type="text"
                      value={siteContent.cta.heading1}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          cta: { ...prev.cta, heading1: e.target.value },
                        }))
                      }
                      className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Heading Line 2
                    </label>
                    <input
                      type="text"
                      value={siteContent.cta.heading2}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          cta: { ...prev.cta, heading2: e.target.value },
                        }))
                      }
                      className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                      CTA Description
                    </label>
                    <textarea
                      value={siteContent.cta.description}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          cta: { ...prev.cta, description: e.target.value },
                        }))
                      }
                      rows={3}
                      className="w-full bg-[#111] border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-600 resize-vertical"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => save("site", siteContent)}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded transition-colors"
          >
            {saving ? "Saving..." : "Save Content"}
          </button>
        </div>
      )}

      {/* ─── FAQ Tab ─── */}
      {tab === "faq" && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-1">FAQ</h2>
            <p className="text-sm text-gray-500 mb-6">
              Manage frequently asked questions shown on the homepage.
            </p>

            <div className="space-y-4">
              {faq.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-white/10 rounded p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) =>
                            updateFaqItem(index, "question", e.target.value)
                          }
                          className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">
                          Answer
                        </label>
                        <textarea
                          value={item.answer}
                          onChange={(e) =>
                            updateFaqItem(index, "answer", e.target.value)
                          }
                          rows={3}
                          className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-600 resize-vertical"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeFaqItem(index)}
                      className="text-gray-600 hover:text-red-400 transition-colors text-lg mt-5 px-2"
                      title="Remove question"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addFaqItem}
              className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Add Question
            </button>
          </div>

          <button
            onClick={() => save("faq", faq)}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded transition-colors"
          >
            {saving ? "Saving..." : "Save FAQ"}
          </button>
        </div>
      )}

      {/* Footer note */}
      <div className="mt-16 pt-8 border-t border-white/5">
        <p className="text-xs text-gray-600">
          Changes saved here update the site content.
          {process.env.NODE_ENV !== "production"
            ? " In development, changes write to local JSON files."
            : " For persistent storage in production, configure Upstash Redis."}
        </p>
      </div>
    </div>
  );
}
