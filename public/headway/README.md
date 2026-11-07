# Headway (scottvibes.com/headway)

Unlisted, noindexed calendar app. Don't edit `index.html` here: it's generated from
`~/headway/headway.html` (the same source as the claude.ai artifact) by `~/headway/build-hosted.sh`.

Google sign-in lives in `src/app/api/headway/*` and `src/lib/headway-auth.ts`. It needs
`HEADWAY_GOOGLE_CLIENT_ID`, `HEADWAY_GOOGLE_CLIENT_SECRET` and `HEADWAY_SECRET` in the env.
