# Technical plan

## Journey
Home → open studio → choose one of three experiments → edit bounded numerical parameters → open predictions → accept Twitch commands or a clearly labeled local practice vote → close predictions → run → reveal calculated outcome and explanation → repeat with one changed variable → save anonymous round record. Guide covers connection, OBS Window Capture, formulas and limitations. Projection uses the same running app and can be left with Escape or a visible exit.

## Modules
`physics.js`: immutable experiment catalog, strict parameter validation, pure result and time-position models. `round.js`: setup/open/locked/running/revealed lifecycle, vote changes and counts, bounded delivery dedupe and export validation. `twitch.js`: OAuth return validation, Helix token validation/subscription and EventSub lifecycle. `scene.js`: accessible SVG instrument driven by physics model. `app.js`: routes and DOM controls. No external server stores chat or credentials.

## Acceptance checks
Formula invariants and edge bounds, changed votes not extra votes, duplicate/stale/mismatched-channel notifications, freeze parameters during a round, import/export validation, keyboard and responsive paths, reconnect/revocation/session loss, no token in URL after callback or exported data. Local UI tests use controlled fixtures only and must be distinguished from actual authenticated Twitch tests.

## Security
No raw chat rendered as HTML. Only exact !trial a/b/same commands, one choice per Twitch user, maximum 5000 voters, 10000 delivery IDs and 50 anonymous history rounds. No automatic chat writes, wagering, third party scripts or analytics. Restrict CSP to self, Twitch API/OAuth and official EventSub WebSocket. User tokens stored only for browser session and removed on disconnect. Import capped at 100 KB and schema validated. All numeric inputs validated at state boundary; session exports contain neither token nor viewer identity.
