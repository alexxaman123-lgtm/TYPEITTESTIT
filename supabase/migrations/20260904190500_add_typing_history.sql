create table if not exists public.typing_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  duration_sec integer not null check (duration_sec > 0),
  target_duration_sec integer not null check (target_duration_sec > 0),
  wpm numeric(8, 2) not null check (wpm >= 0),
  accuracy numeric(6, 2) not null check (accuracy >= 0 and accuracy <= 100),
  words_written numeric(10, 2) not null check (words_written >= 0),
  correct_chars integer not null check (correct_chars >= 0),
  incorrect_chars integer not null check (incorrect_chars >= 0),
  total_typed integer not null check (total_typed >= 0),
  language text not null default 'en' check (language in ('en', 'es')),
  is_custom boolean not null default false,
  completed_at timestamptz not null default timezone('utc', now())
);

create index if not exists typing_history_user_completed_idx
  on public.typing_history (user_id, completed_at desc);

alter table public.typing_history enable row level security;

create policy "Users can view their own typing history"
  on public.typing_history
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own typing history"
  on public.typing_history
  for insert
  with check (auth.uid() = user_id);
