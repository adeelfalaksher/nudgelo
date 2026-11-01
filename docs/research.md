# Research and compliance

Research began October 30; this new implementation began November 1, 2026. Qloo is a separate completed project and no Qloo code is submitted here.

## Official requirements

Event: https://twitchcon-codex.devpost.com/ . Rules: https://twitchcon-codex.devpost.com/rules . Retrieved November 1, 2026 with the Devpost connector.

The API gives the deadline as November 2 at 22:00 UTC, which is November 3 at 03:00 Pakistan time. The FAQ contains an inconsistent UTC conversion; use the API timestamp and official countdown. New work during the event, built with Codex, connecting interactively to Twitch is mandatory. Source repository and setup instructions, explanation of Codex use, actual Codex session ID, and a YouTube video under three minutes showing Twitch functionality AND how Codex built it are required. Video production remains deferred by user instruction. Extension review can take 5–14 days, so use native browser EventSub instead.

Four equally weighted criteria: Innovation/Idea; Potential Impact; Technological implementation; Design. A useful round with clear consequences matters more than unrelated features. No registration, eligibility attestation or final submission is authorized without the required personal answers and explicit agreement.

## Five directions assessed

| Direction | Existing competition | Assessment |
|---|---|---|
| Chat music studio | Chat Choir and Pulse Choir on Devpost | Rejected: very close existing submissions. |
| Audience escape room | HEIST and puzzles-with-chat | Rejected: crowded and overlaps a recent entry. |
| Stream director | Existing OBS automation and audience tools | Rejected: generic and needs privileged OBS access. |
| Raid onboarding map | Many chat loyalty/avatar tools | Useful, but difficult to prove an advantage without a real community. |
| Live science experiment studio | Twitch Predictions/Aquarius overlay and independent physics simulations | Selected: integrate parameter control, testable prediction, physics visualization and explanation into one streamable round. Not a claim of being the first. |

Primary research: NORC, How a Gaming Platform Became a Classroom for STEM Learning, https://www.norc.org/research/library/how-gaming-platform-became-classroom-stem-learning.html ; project https://www.norc.org/research/projects/driving-stem-engagement-via-novas-twitch-channel.html . Its analysis covers NOVA streams and motivates this audience; it is not evidence of Trialroom efficacy.

Competitor sources: https://devpost.com/software/chat-choir ; https://devpost.com/software/pulse-choir ; https://devpost.com/software/heist-2nxbmq ; https://github.com/bbeck/puzzles-with-chat ; https://github.com/AndrewChill/Aquarius . Native Twitch Predictions use Channel Points; Trialroom's plain text predictions use no money or points.

## Integration references

- https://dev.twitch.tv/docs/authentication/register-app/
- https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/
- https://dev.twitch.tv/docs/authentication/validate-tokens/
- https://dev.twitch.tv/docs/chat/authenticating/
- https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatmessage
- https://dev.twitch.tv/docs/eventsub/handling-websocket-events/
- https://dev.twitch.tv/showcase/

Browser-only implicit flow uses a public client ID, state verification and exact redirect URI. Tokens stay in memory/sessionStorage on the user's browser, never in exports or the repository. Validate at connection and hourly. Subscribe only after welcome, verify notification type/channel/user, deduplicate delivery IDs and reject stale events. Keepalive watchdog, explicit disconnect, restricted Twitch reconnect URL and reconnect/reauthorize states are needed. Network interruption does not silently invent missed votes.

## Codex evidence

Observed current Codex runtime thread/session ID: `01a1863a-9282-75ec-8768-4e6badcb1066`. This is the environment's actual ID, not a generated placeholder. Owner should compare it with /status before final submission. Record implementation decisions, tests and revisions in the repository. Never fabricate screenshots of Codex or claim a test not run.

## Revised decision: give the audience actual agency

The owner completed Devpost registration and created project 1522696 / submission 1277168 for this hackathon. That is verified registration, not final submission or permission to invent personal eligibility answers.

A fresh comparison found [ChaosForge](https://devpost.com/software/chaosforge-twitch-chaos-engine-with-openai-codex), [ChatTugArena](https://devpost.com/software/chat-tug-arena), [RallyRoom](https://devpost.com/software/rallyroom-one-chat-one-mission), [Stream Plays Puzzle](https://wendelscardua.itch.io/stream-plays-puzzle) and the earlier puzzles-with-chat repository. Their descriptions show that chat physics, majority actions and cooperative missions already exist. Their functionality and traction were not independently tested.

Five directions were reconsidered: a general rescue co-op (overlaps RallyRoom), a music controller (overlaps Chat Choir/Pulse Choir), a caption director (audio/model infrastructure and existing tools), a moderation assistant (wider permissions and uncertain usefulness), and a target-seeking physics calibration game. The last option reuses verified equations while correcting the studio's central weakness: predictions alone do not let the audience change what happens.

Trialroom now asks the community to hit a physical target within five bounded actions. A chosen control changes one input, the model animates it and a reproducible action log shows the consequence. Multiple buoyancy strategies and a pendulum mass misconception provide testable choices. This is a specific differentiator, not a claim of first invention or a guaranteed winning entry.

Twitch application registration was attempted on the owner's signed-in account with the production redirect and Public client selected. Twitch returned: “user must have two factor auth enabled to perform this action”. Enabling 2FA and owner OAuth require the owner's involvement. Do not claim a registered client, actual chat test or fulfilled Twitch demo requirement until those steps succeed. Anonymous unofficial IRC access is not substituted for documented authenticated EventSub.
