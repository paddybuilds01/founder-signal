create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text,
  created_at timestamptz not null default now()
);

create table if not exists social_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  platform text not null,
  handle text not null,
  external_id text,
  access_token_encrypted text,
  refresh_token_encrypted text,
  scopes text[] default '{}',
  expires_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists social_posts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references social_accounts(id) on delete cascade,
  platform text not null,
  external_id text not null,
  url text,
  body text not null default '',
  topic text,
  community text,
  posted_at timestamptz not null,
  raw jsonb default '{}'::jsonb,
  unique(platform, external_id)
);

create table if not exists post_metrics (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references social_posts(id) on delete cascade,
  captured_at timestamptz not null default now(),
  views integer default 0,
  likes integer default 0,
  replies integer default 0,
  reposts integer default 0,
  quotes integer default 0,
  shares integer default 0,
  engagement_rate numeric default 0,
  raw jsonb default '{}'::jsonb
);

create table if not exists execution_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  category text not null,
  platform text,
  linked_post_id uuid references social_posts(id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  duration_ms integer not null
);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  detail text not null,
  confidence numeric not null default 0,
  created_at timestamptz not null default now()
);
