import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Ganti dengan domain website Anda yang sebenarnya
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://domain-anda.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Jangan izinkan Google meng-index halaman admin
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
