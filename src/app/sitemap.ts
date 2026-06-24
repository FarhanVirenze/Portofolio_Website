import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Ganti dengan domain website Anda yang sebenarnya
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://domain-anda.com';

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portofolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/certification`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
