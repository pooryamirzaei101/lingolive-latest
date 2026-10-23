-- Application tables are server-only. The Vinext server connects with DATABASE_URL;
-- browser clients must never read or modify these tables through PostgREST.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'content_access', 'hidden_samples', 'ielts_blocks', 'ielts_progress',
    'ielts_speaking_examples', 'learner_preferences', 'learner_profiles',
    'learning_daily', 'learning_progress', 'media_integrations',
    'media_transcripts', 'memberships', 'payment_orders', 'payment_settings',
    'premium_grants', 'quick_tip_lessons', 'reading_blocks', 'reading_chapters',
    'reading_items', 'referral_codes', 'referral_entitlements',
    'referral_settings', 'referral_signups', 'routine_lessons', 'saved_routines',
    'saved_sentences', 'saved_vocabulary', 'speaking_recordings',
    'support_messages', 'support_tickets', 'transcript_jobs', 'translation_cache',
    'translation_usage', 'user_admin_audit', 'video_categories', 'video_lessons'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all privileges on table public.%I from anon, authenticated', table_name);
  end loop;
end $$;
