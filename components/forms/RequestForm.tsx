"use client";

import { useReducer, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileUpload } from "./FileUpload";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

// State
interface FormState {
  values: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    cityState: string;
    serviceNeeded: string;
    targetStartDate: string;
    estimatedFootage: string;
    notes: string;
    website: string; // honeypot
  };
  files: File[];
  touched: Record<string, boolean>;
  errors: Record<string, string>;
  submitting: boolean;
  submitError: string;
}

type Action =
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "SET_FILES"; files: File[] }
  | { type: "TOUCH_FIELD"; field: string }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "CLEAR_ERROR"; field: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_ERROR"; error: string }
  | { type: "SUBMIT_SUCCESS" };

const initialState: FormState = {
  values: {
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    cityState: "",
    serviceNeeded: "",
    targetStartDate: "",
    estimatedFootage: "",
    notes: "",
    website: "",
  },
  files: [],
  touched: {},
  errors: {},
  submitting: false,
  submitError: "",
};

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
      };
    case "SET_FILES":
      return { ...state, files: action.files };
    case "TOUCH_FIELD":
      return {
        ...state,
        touched: { ...state.touched, [action.field]: true },
      };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
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
      return { ...state, submitting: false };
    default:
      return state;
  }
}

// Validation
function validateField(field: string, value: string): string | null {
  switch (field) {
    case "companyName":
      return value.trim() ? null : "Company name is required";
    case "contactName":
      return value.trim() ? null : "Contact name is required";
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
      return null;
    case "phone":
      return value.trim() ? null : "Phone number is required";
    case "cityState":
      return value.trim() ? null : "City / State is required";
    case "serviceNeeded":
      return value ? null : "Please select a service";
    default:
      return null;
  }
}

// Input component
function FormInput({
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
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
}) {
  const showError = touched && error;
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-text mb-1.5">
        {label}
        {required && <span className="text-orange ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border bg-bg px-4 py-2.5 text-sm text-text placeholder:text-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent",
          showError ? "border-orange-hard" : "border-line"
        )}
        aria-invalid={showError ? true : undefined}
        aria-describedby={showError ? `${name}-error` : undefined}
      />
      {showError && (
        <p id={`${name}-error`} className="mt-1 text-xs text-orange-hard" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function RequestForm() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = useCallback(
    (field: string, value: string) => {
      dispatch({ type: "SET_FIELD", field, value });
      const error = validateField(field, value);
      if (!error) dispatch({ type: "CLEAR_ERROR", field });
    },
    []
  );

  const handleBlur = useCallback((field: string) => {
    dispatch({ type: "TOUCH_FIELD", field });
    const value = (document.getElementById(field) as HTMLInputElement)?.value || "";
    const error = validateField(field, value);
    if (error) {
      dispatch({ type: "SET_ERRORS", errors: { ...state.errors, [field]: error } });
    }
  }, [state.errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = ["companyName", "contactName", "email", "phone", "cityState", "serviceNeeded"];
    const errors: Record<string, string> = {};

    for (const field of requiredFields) {
      const error = validateField(field, state.values[field as keyof typeof state.values]);
      if (error) errors[field] = error;
      dispatch({ type: "TOUCH_FIELD", field });
    }

    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      // Scroll to first error
      const firstErrorField = requiredFields.find((f) => errors[f]);
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
      return;
    }

    dispatch({ type: "SUBMIT_START" });

    try {
      const formData = new FormData();

      for (const [key, value] of Object.entries(state.values)) {
        formData.append(key, value);
      }

      for (const file of state.files) {
        formData.append("files", file);
      }

      const res = await fetch("/api/lead", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || "Something went wrong. Please try again.";
        dispatch({ type: "SUBMIT_ERROR", error: errorMsg });
        toast.error("Submission failed", { description: errorMsg });
        return;
      }

      dispatch({ type: "SUBMIT_SUCCESS" });
      toast.success("Request submitted", { description: "We'll be in touch shortly." });
      router.push("/thank-you");
    } catch {
      const errorMsg = "Network error. Please check your connection and try again.";
      dispatch({ type: "SUBMIT_ERROR", error: errorMsg });
      toast.error("Connection error", { description: errorMsg });
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Honeypot */}
      <div className="absolute -left-[9999px] -top-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={state.values.website}
          onChange={(e) => handleChange("website", e.target.value)}
        />
      </div>

      {/* Contact Information */}
      <div className="rounded-2xl border border-line bg-bg-2 p-6 md:p-8">
        <h2 className="font-heading text-lg font-bold tracking-tight mb-6">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Company Name"
            name="companyName"
            required
            value={state.values.companyName}
            error={state.errors.companyName}
            touched={state.touched.companyName}
            onChange={(v) => handleChange("companyName", v)}
            onBlur={() => handleBlur("companyName")}
            placeholder="Acme Telecom"
          />
          <FormInput
            label="Contact Name"
            name="contactName"
            required
            value={state.values.contactName}
            error={state.errors.contactName}
            touched={state.touched.contactName}
            onChange={(v) => handleChange("contactName", v)}
            onBlur={() => handleBlur("contactName")}
            placeholder="John Smith"
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            required
            value={state.values.email}
            error={state.errors.email}
            touched={state.touched.email}
            onChange={(v) => handleChange("email", v)}
            onBlur={() => handleBlur("email")}
            placeholder="john@company.com"
          />
          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            required
            value={state.values.phone}
            error={state.errors.phone}
            touched={state.touched.phone}
            onChange={(v) => handleChange("phone", v)}
            onBlur={() => handleBlur("phone")}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* Job Details */}
      <div className="rounded-2xl border border-line bg-bg-2 p-6 md:p-8">
        <h2 className="font-heading text-lg font-bold tracking-tight mb-6">
          Job Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="City / State"
            name="cityState"
            required
            value={state.values.cityState}
            error={state.errors.cityState}
            touched={state.touched.cityState}
            onChange={(v) => handleChange("cityState", v)}
            onBlur={() => handleBlur("cityState")}
            placeholder="Austin, TX"
          />
          <div>
            <label htmlFor="serviceNeeded" className="block text-sm font-medium text-text mb-1.5">
              Service Needed <span className="text-orange ml-1">*</span>
            </label>
            <select
              id="serviceNeeded"
              name="serviceNeeded"
              value={state.values.serviceNeeded}
              onChange={(e) => handleChange("serviceNeeded", e.target.value)}
              onBlur={() => handleBlur("serviceNeeded")}
              className={cn(
                "w-full rounded-lg border bg-bg px-4 py-2.5 text-sm text-text transition-colors focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent",
                state.touched.serviceNeeded && state.errors.serviceNeeded
                  ? "border-orange-hard"
                  : "border-line"
              )}
              aria-invalid={
                state.touched.serviceNeeded && state.errors.serviceNeeded ? true : undefined
              }
            >
              <option value="">Select a service</option>
              <option value="jetting">Fiber Jetting</option>
              <option value="splicing">Fiber Splicing</option>
              <option value="both">Both</option>
            </select>
            {state.touched.serviceNeeded && state.errors.serviceNeeded && (
              <p className="mt-1 text-xs text-orange-hard" role="alert">
                {state.errors.serviceNeeded}
              </p>
            )}
          </div>
          <FormInput
            label="Target Start Date"
            name="targetStartDate"
            type="date"
            value={state.values.targetStartDate}
            onChange={(v) => handleChange("targetStartDate", v)}
            onBlur={() => handleBlur("targetStartDate")}
          />
          <FormInput
            label="Estimated Footage"
            name="estimatedFootage"
            value={state.values.estimatedFootage}
            onChange={(v) => handleChange("estimatedFootage", v)}
            onBlur={() => handleBlur("estimatedFootage")}
            placeholder="e.g. 12,000 ft"
          />
        </div>
        <div className="mt-5">
          <label htmlFor="notes" className="block text-sm font-medium text-text mb-1.5">
            Notes / Constraints
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={state.values.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            onBlur={() => handleBlur("notes")}
            placeholder="Any additional details about the project scope, access requirements, or timing constraints..."
            className="w-full rounded-lg border border-line bg-bg px-4 py-2.5 text-sm text-text placeholder:text-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent resize-y"
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="rounded-2xl border border-line bg-bg-2 p-6 md:p-8">
        <h2 className="font-heading text-lg font-bold tracking-tight mb-6">
          Prints & Scope Documents
        </h2>
        <FileUpload
          files={state.files}
          onChange={(files) => dispatch({ type: "SET_FILES", files })}
        />
      </div>

      {/* Submit */}
      {state.submitError && (
        <div className="rounded-lg bg-orange-soft border border-orange/20 p-4">
          <p className="text-sm text-orange">{state.submitError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={state.submitting}
        className={cn(
          "w-full md:w-auto px-8 py-3 rounded-lg bg-orange text-bg font-semibold text-sm transition-all",
          state.submitting
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-orange-hard"
        )}
      >
        {state.submitting ? (
          <span className="flex items-center justify-center gap-3">
            <Spinner size="sm" />
            Submitting...
          </span>
        ) : (
          "Submit Request"
        )}
      </button>
    </form>
  );
}
