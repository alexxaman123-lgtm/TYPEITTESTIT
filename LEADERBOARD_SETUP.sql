-- GOATTYPE public leaderboard
-- Run this once in the Supabase SQL editor.

create table if not exists public.leaderboard_scores (
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  duration_sec integer not null check (duration_sec in (60, 120, 180, 300)),
  wpm numeric(10, 2) not null check (wpm >= 0 and wpm <= 1000),
  accuracy numeric(6, 2) not null check (accuracy >= 0 and accuracy <= 100),
  words_written numeric(10, 2) not null default 0 check (words_written >= 0),
  correct_chars integer not null default 0 check (correct_chars >= 0),
  incorrect_chars integer not null default 0 check (incorrect_chars >= 0),
  total_typed integer not null default 0 check (total_typed >= 0),
  submitted_at timestamptz not null default now(),
  primary key (user_id, difficulty, duration_sec)
);

create index if not exists leaderboard_scores_wpm_idx
  on public.leaderboard_scores (wpm desc, accuracy desc);

create index if not exists leaderboard_scores_accuracy_idx
  on public.leaderboard_scores (accuracy desc, wpm desc);

alter table public.leaderboard_scores enable row level security;

-- The leaderboard is public to read.
drop policy if exists "Leaderboard scores are publicly readable" on public.leaderboard_scores;
create policy "Leaderboard scores are publicly readable"
  on public.leaderboard_scores
  for select
  using (true);

-- Signed-in users may write only their own scores.
drop policy if exists "Users can insert their own leaderboard score" on public.leaderboard_scores;
create policy "Users can insert their own leaderboard score"
  on public.leaderboard_scores
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own leaderboard score" on public.leaderboard_scores;
create policy "Users can update their own leaderboard score"
  on public.leaderboard_scores
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Usernames must be publicly readable by the leaderboard.
drop policy if exists "Public profiles are readable for leaderboard" on public.profiles;
create policy "Public profiles are readable for leaderboard"
  on public.profiles
  for select
  using (true);
