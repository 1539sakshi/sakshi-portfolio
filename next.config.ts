import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // This project is a self-contained subfolder of a repo that has its own
  // lockfile at the parent level. Without pinning the root, Turbopack walks up,
  // finds two lockfiles and warns about an ambiguous workspace root.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
