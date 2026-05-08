/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = isGithubPages
  ? {
      output: 'export',
      basePath: '/design-test',
      assetPrefix: '/design-test/',
      images: {
        unoptimized: true,
      },
      trailingSlash: true,
    }
  : {};

export default nextConfig;
