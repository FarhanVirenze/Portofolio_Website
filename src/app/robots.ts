import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://xffarhans.my.id').replace(/\/+$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Jangan izinkan Google meng-index halaman admin
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
