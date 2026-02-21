"use client";

import { useReducer, useCallback } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/Spinner";
import { submitReferral } from "@/actions/submitReferral";
import { CheckCircle2 } from "lucide-react";
import type { PositionOption } from "@/components/forms/ApplicationForm";

interface FormState {
  values: {
    referrerName: string;
    referrerEmail: string;
    referrerPhone: string;
    candidateName: string;
    candidateEmail: string;
    candidatePhone: string;
    position: string;
    notes: string;
    website: string;
  };
  touched: Record<string, boolean>;
  errors: Record<string, string>;
  submitting: boolean;
  submitted: boolean;
}

type Action =
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "TOUCH_FIELD"; field: string }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "CLEAR_ERROR"; field: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_ERROR"; error: string }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "RESET" };

const initialState: FormState = {
  values: {
    referrerName: "",
    referrerEmail: "",
    referrerPhone: "",
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    position: "",
    notes: "",
    website: "",
  },
  touched: {},
  errors: {},
  submitting: false,
  submitted: false,
};

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, values: { ...state.values, [action.field]: action.value } };
    case "TOUCH_FIELD":
      return { ...state, touched: { ...state.touched, [action.field]: true } };
    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, ...action.errors } };
    case "CLEAR_ERROR": {
      const errors = { ...state.errors };
      delete errors[action.field];
      return { ...state, errors };
    }
    case "SUBMIT_START":
      return { ...state, submitting: true };
    case "SUBMIT_ERROR":
      return { ...state, submitting: false };
    case "SUBMIT_SUCCESS":
      return { ...state, submitting: false, submitted: true };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const REQUIRED_FIELDS = ["referrerName", "referrerEmail", "candidateName", "candidateEmail"];

function validateField(field: string, value: string): string | null {
  switch (field) {
    case "referrerName":
      return value.trim() ? null : "Your name is required";
    case "referrerEmail":
      if (!value.trim()) return "Your email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
      return null;
    case "candidateName":
      return value.trim() ? null : "Candidate name is required";
    case "candidateEmail":
      if (!value.trim()) return "Candidate email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
      return null;
    default:
      return null;
  }
}

const INPUT_BASE =
  "w-full bg-transparent border-b border-white/[0.12] px-0 py-3 text-sm text-white placeholder:text-white/20 transition-all duration-300 focus:outline-none focus:border-amber-500 focus:shadow-[0_1px_0_0_#F59E0B]";
const INPUT_ERROR =
  "border-red-500/60 focus:border-red-500 focus:shadow-[0_1px_0_0_rgb(239,68,68)]";
const LABEL_BASE =
  "block font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2";

interface ReferralFormProps {
  positions: PositionOption[];
}

export function ReferralForm({ positions }: ReferralFormProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = useCallback((field: string, value: string) => {
    dispatch({ type: "SET_FIELD", field, value });
    const error = validateField(field, value);
    if (!error) dispatch({ type: "CLEAR_ERROR", field });
  }, []);

  const handleBlur = useCallback(
    (field: string) => {
      dispatch({ type: "TOUCH_FIELD", field });
      const value = state.values[field as keyof typeof state.values] || "";
      const error = validateField(field, value);
      if (error) dispatch({ type: "SET_ERRORS", errors: { [field]: error } });
    },
    [state.values]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    for (const field of REQUIRED_FIELDS) {
      const error = validateField(field, state.values[field as keyof typeof state.values]);
      if (error) errors[field] = error;
      dispatch({ type: "TOUCH_FIELD", field });
    }

    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }

    dispatch({ type: "SUBMIT_START" });

    try {
      const formData = new FormData();
      Object.entries(state.values).forEach(([k, v]) => formData.append(k, v));

      const result = await submitReferral(formData);

      if (!result.success) {
        dispatch({ type: "SUBMIT_ERROR", error: result.error || "" });
        toast.error("Submission failed", { description: result.error });
        return;
      }

      dispatch({ type: "SUBMIT_SUCCESS" });
      toast.success("Referral submitted", {
        description: "We'll reach out to your candidate.",
      });
    } catch {
      dispatch({ type: "SUBMIT_ERROR", error: "" });
      toast.error("Connection error", {
        description: "Please check your connection and try again.",
      });
    }
  };

  if (state.submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-7 h-7 text-amber-400" />
        </div>
        <h3 className="font-heading text-xl font-bold text-white mb-2">Referral Submitted</h3>
        <p className="font-mono text-xs text-white/40 mb-6">
          We&apos;ll reach out to your candidate and keep you posted.
        </p>
        <button
          type="button"
          onClick={() => dispatch({ type: "RESET" })}
          className="font-mono text-xs uppercase tracking-[0.15em] text-amber-400 hover:text-amber-300 transition-colors interactable"
        >
          [ Submit Another ]
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Honeypot */}
      <div className="absolute -left-[9999px] -top-[9999px]" aria-hidden="true">
        <label htmlFor="ref-website">Website</label>
        <input
          id="ref-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={state.values.website}
          onChange={(e) => handleChange("website", e.target.value)}
        />
      </div>

      {/* Your Info */}
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-amber-500/60">
        Your Info
      </p>
      {renderField("referrerName", "Your Name", true)}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField("referrerEmail", "Your Email", true, "email")}
        {renderField("referrerPhone", "Your Phone", false, "tel")}
      </div>

      <div className="h-px bg-white/[0.06] my-2" />

      {/* Candidate Info */}
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-amber-500/60">
        Candidate Info
      </p>
      {renderField("candidateName", "Candidate Name", true)}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField("candidateEmail", "Candidate Email", true, "email")}
        {renderField("candidatePhone", "Candidate Phone", false, "tel")}
      </div>

      {/* Position */}
      <div>
        <label htmlFor="ref-position" className={LABEL_BASE}>
          Recommended Position
        </label>
        <select
          id="ref-position"
          name="position"
          value={state.values.position}
          onChange={(e) => handleChange("position", e.target.value)}
          className={`${INPUT_BASE} appearance-none cursor-pointer ${
            !state.values.position ? "text-white/20" : ""
          }`}
        >
          <option value="" className="text-black bg-white">Any position</option>
          {positions.map((pos) => (
            <option key={pos.value} value={pos.value} className="text-black bg-white">
              {pos.label}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="ref-notes" className={LABEL_BASE}>
          Notes
        </label>
        <textarea
          id="ref-notes"
          name="notes"
          rows={2}
          value={state.values.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="How do you know this person? Any relevant experience?"
          className={`${INPUT_BASE} resize-y min-h-[60px]`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={state.submitting}
        className={`
          w-full py-3.5 rounded-sm font-mono text-xs font-bold uppercase tracking-[0.15em]
          transition-all duration-300 interactable
          ${
            state.submitting
              ? "bg-amber-600/40 text-amber-300/50 cursor-not-allowed"
              : "bg-amber-600 text-white hover:bg-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
          }
        `}
      >
        {state.submitting ? (
          <span className="flex items-center justify-center gap-3">
            <Spinner size="sm" />
            Submitting...
          </span>
        ) : (
          "[ SUBMIT REFERRAL ]"
        )}
      </button>
    </form>
  );

  function renderField(
    name: string,
    label: string,
    required: boolean,
    type: string = "text"
  ) {
    const value = state.values[name as keyof typeof state.values];
    const error = state.errors[name];
    const touched = state.touched[name];
    const showError = touched && error;

    return (
      <div>
        <label htmlFor={`ref-${name}`} className={LABEL_BASE}>
          {label}
          {required && <span className="text-amber-500 ml-1">*</span>}
        </label>
        <input
          id={`ref-${name}`}
          name={name}
          type={type}
          value={value}
          onChange={(e) => handleChange(name, e.target.value)}
          onBlur={() => handleBlur(name)}
          className={`${INPUT_BASE} ${showError ? INPUT_ERROR : ""}`}
          aria-invalid={showError ? true : undefined}
        />
        {showError && (
          <p className="mt-1.5 font-mono text-[10px] text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
}
