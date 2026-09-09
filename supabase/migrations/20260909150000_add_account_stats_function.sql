-- Aggregate, server-side account stats for the Monkeytype-style account
-- dashboard. Runs under the caller's own RLS boundary (auth.uid()) so it
-- exposes only the signed-in user's own typing_history rows, and avoids
-- pulling full row data client-side just to compute totals/bests/averages.
create or replace function public.get_account_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  overall jsonb;
  buckets jsonb;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to view account stats';
  end if;

  select jsonb_build_object(
    'testsCompleted', count(*),
    'totalDurationSec', coalesce(sum(duration_sec), 0),
    'bestWpm', coalesce(max(wpm), 0),
    'avgWpm', coalesce(avg(wpm), 0),
    'bestAccuracy', coalesce(max(accuracy), 0),
    'avgAccuracy', coalesce(avg(accuracy), 0)
  )
  into overall
  from public.typing_history
  where user_id = auth.uid();

  select coalesce(jsonb_agg(b), '[]'::jsonb)
  into buckets
  from (
    select
      target_duration_sec as duration_sec,
      difficulty,
      count(*) as tests,
      max(wpm) as best_wpm,
      avg(wpm) as avg_wpm,
      max(accuracy) as best_accuracy,
      avg(accuracy) as avg_accuracy
    from public.typing_history
    where user_id = auth.uid() and is_custom = false
    group by target_duration_sec, difficulty
  ) b;

  return overall || jsonb_build_object('byBucket', buckets);
end;
$$;

revoke all on function public.get_account_stats() from public;
grant execute on function public.get_account_stats() to authenticated;
