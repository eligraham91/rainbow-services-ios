# Rainbow Services Start Here Prototype

This repository contains the **Start Here** stakeholder preview for Rainbow Services. The current review path is a mobile-first PWA so staff, board members, donors, and collaborators can open the app experience on iPhone without TestFlight.

## What is included

- A Vite + React PWA prototype built from the supplied `iOS app (1).zip` Start Here design files.
- PWA metadata, safe-area viewport settings, manifest support, and a service worker.
- Netlify build settings for shareable preview deploys.
- Supplied Rainbow assets under `public/assets`.
- The earlier SwiftUI prototype in `RainbowDemo/` as a native reference track.

## Review Workflow

Use the PWA first for low-friction concept review:

```sh
npm install
npm run dev
```

Reviewers can open the deployed Netlify preview link in iPhone Safari and optionally add it to the Home Screen.

## Design Source

The prototype follows the supplied Start Here UX specification:

- product name: `Start Here`
- palette: cream base, ink text, restrained purple, safety red only for Quick Exit/safety contexts
- flow: onboarding, privacy, mode selection, Situation Builder, Next Step Map, Tools, Find Help, Learn, Keep Free
- principle: no login, no forced disclosure, no personal information required for preview
