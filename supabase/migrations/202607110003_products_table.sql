-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  timeline TEXT NOT NULL,
  includes TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone can view active products)
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Admin full access (service-role bypasses RLS, but this is for clarity)
CREATE POLICY "Admins have full access to products" ON products
  FOR ALL USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Seed 3 products
INSERT INTO products (name, short_name, description, price, timeline, includes, sort_order) VALUES
('Landing Page Bisnis', 'Landing Page', 'Halaman promosi responsif untuk produk, event, atau jasa dengan copywriting ringkas, desain modern, dan optimasi tampilan mobile.', 750000, '3-5 hari kerja', ARRAY['1 halaman utama', 'Form kontak', 'SEO dasar', 'Deploy ke hosting'], 1),
('Website Company Profile', 'Company Profile', 'Website profil usaha lengkap untuk menampilkan layanan, portofolio, informasi kontak, dan kredibilitas brand secara profesional.', 1500000, '7-10 hari kerja', ARRAY['Hingga 5 halaman', 'Galeri/portofolio', 'Integrasi WhatsApp', 'SEO dasar'], 2),
('Aplikasi Web Custom', 'Web App', 'Pengembangan aplikasi web sesuai kebutuhan operasional seperti dashboard admin, katalog, booking, atau sistem internal sederhana.', 3500000, '14-21 hari kerja', ARRAY['Dashboard admin', 'Database', 'Autentikasi', 'Dokumentasi singkat'], 3)
ON CONFLICT DO NOTHING;
