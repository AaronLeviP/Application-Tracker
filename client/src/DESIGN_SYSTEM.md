# Design System Reference

> Quick reference for building new pages. Don't memorize — just keep this open.
> All tokens live in the `:root` block of `App.css`. All classes are already defined there too.

---

## Colors

### Text
| Token | Value | Use for |
|-------|-------|---------|
| `--color-text-primary` | `#1f2937` | Headings, labels, important body text |
| `--color-text-secondary` | `#6b7280` | Subtitles, descriptions, helper text |
| `--color-text-tertiary` | `#9ca3af` | Placeholders, timestamps, de-emphasized |

### Backgrounds
| Token | Value | Use for |
|-------|-------|---------|
| `--color-bg-page` | `#eef2fa` | Page background (set on `body`, don't re-apply) |
| `--color-bg-subtle` | `#f9fafb` | Inside a card, code blocks, zebra rows |
| `--color-surface` | `#ffffff` | Cards, modals, inputs, dropdowns |

### Brand
| Token | Value | Use for |
|-------|-------|---------|
| `--color-primary` | `#3b82f6` | Primary buttons, links, active indicators |
| `--color-primary-dark` | `#1d4ed8` | Hover state on primary elements |
| `--color-primary-muted` | `rgba(59,130,246,0.12)` | Pill backgrounds, subtle tints, focus areas |

### Borders
| Token | Value | Use for |
|-------|-------|---------|
| `--color-border` | `#d1d5db` | Input borders, dividers between sections |
| `--color-border-light` | `#e5e7eb` | Subtle card dividers, table row separators |

### Feedback
| Token | Value | Use for |
|-------|-------|---------|
| `--color-success` | `#10b981` | Success messages, completed states |
| `--color-error` | `#ef4444` | Error text, destructive button bg |
| `--color-error-dark` | `#dc2626` | Error button hover state |
| `--color-error-bg` | `#fee2e2` | Error message background |
| `--color-error-text` | `#991b1b` | Error text on `--color-error-bg` |

---

## Spacing

**Rule: never write a raw pixel value. Always use a token.**

| Token | Value | Common use |
|-------|-------|------------|
| `--space-1` | 4px | Icon-to-text gap, badge padding |
| `--space-2` | 8px | Label-to-input gap, tight rows |
| `--space-3` | 12px | Compact button padding, small gaps |
| `--space-4` | 16px | Standard gap between sibling elements |
| `--space-5` | 20px | Card padding, section gaps |
| `--space-6` | 24px | Modal body padding, generous card padding |
| `--space-8` | 32px | Between major sections on a page |
| `--space-10` | 40px | Large section separation |
| `--space-16` | 64px | Page-level top/bottom breathing room |

---

## Typography

### Font sizes
| Token | Value | Use for |
|-------|-------|---------|
| `--text-xs` | 12px | Timestamps, captions, fine print |
| `--text-sm` | 14px | Helper text, badges, table cells |
| `--text-base` | 16px | Body text, form labels, buttons |
| `--text-lg` | 18px | Page subtitles, intro paragraphs |
| `--text-xl` | 20px | Card headings, section titles |
| `--text-2xl` | 24px | Large section headings |
| `--text-4xl` | 40px | Page `h1` (matches Dashboard/Analytics) |

### Font weights
| Token | Value | Use for |
|-------|-------|---------|
| `--font-normal` | 400 | Regular body text |
| `--font-medium` | 500 | Form labels, secondary emphasis |
| `--font-semibold` | 600 | Section titles, full-width buttons |
| `--font-bold` | 700 | Card headings, strong emphasis |
| `--font-black` | 800 | Page `h1`, stat values — big moments only |

### Page h1 pattern (copy this exactly for consistency)
```css
.your-page-header h1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-black);
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}
```

---

## Borders & Shadows

### Border radius
| Token | Value | Use for |
|-------|-------|---------|
| `--radius-sm` | 6px | Buttons, inputs, small tags |
| `--radius-md` | 10px | Cards, chart cards, section containers |
| `--radius-lg` | 16px | Modals, large overlay panels |
| `--radius-full` | 9999px | Pill badges, circular icon buttons |

### Shadows (elevation)
| Token | Use for |
|-------|---------|
| `--shadow-sm` | Resting cards (default card state) |
| `--shadow-md` | Hovered cards, focused inputs |
| `--shadow-lg` | Dropdowns, popovers |
| `--shadow-xl` | Modals |
| `--shadow-focus` | Blue focus ring — add to `:focus` states |

---

## Animations

### Available `@keyframes` (already defined in App.css — just reference by name)

| Name | Effect | Best for |
|------|--------|---------|
| `fadeInUp` | Fades in while sliding up 14px | Cards, headers, sections |
| `fadeIn` | Opacity 0 → 1 | Overlays, tooltips |
| `scaleIn` | Slides up + scales from 0.97 → 1 | Modals, popovers |
| `shake` | Horizontal shake | Form validation errors |
| `slideIn` | Slides in from the right | Toast notifications |

### Easing tokens
| Token | Curve | Feel |
|-------|-------|------|
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | Smooth, refined — use for most things |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Snappy pop — use for modals, emphasis |

### Transition tokens
| Token | Value | Use for |
|-------|-------|---------|
| `--transition-base` | `all 0.18s ease-out-quart` | Hover states, color changes, card lifts |
| `--transition-slow` | `all 0.3s ease-out-quart` | Slower state changes, panel slides |

### Stagger pattern (copy for any list of cards)
```css
.your-card { animation: fadeInUp 0.35s var(--ease-out-quart) both; }
.your-card:nth-child(1) { animation-delay: 0ms; }
.your-card:nth-child(2) { animation-delay: 60ms; }
.your-card:nth-child(3) { animation-delay: 120ms; }
.your-card:nth-child(4) { animation-delay: 180ms; }
```

---

## Ready-Made Classes

Drop these directly into JSX — no extra CSS needed.

### Buttons
```jsx
<button className="btn-primary">Primary action</button>
<button className="btn-secondary">Cancel / secondary</button>
<button className="btn-danger">Delete / destructive</button>
<button className="btn-primary btn-block">Full-width CTA</button>
<button className="btn-edit">Small edit (card actions)</button>
<button className="btn-delete">Small delete (card actions)</button>
```

### Forms — wrap every field in `form-group` to get styles + focus + validation for free
```jsx
<div className="form-group">
  <label htmlFor="field-id">Label Text</label>
  <input
    type="text"
    id="field-id"
    aria-invalid={!!error}           {/* triggers red border + shake */}
    aria-describedby="field-error"   {/* links error message to field */}
  />
  {error && (
    <p id="field-error" className="form-error" role="alert">{error}</p>
  )}
</div>
```

### Count pill (blue badge next to a heading)
```jsx
<h2>Section Title <span className="section-count">{count}</span></h2>
```

---

## Page Layout Pattern

Every page in this app follows the same structure. Copy it for Settings:

```jsx
// JSX
<div className="settings-page">

  <header className="settings-header">
    <h1>Settings</h1>
    <p>Manage your account and preferences</p>
  </header>

  {/* Your content here */}

</div>
```

```css
/* App.css — add this alongside the other page layouts */

.settings-page {
  margin: 0 auto;
}

.settings-header {
  margin-top: var(--space-5);
  margin-bottom: var(--space-10);
  padding: var(--space-5);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border-top: 3px solid var(--color-primary);  /* blue accent — matches all other headers */
  overflow: hidden;
  animation: fadeInUp 0.4s var(--ease-out-quart) both;
}

.settings-header h1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-black);
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.settings-header p {
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
}
```

---

## Card Pattern

A standard content card — use for settings sections, info panels, etc.

```css
.settings-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
  transition: var(--transition-base);
  animation: fadeInUp 0.35s var(--ease-out-quart) both;
}

/* Card heading with a divider underneath */
.settings-card h2 {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border-light);
}

/* Danger variant — red accent instead of blue */
.settings-card--danger {
  border-top: 3px solid var(--color-error);
}
```

---

## Quick Decisions

**Should I use `--color-surface` or `--color-bg-subtle` for my card background?**
→ `--color-surface` (white) for primary cards. `--color-bg-subtle` for a section _inside_ a card.

**Which shadow for a new card?**
→ `--shadow-sm` at rest. Add `--shadow-md` on `:hover` with `transition: var(--transition-base)`.

**What border-radius for a new card?**
→ `--radius-md` for anything card-sized or larger. `--radius-sm` for inputs and buttons. `--radius-full` for pills/badges.

**How do I match the h1 style on Dashboard and Analytics?**
→ `font-size: var(--text-4xl); font-weight: var(--font-black); letter-spacing: -0.02em;`

**How do I add an entrance animation to my new page's cards?**
→ Add `animation: fadeInUp 0.35s var(--ease-out-quart) both;` and nth-child delays. The keyframe is already defined.

**What transition should my interactive element use?**
→ `transition: var(--transition-base);` for everything. Done.
