/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.output.filename = (pathData) => {
        // disable random hashfilename for offline page
        if (pathData.chunk.name === "app/offline/page") {
          return "static/chunks/[name].js";
        }
        return "static/chunks/[name]-[contenthash].js";
      };
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c.saavncdn.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
