import dotenvLoad from 'dotenv-load';
import nextEnv from 'next-env';

dotenvLoad();

const withNextEnv = nextEnv();

process.traceDeprecation = true;

export default withNextEnv({
  output: 'standalone',
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: {
        loader: 'svg-url-loader',
        options: {
          encoding: 'base64',
        },
      },
    });

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["s3.amazonaws.com"]
  }
});
