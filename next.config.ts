import path from "node:path";
import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const repoName = "sakshi-portfolio";
const basePath = isGithubPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: isGithubPages ? `${basePath}/` : "",
  // This project is a self-contained subfolder of a repo that has its own
  // lockfile at the parent level. Without pinning the root, Turbopack walks up,
  // finds two lockfiles and warns about an ambiguous workspace root.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
