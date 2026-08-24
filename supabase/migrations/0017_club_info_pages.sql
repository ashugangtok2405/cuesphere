alter table public.clubs add column if not exists about_text text not null default '';
alter table public.clubs add column if not exists rules_text text not null default '';
alter table public.clubs add column if not exists membership_text text not null default '';
alter table public.clubs add column if not exists privacy_policy_text text not null default '';
