ALTER TABLE video_lessons ADD COLUMN sections text NOT NULL DEFAULT '[]';
ALTER TABLE media_integrations ADD COLUMN provider_options text NOT NULL DEFAULT '{}';
