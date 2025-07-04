/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mackyna.com.ar',
        port: '1337',
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
  // const nextConfig = {
  // output:"standalone"
};

module.exports = nextConfig;
// export default nextConfig;
