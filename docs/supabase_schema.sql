-- Создание таблицы users
create table public.users (
  fid bigint primary key,
  username text,
  high_score int default 0,
  games_played int default 0,
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

-- Создание таблицы achievements (разблокированные достижения)
create table public.achievements (
  id uuid default gen_random_uuid() primary key,
  fid bigint references public.users(fid),
  achievement_id text not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  minted boolean default false,
  mint_tx_hash text,
  UNIQUE(fid, achievement_id)
);

-- Политики RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.purchases enable row level security;
alter table public.achievements enable row level security;

-- Политики для users: разрешаем всё для простоты (в Flappy Bird это ок)
create policy "Allow all for users" on public.users for all using (true) with check (true);

-- Политики для purchases: разрешаем чтение и вставку
create policy "Allow all for purchases" on public.purchases for all using (true) with check (true);

-- Политики для achievements
create policy "Allow all for achievements" on public.achievements for all using (true) with check (true);
