import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next.js does not pick up an
  // unrelated parent lockfile when inferring the root directory.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
