alter table logos add column if not exists full_desc text default '';
alter table logos add column if not exists media jsonb default '[]'::jsonb;
