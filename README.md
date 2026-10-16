# LingoLive

Editable English-learning application with secure Supabase authentication.

## Account features

- Google OAuth and email/password registration
- Email verification and password recovery
- First-login onboarding for English level and learning purpose
- Optional country, translation language, and newsletter preferences
- Editable account profile with personalized recommendations

## Configuration

Copy `.env.example` to `.env` and add your Supabase project URL and public key. In Supabase, enable the Google provider and add the local and production callback URLs.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
