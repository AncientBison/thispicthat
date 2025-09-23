"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { UploadIcon } from "@/components/icons";

export default function ImageUpload({
  onUpload,
}: {
  onUpload?: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      onUpload?.(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={clsx(
        "min-h-32 max-h-64 max-w-full w-fit mx-auto flex items-center justify-center border-4 border-dashed rounded-lg cursor-pointer transition-colors relative overflow-hidden",
        isDragging
          ? "border-blue-500 bg-blue-700/15"
          : "border-gray-300 bg-white/5 hover:bg-white/10",
        !preview && "w-full"
      )}
    >
      {preview ? (
        <>
          <img
            src={preview}
            alt="Uploaded preview"
            className="object-contain max-h-64 max-w-full"
          />
          <div className="absolute text-center inset-0 bg-black/40 opacity-0 hover:opacity-100 flex flex-col items-center justify-center text-white text-lg font-medium transition-opacity">
            <UploadIcon />
            <p>Click or drag image to upload</p>
          </div>
        </>
      ) : (
        <span className="text-gray-500 text-lg text-center px-4 flex flex-col items-center justify-center gap-2">
          <UploadIcon />
          <p>Click or drag image to upload</p>
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
