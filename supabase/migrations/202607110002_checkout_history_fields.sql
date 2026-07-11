alter table public.checkout_transactions
add column if not exists payment_url text;

alter table public.checkout_transactions
add column if not exists expires_at timestamptz;
