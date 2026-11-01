# Validation and release evidence

Reviewed November 1, 2026. These are bounded engineering checks, not accessibility/security certification or evidence of a live Twitch channel session.

## Release

- Source PR: [#4](https://github.com/adeelfalaksher900-creator/trialroom/pull/4), merged as `f7667d07e0461a3cbe635a1ab6c583a2c6c3f3d9`.
- Required CI: [Checks 41323583203](https://github.com/adeelfalaksher900-creator/trialroom/actions/runs/41323583203), job `model-and-integration`. Every step completed successfully, including npm ci, Node tests, audit and browser checks.
- Protected Preview: `dpl_J2g1YFkqggqntmz486NAE5YxqZ2Q`, target staging, READY. Its complete four-move Synchronize mission was exercised in the owner's connected Chrome browser.
- Production: `dpl_HZdwy7FGE7ubnWpxMMR3vPT2aYRr`, target production, READY. Canonical alias: https://trialroom-live.vercel.app/ . Source metadata points to the merged commit above; build took 1,770 ms.
- Vercel source API returned 19 source files. Every SHA-1 content identifier matched the tested local file, including all 18 public files and vercel.json. This is a deployment-source comparison, not a claim that 19 files were independently downloaded from the public CDN.
- Existing SSO protection remains enabled with `all_except_custom_domains`. No bypass, share token or disabled browser security was used.

## Automated evidence

| Check | Result | Scope |
| --- | --- | --- |
| Node tests | 26 passed | Physics, mission goals, bounds, state transitions, votes, import/export, OAuth and protocol guards |
| Browser journeys | 25 passed | Actual local UI, complete studio/game flows and controlled Twitch fixtures |
| Responsive combinations | 64 passed | Eight routes at 320, 360, 390, 430, 768, 1024, 1440 and 1920 CSS px |
| axe-core states | 12, no detected tagged violations | WCAG2A/AA and WCAG2.1AA tags; incomplete checks remain |
| Dependency audit | 0 known advisories | Runtime and development dependency audit at check time |
| Static secret patterns | 0 findings | Limited private-key, GitHub-token and AWS-key patterns in public/test code |

See [browser-report.json](browser-report.json). Eleven axe states have incomplete color-contrast checks; five also have incomplete aria-prohibited-attr checks. Incomplete is not a pass. Physical phones, real mobile Safari and VoiceOver/NVDA have not been tested.

Game journeys verify empty ballots, a four-action synchronization win, three-action precision braking, two-action neutral buoyancy, a five-action mass-only loss, anonymous action downloads, Stage commands, navigation cancellation, and controlled EventSub ties/duplicate delivery/C-command/disconnect cancellation. The free studio's original predictions, guided retest, actual comparison, notebook and invalid-import checks remain passing.

The browser test initially caught a native fetch receiver bug in the Twitch adapter. The expanded game run also exposed a test-fixture error: same-document hash navigation did not reset a deliberately disconnected fake connection. Reloading the controlled fixture corrected that test setup. Neither issue is hidden as a passing test before correction.

## Deployed interaction evidence

**Preview, connected Chrome, mobile layout:** open Synchronize, vote A, lock, apply, repeat four times. Length A changed 0.4 → 0.6 → 0.8 → 1.0 → 1.2 m. The measured A periods changed 1.269 → 1.554 → 1.794 → 2.006 → 2.198 seconds; B stayed 2.198. Final difference 0.0%, mission complete, one move left. [Actual capture](assets/review/08-preview-mission-complete.png).

**Production, connected Chrome:** open Neutral buoyancy, use two A actions. Density B changed 1200 → 1100 → 1000 kg/m³ against liquid density 1000. The ratio changed 1.20 → 1.10 → 1.00. The mission completed with three moves left. Stage view displayed the neutral block, measured target and A/B/C commands; host controls were hidden. [Actual capture](assets/review/09-production-neutral-buoyancy.png).

The returned Production console feed contained one ordinary log from the browser extension and no application-script error. This describes that captured feed only.

A separate terminal attempt to run the entire browser suite against the public host failed immediately with `net::ERR_EMPTY_RESPONSE`; Python HTTPS requests failed at the environment's proxy CONNECT. No public-suite pass, fresh HTTP-header probe or exposed-file scan is claimed from those attempts. The connected-browser journeys above did complete successfully, and the authenticated Vercel source comparison matched all files. The full automated suite passed locally and independently in GitHub Actions.

## Security and data boundaries

No token or Client Secret is included in source, localStorage or exports. Only read-chat permission is requested. OAuth state is random, single-use and time-limited; tokens are validated on connection and hourly. Exact official reconnect origins, channel/subscription/user guards, freshness and delivery limits are tested. Raw chat never renders as HTML. Anonymous studio imports are bounded and recomputed; mission downloads contain counts and model changes, not identities.

CSP, nosniff, no-referrer, frame denial and disabled camera/microphone/geolocation permissions are configured in the deployed vercel.json. Fresh direct HTTP header/probe verification was blocked by the terminal network environment. Dependency audit and static pattern checks are not comprehensive penetration testing.

Main remains protected: pull requests, up-to-date successful `model-and-integration`, resolved conversations, administrator enforcement, no force pushes or deletions. PR4 merged through those protections.

## Real Twitch blocker

The owner's Twitch console is signed in. Public application registration was prepared with Website Integration and exact Production redirect. Twitch rejected Create with “user must have two factor auth enabled to perform this action”. The owner must enable 2FA, then register/authorize the client before an actual chat-controlled mission can be verified. Fixtures are explicitly not live Twitch evidence. Authentication protections are not bypassed.

## Devpost and media

Existing project 1522696 / submission 1277168 was updated, not duplicated. Name, tagline, full story, technologies and live/repository links were saved. Team type, repository URL, observed Codex session ID, technology explanation and community-use answer were saved in Additional info. Personal residence/surveys and legal attestations remain for the owner.

The hackathon entry is visibly **Draft** and `submitted_at` is null. Devpost's project-save API made its separate portfolio record public at https://devpost.com/software/trialroom ; this is not a final hackathon submission. No final Submit button or rule-agreement checkbox was activated.

The 3:2 thumbnail is an actual app screenshot, not generated functionality. Full-resolution source: 1536×1024 JPEG. A 768×512 upload variant was captured for the direct connector after the streaming upload hit a proxy timeout. Upload returned success with background processing; no successful upload was retried. The draft subsequently displayed the uploaded thumbnail with a completed image load.

The final under-three-minute video must show actual Twitch operation and Codex build footage. Final video and 15-image gallery remain deferred for owner review. Team membership currently lists only the owner account; the second teammate still needs the owner's invitation/acceptance workflow.

## Manual contrast follow-up

Manual review of the SVG block faces found that white text on the brass B face (#bd914d) had a 2.87:1 contrast ratio. B now uses dark ink #1b2420; A keeps its white label on green (4.83:1). This is a targeted readability correction, not a claim to have completed all manual accessibility checks. The full game/Preview/Production evidence above describes the feature release; the color-only follow-up and final release status are recorded on its GitHub pull request.

## Playground and connection revision

The latest source branch replaces player-facing Client ID setup with a shared-app, one-button OAuth flow and a separate owner route. Missing app configuration and cross-origin Preview callbacks fail clearly. Real Twitch remains pending owner application setup; its settings page was inspected in the connected browser and still offers Set Up Two-Factor Authentication. No password/OTP was requested or authentication protection bypassed.

34 Node tests passed. The full local browser run passed 32 journeys, 72 route/width combinations and 12 axe states with zero detected tagged violations. Eleven contrast checks and five aria checks remain incomplete, so this is not full accessibility certification. New cases cover direct solo actions, keyboard/mobile control focus, no player ID input, configured one-button OAuth (read-only scope, random state, exact callback), Preview origin mismatch and cancelled-vote data cleanup. A final focused check covered 16 route/width combinations after enlarging secondary touch controls, plus another modal axe check. Dependency audit reported no known advisories.

The source CI [Checks 41330180700](https://github.com/adeelfalaksher900-creator/trialroom/actions/runs/41330180700) completed every required step successfully. During local review, the dark-theme progress number and inline guide code initially failed contrast assertions; their foreground/background combinations were corrected before the passing run. Missing pending OAuth timestamps/app IDs now fail closed, and opaque bearer-token punctuation is accepted without allowing header control characters. Voter and delivery maps are discarded after completed/cancelled decisions.

The current QA screenshots show the revised interface; they are not generated product imagery or the held 15-image gallery. The existing marketing thumbnail/video/gallery have not been regenerated for this redesign.

The guide now separates one-tap solo play, local chat-vote rehearsal and real-channel hosting. The privacy page describes the shared public identifier without asking players to supply it. The studio's status region no longer rewrites unchanged text on every timer update; a MutationObserver browser regression covers that behavior. The final guide/status follow-up and release identifiers are recorded in its pull request.

## Nudgelo rebrand

The existing project is now called Nudgelo. The interface, metadata, help copy, downloads, npm package and public application configuration use the new name. Stable storage keys, the existing GitHub repository and legacy commands remain compatible. `!nudge` is the primary displayed command; a strict-parser regression covers both names and rejects embedded/partial commands.

35 Node tests, 32 local browser journeys, 72 route/width combinations and 12 axe states passed. There were no captured application errors or detected tagged violations. Eleven contrast states and five aria states remain incomplete. Dependency audit reported zero known advisories. The test run found and corrected secondary-text contrast and a phone heading overflow before passing. Required CI and release details are recorded in the rebrand pull request. Real Twitch remains pending; no final media or hackathon submission was produced.
