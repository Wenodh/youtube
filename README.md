# YouTube Clone

React 18 + Redux Toolkit YouTube browsing application using the YouTube Data API v3.

## Local setup

- Node.js 18+
- A Google Cloud project with YouTube Data API v3 enabled

```bash
npm ci
cp .env.example .env.local
# Set REACT_APP_GOOGLE_API_KEY and (optionally) REACT_APP_GOOGLE_CLIENT_ID in .env.local
npm start
```

Run checks:

```bash
npm test -- --watchAll=false
npm run build
```

## API key security and quota

A `REACT_APP_*` value is compiled into browser JavaScript. The YouTube API key is therefore public; do not treat it as a secret. In Google Cloud Console, restrict the key to HTTP referrers for localhost and your exact deployed domains, and restrict it to YouTube Data API v3. Rotate any key that has been committed publicly.

Successful Data API GET responses are cached in memory for short periods to reduce repeated calls during navigation. This does not replace quota monitoring or server-side enforcement. YouTube Search API calls can consume considerably more quota than video/channel lookups.

## Authentication limitations

Google Identity Services currently supplies a client-side profile preview only. This project does not verify credentials on a backend, create a server session, or obtain YouTube OAuth scopes. The profile display is not proof of a server-authenticated user. In-app likes/dislikes are local preferences; they do not modify a YouTube account. Subscribe and live-chat actions are not connected. The Shorts feed currently uses a short-duration search query; the public Data API does not provide a dedicated Shorts-only feed filter, so results are not guaranteed to be Shorts. The Live Chat panel now explains this rather than generating fake messages.

Real YouTube account actions require a backend OAuth authorization-code flow with state/PKCE, server-side token validation, the minimum required YouTube scopes, and secure server-side refresh-token storage. Never put OAuth client secrets or refresh tokens in React environment variables.

## CI

GitHub Actions runs Jest and a production build for pull requests and pushes to `master`.
