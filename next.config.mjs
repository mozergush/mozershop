import withBundleAnalyzer from '@next/bundle-analyzer';
import withNextIntl from "next-intl/plugin";

const nextIntlConfig = withNextIntl();

const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
    images: {
        minimumCacheTTL: 3600,
    },
};

export default nextIntlConfig(bundleAnalyzer(nextConfig));