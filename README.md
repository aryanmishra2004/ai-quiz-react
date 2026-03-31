---
title: AI Quiz React
emoji: 🧠
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
app_port: 7860
short_description: AI-powered quiz generator built with React and Vite
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

This repository is configured for a Docker Space so it can run on the free Hugging Face plan.

Required Space secret:

- `GROQ_API_KEY`

Optional:

- `VITE_QUIZ_API_URL` if you want the frontend to use another backend instead

Recommended:

- Add `GROQ_API_KEY` as a Space secret, not a public variable
- Revoke any Groq key that has already been exposed in the frontend
