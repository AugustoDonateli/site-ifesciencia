import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "suocgfbfvcvmsgqypand.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Miniatura do YouTube: usada só no painel, para confirmar que o
      // código do vídeo existe. No site público a capa é a que a equipe envia.
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
