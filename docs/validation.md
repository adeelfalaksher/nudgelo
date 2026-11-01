# Validation and release evidence

Reviewed November 1, 2026. This is bounded engineering evidence, not an accessibility or security certification.

## Completed checks

- **17 Node tests passed**, zero failures: small angle mass/length invariants, stopping distance, neutral buoyancy, numerical trust boundaries, exact command parsing, round state transitions, duplicate and stale votes, anonymous import/export, OAuth state and client mismatch, official reconnect address restriction and notification admission.
- **15 browser journeys passed**: actual Home instrument motion; local changed prediction and locked values through run/reveal/save; anonymous download; Stage view and Escape exit; friction run; buoyancy run; invalid import rejection; reduced motion; controlled EventSub flow with real browser fetch and a fixture WebSocket. The last test validates subscription payload, duplicate delivery, changed vote, a second user, disabled local voting during a Twitch round and connection-loss closure. It is a fixture, not an actual Twitch account test.
- **40 route/width combinations**, no document horizontal overflow: Home, Studio, guided pendulum, Guide and Privacy at 320, 360, 390, 430, 768, 1024, 1440 and 1920 CSS px. Resized browser, not physical phones or mobile Safari.
- **8 axe-core 4.11.0 states**, zero detected WCAG-tagged violations: Home, predictions open, result, stage, connection dialog, controlled comparison, mobile studio and guide. Incomplete contrast items remain in seven states; five also have an incomplete aria-prohibited-attr check. An incomplete is not a pass. Real assistive technology testing and a full manual audit remain outstanding.
- **npm audit**, including dev dependencies: zero known advisories at check time. No runtime package is loaded by the static website. Package audit is not proof of absence of vulnerabilities.

The expanded checks cover the guided mass question, calculated plot, recap, a one-variable retest, comparison measurements, notebook parameter restore, keyboard disclosure and skip link, and a Twitch fixture recap using unique voters rather than message volume. New pure tests cover empty prediction statistics, multi-variable comparison honesty and retest bounds. The skip link initially failed a browser regression by changing the hash to #main; it now focuses the existing main element without changing the route.

The real browser test caught a native fetch binding error in the Twitch adapter: calling Window.fetch with the connection object as receiver throws Illegal invocation. The fetcher is now explicitly bound to globalThis. The fixture test reproduces the browser path, so the fix is not inferred from Node mocks alone. A text contrast issue was also corrected before the passing run.

GitHub Actions independently completed the same release checks successfully for source commit `20b1483e7e8757c8a91bd6dde4e90eb2b63ad2a0`: npm ci, Node tests, production dependency audit and browser journeys. See [Checks run 41300485415](https://github.com/adeelfalaksher900-creator/trialroom/actions/runs/41300485415). The status API's empty legacy status list was not treated as a passing check; the completed Actions run and its successful job steps were inspected.

## Production observation

Vercel project `prj_X7DJhJhnNN9ghI0xWLxnpa9WNned`, team `team_puESbhvNZtjIIvtZyWxiNYhm`. First deployment `dpl_4jBwha1BWW2PsAYqY6u8wTVsaRBY` reached READY. Although created with no target as a candidate, Vercel assigned the first project deployment to Production. This is reported as Production, not as a protected Preview. Project SSO protection remains all_except_custom_domains; no protection bypass or share token was created.

The public site was independently opened in the user's connected Chrome browser. A local practice A prediction completed the pendulum round; it revealed A at 1.794 s and B at 2.198 s per swing. The console read returned no captured errors/warnings. This verifies a deployed local-practice journey, not authenticated Twitch traffic.

The canonical public URL is https://trialroom-live.vercel.app/. Its deployment alias was verified against this project and deployment. Independent HTTPS requests returned HTTP 200 and an index identical to the local public/index.html. The deployed twitch.js also exactly matches the tested file (SHA-256 `57851de742021e7c33a79e38afdd76f42c45c4acca58a2f583086e039376d1eb`). Live responses include CSP, nosniff, no-referrer, frame denial and disabled camera/microphone/geolocation permissions. The interactive Chrome journey above ran on the same deployment's original alias; the canonical alias was checked over HTTPS, not represented as a second completed Chrome journey.

## Security scope

No token or Client Secret is stored in source, exports, localStorage or server storage. The public Client ID is not a secret. Token validation is startup/hourly, with explicit error and reconnect states. Only read chat is requested; the app never sends chat or wagers. Exact command parser and channel subscription guards are tested. Imports are bounded and normalized. CSP and standard browser security headers are configured in vercel.json and observed on the live deployment. No private user dataset or paid API was used.

## What remains

- Twitch Developer Console shows a sign-in wall. An actual registered client, owner authorization and real chat round remain necessary before claiming the main Twitch requirement is verified.
- Chrome reconnected during the guided release review. The existing Twitch login tab still requires the owner’s sign-in. A different browser was not used to evade authentication.
- GitHub now displays “Branch protection rule created” for main. Its saved rule requires pull requests and resolved conversations, applies to administrators, and does not allow force pushes or deletions. The model-and-integration check is now required with an up-to-date branch; GitHub confirmed “Branch protection rule settings saved.” No existing protection was disabled.
- Devpost registration is not complete. It asks personal travel/experience answers and explicit agreement to rules and eligibility. No answers or legal agreement are invented. Text and thumbnail are prepared; they are not called an uploaded hackathon draft without a successful save.
- Physical phones, VoiceOver/NVDA, independent penetration testing and real streamer/user research are unverified.
- The final under-three-minute video must show real Twitch operation and Codex build footage. Video and 15-image gallery remain deferred for owner review.

## Tool provenance

Mobbin references were actually viewed; see design notes. 12ui draft stopped at sign in before a hosted generation. Original SVG figures apply Anatomy construction/motion guidance, but no kit geometry audit is claimed. Agent-Reach executed on VON and read the official EventSub documentation with its Jina web backend (ok true, retained JSON on the device). Its first public-web backend attempt was rejected by the installed version and was corrected using the advertised channel list. REA's original guide says to skip REA for ordinary analysis of a complete source repository; normal source tools and browser evidence are used here, rather than pretending a reverse engineering run improved newly authored code. Previously removed paid-key apps were not reinstalled. No final video software run is claimed.

## Guided release CI

The guided release source commit 1323de93aeb249687ae4c96337b3ff8d5508a307 passed [Checks run 41307959856](https://github.com/adeelfalaksher900-creator/trialroom/actions/runs/41307959856). Every job step, including the expanded browser journeys, completed successfully. The new protected Preview dpl_5vfT3t54ks5sBg8oGBfbA6n1ngG3 reached READY. Its Home rendered in the connected Chrome browser; subsequent manual controls hit browser-driver CDP timeouts, so a complete manual Preview round is not claimed. An independent request to the preceding protected candidate returned a Vercel SSO redirect. No share link, protection bypass or disabled browser security was used.

## Guided production verification

PR2 merged as 80770360a5d377103738e836b6d7ff5b60451ca6 after required CI. The preview-promotion endpoint returned 422 for this Preview, so a fresh Production deployment was built from the exact same source instead: dpl_8w9csmH4H79XBzFvK23CKaYervye reached READY. The canonical trialroom-live.vercel.app alias was verified against that deployment. An independent HTTPS check downloaded all 13 public files: every file returned 200 and exactly matched the tested local source bytes. CSP, nosniff, no-referrer, frame denial and disabled camera/microphone/geolocation headers were present.

An independent cloud browser then verified the public website without signing into an account: guided mass question → local Same prediction → locked inputs → run → both periods 2.006 seconds; controlled retest → only A length 1 to 0.8 m → A prediction → run → A period 1.794 and B 2.006 seconds. The comparison table showed the actual previous and current measurements. The downloaded anonymous export contained two valid records, outcomes same/a and no tokens or voter/delivery identifiers. Restoring round one's settings returned to setup with both lengths 1 m, zero fresh predictions and the two saved records retained.

The returned console feed contained browser-extension metadata errors from a chrome-extension origin. No Trialroom product-script error appeared in that returned feed. These extension messages are not represented as application failures or silently described as a completely error-free browser. Protected Preview manual controls timed out, but the independent public-site interactions above completed successfully. Actual authenticated Twitch remains unverified.

Fresh live proof: [first reveal](assets/review/04-live-first-reveal.jpg), [changed result](assets/review/05-live-retest-reveal.jpg), [comparison](assets/review/06-live-comparison.jpg). These are real website captures, not generated images or gallery-production assets.
