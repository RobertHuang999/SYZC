---
name: vitamin-prototype-annotation
description: Low-intrusion product-logic annotation workflow for existing prototypes and frontend projects. Use when Codex needs to add, initialize, update, or export page-level business annotations for already-built HTML, React, Vue, SPA, admin-system, Axure-like, Figma-exported, or static prototype pages by reading business PRDs, mapping requirements to UI elements, injecting a lightweight annotation runtime, and writing separate Markdown annotation documents without polluting the original PRD or business code.
---

# Vitamin Prototype Annotation

## Core Principle

Treat annotations as an external explanation layer, not as business UI. Keep the original prototype and business PRD clean. Add only the smallest required runtime hook, selector hints, and annotation documents.

Maintain one current annotation set for the current prototype. Update Markdown blocks in place; the runtime must display only the latest rules. Do not create or maintain changelogs, version folders, or historical annotation copies unless the user explicitly asks for them. Keep a readable `来源` line in each Markdown block and retain `sourceRefs` in configuration so current annotations can point back to the current PRD files and sections.

The page annotation runtime is strictly read-only. Never add annotation editing, drafts, save APIs, or browser-to-Markdown write-back. Annotation content is changed only by editing Markdown files directly or by asking Codex to update them.

Use this skill for two workflows:

- Initialization: existing page or prototype has no annotation layer yet.
- Incremental update: annotation layer already exists and PRD, page code, or annotation content changed.

If the user does not clearly request initialization or update, ask which workflow to run before editing files.

## Required Inputs

Before generating annotations, discover these inputs in the target project:

- Existing prototype implementation: static HTML, React/Vite/Next, Vue/Nuxt, plain SPA, or other frontend output.
- Business PRD files: search for `prd.md`, `PRD.md`, `requirements.md`, `docs/**/*.md`, product docs, or user-specified files.
- Existing annotation files: search for `annotations/**/*.md`, `**/annotations/**/*.md`, `annotation.config.json`, `annotation.workspace.json`, `annotation-kit`, or prior runtime injection.
- Available run command: inspect `package.json`, static `index.html`, or documented scripts.
- Deployment target: determine whether the user needs local-only use, static cloud viewing, cloud collaboration, or Git-reviewed annotation updates.

Never assume the current demo structure exists in the target project.

## Low-Intrusion Strategy

Choose the least invasive viable integration:

1. Zero-source-change mode: use bookmarklet, extension, or browser-injected runtime when source files cannot be edited.
2. One-line runtime mode: copy `assets/annotation-kit/` into the project and add one script/link pair to the HTML entry.
3. Selector-hint mode: add only stable `data-anno` attributes to key UI modules when selectors are unstable.
4. Component integration mode: use framework code only when the page cannot be reliably annotated from DOM selectors.

Do not rewrite UI components to support annotations. Do not move layout nodes. Do not couple annotation state to business state.

## Annotation Directory Decision

Choose the annotation document directory in this order:

1. Use the directory explicitly specified by the user.
2. If existing annotation Markdown files are found, keep using that directory.
3. If a main business PRD is found, create an `annotations/` folder beside that PRD.
   - Example: `docs/prd.md` -> `docs/annotations/`
   - Example: `requirements/product/prd.md` -> `requirements/product/annotations/`
4. If multiple PRDs exist, keep each module's annotation source beside its relevant PRD. Add one `annotation.workspace.json` at their nearest practical common annotation parent to aggregate compilation; do not move all module files into one directory merely to share a runtime.
5. If no PRD location is discoverable, create `annotations/` at the target project root and state this fallback in the final response.

Never hard-code a global path such as `docs/annotations/` unless that is the directory selected by the above rules.

## History Is Explicit Only

Do not create `changelog.md` or `versions/` by default. The business PRD and requirement documents retain the change history; annotations only explain the current page. If the user explicitly asks for annotation restore points or audit history, keep them inside the selected annotation directory and exclude them from default runtime input.

## Source And Runtime Separation

Treat annotation Markdown files as authoring source and `annotation.bundle.json` as the deployable read-only artifact. Do not require source PRDs or source annotation Markdown to be publicly served.

Use this mapping:

- Each module's `annotation.config.json` stores its `scope`, page, target selector, `markdownFile`, `blockId`, and requirement source references.
- `annotation.workspace.json` optionally aggregates multiple module configs into one runtime bundle while allowing each module to keep local numbering such as `1`, `2`, `3`.
- The Markdown file stores one or more blocks delimited by `<!-- anno:start id=... -->` and `<!-- anno:end id=... -->`.
- `scripts/compile_annotations.py` validates the mapping and compiles Markdown blocks into `annotation.bundle.json`.
- Runtime reads the bundle, renders matching badges/popups, and refreshes the deployed bundle without writing source files.

Use inline `markdown` only for tiny demos or legacy fallback. For real projects, compile external Markdown before browser verification and deployment.

## Read-Only Boundary

The runtime only reads and presents annotations:

- Local changes: the user edits annotation Markdown directly, or Codex updates it in the workspace.
- Published changes: commit and deploy the changed Markdown through the project's normal release flow.
- Browser behavior: read the compiled bundle, render badges/popups, refresh content, view all annotations, and download/export.

Never add an edit button, Markdown editor, `contenteditable`, textarea editor, draft storage, `saveEndpoint`, persistence adapter, authentication, or annotation write API to the page runtime. Export is a read-only delivery action, not an editing workflow.

## Mermaid Support

Support Mermaid as optional Markdown enhancement:

- Render fenced blocks written as ```` ```mermaid ````.
- If `window.mermaid` already exists, reuse it.
- If `annotation.config.json` provides `mermaid.src`, load that script before rendering diagrams.
- If Mermaid is unavailable, show the Mermaid source as a readable code block rather than failing the annotation popup.
- Do not require internet CDN access by default; prefer a local Mermaid asset when projects need offline reliability.

## Workflow A: Initialization

1. Inspect the project type and entry point.
   - React/Vite/SPA: inspect `package.json`, `src`, and root `index.html`.
   - Static HTML: inspect each relevant `.html` file.
   - Built output only: prefer runtime injection or bookmarklet mode.
2. Read business PRDs and extract all page-relevant logic.
   - Preserve business rules, field rules, states, roles, exceptions, and flow relations.
   - Do not summarize away implementation-critical details.
   - For form pages, separately extract field constraints and page-global handling such as mode entry, save or submit boundaries, validation scope, success return, and unsaved-leave handling.
   - Do not infer generic component behavior when the PRD does not make it business-specific.
3. Open or run the page and build a DOM target inventory.
   - Prefer stable module targets over every small element.
   - Record target label, selector candidates, visible text, role, page path, and visibility state.
   - For a modal, drawer, popover, accordion or tab panel, record the action that reveals it and inspect the target after it is visible.
4. Aggregate requirements by UI module.
   - One closely related module gets one annotation badge.
   - Filter bars, table operations, tabs, forms, modals, drawers, field groups, and batch tools are typical modules.
   - Add one page-global badge only when cross-field rules would otherwise be scattered across field groups; do not add it to ordinary display-only pages.
5. Write separate annotation Markdown files.
   - Store them in the selected annotation directory from "Annotation Directory Decision".
   - Add stable source requirement ids and map them through each annotation's `sourceRefs`.
   - Add a readable `来源：{PRD文件或章节}` line near the top of every block.
   - Create or update `changelog.md` only when annotation history is explicitly requested.
   - Keep business PRD unchanged.
6. Generate or update each module's `annotation.config.json`.
   - Assign a stable lowercase kebab-case `scope` and map each annotation id to page path, target selector, module name, `markdownFile`, and `blockId`.
   - When one deployed runtime covers multiple module configs, add or update a project-level `annotation.workspace.json` instead of manually merging module configs.
7. Compile and validate the read-only bundle.
   - Single module: run `scripts/compile_annotations.py <config> --output <public-runtime-dir>/annotation.bundle.json --coverage <annotation-dir>/coverage.md`.
   - Multiple modules: run the same command with `<workspace>`; workspace output, coverage, and optional `htmlOutput` may be declared in the manifest.
   - Do not continue with unmapped source requirements, duplicate ids, missing blocks, or missing selectors.
8. Install runtime with the smallest integration.
   - Use `scripts/install_annotation_kit.py` when copying bundled runtime assets is appropriate.
   - Existing project config must be preserved unless the user explicitly requests replacement.
9. Verify in browser.
   - Badges are positioned by absolute/fixed overlay, not by changing business layout.
   - Verify the initial mode matches `runtime.initialMode`; use `"preview"` by default and `"annotate"` only when badges should appear on first load.
   - Verify hidden modules do not render corner badges before reveal, then open each relevant module and verify its badge appears on the correct visible target.
   - Popups are clickable, draggable, resizable, read-only, and isolated from page events.
   - Markdown renders headings, lists, blockquotes, emphasis, inline code, and tables.
   - Initial mode is visibly `preview`; switching mode shows a toast.
   - Runtime refresh performs a no-cache bundle read, updates open popups, and removes deleted annotations without reloading the business page.

## Workflow B: Incremental Update

1. Compare current PRD/page/annotation files.
2. Classify changes as added, modified, deleted, or moved.
3. Update only affected annotation Markdown blocks and selector mappings.
   - Keep field-group blocks concise but preserve PRD-defined requiredness, editable conditions, defaults, range, length, precision, format, uniqueness, and validation timing.
   - Keep save, submit, return, mode, and dirty-form handling in the page-global block when one exists instead of repeating them in every field block.
   - Refresh each affected block's readable `来源` line and its configured `sourceRefs` against the current PRD.
4. Keep runtime styles, badge shape, offsets, and popup behavior unchanged unless the user explicitly asks for visual changes.
5. Remove stale badges only when their target module or requirement is truly removed.
6. Preserve supplemental annotation ids.
7. Recompile the owning module config or project workspace, then regenerate the bundle, coverage matrix, and configured HTML output before browser verification.

## Identifier Rules

Use stable ids rather than implying priority:

- Auto-generated initial annotations: `1`, `2`, `3`.
- Supplemental annotations: `A1`, `A2`, `A3`.
- Nested additions under a known module: `1a`, `1b` only when the user wants explicit relationship to an existing module.

Display ids are local to a module. The compiler creates the runtime key as `scope:id`, so `product:1` and `purchase:1` may coexist while both page badges display `1`. View-all and exported documents use `scope:id` to remain unambiguous.

When exporting all annotations, sort by page order first, then DOM order, then id.

## Selector Rules

Use selector priority:

1. Existing `data-anno`
2. Existing stable `data-testid`, `id`, `aria-label`, `name`, `role`
3. Stable semantic selector plus visible text fingerprint
4. Stable class selector
5. Generated CSS path as a temporary fallback

If no selector is stable, add one `data-anno` to the module root. Keep the attribute descriptive, such as `data-anno="product-filter-bar"`.

Read `references/integration-patterns.md` before modifying a new project type. Read `references/annotation-authoring.md` before generating or updating annotation content. Read `references/collaboration-deployment.md` before implementing local/cloud collaboration.

## Bundled Resources

- `assets/annotation-kit/runtime.js`: framework-neutral annotation overlay runtime.
- `assets/annotation-kit/runtime.css`: annotation badge, popup, and Markdown rendering styles.
- `assets/annotation-kit/annotation.config.json`: config template.
- `assets/annotation-kit/annotation.schema.json`: config schema.
- `assets/annotation-kit/annotation.workspace.json`: multi-module compilation manifest template.
- `assets/annotation-kit/annotation.workspace.schema.json`: workspace manifest schema.
- `scripts/compile_annotations.py`: validates source coverage and compiles a deployable read-only bundle.
- `scripts/install_annotation_kit.py`: copies runtime assets into a target project and can inject script/link tags into HTML entries.

## Validation Checklist

Before final response, verify:

- The selected workflow was initialization or update.
- Business PRD was not polluted with page annotation content.
- Annotation Markdown is separate and complete enough for developers.
- Runtime annotations represent the current prototype only; every block has a readable source line and valid `sourceRefs`.
- Form pages with cross-field processing have one page-global annotation; field-group annotations preserve the PRD-defined core constraints without expanding generic component conventions.
- Every declared source requirement maps to at least one annotation, or the user explicitly accepted an unmapped item.
- Compiled bundle contains no source PRD content outside mapped annotation blocks.
- Same module does not receive redundant badges.
- Runtime injection is minimal for the project type.
- Multiple modules sharing one runtime compile through a workspace manifest; no hand-merged config is required.
- Badges do not alter layout.
- Popup placement leaves the badge column clickable, and `runtime.zIndexBase` resolves host stacking conflicts without changing host styles.
- Popups support click-to-open, close button, drag, resize, read-only export, and event isolation.
- Runtime contains no edit controls, browser drafts, save endpoint, or write-back path.
- Runtime refresh re-reads the deployed bundle and reconciles existing badges and open popups.
- Configured `page` or `routeMatcher` matches the browser route; for a static one-page prototype, use `page: "*"`.
- Optional standalone HTML output contains rendered Markdown rather than raw source text.
- Markdown preview renders tables, nested ordered/unordered lists, task lists, headings, blockquotes, links, emphasis, and inline code.
- Build or browser verification ran, or the reason it could not run is stated.
