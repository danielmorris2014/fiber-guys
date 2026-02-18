"use client";

import { useState, useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_EXTENSIONS: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
};
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({ files, onChange }: FileUploadProps) {
  const [warnings, setWarnings] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const msgs = rejectedFiles.map(
          (r) => `${r.file.name}: ${r.errors.map((e) => e.message).join(", ")}`
        );
        setWarnings(msgs);
        setTimeout(() => setWarnings([]), 5000);
      }
      if (acceptedFiles.length > 0) {
        onChange([...files, ...acceptedFiles]);
      }
    },
    [files, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_EXTENSIONS,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-orange bg-orange-soft"
            : "border-line hover:border-muted"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-muted mx-auto mb-3" />
        <p className="text-sm text-muted">
          <span className="text-orange font-medium">Click to upload</span>{" "}
          or drag and drop
        </p>
        <p className="text-xs text-muted mt-1">
          PDF, DWG, JPG, PNG, DOC, XLSX — Max 25MB each
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between gap-3 rounded-lg bg-bg p-3 border border-line"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-muted shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-text truncate">{file.name}</p>
                  <p className="text-xs text-muted">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="p-1 text-muted hover:text-orange transition-colors shrink-0"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="rounded-lg bg-orange-soft border border-orange/20 p-3">
          {warnings.map((msg, i) => (
            <p key={i} className="text-xs text-orange">
              {msg}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
