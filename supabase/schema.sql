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

create table if not exists public.settings (
  id int primary key default 1,
  heading text default 'ДАВАЙТЕ РАБОТАТЬ',
  subheading text default 'Обсудим проект — расскажите задачу',
  services jsonb default '[
    {"title":"UX/UI Дизайн","desc":"Продуктовые интерфейсы, мобильные приложения, веб-платформы","price":"от 80 000 ₽"},
    {"title":"Брендинг","desc":"Фирменный стиль, логотип, гайдлайн","price":"от 60 000 ₽"},
    {"title":"Motion Design","desc":"Анимации для UI, видеоролики, шаблоны для соцсетей","price":"от 40 000 ₽"},
    {"title":"AI-интеграция","desc":"Автоматизация дизайн-процессов, AI Art Direction","price":"по запросу"}
  ]'::jsonb,
  links jsonb default '[
    {"label":"Telegram","value":"@rogovdesign","href":"https://t.me/rogovdesign"},
    {"label":"Email","value":"hello@rogov.design","href":"mailto:hello@rogov.design"},
    {"label":"Behance","value":"behance.net/rogov","href":"https://behance.net"}
  ]'::jsonb
);

-- Insert default row if not exists
insert into public.settings (id) values (1) on conflict (id) do nothing;

alter table public.settings disable row level security;
