"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

interface FileUploadProps {
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  onRemoveFile?: (file: File) => void;
  currentFiles?: File[];
  label?: string;
  subLabel?: string;
}

export default function FileUpload({
  multiple = false,
  onFilesSelected,
  onRemoveFile,
  currentFiles = [],
  label = "Upload Images",
  subLabel = "Drag and drop or click to browse",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync previews with currentFiles
  useEffect(() => {
    const newPreviews = currentFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews(newPreviews);

    // Cleanup URLs on unmount or update
    return () => {
      newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [currentFiles]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
    // Reset value so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const processFiles = (files: File[]) => {
    const allowedFiles = multiple ? files : [files[0]];
    onFilesSelected(allowedFiles);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-xs uppercase tracking-widest block mb-2">
          {label}
        </label>
      </div>

      <div
        className={`relative group cursor-pointer transition-all duration-300 ease-out
          border border-dashed p-8 text-center min-h-[160px] flex flex-col items-center justify-center
          ${isDragging
            ? "border-black bg-gray-50"
            : "border-border hover:border-muted"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple={multiple}
          className="hidden"
          accept="image/*"
        />

        <div className="bg-gray-100 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-600"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
        </div>

        <p className="text-sm font-medium tracking-wide">{subLabel}</p>
        <p className="text-xs text-muted mt-2">Supports JPG, PNG, WEBP</p>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in mt-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative aspect-square border border-border group overflow-hidden bg-gray-50"
            >
              <Image
                src={preview.url}
                alt={`Preview ${index}`}
                fill
                className="object-cover"
              />
              {onRemoveFile && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(preview.file);
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
