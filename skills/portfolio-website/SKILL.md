---
name: portfolio-website
description: Compatibility entry for existing portfolio-website users. Design, build, or redesign websites and web interfaces for the actual audience, task, content, identity, and constraints. The current primary Skill name is ui-design.
---

# UI Design

Design an interface for the actual people, content, and task. Brand expression, an efficient operational workflow, a purchasing decision, and a portfolio reading path call for different structures. Do not reuse a signature layout, palette, card treatment, or motion vocabulary by default.

[中文指南](references/zh-CN/overview.md)

## Understand the job

Identify the audience, primary task and next action, content or data available, brand and accessibility requirements, existing stack, devices, operational constraints, and what is real or simulated. Inspect the existing product and use confirmed context. Ask only about consequential gaps and continue independent work.

Read [application design](references/application-design.md) for decision paths and state models for brand, commerce, dashboards, AI products, and portfolios. These examples are starting points, not style presets. A particular industry can support several valid directions. For portfolios, use [content and evidence](references/content.md), [adaptive structure](references/structure.md), [media and navigation](references/images-and-links.md), and [fictional demonstrations](references/demo-projects.md) as relevant.

## Research and choose a direction

When references shape a decision, follow [reference research](references/reference-research.md) to a specific case, live site, component, or official implementation. Record the source, what was actually seen or operated, the principle, adaptation, and how the adaptation will be checked. Mark blocked, login-only, recorded-video-only, or untested behavior clearly. Do not claim a source's license covers assets or code without checking the actual terms.

Define a visual direction from the user's purpose and material: hierarchy, layout, type, color roles, media, density, control geometry, and motion. Interpret words such as "premium" through the intended audience, brand and use, rather than as a fixed palette, amount of whitespace, or visual effect. For an open brief, consider materially different ways to organize the first action, content and media before choosing; follow an explicit direction or existing identity when supplied. Check for repeated composition, headline cadence, decorative motif, type pairing and motion across unrelated work, not just repeated colors. Select the direction that suits this brief, not one chosen simply to look different. Write a proportionate DESIGN.md recording choices, real inputs, uncertain assumptions, breakpoints, component states, and checks. Compare the result with another relevant build: differences must include information architecture and user task where those differ, not merely colors or job titles. An existing product family may intentionally share its design system.

The existing portfolio-focused references, including [visual direction](references/visual-direction.md), [surfaces](references/surfaces.md), [spatial construction](references/spatial-construction.md), and the older [portfolio visual review](references/visual-review.md), are case studies, not universal formulas or pass/fail gates. For instance, sampled artifact colors, a single focal object, a fixed heading length, asymmetry, large gaps, layered shadows, or showpiece motion are choices only when they serve this project. Do not reshape a product to satisfy an inapplicable portfolio heuristic.

## Build the real task and its states

Start with the primary route and truthful content. Controls should do what their labels say. Model the reachable empty, populated, loading, success, error, disabled, recovery, and stale states that apply; use real progress and cancellation only when actual work supports them. Keep filters, detail views, charts, totals, visible output, and exports consistent. For model interfaces, distinguish a local prototype, mock response, and a connected model; never imply a model request was made when it was not.

Use [interaction and motion](references/interaction-motion.md) when shaping animation or expressive interaction. Motion can provide feedback and continuity, or create atmosphere, delight and brand character. When a brief calls for expressive motion, implement visible, considered effects; when the task calls for quiet or efficiency, use a different treatment. Select and adapt techniques to the audience and interaction rather than imposing a fixed effect or limiting every site to portfolio conventions.

Read [component anatomy](references/component-anatomy.md), [interaction states](references/interaction-states.md), [motion choreography](references/motion-choreography.md), and [responsive construction](references/responsive-construction.md) selectively as portfolio-derived examples. Apply their observations only when the component, state and purpose make them relevant. Preserve keyboard focus, touch alternatives, native navigation, adequate contrast and reduced-motion behavior.

## Verify and hand over

After the final code edit, run the actual product and inspect it visually with its real copy and data at desktop and phone sizes, plus relevant intermediate or user-reported widths. Check script syntax, capture initial-load browser errors, and confirm that expected dynamic content actually renders; then exercise the primary task, navigation, error and recovery paths, keyboard, touch, and reduced motion as applicable. Repeat affected checks after subsequent edits. If a required browser or interaction cannot be tested, report it as unverified. Compare screenshots for hierarchy, clipping, obstruction, typography, density, and whether the design suits the brief. An automated pass does not judge visual quality.

Use [general visual review](references/general-visual-review.md) to assess whether execution suits the actual task, brand, audience and content. For a compatible built static site, the optional `node scripts/selfcheck.mjs <built-site-dir>` measures documented checks; `--static-only` explicitly skips the browser. Exit 2 means a requested measurement could not finish. The instrument has portfolio-derived assumptions and does not replace a domain-specific or visual review. Investigate each finding for applicability; fix confirmed defects and explain inapplicable heuristics, rather than treating every flagged style as a universal defect. Report unmeasured states, false positives, and unsupported stacks instead of converting them into a pass. See [self-check](references/self-check.md).

Keep real identities, private materials, credentials, and unlicensed third-party content out of shared examples. Deliver source and preview within the user's authorization; distinguish local checks, real browser interaction, installation discovery, and public release.
