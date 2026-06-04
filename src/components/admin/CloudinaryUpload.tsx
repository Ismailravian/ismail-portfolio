"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Video } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  label: string;
  type: "image" | "video";
  defaultValue?: string | null;
  accept?: string;
};

async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !preset) {
    throw new Error("Cloudinary env vars not set. Add them to .env.local — see README.");
  }

  const resourceType = file.type.startsWith("video/") ? "video" : "image";
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", preset);

  const res = await fetch(url, { method: "POST", body });
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
  const data = await res.json();
  return data.secure_url as string;
}

export function CloudinaryUpload({ name, label, type, defaultValue, accept }: Props) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasCloudinary =
    typeof window !== "undefined" &&
    !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      setUrl(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const defaultAccept =
    type === "image" ? "image/png,image/jpeg,image/webp,image/gif" : "video/mp4,video/webm,video/mov";

  return (
    <div className="space-y-2">
      <span className="text-xs text-muted">{label}</span>

      {/* Hidden input carries the final URL into the form */}
      <input type="hidden" name={name} value={url} />

      {/* Drop zone — only shown if Cloudinary is configured */}
      {hasCloudinary ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors text-center",
            dragging ? "border-accent bg-accent/10" : "border-border hover:border-accent/60 hover:bg-card/40"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept ?? defaultAccept}
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-muted">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm">Uploading…</span>
            </div>
          ) : url ? (
            <div className="flex flex-col items-center gap-2">
              {type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="preview" className="max-h-32 rounded-lg object-contain mx-auto" />
              ) : (
                <div className="flex items-center gap-2 text-accent text-sm">
                  <Video className="h-5 w-5" /> Video uploaded
                </div>
              )}
              <span className="text-xs text-muted truncate max-w-xs">{url}</span>
              <span className="text-xs text-accent">Click or drop to replace</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted">
              {type === "image" ? (
                <ImageIcon className="h-8 w-8" />
              ) : (
                <Video className="h-8 w-8" />
              )}
              <span className="text-sm font-medium">
                Drop {type === "image" ? "an image" : "a video"} here, or click to browse
              </span>
              <span className="text-xs">
                {type === "image" ? "PNG, JPEG, WebP" : "MP4, WebM, MOV"}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Fallback: plain URL input when Cloudinary is not configured */
        <div className="space-y-1">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={type === "image" ? "https://res.cloudinary.com/…" : "https://youtube.com/watch?v=… or direct MP4 URL"}
            className="w-full px-3 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
          <p className="text-xs text-muted">
            Paste a URL. To enable direct upload, add{" "}
            <code className="text-accent">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> and{" "}
            <code className="text-accent">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> to{" "}
            <code className="text-accent">.env.local</code>.
          </p>
        </div>
      )}

      {/* Show a clear button if URL is set */}
      {url && !uploading && (
        <button
          type="button"
          onClick={() => setUrl("")}
          className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-400"
        >
          <X className="h-3 w-3" /> Remove {type}
        </button>
      )}

      {error && (
        <p className="text-xs text-rose-500 bg-rose-500/10 rounded-lg px-3 py-2">{error}</p>
      )}
    </div>
  );
}
