---
title: AI Quiz React
emoji: Quiz
colorFrom: blue
colorTo: green
sdk: static
pinned: false
short_description: AI-powered quiz generator built with React and Vite
app_build_command: npm run build
app_file: dist/index.html
---

# AI Quiz React

A React + Vite quiz app with student and admin views.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Hugging Face Spaces

This repository is configured for a Static HTML Space.

Required Space settings:

- SDK: `Static`
- Build command: `npm run build`
- App file: `dist/index.html`

If you want quiz generation to work on Hugging Face, add one of these in the Space settings:

- `VITE_QUIZ_API_URL`
- `VITE_GROQ_API_KEY`

Recommended:

- Use `VITE_QUIZ_API_URL` for production
- Do not expose a private API key directly in a public frontend Space
