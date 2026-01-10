import createNextIntlPlugin from "next-intl/plugin";

/**
 * @type {import('next').NextConfig}
 */
export const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
