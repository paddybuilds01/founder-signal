# Founder Signal

Founder Signal is a founder analytics OS for social growth and execution intelligence.

## What is included

- Original command center: overview, platform health, content log, execution tracker, goals, insights, settings.
- New analytics layer: post analytics, best posting windows, topic performance, community fit, recommendations.
- API-ready connectors:
  - Bluesky via AT Protocol handle + app password.
  - Threads via Threads user id + access token.
- Supabase-ready schema in `supabase/schema.sql`.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes

- The app is local-first until Supabase credentials are wired into a real project.
- Instagram and X are represented in the UI and data model, but planned for the next connector wave because API access is more gated.
- Threads requires a Meta app and token with the right Threads permissions.
- Bluesky requires an app password from the Bluesky account settings.
