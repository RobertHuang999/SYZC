---
name: mobile-prototype-annotation
description: Build, refine, or validate an interactive mobile or H5 prototype annotation workspace from product requirements, page lists, business rules, API contracts, and reference screenshots. Use when the work needs a left page directory, center phone preview, right PRD/API annotation panel, linked highlighting, mock data, responsive phone sizing, or local browser verification.
---

# Mobile Prototype Annotation

Build a real, runnable mobile/H5 prototype and its annotation workspace. Use the user's language for visible copy and keep product-specific data configurable rather than hardcoded into the workflow.

## Workflow

1. Inspect the current project before editing. Identify the framework, entry point, existing components, styling conventions, scripts, and run commands. Preserve unrelated user changes.
2. Read all supplied requirements, page lists, rules, API contracts, and screenshots. Extract the page hierarchy, primary mobile modules, interaction states, and visual anchors before coding.
3. Decide whether to extend the existing app or create the smallest local frontend that can run. Prefer existing project patterns and dependencies.
4. Model pages as configuration data. Keep page metadata, mobile content, mock data, rules, API contracts, and annotation targets in one structured model. Do not duplicate a complete renderer for every page.
5. Implement the workspace with three coordinated regions:
   - left: numbered page and business-flow directory;
   - center: interactive phone preview and board-size controls;
   - right: current-page PRD rules, field notes, and RESTful API contracts.
6. Mark every annotated prototype region with a stable target ID such as `metrics`, `quick-actions`, `product-list`, or `sales-form`. Use the same ID on the related rule card and any target metadata.
7. Implement two-way linking:
   - selecting a rule highlights and scrolls to the matching mobile region;
   - selecting a mobile region highlights or scrolls to its matching rule;
   - page navigation updates the directory, phone screen, rules, and page identifier together;
   - board-size changes and mock reset do not reload the page.
8. Render real interface states, not empty placeholders. Include the controls relevant to the product, such as cards, lists, forms, charts, empty/loading/error states, tabs, dialogs, or quick actions.
9. Make the phone board scale as one unit. Support 375px, 390px, and 414px logical board widths by default. Preserve the selected board's aspect ratio; when the viewport is short, scale width and height together so the phone frame, content, and bottom tab bar remain coherent.
10. Keep desktop regions independently scrollable. Long annotation content must not stretch the whole app outside the viewport. On narrow screens, hide the page directory when appropriate, stack the preview and annotations, and prevent horizontal overflow.
11. Verify the rendered result in a browser when the app can run locally. Inspect both a desktop viewport and a narrow/mobile viewport. Check console errors, overflow, target highlighting, page switching, board sizing, and mock reset.
12. Start the local preview server when the project supports it and report the URL, changed files, and verification results.

## Layout and visual baseline

- Use a restrained product-workbench visual language: light gray-blue workspace, white panels, blue primary accent, and limited green/red status colors.
- Keep the left directory, center preview, and right annotation panel visually distinct without nesting page sections inside decorative cards.
- Use compact headings and readable body text. Avoid marketing-style hero sections.
- Use stable dimensions for the phone frame, toolbar, tabs, counters, and controls so text or hover states cannot shift layout.
- Remove browser-default button styling where it conflicts with the design. Use familiar icons or icon-plus-text controls for actions.
- Match screenshots by measuring viewport, column widths, phone bounds, toolbar bounds, and key internal sections. Treat visual comparison as an iterative verification loop.

## Annotation content

For each page, present:

- page purpose and scope;
- business flow steps;
- module or field rules;
- interaction and validation rules;
- role or permission notes when supplied;
- API method, path, purpose, authentication, parameters, response example, and important error states.

Use a dark code block with readable JSON highlighting for API examples. Keep the annotation panel content data-driven and independently scrollable.

## Input handling

Use supplied information in this order when sources conflict:

1. explicit user requirements;
2. reference screenshots and visual measurements;
3. existing application behavior and conventions;
4. sensible mock data clearly labeled as mock data.

If requirements are incomplete, make conservative assumptions and record them in the final summary. Do not invent real credentials, production endpoints, or sensitive data.

Read [data-schema.md](references/data-schema.md) when defining page configuration, target IDs, rules, or API contracts. Read [verification.md](references/verification.md) before final browser verification.

## Completion criteria

Consider the task complete only when:

- the requested mobile pages render as a usable prototype;
- the left directory, center phone preview, and right annotations stay synchronized;
- target IDs provide reliable two-way highlighting;
- 375px, 390px, and 414px board modes preserve aspect ratio;
- desktop and narrow layouts do not have unintended horizontal overflow;
- the local preview works, or the blocking environment issue is reported clearly;
- the final response names the files changed, preview URL, tested interactions, and remaining mock/API boundaries.
