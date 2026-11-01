# Trialroom

**Tagline:** Your chat runs the lab. Five moves to solve a physics mission together—vote, change a real model input and discover what gets you to the target.

**Saved status:** Story, technologies and links saved to project 1522696. Hackathon submission 1277168 remains Draft and unsubmitted. Devpost separately made the portfolio page public. Factual Additional info answers were saved; owner personal/legal answers remain. Thumbnail upload succeeded with background processing.

## Inspiration

A poll can collect opinions while leaving the audience on the sidelines. We wanted chat to change what actually happens on a stream. Science gives that decision a clear consequence: change a physical input, see the model respond and find out whether the idea helped.

Our first studio let people predict an outcome. Reviewing that flow exposed its weakness: the audience still had no control. We rebuilt the main experience around cooperative calibration missions while preserving the free experiment studio.

## What it does

Trialroom gives a Twitch community five moves to solve one shared physical problem. Viewers choose a control through `!trial a`, `!trial b` or `!trial c`. The unique most-voted action changes one bounded input. The instrument moves, the measurement updates and the group plans its next decision.

Three missions are included: synchronize two pendulums, stop a sled inside a 1.40–1.70 metre target, and suspend a block at neutral buoyancy. Some tempting moves do not help; changing pendulum mass, for example, cannot fix its period in the ideal small-angle model. Buoyancy permits more than one valid strategy.

The interface shows the target, remaining moves, commands, current input source and anonymous action trail. Ties, empty ballots and controls at their limits do not consume a move. Local practice is explicitly one voter on the device. Stage view exposes the instrument and commands for OBS Window Capture. It does not synchronize an independent OBS Browser Source.

For open-ended exploration, the studio supports custom inputs, predictions, calculated traces, one-variable retests, actual before/after comparisons and a validated anonymous notebook.

## How we built it

Codex supported official-rule research, competitor comparison, the product revision, physics and voting modules, responsive interface, Twitch integration, regression tests and deployment. No runtime AI or paid inference key is needed.

The application uses HTML, CSS, browser JavaScript modules and original SVG instruments. Pure equations supply both the movement and reported measurement. The game engine keeps ballot state, applies bounded actions and evaluates the target. Twitch OAuth, Helix and EventSub WebSockets provide an own-channel read-chat path. Tokens remain in memory/sessionStorage and never enter source or downloads. There is no client secret, chat-writing permission or remote chat archive.

## Challenges we ran into

Audience control needs a fair boundary. A viewer changing a choice must replace a vote, not add another. Duplicate delivery and stale messages must not count. An interrupted Twitch ballot must not apply partial results. We reuse a guarded ballot lifecycle, then apply a single consensus action only after voting closes.

Browser checks caught a native fetch binding bug that Node mocks missed. Later game tests caught a fixture session-reset mistake; the fixture now reloads its controlled connection explicitly. The mobile review also moved the primary turn action into reach and scrolls between choices and the instrument at the appropriate step.

## Accomplishments we're proud of

The three targets are reachable through the actual UI and model. Browser checks also verify a five-move loss, anonymous action export, Stage view commands, no-vote handling, navigation cancellation and controlled Twitch tie/disconnect behavior. The existing studio's guided retest remains functional.

26 model/protocol tests and 25 browser journeys passed. 64 route/width combinations at 320–1920 CSS pixels had no horizontal overflow. Twelve automated accessibility states had no detected WCAG-tagged violations; incomplete checks remain documented. Dependency audit reported no known advisories. These are bounded engineering checks, not accessibility or penetration-test certification.

## What we learned

Giving chat agency changes the product more than adding decorative features. A measured target, a small move budget and a clear consequence create something people can discuss together. Scientific honesty matters too: a calculated model output is not a sensor reading, neutral buoyancy is not surface floating, and a protocol fixture is not proof of real Twitch operation.

## What's next

Complete real-channel verification, record the actual Twitch-and-Codex demonstration, then test with creators and assistive-technology users. Creator adoption, learning outcomes and engagement improvements have not been measured.

**Integration status:** The owner is signed in to Twitch, but application registration returned “user must have two factor auth enabled to perform this action”. Real Twitch authorization and an actual chat-controlled mission remain pending owner 2FA. We do not present fixture traffic as live Twitch evidence.

**Live:** https://trialroom-live.vercel.app/

**Code:** https://github.com/adeelfalaksher900-creator/trialroom

**Built with:** OpenAI Codex, JavaScript, HTML, CSS, SVG, Twitch API, Twitch EventSub, OAuth, WebSocket, Vercel, Playwright, axe-core.

**Team:** Adeel Falak Sher and Raouf Khalid. Individual roles are not invented.

## Additional information preparation

- New implementation began November 1, 2026; research began October 30. Qloo is a separate completed project.
- Observed Codex session: 01a1863a-9282-75ec-8768-4e6badcb1066. Owner should compare with /status before final submission.
- Technology: Codex supported research, implementation, testing and release; the Twitch OAuth/Helix/EventSub adapter reads audience control commands. Actual channel verification is pending owner 2FA.
- Community use: open a mission during a stream, show the lab with OBS Window Capture, collect A/B/C commands and apply the chosen control until the group hits the target or uses its five moves.
- Personal survey, residence and legal eligibility answers belong to the owner and are not inferred.
- Required public YouTube video under three minutes must show actual Twitch operation and Codex build footage. Video and the 15-image gallery remain deferred until project review approval.
- Save as a draft only. Do not perform final submission.
