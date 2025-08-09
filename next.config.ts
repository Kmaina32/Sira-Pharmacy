
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plcgcc.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.canva.com',
        port: '',
        pathname: '/**',
      },
      {
          protocol: 'https',
          hostname: 'media.canva.com',
          port: '',
          pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'antdisplay.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.citypng.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.clipartmax.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firstaidforlife.org.uk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.newfoodmagazine.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.lullabytrust.org.uk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'orthohub.co.ke',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.shekhawatihospital.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
