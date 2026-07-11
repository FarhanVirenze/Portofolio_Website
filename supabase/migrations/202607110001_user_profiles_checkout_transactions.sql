create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.checkout_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  merchant_order_id text not null unique,
  duitku_reference text,
  payment_url text,
  product_id text not null,
  product_name text not null,
  payment_method text not null,
  amount integer not null,
  status text not null default 'pending',
  result_code text,
  customer_name text not null,
  email text not null,
  phone text not null,
  billing_address text not null,
  raw_request jsonb,
  raw_response jsonb,
  raw_callback jsonb,
  paid_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists checkout_transactions_user_id_idx
  on public.checkout_transactions(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;
create trigger user_profiles_set_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists checkout_transactions_set_updated_at on public.checkout_transactions;
create trigger checkout_transactions_set_updated_at
before update on public.checkout_transactions
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.email, ''),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = case
      when public.user_profiles.full_name = '' then excluded.full_name
      else public.user_profiles.full_name
    end,
    avatar_url = coalesce(public.user_profiles.avatar_url, excluded.avatar_url);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

alter table public.user_profiles enable row level security;
alter table public.checkout_transactions enable row level security;

drop policy if exists "Users can read own profile" on public.user_profiles;
create policy "Users can read own profile"
on public.user_profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
on public.user_profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile"
on public.user_profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can read own checkout transactions" on public.checkout_transactions;
create policy "Users can read own checkout transactions"
on public.checkout_transactions for select
using (auth.uid() = user_id);
