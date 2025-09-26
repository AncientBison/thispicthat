import createNextIntlPlugin from "next-intl/plugin";

/**
 * @type {import('next').NextConfig}
 */
export const nextConfig = {};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
