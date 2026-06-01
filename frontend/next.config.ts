import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proksikan panggilan API ke FastAPI dari sisi server Next.
  // Browser cukup memanggil same-origin /backend/* (aman lewat HTTPS tunnel).
  async rewrites() {
    const backend = process.env.BACKEND_ORIGIN || "http://localhost:8000";
    return [{ source: "/backend/:path*", destination: `${backend}/:path*` }];
  },
  images: {
    // Jangan optimasi di server (hindari fetch upstream yang gagal karena
    // intersepsi TLS ISP); browser memuat URL gambar asli langsung.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "ibb.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
