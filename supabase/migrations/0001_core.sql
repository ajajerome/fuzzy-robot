-- Core schema for Spelförståelse FC
create table if not exists public.player (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid,
  display_name text not null,
  age_group text not null,
  avatar_config jsonb not null default '{}'::jsonb,
  xp_total integer not null default 0,
  badge_summaries jsonb not null default '[]'::jsonb,
  guardian_email text,
  parental_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.coach (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid,
  org_id uuid,
  role text not null default 'coach',
  created_at timestamptz not null default now()
);

create table if not exists public.exercise (
  id uuid primary key default gen_random_uuid(),
  kind text not null, -- quiz/scenario/draw
  difficulty text not null,
  format text not null, -- 5v5/7v7/9v9/11v11
  content_json jsonb not null,
  created_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.question (
  id uuid primary key default gen_random_uuid(),
  age_group text not null,
  difficulty text not null,
  sources text[] default '{}',
  question_json jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.answer (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.player(id) on delete cascade,
  question_id uuid references public.question(id) on delete set null,
  answer_json jsonb not null,
  score integer,
  feedback text[],
  created_at timestamptz not null default now()
);

create table if not exists public.season (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.player(id) on delete cascade,
  start_date date not null default current_date,
  weeks_json jsonb not null default '[]'::jsonb,
  progression_json jsonb not null default '{}'::jsonb
);

create table if not exists public.tip (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  age_group text not null,
  theme text,
  locale text not null default 'sv',
  created_at timestamptz not null default now()
);

create table if not exists public.task (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid references public.coach(id) on delete cascade,
  team_id uuid,
  payload_json jsonb not null,
  due_at timestamptz,
  status text not null default 'assigned',
  created_at timestamptz not null default now()
);

-- Basic RLS enablement (policies to be refined later)
alter table public.player enable row level security;
alter table public.answer enable row level security;
alter table public.season enable row level security;

-- Placeholder policies (tighten later)
create policy if not exists player_owner_select on public.player for select using (true);
create policy if not exists player_owner_modify on public.player for all using (true) with check (true);

