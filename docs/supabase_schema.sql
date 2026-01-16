-- Создание таблицы users
create table public.users (
  fid bigint primary key,
  username text,
  high_score int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Создание таблицы purchases
create table public.purchases (
  id uuid default gen_random_uuid() primary key,
  fid bigint references public.users(fid),
  sku_id text not null,
  tx_hash text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Политики RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.purchases enable row level security;

-- Политики для users: разрешаем всё для простоты (в Flappy Bird это ок)
create policy "Allow all for users" on public.users for all using (true) with check (true);

-- Политики для purchases: разрешаем чтение и вставку
create policy "Allow all for purchases" on public.purchases for all using (true) with check (true);
