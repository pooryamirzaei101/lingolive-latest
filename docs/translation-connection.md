# Translation connection

Word lookup first uses reviewed Persian meanings bundled with the app. An optional server-side translator supplies missing Persian meanings and other selected languages. No external translation service is enabled by default.

To activate a LibreTranslate-compatible provider later, set these **Site secrets / server bindings**, never client variables:

- `TRANSLATION_API_URL`: the provider's full HTTPS `/translate` endpoint.
- `TRANSLATION_API_KEY`: the provider's key, when required. Self-hosted instances may omit it.

The adapter sends JSON `{q, source: "en", target, format: "text", api_key?}` and expects `{translatedText: string}`. Only a signed-in learner can request live word translation. Input is limited to short words or phrases, the endpoint is fixed on the server, and requests time out after seven seconds. A failed provider does not erase reviewed or saved translations. The administration screen shows connection status and offers an explicit connection test.

The Word Bank stores the student's selected language alongside the translation. Changing language leaves earlier entries intact. No background translation or purchase occurs when configuration is absent.
