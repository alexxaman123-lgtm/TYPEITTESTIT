drop policy if exists "Users can insert their own typing history"
on public.typing_history;

revoke insert on public.typing_history from anon, authenticated;

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
