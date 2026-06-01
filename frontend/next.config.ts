import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
