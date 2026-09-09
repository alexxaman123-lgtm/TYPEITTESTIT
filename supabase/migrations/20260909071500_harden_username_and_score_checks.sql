-- Hardening pass following a security audit:
-- 1. Lower the implausible WPM ceiling accepted by the server-side scoring
--    functions (and add one at the schema level for the leaderboard table).
--    1000 WPM, and previously no cap at all for typing history, is far
--    beyond any realistic human typing speed and made both the leaderboard
--    and typing history trivially fakeable by calling the RPC directly with
--    fabricated numbers. 350 WPM comfortably covers even world-record-level
--    sustained typing on short tests.
-- 2. Normalize simple leetspeak substitutions before checking usernames
--    against the profanity/impersonation blocklist in set_username(), so
--    obvious bypasses like "adm1n" or "sh1t" are still caught.

create or replace function public.set_username(requested_username text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  cleaned_username text := btrim(coalesce(requested_username, ''));
  normalized_username text;
  leet_normalized text;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to choose a username';
  end if;

  if char_length(cleaned_username) < 3 or char_length(cleaned_username) > 24 then
    raise exception 'Username must be between 3 and 24 characters';
  end if;

  if cleaned_username !~ '^[A-Za-z0-9][A-Za-z0-9_-]*$' then
    raise exception 'Use letters, numbers, underscores, or hyphens, and start with a letter or number';
  end if;

  normalized_username := lower(cleaned_username);
  leet_normalized := translate(normalized_username, '013457$@', 'oieastsa');

  if normalized_username ~ '(admin|administrator|moderator|support|typeittestit|fuck|fck|shit|bitch|asshole|dick|cunt|porn|nazi)'
    or leet_normalized ~ '(admin|administrator|moderator|support|typeittestit|fuck|fck|shit|bitch|asshole|dick|cunt|porn|nazi)' then
    raise exception 'Please choose a respectful username';
  end if;

  insert into public.profiles (user_id, username)
  values (auth.uid(), cleaned_username)
  on conflict (user_id) do update
    set username = excluded.username,
        updated_at = now();

  return cleaned_username;
end;
$$;

revoke all on function public.set_username(text) from public;
grant execute on function public.set_username(text) to authenticated;

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

  if p_wpm < 0 or p_wpm > 350 then
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

alter table public.leaderboard_scores
  drop constraint if exists leaderboard_scores_wpm_check;

alter table public.leaderboard_scores
  add constraint leaderboard_scores_wpm_check check (wpm >= 0 and wpm <= 350);

-- record_typing_history previously existed in some deployments with a
-- "returns bigint" signature (returning the new row id). Postgres refuses to
-- change an existing function's return type via CREATE OR REPLACE, so drop
-- any prior version first to make this migration safe to apply regardless
-- of which version is currently live.
drop function if exists public.record_typing_history(
  text, integer, integer, numeric, numeric, numeric, integer, integer, integer, text, boolean
);

create or replace function public.record_typing_history(
  p_difficulty text,
  p_duration_sec integer,
  p_target_duration_sec integer,
  p_wpm numeric,
  p_accuracy numeric,
  p_words_written numeric,
  p_correct_chars integer,
  p_incorrect_chars integer,
  p_total_typed integer,
  p_language text,
  p_is_custom boolean
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return false;
  end if;

  if p_difficulty not in ('easy', 'medium', 'hard')
    or p_duration_sec <= 0
    or p_target_duration_sec <= 0
    or p_wpm < 0
    or p_wpm > 350
    or p_accuracy < 0
    or p_accuracy > 100
    or p_words_written < 0
    or p_correct_chars < 0
    or p_incorrect_chars < 0
    or p_total_typed < 0
    or p_language not in ('en', 'es') then
    return false;
  end if;

  insert into public.typing_history (
    user_id,
    difficulty,
    duration_sec,
    target_duration_sec,
    wpm,
    accuracy,
    words_written,
    correct_chars,
    incorrect_chars,
    total_typed,
    language,
    is_custom
  ) values (
    auth.uid(),
    p_difficulty,
    p_duration_sec,
    p_target_duration_sec,
    p_wpm,
    p_accuracy,
    p_words_written,
    p_correct_chars,
    p_incorrect_chars,
    p_total_typed,
    p_language,
    coalesce(p_is_custom, false)
  );

  return true;
end;
$$;

revoke all on function public.record_typing_history(text, integer, integer, numeric, numeric, numeric, integer, integer, integer, text, boolean) from public;
grant execute on function public.record_typing_history(text, integer, integer, numeric, numeric, numeric, integer, integer, integer, text, boolean) to authenticated;
