-- Add format column to cases (used by "Анимация" section: 16:9 vs 9:16)
alter table cases add column if not exists format text default 'horizontal';
-- format: 'horizontal' (16:9) | 'vertical' (9:16)

-- New table for the "Логотипы" section
create table if not exists logos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  name text not null,
  year text,
  comment text,
  size text default 'normal', -- 'normal' (1x1) | 'wide' (2x1)
  accent text default '#6B935C',
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

alter table logos disable row level security;
