import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // DuckDB uses native Node.js addons — exclude from webpack bundling
  serverExternalPackages: ["duckdb"],
  // Fix workspace root detection when there are multiple lockfiles
  outputFileTracingRoot: require("path").join(__dirname, "../.."),
};

export default nextConfig;
