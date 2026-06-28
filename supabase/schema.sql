create extension if not exists "uuid-ossp";

create table if not exists public.cases (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  section text not null,
  title text not null,
  year text default to_char(now(), 'YYYY'),
  tags text[] default '{}',
  description text,
  full_desc text,
  accent text default '#6B935C',
  size text default 'small',
  role_label text,
  duration text,
  cover_url text,
  cover_type text default 'image',
  media jsonb default '[]',
  stat_value text,
  stat_label text,
  colors text[] default '{}',
  sort_order int default 0,
  published boolean default true
);

create table if not exists public.articles (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  title text not null,
  date date default current_date,
  tags text[] default '{}',
  preview text,
  body text,
  published boolean default true,
  sort_order int default 0
);

alter table public.cases disable row level security;
alter table public.articles disable row level security;
