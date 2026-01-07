/** @type {import("next").NextConfig} */
const nextConfig = {
  serverExternalPackages: ["esbuild-wasm"],
  async rewrites() {
    return [
      {
        source: "/sw.js",
        destination: "/serwist/sw.js",
      },
      {
        source: "/sw.js.map",
        destination: "/serwist/sw.js.map",
      }
    ]
  }
};

export default nextConfig;
