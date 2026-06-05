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
    return {
      beforeFiles: [
        { source: "/", destination: "/index.html" },
      ],
    };
  },
};

export default nextConfig;
