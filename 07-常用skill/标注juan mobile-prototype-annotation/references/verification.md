# Verification Checklist

Use this checklist after implementation and after meaningful visual changes.

## Functional checks

- [ ] Selecting a page updates the left active item, phone title/content, right page ID, and rules.
- [ ] Selecting a rule highlights the matching phone target and scrolls it into view.
- [ ] Selecting a phone target highlights or scrolls to the matching rule.
- [ ] Switching between 375px, 390px, and 414px changes the board mode without reloading.
- [ ] Board width and height keep the same aspect ratio at every viewport size.
- [ ] Mock reset returns the default page and data state.
- [ ] Relevant phone controls work without navigating away unexpectedly.

## Layout checks

Test at minimum:

- a wide desktop viewport around 2048x1035;
- a common desktop viewport around 1280x720;
- a narrow viewport around 390x844.

Check:

- [ ] Phone frame, toolbar, and bottom tab bar remain coherent.
- [ ] Long annotation content scrolls inside the annotation panel.
- [ ] The full document does not gain unexpected horizontal overflow.
- [ ] Narrow layout does not clip the phone preview or board controls.
- [ ] Text stays inside its parent controls and cards.
- [ ] No browser-default borders or focus states disrupt intended controls.

## Browser checks

- [ ] Capture a fresh screenshot after reload at each test viewport.
- [ ] Read console errors after the main interaction pass.
- [ ] Verify the local URL responds from the project directory.
- [ ] Reset temporary viewport overrides before finishing.

If a check cannot run because the environment blocks a server, browser, or dependency, report the exact check and blocker instead of claiming success.
