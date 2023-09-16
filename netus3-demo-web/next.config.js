/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
     {
        source: '/',
        destination: '/home',
        permanent: true,
     }
    ]
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  },
  env: {
    infuraKey: process.env.INFURA_KEY,
    alchemyKey: process.env.ALCHEMY_KEY,
    walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID,
    appEnv: process.env.APP_ENV,
    accesskeyId: process.env.AWS_ACCESSKEYID,
    secretaccessKey: process.env.AWS_SECRETACCESSKEY,
    bucket: process.env.BUCKET
  },
  distDir: 'next-test'
}

module.exports = {
  ...nextConfig,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals.push({ bufferutil: "bufferutil", "utf-8-validate": "utf-8-validate", "supports-color": "supports-color" }); 
    }
    config.externals.push("pino-pretty", "lokijs", "encoding")
    return config;
  },
}
