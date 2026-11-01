# Trialroom product contract

Audience: Twitch science/variety creators and viewers who want to solve a short puzzle together.

Core promise: the community has five moves to reach an explicit physical target. Each unique most-voted action changes exactly one bounded input. The same deterministic model supplies the instrument and measured result.

Acceptance:

- Three distinct solvable missions: synchronized pendulums, precision stopping, neutral buoyancy.
- One vote per viewer; a newer choice replaces the old one; duplicate/stale/wrong-channel messages cannot add votes.
- No-vote, tie and at-bound control decisions do not spend moves. Network interruption cancels Twitch voting without applying partial results.
- Explicit ready, voting, locked, testing, feedback, win and loss states. No resets or mission switches while a turn is active.
- Immediate one-tap solo play, a separately labeled one-voter vote rehearsal, authenticated own-channel EventSub path and no chat-writing permission.
- Shared owner app configuration and a player-facing one-button connection; no per-player Client ID form. Clear unavailable/origin-mismatch states.
- Visible commands on Stage view, original moving instruments, model assumptions, keyboard/focus support and reduced motion.
- Mobile navigation and reachable primary action; no horizontal overflow at 320–1920 CSS px.
- Anonymous downloadable action logs. No token, raw chat or viewer identity in downloads/source.
- Free studio retains guided predictions, one-variable retests and the validated local notebook.

No backend is necessary for the single host-browser flow. Independent OBS Browser Source synchronization, cloud sessions, paid inference, guaranteed learning gains and untested live Twitch operation are not promised.

Release gate: model tests, real UI journeys, protocol fixtures, responsive/accessibility checks, dependency audit, required CI, protected Preview and independent public release checks. Disclose actual blockers and incomplete tests.

Submission: maintain project 1522696 as a Devpost draft. No invented personal answers. Do not final-submit or produce final video / 15-image gallery until owner review approval.
