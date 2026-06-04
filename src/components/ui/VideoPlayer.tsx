"use client";

function youtubeEmbed(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      return `https://player.vimeo.com/video${u.pathname}`;
    }
  } catch {}
  return null;
}

export function VideoPlayer({ src }: { src: string }) {
  const embed = youtubeEmbed(src);

  if (embed) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden glass">
        <iframe
          src={embed}
          title="Project demo"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video
      controls
      playsInline
      preload="metadata"
      className="w-full aspect-video rounded-2xl glass object-cover"
      src={src}
    />
  );
}
