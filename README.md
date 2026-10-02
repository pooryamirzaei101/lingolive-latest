# EnglishFluento Version 1

A responsive English-learning MVP with original sample content. Built with Next.js-compatible Vinext, React, TypeScript, Tailwind CSS, and a Cloudflare-compatible Site output.

## What works

- Homepage, seven learning categories, course and lesson listings, and lesson details.
- Free lesson audio through browser speech synthesis, English/Persian sentence display, selectable transcript lines, previous/next, repeat, and shadowing prompts.
- Save and complete lessons, with a dashboard stored on the current device.
- Responsive layouts for desktop, tablet, and mobile.

Premium lessons are previews. Accounts, video uploads, payments, cross-device progress, and administration require a later phase with secure backend services. Browser speech availability and voices vary by device.

## Run locally

Requires Node.js 22.13 or later. Run `npm ci`, then `npm run dev`. Run `npx tsc --noEmit` and `npm run build` to verify the project. The Site deployment uses `.openai/hosting.json` and the generated Cloudflare-compatible build.

## Hosting and domain

The Site project ID in `.openai/hosting.json` links this source to its Site deployment. Publish a saved version there, then attach a custom domain and set the DNS records supplied by the hosting dashboard. A separate hosting provider will need its own compatible build/deployment configuration.
