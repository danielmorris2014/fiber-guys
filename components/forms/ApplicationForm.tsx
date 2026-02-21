"use client";

import { useReducer, useCallback, useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/Spinner";
import { submitApplication } from "@/actions/submitApplication";
import type { SubmitApplicationResult } from "@/actions/submitApplication";
import { CheckCircle2 } from "lucide-react";
import { Turnstile } from "@/components/ui/Turnstile";
import { FileUpload } from "@/components/forms/FileUpload";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
interface FormState {
  values: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    position: string;
    yearsExperience: string;
    hasCDL: string;
    equipmentExperience: string;
    website: string;
  };
  touched: Record<string, boolean>;
  errors: Record<string, string>;
  submitting: boolean;
  submitError: string;
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
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    position: "",
    yearsExperience: "",
    hasCDL: "",
    equipmentExperience: "",
    website: "",
  },
  touched: {},
  errors: {},
  submitting: false,
  submitError: "",
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
      return { ...state, submitting: true, submitError: "" };
    case "SUBMIT_ERROR":
      return { ...state, submitting: false, submitError: action.error };
    case "SUBMIT_SUCCESS":
      return { ...state, submitting: false, submitted: true };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function validateField(field: string, value: string): string | null {
  switch (field) {
    case "firstName":
      return value.trim() ? null : "First name is required";
    case "lastName":
      return value.trim() ? null : "Last name is required";
    case "phone":
      return value.trim() ? null : "Phone number is required";
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
      return null;
    case "position":
      return value ? null : "Select a position";
    case "yearsExperience":
      return value.trim() ? null : "Years of experience is required";
    case "hasCDL":
      return value ? null : "CDL status is required";
    default:
      return null;
  }
}

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "phone",
  "email",
  "position",
  "yearsExperience",
  "hasCDL",
];

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const INPUT_BASE =
  "w-full bg-transparent border-b border-white/[0.12] px-0 py-3 text-sm text-white placeholder:text-white/20 transition-all duration-300 focus:outline-none focus:border-blue-600 focus:shadow-[0_1px_0_0_#2563EB]";
const INPUT_ERROR =
  "border-red-500/60 focus:border-red-500 focus:shadow-[0_1px_0_0_rgb(239,68,68)]";
const LABEL_BASE =
  "block font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2";

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------
function Field({
  label,
  name,
  type = "text",
  required,
  value,
  error,
  touched,
  onChange,
  onBlur,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (v: string) => void;
  onBlur: () => void;
  placeholder?: string;
}) {
  const showError = touched && error;
  return (
    <div>
      <label htmlFor={name} className={LABEL_BASE}>
        {label}
        {required && <span className="text-blue-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${INPUT_BASE} ${showError ? INPUT_ERROR : ""}`}
        aria-invalid={showError ? true : undefined}
        aria-describedby={showError ? `${name}-error` : undefined}
      />
      {showError && (
        <p id={`${name}-error`} className="mt-1.5 font-mono text-[10px] text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success
// ---------------------------------------------------------------------------
function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
      </div>
      <h3 className="font-heading text-2xl font-bold text-white mb-2">
        Application Received
      </h3>
      <p className="font-mono text-sm text-white/50 max-w-md mb-2">
        If your experience matches our current needs, dispatch will reach out.
      </p>
      <p className="font-mono text-xs text-white/30 mb-8">
        We review applications on a rolling basis
      </p>
      <button
        type="button"
        onClick={onReset}
        className="font-mono text-xs uppercase tracking-[0.15em] text-blue-400 hover:text-blue-300 transition-colors interactable"
      >
        [ Submit Another Application ]
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
export interface PositionOption {
  value: string;
  label: string;
}

const RESUME_ACCEPT: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

interface ApplicationFormProps {
  positions?: PositionOption[];
}

export function ApplicationForm({ positions = [] }: ApplicationFormProps) {
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const initialRoleApplied = useRef(false);

  // Pre-select position from ?role= URL param (matches against slug values)
  useEffect(() => {
    if (initialRoleApplied.current) return;
    const role = searchParams.get("role");
    if (role && positions.some((p) => p.value === role)) {
      dispatch({ type: "SET_FIELD", field: "position", value: role });
      initialRoleApplied.current = true;
    }
  }, [searchParams, positions]);

  // Listen for role-selected custom event (from "Apply Now" buttons)
  useEffect(() => {
    const handler = (e: Event) => {
      const role = (e as CustomEvent).detail;
      if (role && positions.some((p) => p.value === role)) {
        dispatch({ type: "SET_FIELD", field: "position", value: role });
      }
    };
    window.addEventListener("role-selected", handler);
    return () => window.removeEventListener("role-selected", handler);
  }, [positions]);

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
      const firstField = REQUIRED_FIELDS.find((f) => errors[f]);
      if (firstField) document.getElementById(firstField)?.focus();
      return;
    }

    dispatch({ type: "SUBMIT_START" });

    try {
      const formData = new FormData();
      Object.entries(state.values).forEach(([k, v]) => formData.append(k, v));
      if (resumeFiles.length > 0) {
        formData.append("resume", resumeFiles[0]);
      }
      if (turnstileToken) formData.append("cf-turnstile-response", turnstileToken);

      const result: SubmitApplicationResult = await submitApplication(formData);

      if (!result.success) {
        if (result.fieldErrors) {
          dispatch({ type: "SET_ERRORS", errors: result.fieldErrors });
          for (const field of Object.keys(result.fieldErrors)) {
            dispatch({ type: "TOUCH_FIELD", field });
          }
        }
        const msg = result.error || "Something went wrong. Please try again.";
        dispatch({ type: "SUBMIT_ERROR", error: msg });
        toast.error("Submission failed", { description: msg });
        return;
      }

      dispatch({ type: "SUBMIT_SUCCESS" });
      toast.success("Application submitted", {
        description: "We'll review your experience and be in touch.",
      });
    } catch {
      const msg = "Network error. Please check your connection and try again.";
      dispatch({ type: "SUBMIT_ERROR", error: msg });
      toast.error("Connection error", { description: msg });
    }
  };

  if (state.submitted) {
    return <SuccessState onReset={() => { dispatch({ type: "RESET" }); setResumeFiles([]); }} />;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-10">
      {/* Honeypot */}
      <div className="absolute -left-[9999px] -top-[9999px]" aria-hidden="true">
        <label htmlFor="app-website">Website</label>
        <input
          id="app-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={state.values.website}
          onChange={(e) => handleChange("website", e.target.value)}
        />
      </div>

      {/* ---- Section 01: Identity ---- */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[10px] text-blue-600 uppercase tracking-[0.2em]">01</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.15em]">Contact</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Field
            label="First Name" name="firstName" required
            value={state.values.firstName} error={state.errors.firstName} touched={state.touched.firstName}
            onChange={(v) => handleChange("firstName", v)} onBlur={() => handleBlur("firstName")}
            placeholder="First"
          />
          <Field
            label="Last Name" name="lastName" required
            value={state.values.lastName} error={state.errors.lastName} touched={state.touched.lastName}
            onChange={(v) => handleChange("lastName", v)} onBlur={() => handleBlur("lastName")}
            placeholder="Last"
          />
          <Field
            label="Phone Number" name="phone" type="tel" required
            value={state.values.phone} error={state.errors.phone} touched={state.touched.phone}
            onChange={(v) => handleChange("phone", v)} onBlur={() => handleBlur("phone")}
            placeholder="(___) ___-____"
          />
          <Field
            label="Email Address" name="email" type="email" required
            value={state.values.email} error={state.errors.email} touched={state.touched.email}
            onChange={(v) => handleChange("email", v)} onBlur={() => handleBlur("email")}
            placeholder="you@email.com"
          />
        </div>
      </div>

      {/* ---- Section 02: Experience ---- */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[10px] text-blue-600 uppercase tracking-[0.2em]">02</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.15em]">Experience</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Position Select */}
          <div>
            <label htmlFor="position" className={LABEL_BASE}>
              Position Applied For <span className="text-blue-500 ml-1">*</span>
            </label>
            <select
              id="position"
              name="position"
              value={state.values.position}
              onChange={(e) => handleChange("position", e.target.value)}
              onBlur={() => handleBlur("position")}
              className={`${INPUT_BASE} appearance-none cursor-pointer ${
                state.touched.position && state.errors.position ? INPUT_ERROR : ""
              } ${!state.values.position ? "text-white/20" : ""}`}
              aria-invalid={state.touched.position && state.errors.position ? true : undefined}
            >
              <option value="" className="text-black bg-white">Select position</option>
              {positions.map((pos) => (
                <option key={pos.value} value={pos.value} className="text-black bg-white">
                  {pos.label}
                </option>
              ))}
            </select>
            {state.touched.position && state.errors.position && (
              <p className="mt-1.5 font-mono text-[10px] text-red-400" role="alert">{state.errors.position}</p>
            )}
          </div>

          <Field
            label="Years of OSP Experience" name="yearsExperience" type="number" required
            value={state.values.yearsExperience} error={state.errors.yearsExperience} touched={state.touched.yearsExperience}
            onChange={(v) => handleChange("yearsExperience", v)} onBlur={() => handleBlur("yearsExperience")}
            placeholder="e.g. 5"
          />

          {/* CDL Radio */}
          <div>
            <label className={LABEL_BASE}>
              Valid CDL? <span className="text-blue-500 ml-1">*</span>
            </label>
            <div className="flex gap-6 pt-2">
              {[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 cursor-pointer group interactable"
                >
                  <div className="relative w-5 h-5 rounded-full border border-white/20 group-hover:border-white/40 transition-colors flex items-center justify-center">
                    <input
                      type="radio"
                      name="hasCDL"
                      value={opt.value}
                      checked={state.values.hasCDL === opt.value}
                      onChange={(e) => handleChange("hasCDL", e.target.value)}
                      onBlur={() => handleBlur("hasCDL")}
                      className="sr-only"
                    />
                    {state.values.hasCDL === opt.value && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span className="font-mono text-sm text-white/70 group-hover:text-white transition-colors">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
            {state.touched.hasCDL && state.errors.hasCDL && (
              <p className="mt-1.5 font-mono text-[10px] text-red-400" role="alert">{state.errors.hasCDL}</p>
            )}
          </div>

          <div>{/* spacer */}</div>
        </div>

        {/* Equipment textarea */}
        <div className="mt-6">
          <label htmlFor="equipmentExperience" className={LABEL_BASE}>
            Equipment Experience
          </label>
          <textarea
            id="equipmentExperience"
            name="equipmentExperience"
            rows={3}
            value={state.values.equipmentExperience}
            onChange={(e) => handleChange("equipmentExperience", e.target.value)}
            onBlur={() => handleBlur("equipmentExperience")}
            placeholder="What specific jetting machines or fusion splicers are you most experienced with?"
            className={`${INPUT_BASE} resize-y min-h-[80px]`}
          />
        </div>
      </div>

      {/* ---- Section 03: Resume ---- */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[10px] text-blue-600 uppercase tracking-[0.2em]">03</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.15em]">Resume</span>
        </div>

        <FileUpload
          files={resumeFiles}
          onChange={setResumeFiles}
          accept={RESUME_ACCEPT}
          helpText="Drop Resume (PDF, DOC, DOCX)"
          maxSize={10 * 1024 * 1024}
        />
        <p className="mt-2 font-mono text-[10px] text-white/20">Optional — attach your resume if you have one handy</p>
      </div>

      {/* ---- Turnstile ---- */}
      <div className="border-t border-b border-white/[0.06] py-4">
        <Turnstile
          onToken={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
        />
      </div>

      {/* ---- Error ---- */}
      {state.submitError && (
        <div className="rounded-sm bg-red-500/10 border border-red-500/20 p-4">
          <p className="font-mono text-xs text-red-400">{state.submitError}</p>
        </div>
      )}

      {/* ---- Submit ---- */}
      <button
        type="submit"
        disabled={state.submitting}
        className={`
          w-full py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-[0.15em]
          transition-all duration-300 interactable
          ${
            state.submitting
              ? "bg-emerald-600/40 text-emerald-300/50 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
          }
        `}
      >
        {state.submitting ? (
          <span className="flex items-center justify-center gap-3">
            <Spinner size="sm" />
            Processing...
          </span>
        ) : (
          "[ SUBMIT APPLICATION ]"
        )}
      </button>
    </form>
  );
}
