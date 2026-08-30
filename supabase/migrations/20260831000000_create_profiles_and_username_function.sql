-- Stores only the public username needed by signed-in TYPEITTESTIT features.
-- Apply this migration in the Supabase project before deploying the client change.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length_check check (char_length(username) between 3 and 24),
  constraint profiles_username_format_check check (username ~ '^[A-Za-z0-9][A-Za-z0-9_-]*$')
);

create unique index if not exists profiles_username_case_insensitive_key
  on public.profiles (lower(username));

alter table public.profiles enable row level security;

grant select on public.profiles to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.set_username(requested_username text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  cleaned_username text := btrim(coalesce(requested_username, ''));
  normalized_username text;
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

  if normalized_username ~ '(admin|administrator|moderator|support|typeittestit|fuck|fck|shit|bitch|asshole|dick|cunt|porn|nazi)' then
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
