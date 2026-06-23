/** @type {import('next').NextConfig} */
function resolveNextAuthUrl() {
  const configured = process.env.NEXTAUTH_URL?.trim();
  if (configured) return configured;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

const nextConfig = {
  env: {
    NEXTAUTH_URL: resolveNextAuthUrl(),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
