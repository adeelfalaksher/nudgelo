# Trialroom

**Tagline:** Turn Twitch chat into a room full of scientists. Predict together, run the experiment, and find out why.

**Draft state:** Prepared text, not yet saved on Devpost. Registration and real Twitch verification are pending. Do not submit this file as a claim that authenticated Twitch has been tested.

## Inspiration

A good science stream gives the audience a reason to form a hypothesis before the answer appears. We wanted a streamer to ask a small, testable question and give chat a meaningful part in discovering the result. Research on NOVA's Twitch streams helped us choose science creators as the audience; it does not establish impact for our project.

## What it does

Trialroom is a browser experiment studio. A host chooses a pendulum, friction or buoyancy question, changes the parameters, opens a prediction window, then locks the choices and runs the model. The result includes calculated measurements, the equation and its assumptions. Guided questions help a new host begin. One-variable retests compare before/after measurements, while calculated SVG traces make the model visible. An anonymous notebook restores earlier settings with fresh predictions.

Viewers participate with `!trial a`, `!trial b` or `!trial same`. One viewer has one current choice; a changed prediction replaces the earlier choice. No points or stakes are involved. A clearly labeled local practice mode runs without an account. Stage view can be captured with OBS Window Capture. Anonymous round records can be saved, downloaded and imported.

## How we built it

Codex helped compare ideas, read the Twitch documentation, build pure physics and voting modules, create the responsive interface, diagnose a browser fetch binding bug, write regression tests and prepare deployment and documentation.

The app uses browser JavaScript, HTML, CSS, SVG, native Twitch OAuth, Helix and EventSub WebSockets. It asks only for read-chat permission for the host's own channel. No client secret, remote database, paid inference API or runtime AI is required. The SVG instruments and result text use the same deterministic model. The buoyancy motion illustrates settling to equilibrium rather than simulating fluid dynamics.

## Challenges

A prediction needs a clear boundary: inputs and choices cannot change after the round closes. Duplicate deliveries cannot add votes, a chatter changing their mind should not count twice, and a broken connection must not pretend missing messages arrived. We added phase checks, message freshness guards, bounded deduplication and connection-loss closure.

The browser regression check also found a bug that a Node mock did not catch: native Window.fetch failed when invoked with the connection object as receiver. Binding it to the browser global fixed the actual call path.

## Accomplishments

Three experiments run through a complete local practice round, from parameter selection to measured reveal and anonymous export. The interface includes an original animated physical instrument, a projection layout, a mobile navigation bar, keyboard focus and a reduced-motion path. Seventeen model/protocol tests and fifteen browser journeys passed. Forty route/width combinations had no horizontal overflow. Eight automated accessibility states had no detected violations, with incomplete checks documented in the repository. A keyboard regression reproduced and fixed a skip-link bug that changed the page instead of focusing its content.

## What we learned

A useful live interaction needs more than a chat command. The same equation has to explain the moving instrument and the final result, while timing and input rules keep the audience's prediction fair. Browser integration checks also matter: passing pure tests does not establish a working network or authenticated channel.

## What's next

Complete an authenticated Twitch round and record its actual evidence, then test with science creators and assistive technology users. Expand experiments only when a clear question and honest model can be supported.

## Try it

Open Studio, keep the pendulum defaults, open predictions and choose a local answer. Close predictions, run the experiment, then compare the measured periods. Try equal lengths with different masses next.

**Live website:** https://trialroom-live.vercel.app/

**Source repository:** https://github.com/adeelfalaksher900-creator/trialroom

**Built with:** OpenAI Codex, JavaScript, HTML, CSS, SVG, Twitch API, Twitch EventSub, Twitch OAuth, Vercel, WebSocket, Playwright.

**Team:** Adeel Falak Sher and Raouf Khalid. Individual roles are not invented.

## Submission answers to prepare

- Start of implementation: November 1, 2026. Research began October 30, 2026. The core app is new during the event.
- Code URL: https://github.com/adeelfalaksher900-creator/trialroom
- Observed Codex build session ID: 01a1863a-9282-75ec-8768-4e6badcb1066. Compare with /status before final submission.
- Technology requirement: Codex assisted research, implementation, testing and release. Twitch OAuth/Helix authorizes and subscribes the owner's channel; EventSub delivers prediction commands. Actual authorized Twitch verification is still pending and must be described accurately.
- Streamer/community use: set a question, invite A/B/Same commands in chat, lock predictions, show the experiment on stream and discuss the measured outcome.
- Personal experience surveys, countries, eligibility and travel answers: owner to supply. Do not infer subjective answers or check legal attestations.
- Required video: under three minutes, actual functioning Twitch footage and footage of the Codex build; publicly viewable YouTube link. Deferred until owner approval.
- Thumbnail: docs/assets/thumbnail-3x2.jpg, 1536×1024, original AI-assisted marketing illustration, not a product screenshot.
