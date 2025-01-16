// next.config.ts
import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig, ResolveOptions } from 'webpack';

// Define custom resolve fallback type
interface CustomResolveFallback {
  [key: string]: boolean | string | string[] | undefined;
}

// Define custom resolve options extending webpack's ResolveOptions
interface CustomResolveOptions extends Omit<ResolveOptions, 'fallback'> {
  fallback?: CustomResolveFallback;
}

// Define custom webpack configuration
interface CustomWebpackConfig extends Omit<WebpackConfig, 'resolve'> {
  experiments?: {
    asyncWebAssembly?: boolean;
    layers?: boolean;
    topLevelAwait?: boolean;
  };
  resolve?: CustomResolveOptions;
}

// Define webpack function type
type WebpackConfigFunction = (
  config: CustomWebpackConfig,
  context: { isServer: boolean }
) => CustomWebpackConfig;

// Define the Next.js configuration
const nextConfig: NextConfig = {
  webpack: ((config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          fs: false,
          net: false,
          tls: false,
        },
      };
    }

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  }) as WebpackConfigFunction,

  // Updated experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3001'],
    },
  },

  // Moved from experimental to root level
  serverExternalPackages: ['@xmtp/xmtp-js'],
};

export default nextConfig;