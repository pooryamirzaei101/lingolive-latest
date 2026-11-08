# API connections and YouTube lessons

Sign in using the account matching the server's `ADMIN_EMAIL`, then open **Administration**.

## API connections

Open **API connections** in the administrator sidebar, or visit `/administration/media-apis`.

- Save AssemblyAI credentials for English transcription.
- Choose Google Cloud Translation, DeepL, or Azure for translation, save its credentials, then test the saved connection.
- Enable API generation when you are ready to generate new content. Existing transcripts and translations remain saved when generation is disabled.
- Blank credential fields keep the saved values. The server requires `MEDIA_CONFIG_ENCRYPTION_KEY` to encrypt credentials; retain the original key across deployments.
- In **YouTube connection**, save Google OAuth credentials and use the displayed redirect URI in the Google Cloud OAuth client configuration. Connect the Google account, then test authorization. Replacing OAuth credentials requires reconnecting.

Provider tests use the saved credentials. No credentials are displayed back to the browser. Generation and connection tests can use provider quota.

## Add a YouTube video to a section

Open **Add YouTube videos** in the administrator sidebar, or visit `/administration/youtube`.

1. Choose **Video Lessons / News**, **Speaking Practice**, or **YouTube Videos**, then choose a folder. News and its subfolders are under Video Lessons / News.
2. Paste a YouTube video or Shorts URL and add the title and description.
3. Choose a transcript source: manual text, an English SRT file, authorized YouTube captions, or AssemblyAI with your matching original audio/video.
4. Create the draft, review the English transcript and timestamps, and prepare any translations.
5. Save the reviewed transcript and publish. The video appears in its selected section and folder.

You can also choose **YouTube URL** in the Video or Speaking studio's **Video source** field. Opening a supported administration folder and choosing **Add YouTube video here** preselects that folder in the YouTube studio. The YouTube studio lists YouTube videos across all supported destinations, and **Move to folder** can move them between these destinations.

YouTube playback uses an embedded player and needs no API key. Caption import through the official API requires a connected Google account with permission to edit the video. For other videos, supply subtitle files, manual text, or matching original media you can use. No YouTube video file is downloaded. Student membership and publication rules still apply; published Speaking Practice videos retain voice recording.
