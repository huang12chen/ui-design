---
name: portfolio-website
description: Design, build, or redesign websites and web interfaces for brand sites, shops, dashboards, AI products, portfolios, and other purposes. Derive the visual direction and interaction model from the audience, task, content, existing identity, and constraints; implement and inspect a working result. Also use for résumé, CV, 简历, 作品集, portfolio, 官网, 商城, 后台, 仪表盘 and AI 产品 interface requests. The stable portfolio-website name keeps existing installations compatible.
---

# UI Design

Design an interface for the actual people, content, and task. Brand expression, an efficient operational workflow, a purchasing decision, and a portfolio reading path call for different structures. Do not reuse a signature layout, palette, card treatment, or motion vocabulary by default.

[中文指南](references/zh-CN/overview.md)

## Understand the job

Identify the audience, primary task and next action, content or data available, brand and accessibility requirements, existing stack, devices, operational constraints, and what is real or simulated. Inspect the existing product and use confirmed context. Ask only about consequential gaps and continue independent work.

Read [application design](references/application-design.md) for decision paths and state models for brand, commerce, dashboards, AI products, and portfolios. These examples are starting points, not style presets. A particular industry can support several valid directions. For portfolios, use [content and evidence](references/content.md), [adaptive structure](references/structure.md), [media and navigation](references/images-and-links.md), and [fictional demonstrations](references/demo-projects.md) as relevant.

## Research and choose a direction

When references shape a decision, follow [reference research](references/reference-research.md) to a specific case, live site, component, or official implementation. Record the source, what was actually seen or operated, the principle, adaptation, and how the adaptation will be checked. Mark blocked, login-only, recorded-video-only, or untested behavior clearly. Do not claim a source's license covers assets or code without checking the actual terms.

Define a visual direction from the user's purpose and material: hierarchy, layout, type, color roles, media, density, control geometry, and motion. Explore more than one credible direction when useful; select one for a reason, not because it is the last project's default. Write a proportionate DESIGN.md recording choices, real inputs, uncertain assumptions, breakpoints, component states, and checks. Compare the result with another relevant build: differences must include information architecture and user task where those differ, not merely colors or job titles.

The existing portfolio-focused [visual direction](references/visual-direction.md), [surfaces](references/surfaces.md), and [spatial construction](references/spatial-construction.md) offer possible methods, not universal formulas. For instance, sampled artifact colors, a single focal object, asymmetry, or large gaps are choices only when they serve this project; dense tools and commerce flows may require different decisions.

## Build the real task and its states

Start with the primary route and truthful content. Controls should do what their labels say. Model the reachable empty, populated, loading, success, error, disabled, recovery, and stale states that apply; use real progress and cancellation only when actual work supports them. Keep filters, detail views, charts, totals, visible output, and exports consistent. For model interfaces, distinguish a local prototype, mock response, and a connected model; never imply a model request was made when it was not.

Read [component anatomy](references/component-anatomy.md), [interaction states](references/interaction-states.md), [motion choreography](references/motion-choreography.md), and [responsive construction](references/responsive-construction.md) selectively. Preserve keyboard focus, touch alternatives, native navigation, adequate contrast and reduced-motion behavior. Motion should explain continuity, feedback, or the content; do not require a particular library, decorative effect, or number of showpieces.

## Verify and hand over

Run the actual product and inspect it visually with its real copy and data at desktop and phone sizes, plus relevant intermediate or user-reported widths. Exercise the primary task, navigation, error and recovery paths, keyboard, touch, and reduced motion as applicable. Compare screenshots for hierarchy, clipping, obstruction, typography, density, and whether the design suits the brief. An automated pass does not judge visual quality.

For a compatible built static site, the optional `node scripts/selfcheck.mjs <built-site-dir>` measures documented checks; `--static-only` explicitly skips the browser. Exit 2 means a requested measurement could not finish. The instrument has portfolio-derived assumptions and does not replace a domain-specific or visual review. Report unmeasured states, false positives, and unsupported stacks instead of converting them into a pass. See [self-check](references/self-check.md) and [visual review](references/visual-review.md).

Keep real identities, private materials, credentials, and unlicensed third-party content out of shared examples. Deliver source and preview within the user's authorization; distinguish local checks, real browser interaction, installation discovery, and public release.
