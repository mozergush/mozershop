import withBundleAnalyzer from '@next/bundle-analyzer';
import withNextIntl from "next-intl/plugin";

const nextIntlConfig = withNextIntl();

const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
    images: {
        minimumCacheTTL: 31536000,
    },
    async headers() {
        return [
            {
                // Настройка заголовков для всех оптимизированных изображений
                source: "/_next/image",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable", // Пример: кэшировать на 1 год
                    },
                ],
            },
        ];
    },
};

export default nextIntlConfig(bundleAnalyzer(nextConfig));