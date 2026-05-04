---
description: Redesign the Vue 3 app into a modern SaaS-style interface with a vertical sidebar navigation
---

Redesign this Vue 3 application's UI from a top navigation bar layout to a modern SaaS-style interface with a fixed vertical sidebar on the left. All existing functionality must be preserved — this is purely a visual/layout transformation.

## Step 1 — Read current layout files

Read these files to understand the current structure before making any changes:
- `client/src/App.vue` (the root layout, global CSS, and all nav links)
- `client/src/components/FilterBar.vue` (to understand how filters are laid out)

## Step 2 — Delegate the full redesign to vue-expert

**MANDATORY: Use the vue-expert subagent for ALL .vue file modifications.**

Brief vue-expert with the following complete specification:

---

### Layout transformation

Replace the horizontal top-nav layout with a two-column CSS grid:
- **Left column**: Fixed sidebar, `260px` wide, full viewport height (`100vh`), `position: fixed`, `left: 0`, `top: 0`
- **Right column**: Main area that fills the remaining width (`margin-left: 260px`), contains FilterBar + `<router-view>`

```
┌──────────┬────────────────────────────────┐
│          │  FilterBar (sticky top)        │
│ Sidebar  ├────────────────────────────────┤
│  260px   │                                │
│  fixed   │   <router-view />              │
│          │   (scrollable main content)    │
│          │                                │
└──────────┴────────────────────────────────┘
```

### Sidebar structure (top to bottom)

```
┌─────────────────────────┐
│  [Logo mark] Company    │  ← .sidebar-brand (padding: 24px 20px)
│  Inventory System       │
├─────────────────────────┤
│  Nav section label:     │  ← .nav-section-label (MAIN MENU)
│  > Overview             │  ← router-link with icon
│  > Inventory            │
│  > Orders               │
│  > Restocking           │
│  > Finance              │
│  > Demand Forecast      │
│  > Reports              │
├─────────────────────────┤  ← push to bottom with margin-top: auto
│  [Language switcher]    │
│  [User avatar + name]   │  ← .sidebar-footer, opens profile modal on click
└─────────────────────────┘
```

### Sidebar design tokens

```css
--sidebar-bg: #0f172a;
--sidebar-width: 260px;
--sidebar-text: #94a3b8;
--sidebar-text-active: #f8fafc;
--sidebar-active-bg: rgba(255,255,255,0.08);
--sidebar-hover-bg: rgba(255,255,255,0.05);
--sidebar-accent: #3b82f6;
```

### Nav item styling

Each `<router-link>` in the sidebar:
- Display: flex, align-items: center, gap: 10px
- Padding: `10px 16px`, border-radius: `8px`, margin: `2px 12px`
- Default color: `#94a3b8`, font-size: `0.875rem`, font-weight: `500`
- Hover: background `rgba(255,255,255,0.05)`, color `#e2e8f0`
- Active (`.router-link-active`): background `rgba(59,130,246,0.15)`, color `#93c5fd`, left border `3px solid #3b82f6`, font-weight `600`
- Add a simple SVG icon before each label (inline, 16×16). Use these minimal path icons:
  - Overview: grid icon `M3 3h7v7H3zm8 0h7v7h-7zm-8 8h7v7H3zm8 0h7v7h-7z` (simplified 4-square)
  - Inventory: box icon `M20 7L12 3 4 7m16 0v10l-8 4m-8-4V7m8 10V7` (polyline as stroke)
  - Orders: list icon `M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01`
  - Restocking: refresh/arrows icon `M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0115 0M20 15a9 9 0 01-15 0`
  - Finance: currency icon `M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6`
  - Demand Forecast: trending icon `M22 12h-4l-3 9L9 3l-3 9H2`
  - Reports: bar chart icon `M18 20V10M12 20V4M6 20v-6`

  Render icons as `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`.

### Sidebar footer

At the bottom of the sidebar (use `margin-top: auto` on a flex child):
- Language switcher component (keep existing `<LanguageSwitcher />`)
- User row: avatar circle (initials, `#1e40af` background, `32px`), user name "Manoj Krishnan", clicking opens ProfileMenu or sets `showProfileDetails = true`

### FilterBar adjustment

The FilterBar currently sits below the top nav. In the new layout it should be:
- `position: sticky`, `top: 0`, `z-index: 50`
- Background `#ffffff`, `border-bottom: 1px solid #e2e8f0`
- Padding: `12px 24px`
- Full width of the main content area

### Main content area

```css
.main-content {
  padding: 28px 32px;
  min-height: calc(100vh - 57px); /* 57px = FilterBar height */
  background: #f8fafc;
}
```

### Global CSS improvements to apply alongside the layout change

- `body`: `font-size: 15px`, `line-height: 1.5`
- `.card`: add `box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`, keep existing border
- `.page-header h2`: `font-size: 1.75rem`
- `.stat-card`: `border-radius: 12px`
- `.badge`: `border-radius: 20px` (pill shape)
- Keep ALL other existing global CSS rules untouched — only add/override the above

### Critical constraints

- Do NOT remove ProfileMenu, TasksModal, ProfileDetailsModal, or LanguageSwitcher — they must still work
- Keep ALL router-links identical to current (`/`, `/inventory`, `/orders`, `/restocking`, `/demand`, `/spending`, `/reports`)
- Use `$route.path` for active state detection (same as current)
- The `.nav-tabs a.active::after` bottom-border trick no longer applies — remove it; use the left-border accent instead
- Preserve ALL existing scoped styles in child components — only App.vue global styles and layout change
- After changes, use Playwright MCP (`mcp__playwright__*`) to:
  1. Navigate to `http://localhost:3000`
  2. Take a screenshot to verify the sidebar is visible and the layout is correct
  3. Click each nav item to verify routing still works
  4. Report any visual issues found

---

## Step 3 — Verify and report

After vue-expert completes, confirm:
- Sidebar renders with dark background and all 7 nav links
- Active route is highlighted with the blue left-border accent
- FilterBar is sticky below the sidebar's top edge
- All modals (Profile, Tasks) still open correctly
- No console errors in the browser
