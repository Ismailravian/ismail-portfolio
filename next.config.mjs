/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  transpilePackages: ["three"],
  async rewrites() {
    return [
      // Serve the immersive static portfolio at the root
      { source: "/", destination: "/index.html" },
    ];
  },
};

export default nextConfig;
