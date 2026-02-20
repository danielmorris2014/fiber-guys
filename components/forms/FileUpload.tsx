"use client";

import { useState, useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Upload, X, FileText } from "lucide-react";

const DEFAULT_ACCEPTED: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/vnd.google-earth.kmz": [".kmz"],
  "application/vnd.google-earth.kml+xml": [".kml"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/acad": [".dwg"],
  "application/dxf": [".dxf"],
};
const DEFAULT_MAX_SIZE = 25 * 1024 * 1024; // 25MB

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  accept?: Record<string, string[]>;
  helpText?: string;
  maxSize?: number;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExt(name: string): string {
  const ext = name.split(".").pop()?.toUpperCase() || "FILE";
  return ext;
}

export function FileUpload({
  files,
  onChange,
  accept,
  helpText,
  maxSize,
}: FileUploadProps) {
  const acceptedTypes = accept ?? DEFAULT_ACCEPTED;
  const fileSizeLimit = maxSize ?? DEFAULT_MAX_SIZE;
  const [warnings, setWarnings] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const msgs = rejectedFiles.map(
          (r) =>
            `${r.file.name}: ${r.errors.map((e) => e.message).join(", ")}`
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
    accept: acceptedTypes,
    maxSize: fileSizeLimit,
    multiple: true,
  });

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-sm p-10 text-center cursor-pointer
          transition-all duration-300
          ${
            isDragActive
              ? "border-blue-600 bg-blue-600/5"
              : "border-white/[0.1] hover:border-white/20 bg-white/[0.01]"
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload
          className={`w-6 h-6 mx-auto mb-4 ${
            isDragActive ? "text-blue-600" : "text-white/20"
          }`}
        />
        <p className="font-mono text-xs text-white/50">
          {isDragActive ? (
            <span className="text-blue-400">Drop files here</span>
          ) : helpText ? (
            <>
              {helpText} or{" "}
              <span className="text-blue-600 hover:text-blue-400">
                Click to Browse
              </span>
            </>
          ) : (
            <>
              Drag &amp; Drop Prints{" "}
              <span className="text-white/20">(PDF, KMZ, CAD)</span> or{" "}
              <span className="text-blue-600 hover:text-blue-400">
                Click to Browse
              </span>
            </>
          )}
        </p>
        <p className="font-mono text-[10px] text-white/15 mt-2 uppercase tracking-widest">
          Max {fileSizeLimit >= 1024 * 1024 ? `${Math.round(fileSizeLimit / (1024 * 1024))}MB` : `${Math.round(fileSizeLimit / 1024)}KB`} per file
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-sm bg-white/[0.02] border border-white/[0.06] group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-[9px] font-bold text-blue-400 uppercase w-8 flex-shrink-0">
                  .{getFileExt(file.name).toLowerCase()}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-xs text-white/60 truncate">
                    {file.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-mono text-[10px] text-white/20">
                  {formatFileSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="p-1 text-white/20 hover:text-red-400 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="rounded-sm bg-red-500/10 border border-red-500/20 p-3">
          {warnings.map((msg, i) => (
            <p key={i} className="font-mono text-[10px] text-red-400">
              {msg}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
