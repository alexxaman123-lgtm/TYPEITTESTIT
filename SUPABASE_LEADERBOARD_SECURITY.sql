-- GOATTYPE leaderboard security hardening.
-- Run this once in Supabase SQL Editor after the leaderboard tables exist.

-- Users must never be able to directly insert or update leaderboard rows.
drop policy if exists "Users can insert their own leaderboard score"
  on public.leaderboard_scores;

drop policy if exists "Users can update their own leaderboard score"
  on public.leaderboard_scores;

-- The application writes scores through this SECURITY DEFINER function instead.
-- The function always uses auth.uid(), validates the test dimensions, enforces
-- the competitive accuracy threshold, compares against the user's existing best,
-- and only stores a new best.
create or replace function public.submit_leaderboard_score(
  p_difficulty text,
  p_duration_sec integer,
  p_wpm numeric,
  p_accuracy numeric,
  p_words_written numeric,
  p_correct_chars integer,
  p_incorrect_chars integer,
  p_total_typed integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_username text;
  v_current_wpm numeric;
  v_current_accuracy numeric;
  v_is_better boolean;
begin
  if v_user_id is null then
    return false;
  end if;

  if p_difficulty not in ('easy', 'medium', 'hard') then
    return false;
  end if;

  if p_duration_sec not in (60, 120, 180, 300) then
    return false;
  end if;

  if p_wpm is null or p_accuracy is null then
    return false;
  end if;

  if p_wpm < 0 or p_wpm > 1000 then
    return false;
  end if;

  if p_accuracy < 95 or p_accuracy > 100 then
    return false;
  end if;

  -- Keep the account/profile relationship in sync.
  select username
    into v_username
  from public.profiles
  where user_id = v_user_id;

  if v_username is null or btrim(v_username) = '' then
    v_username := coalesce(
      nullif(btrim(auth.jwt() -> 'user_metadata' ->> 'username'), ''),
      nullif(btrim(auth.jwt() -> 'user_metadata' ->> 'preferred_username'), ''),
      nullif(btrim(auth.jwt() -> 'user_metadata' ->> 'name'), '')
    );

    if v_username is null or v_username = '' then
      return false;
    end if;

    insert into public.profiles (user_id, username)
    values (v_user_id, v_username)
    on conflict (user_id) do update
      set username = excluded.username;
  end if;

  select wpm, accuracy
    into v_current_wpm, v_current_accuracy
  from public.leaderboard_scores
  where user_id = v_user_id
    and difficulty = p_difficulty
    and duration_sec = p_duration_sec;

  v_is_better :=
    v_current_wpm is null
    or p_wpm > v_current_wpm
    or (p_wpm = v_current_wpm and p_accuracy > coalesce(v_current_accuracy, -1));

  if not v_is_better then
    return false;
  end if;

  insert into public.leaderboard_scores (
    user_id,
    difficulty,
    duration_sec,
    wpm,
    accuracy,
    words_written,
    correct_chars,
    incorrect_chars,
    total_typed,
    submitted_at
  )
  values (
    v_user_id,
    p_difficulty,
    p_duration_sec,
    p_wpm,
    p_accuracy,
    greatest(coalesce(p_words_written, 0), 0),
    greatest(coalesce(p_correct_chars, 0), 0),
    greatest(coalesce(p_incorrect_chars, 0), 0),
    greatest(coalesce(p_total_typed, 0), 0),
    now()
  )
  on conflict (user_id, difficulty, duration_sec)
  do update set
    wpm = excluded.wpm,
    accuracy = excluded.accuracy,
    words_written = excluded.words_written,
    correct_chars = excluded.correct_chars,
    incorrect_chars = excluded.incorrect_chars,
    total_typed = excluded.total_typed,
    submitted_at = excluded.submitted_at;

  return true;
end;
$$;

revoke all on function public.submit_leaderboard_score(
  text, integer, numeric, numeric, numeric, integer, integer, integer
) from public;

grant execute on function public.submit_leaderboard_score(
  text, integer, numeric, numeric, numeric, integer, integer, integer
) to authenticated;

-- Keep RLS enabled and public read-only access for the leaderboard.
alter table public.leaderboard_scores enable row level security;
