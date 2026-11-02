# Nudgelo verification

Reviewed November 2, 2026. These are bounded engineering checks on the application and its test harness. They are not an independent penetration-test certification, physical-device test, or proof of a real Twitch channel connection.

## Current automated results

| Check | Result | Scope |
| --- | --- | --- |
| Model, protocol and security tests | 38 passed | Physics, goals, input bounds, ballot lifecycle, capacity limits, anonymous import/export, OAuth and EventSub guards |
| Browser journeys | 35 passed | Actual local UI; Twitch-specific integration paths use controlled fixtures |
| Responsive layout combinations | 72 passed | Nine routes at 320, 360, 390, 430, 768, 1024, 1440 and 1920 CSS px; no horizontal overflow |
| Automated accessibility states | 12; zero detected tagged violations | WCAG2A/AA and WCAG2.1AA; eleven contrast states and five ARIA states remain incomplete |
| Dependency audit | Zero known advisories | Both production and development dependencies, against the committed npm lockfile |
| Limited history secret scan | Zero pattern findings | Eleven revisions / 303 text-file revisions; private-key, GitHub-token, AWS-key and OpenAI-key patterns only |

The browser results are saved in [browser-report.json](browser-report.json). Incomplete accessibility checks are not passes. These automated checks do not establish native VoiceOver/NVDA behavior or physical-phone operation.

## Bugs found and corrected in this review

Starting an eight-second Studio experiment and navigating to the guide caused an uncaught `scrollIntoView` error when the experiment completed. This was reproduced on the deployed website. A new UI regression failed on the old code, then passed after guarding the result-panel access by the active route. The experiment now completes in the background, saves exactly one anonymous record, and shows its result when the user returns.

The trace's accessible description still named colors from the earlier design. It now identifies A as solid and B as dashed, matching the line styles without relying on color names.

## Feature coverage

- The Home instrument visibly moves and responds to a length change.
- Synchronize reaches 0.0% after four length changes; Precision braking reaches 1.53 m after three friction changes; Neutral buoyancy reaches a 1.00 density ratio after two density changes. A five-move ineffective strategy produces the actual loss state.
- Solo actions, local one-voter rehearsal, empty votes, tied votes, changed votes, duplicate delivery, stale/deadline votes, bounded no-op controls, navigation cancellation, and disconnection cancellation are exercised.
- The free Studio tests all three models, locked prediction inputs, an eight-second run, recap, calculated traces, one-variable retest and actual before/after measurements.
- Notebook restoration, anonymous downloads, valid import followed by reload, malformed import, forged results, and an oversized file are exercised. Failed imports preserve the existing notebook and clear the file input.
- Mission and Studio Stage views work, expose their relevant information, and exit with Escape. Stage view is intended for OBS Window Capture; an independent OBS Browser Source is not synchronized.
- Navigation, keyboard skip/focus behavior, mobile control focus, the mobile settings disclosure, reduced motion, the player connection dialog, configured OAuth destination and Preview callback-origin handling are exercised.

## Production HTTP checks

The canonical public host is https://nudgelo.vercel.app/ . This review directly observed HTTP 200 with CSP, HSTS, nosniff, frame denial, no-referrer and camera/microphone/geolocation restrictions. Eleven bounded requests for configuration/source/admin-like paths were rejected rather than exposing files. Two redirect-query probes did not redirect to an external origin. Five served application files matched their source bytes at the time of the checks.

The host serves public static files, so cross-origin readability of those public assets is not an authenticated-data disclosure. No application database, password endpoint, server-side URL fetcher or private API is deployed. The HTTP probes were read-only and did not test Twitch's infrastructure, load resistance, or every possible attack class. Post-release browser checks and source comparison must verify the navigation fix's deployed build.

## Security controls and automation

Untrusted model parameters, imported records and chat commands are validated before use. Imported outcomes are recomputed; counts and file/history sizes are bounded. Canonical imported records discard unrelated metadata. Voter and delivery identifiers have length and capacity limits. The app requests only `user:read:chat`, never posts messages, validates tokens against the client and user, checks random/single-use/time-limited OAuth state, and accepts only exact official reconnect origins and matching fresh chat events. External user text is not rendered as HTML.

The browser-only Twitch token is held in memory and sessionStorage for the browser session, removed on disconnect, and omitted from all downloads. No Client Secret or access token belongs in source or localStorage. This is a client-only OAuth design; it does not use an application server session cookie.

CI keeps the existing required job name and read-only repository permissions. Checkout/setup actions are pinned to commits, checkout does not retain its credential, installation skips package lifecycle scripts, and the native audit covers development dependencies too. Main branch protections are preserved; changes go through a pull request and required CI.

## Integration and submission status

Live Twitch operation is not verified. The shared application's Client ID is unset, and registration requires the owner to complete Twitch's 2FA prerequisite. Controlled OAuth/EventSub fixtures are not real channel evidence. No authentication protection is bypassed.

Devpost project 1522696 / submission 1277168 is Submitted. It contains the supplied [2:19 walkthrough](https://www.youtube.com/watch?v=Bj7RRNe2IvA), fifteen captioned application screenshots and a 3:2 thumbnail. The walkthrough demonstrates the local application and states the Twitch limitation. This review preserves that existing submission and its required Codex explanation.
