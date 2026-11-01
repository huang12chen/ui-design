# Design for the application

[简体中文](zh-CN/application-design.md)

Start with the decision a person is trying to make. These examples describe tasks and checks, not mandatory styles or page recipes. Existing identity, research, content and the user's direction take precedence.

| Application | Core questions | Useful structures to explore | States and verification |
| --- | --- | --- | --- |
| Brand or service | What is offered, for whom, and what makes it credible? | Editorial story, product-led demonstration, campaign, catalogue, or a concise service overview | Navigation and CTA lead to the promised place; media and type remain readable on small screens; no invented clients or endorsements |
| Shop | Can a visitor identify, compare, select and understand the cost of a product? | Searchable catalogue, curated collection, detailed product view or guided comparison | Selection, unavailable variant, cart quantity, totals, empty cart, removal and any actual checkout; disclose when checkout is only a demo |
| Dashboard or operations | What decision or action is due now, and what evidence supports it? | Table and detail, overview to drill-down, status board, timeline, or map | Period, units, filters, charts and rows use the same data; check empty results, loading/error, keyboard access and narrow table access |
| AI product | What can the system do, what will it use, and can the user inspect and revise the result? | Contextual editor, conversation, review queue, structured generator, or mixed workflow | Editable starters, input validation, current output, real progress/cancel if supported, failure/retry, stale output and export consistency; distinguish a template or mock from a live model |
| Portfolio | What did this person do, and what evidence can the reader inspect? | Curated index, continuous story, detailed case, archive, or another form suited to the work | Honest contribution, source and outcome; directly reachable work, mobile media, case return, contact and privacy |

## Derive the visual system

Describe the primary task, its information objects, and the first meaningful action. Choose hierarchy and density from those objects: a table for comparing orders has different constraints from a campaign image or an editable document. Define color *roles*, type roles, spacing, grids, surface treatment and control geometry; use concrete values and record why they fit. Test the longest real labels, mixed scripts, data units, color contrast, focus and image proportions. Do not copy the identity or signature composition of a reference.

When comparing directions, look at the navigation model, first screen, density, rhythm, type, media, surface, and interaction together. Different products may deliberately share a design system; distinct products should not become identical by accident. A palette or a person's job title alone does not prove distinctness.

For an open brief with room to explore, sketch at least two plausible *structures* before committing: what appears first, what the user acts on, how content is grouped, and what visual material carries the idea. For example, a collection-first shop, an object-focused product story, and a guided comparison make different choices even if they sell the same thing. Choose for the actual task and identity, not for novelty alone; an existing design system or explicit direction can make exploration unnecessary. Compare with recent work: repeated split heroes, the same headline cadence, decorative symbols, type pairing, card shape, and motion can create a house signature even when the colors differ. Change the underlying decisions when they do not fit this brief, and preserve familiar patterns when they help the user.

## Choose interaction by its purpose

| Pattern | Useful when | Implementation and checks |
| --- | --- | --- |
| Inline reveal or drawer | Context should stay visible while inspecting or editing | Keep the initiating control discoverable; provide an explicit close, Escape, focus restoration and appropriate scroll behavior; test long content and touch |
| Filters and linked visualizations | Users compare a shared scope across numbers and records | One state drives labels, totals, chart and rows; expose period and unit; verify rapid changes, empty results and a non-hover way to inspect data |
| Suggested prompts | An open-ended input needs a useful starting point | Insert editable text or clearly initiate the named action; preserve user edits and make output provenance and limitations clear |
| Compare slider | A before/after comparison is meaningful | Use an accessible range control and the same aligned image dimensions; test keyboard, touch, labels and endpoints |
| Shared transition | Continuity helps users follow a move from list to detail | Keep routes and Back usable without the transition; avoid duplicated content, moving hit targets, and missing reduced-motion fallback |
| Drag, long press, wheel or gesture | Direct manipulation substantially helps a task | Offer a visible button, input or keyboard path; allow cancellation, preserve state, and do not make a gesture the only way to act |
| Material, depth, glass, 3D or ambient motion | It supports a brand or explains a real object or relationship | Budget load and motion, keep text legible over changing backgrounds, provide a static fallback, and test mobile, low performance and reduced motion |

Animation is not proof of feedback. Check the input, the state before and after, whether the result is real, and what happens when an action is repeated, interrupted, fails or is cancelled. A visual press is not a claim of physical haptics. Use composition events for text input: do not submit while an input method is composing; test actual browsers and languages rather than installing a fixed post-composition delay as a universal rule.

## Prototype boundaries and testing

Label fictional brands, synthetic data and local template output where readers encounter them. Do not invent a payment, backend update or model response. If result-driving inputs change, either regenerate the result or visibly mark it stale and prevent a misleading export. A chart, summary and table should agree on the same selected data.

Verify each actual product route at desktop and mobile sizes. Operate the main task and relevant failure/recovery path, including keyboard and touch alternatives. Inspect intermediate motion and overlays, not only the final frame. Keep a concrete visual review separate from the automated results: both can reveal issues the other misses.
