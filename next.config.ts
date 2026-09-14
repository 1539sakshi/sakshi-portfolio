import path from "node:path";
import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const repoName = "sakshi-portfolio";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
  // This project is a self-contained subfolder of a repo that has its own
  // lockfile at the parent level. Without pinning the root, Turbopack walks up,
  // finds two lockfiles and warns about an ambiguous workspace root.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
