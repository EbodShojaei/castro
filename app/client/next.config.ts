import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig, ResolveOptions } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin'; // Minification plugin
import JavaScriptObfuscator from 'webpack-obfuscator'; // Obfuscation plugin

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
    layers?: boolean;
    topLevelAwait?: boolean;
  };
  resolve?: CustomResolveOptions;
}

// Define webpack function type
type WebpackConfigFunction = (
  config: CustomWebpackConfig,
  context: { isServer: boolean; dev: boolean },
) => CustomWebpackConfig;

// Define the Next.js configuration
const nextConfig: NextConfig = {
  webpack: ((config, { isServer, dev }) => {
    if (!isServer) {
      // Ensure config.optimization is not undefined
      if (!config.optimization) {
        config.optimization = {};
      }

      // Disable source maps in production
      if (!dev) {
        config.devtool = false;

        // Minify JavaScript using Terser
        config.optimization.minimizer = [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true, // Remove console logs for production
              },
            },
          }),
        ];

        // Optional: Add JavaScript Obfuscation
        config.plugins?.push(
          new JavaScriptObfuscator(
            {
              rotateStringArray: true, // Obfuscate string literals
              stringArray: true, // Enable string obfuscation
            },
            ['excluded-file.js'], // Optional: Exclude certain files from obfuscation
          ),
        );
      }

      // Modify resolve to fallback modules for non-server environment
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

    // Enable Webpack experiments
    config.experiments = {
      ...config.experiments,
      layers: true,
    };

    return config;
  }) as WebpackConfigFunction,

  // Updated experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins:
        process.env.NODE_ENV === 'production'
          ? [
              process.env.NEXT_PUBLIC_ALLOWED_ORIGINS ||
                'https://castro-chat.vercel.app',
            ]
          : ['http://localhost:3001'], // Default to localhost if not set
    },
  },
  serverExternalPackages: ['@xmtp/xmtp-js'],
};

export default nextConfig;
