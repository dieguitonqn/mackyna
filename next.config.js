/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none';",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '149.50.144.192',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'store.mackyna.com.ar',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // experimental: {
  //   cpus:1,
  //   webpackBuildWorker: true,
  //   serverSourceMaps: false,
  // },
  // eslint:{
  //   ignoreDuringBuilds:true,
  // },
  // typescript:{
  //   ignoreBuildErrors:true,
  // },
  // productionBrowserSourceMaps: false,
  /* config options here */
};

module.exports = nextConfig;
// export default nextConfig;
