# Signed-Out Screen Redesign Specification

**Status:** Approved for implementation planning
**Approved:** July 22, 2026
**Implementation status:** Not started
**Suggested file:** `docs/signed-out-screen-redesign-spec.md`
**Target slug:** `signed-out-screen-redesign`

---

## 1. Purpose

Redesign the Daily Planner signed-out screen so it feels polished, visually consistent with the signed-in application, and clearly communicates the product before the user signs in.

The redesigned screen will combine:

* a clear Google authentication area;
* a product showcase carousel using real Daily Planner screenshots;
* responsive desktop and mobile layouts;
* refined but restrained carousel animations;
* the existing light and dark theme behavior.

This is a focused signed-out-screen UI improvement. It must not change authentication architecture, task persistence, Quick Ideas persistence, Firebase configuration, or signed-in application behavior.

---

## 2. Source-of-Truth Priority

Use these sources in the following order.

### 2.1 Functional behavior

The current application code is authoritative for:

* Firebase Authentication;
* Google popup sign-in;
* authentication loading state;
* authentication error behavior;
* emulator behavior;
* theme persistence;
* signed-in and signed-out gating.

The redesign must preserve these behaviors.

### 2.2 Layout and composition

The final desktop and mobile mockups define the approved composition:

```text
docs/design/signed-out-screen/mockups/
├── signed-out-desktop-final.png
└── signed-out-mobile-final.png
```

The mockups define:

* authentication-content placement;
* desktop two-column composition;
* mobile stacked composition;
* carousel position;
* relative visual hierarchy;
* general spacing direction.

The mockups are not authoritative for AI-invented interface details.

### 2.3 Carousel content

The real Daily Planner screenshots define the exact application content shown inside the carousel:

```text
docs/design/signed-out-screen/source-screenshots/
```

The application must use the optimized production assets:

```text
public/auth-showcase/
├── desktop-dashboard.webp
├── desktop-today.webp
├── desktop-youtube-task.webp
├── desktop-quick-ideas.webp
├── mobile-dashboard.webp
├── mobile-today.webp
├── mobile-youtube-task.webp
└── mobile-quick-ideas.webp
```

### 2.4 Visual system

The current Daily Planner application is authoritative for:

* logo treatment;
* typography;
* colors;
* design tokens;
* borders;
* border radii;
* shadows;
* theme toggle;
* focus styles;
* button behavior;
* light and dark mode.

Do not create a separate visual system for the signed-out screen.

---

## 3. Approved Product Decisions

The following decisions are approved:

1. Desktop uses a two-column layout.
2. Authentication content appears on the left.
3. The product showcase carousel appears on the right.
4. Mobile stacks authentication above the carousel.
5. The carousel contains four slides.
6. The default slide is Dashboard.
7. The carousel does not auto-advance.
8. Desktop shows the active screen with previous and next screens partially visible behind it.
9. Mobile shows one primary screen with at most a narrow neighboring-screen preview.
10. Users can navigate with arrow buttons and navigation dots.
11. Desktop keyboard navigation uses Left Arrow and Right Arrow while the carousel is focused.
12. Mobile supports horizontal swipe when it can be implemented without adding a package.
13. Carousel changes use a restrained slide, scale, and fade transition.
14. The default animation duration is approximately 400 milliseconds.
15. Reduced-motion users receive an instant change or short fade without sliding or scaling.
16. The Google sign-in action remains the primary interactive element.
17. The carousel is controlled entirely by the user.
18. Real WebP screenshots are used without redrawing their contents.
19. No new npm package is introduced.
20. Authentication behavior remains functionally unchanged.

---

## 4. Scope

### 4.1 Included

This task includes:

* redesigning the signed-out authentication screen;
* desktop and mobile responsive layouts;
* product showcase carousel;
* four real Daily Planner product slides;
* arrow navigation;
* dot navigation;
* keyboard navigation;
* mobile swipe where practical;
* carousel slide title and caption;
* carousel transition animations;
* reduced-motion behavior;
* light and dark mode;
* authentication pending and error presentation;
* responsive and accessibility verification.

### 4.2 Explicitly excluded

Do not include:

* changes to Firebase Authentication providers;
* changes to Google popup behavior;
* email/password authentication;
* account registration forms;
* password reset;
* guest mode;
* demo mode;
* changes to signed-in Planner screens;
* task or Quick Idea cloud behavior;
* Phase 6D implementation;
* changes to Firestore;
* changes to Firebase Rules;
* new routes;
* a marketing navigation bar;
* testimonials;
* pricing;
* feature comparison tables;
* promotional sections;
* stock imagery;
* decorative illustrations;
* a fake browser or phone frame;
* autoplaying carousel behavior;
* video backgrounds;
* new animation packages;
* major redesign of the existing application theme.

---

## 5. Content

### 5.1 Brand

Display the existing Daily Planner brand and logo using the application’s current treatment.

Do not use a Gemini-invented logo.

### 5.2 Authentication copy

Use the following approved copy:

**Eyebrow**

> PLAN WITH CLARITY

**Headline**

> Your day, organized everywhere.

**Supporting text**

> A private cross-device workspace for your tasks and Quick Ideas, synced through your own Google account.

**Primary action**

> Continue with Google

**Security note**

> Secure sign-in powered by Google.

Minor punctuation adjustments are allowed if meaning remains unchanged.

### 5.3 Theme control

Display one theme toggle in the page header.

Do not place a second theme toggle inside the authentication area.

Use the existing theme control or its current visual language.

---

## 6. Carousel Slides

Use four slides in this order.

### Slide 1 — Dashboard

**Desktop asset**

```text
/auth-showcase/desktop-dashboard.webp
```

**Mobile asset**

```text
/auth-showcase/mobile-dashboard.webp
```

**Title**

> Dashboard overview

**Caption**

> See your tasks, ideas, and daily progress in one place.

### Slide 2 — Today

**Desktop asset**

```text
/auth-showcase/desktop-today.webp
```

**Mobile asset**

```text
/auth-showcase/mobile-today.webp
```

**Title**

> Plan your day

**Caption**

> Organize today’s priorities and keep important work visible.

### Slide 3 — YouTube Learning

**Desktop asset**

```text
/auth-showcase/desktop-youtube-task.webp
```

**Mobile asset**

```text
/auth-showcase/mobile-youtube-task.webp
```

**Title**

> Learn with focus

**Caption**

> Watch videos, save progress, and create timestamped notes.

### Slide 4 — Quick Ideas

**Desktop asset**

```text
/auth-showcase/desktop-quick-ideas.webp
```

**Mobile asset**

```text
/auth-showcase/mobile-quick-ideas.webp
```

**Title**

> Capture Quick Ideas

**Caption**

> Save thoughts quickly and expand them when you are ready.

---

## 7. Desktop Layout

### 7.1 Page shell

At desktop widths:

* show the Daily Planner brand in the upper-left;
* show one theme toggle in the upper-right;
* place the main content beneath the header;
* use a two-column layout;
* keep the authentication area visually clear;
* make the showcase visually dominant without overpowering sign-in.

The layout should fit comfortably at approximately `1440 × 900`.

### 7.2 Authentication column

The left column contains:

1. eyebrow text;
2. headline;
3. supporting description;
4. Continue with Google button;
5. security note.

The Google button must:

* be the strongest interactive element;
* include the recognizable multicolor Google icon;
* have a generous touch/click height;
* have clear hover, active, disabled, and focus-visible states;
* show a pending state during authentication;
* prevent duplicate sign-in attempts.

### 7.3 Showcase column

The right column contains:

* previous arrow;
* layered carousel frames;
* next arrow;
* slide title;
* slide caption;
* four navigation dots.

The active screenshot should be large enough to communicate the application.

Inactive neighboring screenshots:

* remain partially visible;
* use a smaller scale;
* use reduced opacity;
* have lower visual emphasis;
* sit behind the active slide.

Do not place screenshots inside fake browser chrome, laptop frames, or phone frames.

---

## 8. Mobile Layout

At mobile widths:

* retain the Daily Planner brand and theme toggle;
* stack the authentication content first;
* place the carousel below the authentication area;
* keep the Google button visible before the carousel;
* allow vertical page scrolling when needed;
* use comfortable horizontal padding;
* maintain readable text and touch targets.

The carousel should:

* display one large active mobile screenshot;
* use a plain rounded rectangular app frame;
* avoid a fake phone bezel;
* show only a narrow edge of the neighboring slide when space permits;
* hide neighboring previews when they create clutter;
* place dots beneath the screenshot;
* keep arrows touch-friendly if displayed;
* use approximately `280–320px` of visible screenshot height where practical.

The implementation must not invent a mobile bottom navigation bar or alter the screenshots.

---

## 9. Carousel Interaction

### 9.1 Navigation methods

Support:

* previous arrow;
* next arrow;
* clickable navigation dots;
* Left Arrow and Right Arrow keyboard controls while the carousel region is focused;
* horizontal swipe on mobile when practical without a dependency.

Navigation wraps:

* Next from slide 4 moves to slide 1.
* Previous from slide 1 moves to slide 4.

### 9.2 No automatic movement

The carousel must not auto-advance.

It must not use:

* timers;
* autoplay;
* pause-on-hover logic;
* automatic slide changes after sign-in errors.

### 9.3 Focus behavior

The carousel region must be keyboard reachable.

Arrow and dot buttons must:

* use native button elements;
* have visible focus indicators;
* expose useful accessible labels;
* not interfere with normal page scrolling.

---

## 10. Animation

### 10.1 Desktop transition

Use a layered slide, scale, and fade transition.

The outgoing active screen:

* moves slightly toward the outgoing direction;
* scales from `1` toward approximately `0.94`;
* reduces opacity and shadow emphasis.

The incoming screen:

* moves from its neighboring position;
* scales from approximately `0.94` to `1`;
* increases opacity;
* receives the active border and shadow.

Inactive side screens may use approximately:

* scale: `0.88–0.92`;
* opacity: `0.35–0.5`;
* lower stacking order.

### 10.2 Timing

Use approximately:

* `400ms` for transform and primary movement;
* `250–300ms` for opacity and caption transitions.

Use a smooth ease-out curve such as:

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

The exact CSS may be adjusted during implementation if the resulting motion remains equivalent.

### 10.3 Supporting animation

Allowed:

* active dot changing from a circle to a short pill;
* subtle arrow hover movement of one or two pixels;
* subtle active-frame border emphasis;
* title and caption crossfade.

Do not use:

* spinning;
* card flipping;
* large perspective rotation;
* bouncing;
* constant floating;
* dramatic parallax;
* excessive glow;
* transitions longer than approximately 500ms.

### 10.4 Reduced motion

Under `prefers-reduced-motion: reduce`:

* remove slide movement;
* remove scaling;
* remove directional arrow movement;
* switch slides instantly or use a very short opacity fade;
* preserve every navigation method.

---

## 11. Screenshot Presentation

Use the supplied WebP assets as image content.

Requirements:

* do not redraw screenshot contents;
* do not replace text inside screenshots;
* do not overlay fake controls inside screenshots;
* do not crop away the core feature being showcased;
* do not stretch or distort the image;
* preserve image aspect ratio;
* use `object-fit` and `object-position` deliberately;
* keep screenshots non-interactive;
* prevent drag behavior if it interferes with swipe interaction.

Screenshots are decorative product demonstrations rather than interactive app instances.

Use suitable alternative-text handling:

* the active slide title and caption communicate the feature;
* redundant screenshot imagery may use an empty `alt` when the surrounding accessible carousel labeling provides equivalent meaning.

---

## 12. Authentication Behavior

Preserve the existing Google-only authentication flow.

The redesign must continue to support:

* Firebase Auth loading;
* Google popup sign-in;
* duplicate-submission prevention;
* pending button state;
* authentication error display;
* emulator sign-in behavior;
* signed-in Planner transition.

The primary button should show an appropriate pending label, such as:

> Signing in…

Authentication errors must remain visible and accessible.

Do not change authentication logic merely to match the mockup.

---

## 13. Theme Behavior

The signed-out page must work in both light and dark mode.

Requirements:

* use current app theme state;
* preserve current theme persistence;
* use existing design tokens where available;
* maintain identical layout and functionality in both themes;
* adjust surfaces, borders, shadows, and text for contrast;
* avoid hardcoding the entire design only for the dark mockup.

The approved dark mockup defines composition, not a dark-only feature requirement.

---

## 14. Accessibility

The redesigned screen must:

* use semantic headings;
* maintain a logical focus order;
* use real buttons for sign-in, arrows, and dots;
* have visible keyboard focus;
* provide accessible labels for carousel controls;
* identify the active slide;
* announce slide changes without excessive repetition;
* avoid relying on color alone;
* meet readable contrast requirements;
* support reduced motion;
* preserve usable touch targets on mobile.

Recommended carousel labeling:

> Slide 1 of 4: Dashboard overview

The carousel may use a polite live region for slide-title changes.

Do not announce all inactive slide contents on every transition.

---

## 15. Responsive Behavior

The implementation plan must determine exact breakpoints from the existing application.

Expected behavior:

### Large desktop

* two columns;
* layered three-position carousel;
* full authentication content;
* visible arrows and dots.

### Smaller desktop or tablet

* reduce screenshot overlap;
* reduce inactive-slide visibility;
* maintain readable active slide;
* preserve two columns while space allows.

### Mobile

* stacked layout;
* authentication first;
* one dominant screenshot;
* limited or hidden neighboring preview;
* vertical scrolling allowed;
* touch-friendly controls.

No horizontal page overflow is permitted.

---

## 16. Performance

Use the optimized WebP assets under:

```text
public/auth-showcase/
```

Requirements:

* do not load the large PNG/JFIF design references from `docs/`;
* preload or prioritize only the first active slide when useful;
* lazy-load later slides when appropriate;
* avoid layout shifts;
* provide explicit image dimensions or stable aspect-ratio containers;
* do not add animation libraries;
* do not add a carousel dependency.

The implementation should remain lightweight and suitable for the existing Vite application.

---

## 17. Error and Edge Cases

Handle:

* image asset load failure without breaking authentication;
* rapid repeated arrow clicks;
* rapid dot selection;
* swipe interrupted by vertical scrolling;
* theme change during a transition;
* browser resizing during a transition;
* authentication pending while the carousel remains visible;
* reduced-motion changes from the operating system;
* missing or delayed screenshot assets.

If a screenshot cannot load, the slide may show its title and caption in a stable placeholder frame.

The Google sign-in function must remain usable even if the carousel fails.

---

## 18. Likely Implementation Areas

The implementation-plan agent must inspect the repository before identifying exact files.

Likely areas include:

* the current signed-out/Auth screen component;
* current auth-screen CSS;
* current theme control;
* a new or extracted showcase carousel component;
* a small slide-data configuration module;
* the existing authentication hook or props, only if required for UI state;
* responsive and reduced-motion CSS.

The production images already exist under:

```text
public/auth-showcase/
```

Do not duplicate those images in another production asset directory without a clear implementation reason.

---

## 19. Verification

### Automated checks

Run the repository-required checks, including:

```text
npm run build
npm run lint
git diff --check
```

Run existing tests relevant to authentication if present.

Do not add a new test framework for this task.

### Manual desktop checks

Verify:

* desktop two-column layout;
* Dashboard is the default slide;
* previous and next frames appear correctly;
* arrows work in both directions;
* navigation wraps;
* dots select the correct slide;
* Left and Right Arrow keys work while focused;
* approximately 400ms transitions feel smooth;
* active slide receives correct visual emphasis;
* title and caption update correctly;
* sign-in remains the clearest action;
* pending and error authentication states work;
* light and dark mode both work;
* resizing does not break the layout.

### Manual mobile checks

Verify:

* authentication content appears before the carousel;
* Google button is immediately understandable;
* one screenshot is visually dominant;
* neighboring preview does not create overflow;
* dots and arrows are touch-friendly;
* swipe works without blocking vertical scrolling;
* the page can scroll naturally;
* no phone frame or invented app UI appears;
* all content fits without horizontal overflow.

### Accessibility checks

Verify:

* keyboard-only sign-in and carousel navigation;
* visible focus states;
* useful accessible button labels;
* active-slide announcement;
* reduced-motion behavior;
* no color-only communication;
* logical heading and focus order.

---

## 20. Acceptance Criteria

This task is complete when:

1. The signed-out screen matches the approved desktop and mobile composition.
2. The screen remains visually consistent with the real Daily Planner app.
3. Google sign-in remains the primary action.
4. Authentication functionality is unchanged.
5. The carousel uses the eight committed WebP assets.
6. Dashboard is the default slide.
7. Four slides are available in the approved order.
8. Arrow navigation works and wraps.
9. Dot navigation works.
10. Desktop keyboard navigation works.
11. Mobile swipe works where practical without adding a package.
12. The carousel does not auto-advance.
13. Desktop uses layered active, previous, and next screens.
14. Mobile displays one dominant screenshot without a fake device frame.
15. Slide title and caption update correctly.
16. Desktop transitions use the approved restrained slide/scale/fade direction.
17. Reduced-motion behavior removes major movement.
18. Light and dark modes both work.
19. Authentication pending and error states remain accessible.
20. The sign-in flow works with the Firebase Auth emulator.
21. No signed-in application behavior changes.
22. No Firestore or Phase 6D behavior changes.
23. No new npm package is introduced.
24. No horizontal overflow occurs.
25. Build, lint, and `git diff --check` pass.
26. Desktop and mobile normal-browser testing pass.
27. Nothing is committed or pushed without separate approval.

---

## 21. Implementation Workflow

After saving this approved specification:

1. Commit and push the specification as a documentation checkpoint.
2. Run the `implementation-plan` skill with:

   * specification: `docs/signed-out-screen-redesign-spec.md`
   * target slug: `signed-out-screen-redesign`
3. Ask the planning agent to keep the plan concise and implementation-focused.
4. Target approximately 250–400 Markdown lines, while allowing additional length only when repository-specific complexity requires it.
5. Review and explicitly approve the implementation plan.
6. Implement in a fresh coding-agent session.
7. Run automated and manual verification.
8. Review the implementation before committing and pushing.

The implementation plan should reference this specification rather than repeat every visual and acceptance requirement.
