import{b as ye,c as rt}from"./chunk-EFJBUH5F.js";import{a as tt}from"./chunk-Q735PSZL.js";import{c as s,d as _}from"./chunk-76IELU7F.js";function ot(){let e=document.createElement("div");e.className="persona-history-sr-only",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("data-persona-history-live-region","");let r;return{element:e,announce(i){r!==void 0&&clearTimeout(r),e.textContent="",r=setTimeout(()=>{r=void 0,e.textContent=i},0)},destroy(){r!==void 0&&clearTimeout(r),e.remove()}}}var it=`
.persona-history-view {
  --persona-history-surface-bg: var(--persona-surface, #ffffff);
  --persona-history-topbar-bg: var(--persona-header-bg, var(--persona-surface, #ffffff));
  --persona-history-border: var(--persona-divider, var(--persona-border, #e5e7eb));
  --persona-history-row-hover-bg: var(--persona-button-ghost-hover-bg, rgba(0, 0, 0, 0.04));
  --persona-history-row-avatar-bg: var(--persona-header-icon-bg, var(--persona-primary, #2563eb));
  --persona-history-row-active-bg: var(--persona-divider, var(--persona-border, #e5e7eb));
  --persona-history-skeleton-bg: var(--persona-divider, var(--persona-border, #e5e7eb));
  --persona-history-focus-ring: var(--persona-primary, #2563eb);
  --persona-history-slide: 20px;
  --persona-history-row-min-height: 60px;
  --persona-history-topbar-min-height: 56px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background: var(--persona-history-surface-bg);
  color: var(--persona-text, #111827);
  font-family: var(--persona-font-family, inherit);
  font-size: 14px;
  line-height: 1.45;
  opacity: 1;
}
.persona-history-view *,
.persona-history-view *::before,
.persona-history-view *::after {
  box-sizing: border-box;
}
.persona-history-view--enter .persona-history-body {
  animation: persona-history-enter-body var(--persona-history-enter-ms, 180ms)
    var(--persona-history-enter-easing, cubic-bezier(0, 0, 0.2, 1)) both;
}
@keyframes persona-history-enter-body {
  from { opacity: 0; transform: translateX(var(--persona-history-slide)); }
  to { opacity: 1; transform: none; }
}
.persona-history-view .persona-history-sr-only,
.persona-history-view--panel .persona-history-group-heading,
.persona-history-view .persona-history-scope-alert[data-persona-history-scope-tone="ambient"] {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.persona-history-view .persona-history-topbar,
.persona-history-topbar.persona-history-topbar--shell {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  gap: 4px;
}
.persona-history-view .persona-history-topbar {
  min-height: var(--persona-history-topbar-min-height);
  padding: 6px 8px;
  background: var(--persona-history-topbar-bg);
  border-bottom: 1px solid var(--persona-history-border);
}
.persona-history-view .persona-history-heading-group,
.persona-history-topbar--shell .persona-history-heading-group {
  min-width: 0;
  text-align: center;
}
.persona-history-view .persona-history-title,
.persona-history-topbar--shell .persona-history-title {
  margin: 0;
  padding: 0;
  /* Pinned like the main header stamps it inline: without a declaration here,
     a non-shadow host's own h2 font rule fills the gap and the two titles
     drift apart. The inherit fallback resolves to the widget's font. */
  font-family: var(--persona-components-header-title-fontFamily, inherit);
  font-size: var(--persona-components-header-title-fontSize, 1rem);
  font-weight: var(--persona-components-header-title-fontWeight, 600);
  line-height: var(--persona-components-header-title-lineHeight, 1.5rem);
  color: var(--persona-header-title-fg, var(--persona-primary, #0f0f0f));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.persona-history-view .persona-history-caption {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}
.persona-history-view .persona-history-scope {
  flex: 1 1 auto;
  margin: 0;
  font-size: 12px;
  line-height: 1.35;
  color: var(--persona-text-muted, #6b7280);
  overflow-wrap: anywhere;
}
.persona-history-view .persona-history-scope-description {
  display: block;
}
.persona-history-view .persona-history-scope-alert {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--persona-history-border);
  border-radius: var(--persona-radius-md, 8px);
  font-size: 12px;
  color: var(--persona-text-muted, #6b7280);
}
.persona-history-view .persona-history-scope-alert-title {
  display: block;
  font-weight: 600;
  color: var(--persona-text, #111827);
}

.persona-history-view button.persona-history-icon-button,
.persona-history-topbar--shell button.persona-history-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: var(--persona-button-ghost-radius, var(--persona-radius-md, 8px));
  background: transparent;
  color: var(--persona-header-action-icon-fg, var(--persona-text-muted, #6b7280));
  cursor: pointer;
}
.persona-history-view button.persona-history-icon-button:hover:not(:disabled),
.persona-history-topbar--shell button.persona-history-icon-button:hover:not(:disabled) {
  background: var(--persona-button-ghost-hover-bg, rgba(0, 0, 0, 0.04));
}
.persona-history-view button:focus-visible,
.persona-history-view [role="menuitem"]:focus-visible,
.persona-history-topbar--shell button:focus-visible {
  outline: 2px solid var(--persona-history-focus-ring, var(--persona-primary, #2563eb));
  outline-offset: 2px;
}
.persona-history-view button:disabled {
  opacity: 0.55;
  cursor: default;
}
.persona-history-view button.persona-history-list-options {
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
  margin-left: auto;
}
.persona-history-view button.persona-history-list-options[aria-expanded="true"] {
  background: var(--persona-button-ghost-hover-bg, rgba(0, 0, 0, 0.04));
  color: var(--persona-text, #111827);
}

.persona-history-view .persona-history-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.persona-history-view button.persona-history-new {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  border: 1px solid transparent;
  border-radius: var(--persona-button-radius, var(--persona-radius-lg, 10px));
  font: inherit;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  cursor: pointer;
}
.persona-history-view button.persona-history-new span {
  min-width: 0;
  overflow-wrap: anywhere;
}
.persona-history-view .persona-history-list-region {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.persona-history-view .persona-history-group-heading {
  margin: 0 0 4px;
  padding: 0 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--persona-text-muted, #6b7280);
}
.persona-history-view ul.persona-history-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.persona-history-view li.persona-history-item {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}
.persona-history-view button.persona-history-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: var(--persona-history-row-min-height);
  padding: 10px 16px;
  margin: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.persona-history-view li.persona-history-item:hover button.persona-history-row:not(:disabled),
.persona-history-view button.persona-history-row:hover:not(:disabled) {
  background: var(--persona-history-row-hover-bg);
}
.persona-history-view button.persona-history-row[aria-current="page"] {
  background: var(--persona-history-row-active-bg);
}
.persona-history-view .persona-history-row-avatar {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 16.7%;
  background: var(--persona-history-row-avatar-bg);
  color: var(--persona-header-icon-fg, var(--persona-text-inverse, #ffffff));
  font-size: 20px;
  line-height: 1;
}
.persona-history-view .persona-history-row-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.persona-history-view .persona-history-row-body {
  flex: 1 1 auto;
  min-width: 0;
  line-height: 21px;
}
.persona-history-view .persona-history-row-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}
.persona-history-view .persona-history-row-title {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--persona-text, #111827);
}
.persona-history-view .persona-history-truncate {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.persona-history-view time.persona-history-row-time {
  flex: 0 0 auto;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  color: var(--persona-text-muted, #6b7280);
}
.persona-history-view .persona-history-row-star {
  flex: 0 0 auto;
  display: inline-flex;
  align-self: center;
  color: var(--persona-text-muted, #6b7280);
}
.persona-history-view .persona-history-row-preview {
  font-size: 14px;
  color: var(--persona-text-muted, #6b7280);
}
.persona-history-view button.persona-history-row-menu-button {
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  color: var(--persona-text-muted, #6b7280);
}
@media (hover: hover) {
  .persona-history-view button.persona-history-row-menu-button {
    opacity: 0;
    transition: opacity 120ms ease;
  }
  .persona-history-view li.persona-history-item:hover time.persona-history-row-time,
  .persona-history-view li.persona-history-item:focus-within time.persona-history-row-time {
    opacity: 0;
  }
  .persona-history-view li.persona-history-item:hover button.persona-history-row-menu-button,
  .persona-history-view li.persona-history-item:focus-within button.persona-history-row-menu-button {
    opacity: 1;
  }
}
.persona-history-view button.persona-history-row-menu-button[aria-expanded="true"] {
  opacity: 1;
}
.persona-history-view button.persona-history-row-menu-button:hover:not(:disabled),
.persona-history-view button.persona-history-row-menu-button[aria-expanded="true"] {
  background: linear-gradient(var(--persona-history-row-hover-bg), var(--persona-history-row-hover-bg)),
    linear-gradient(var(--persona-history-row-hover-bg), var(--persona-history-row-hover-bg)),
    var(--persona-history-surface-bg);
  color: var(--persona-text, #111827);
}
@media (hover: hover) {
  .persona-history-view li.persona-history-item:hover .persona-history-row-preview,
  .persona-history-view li.persona-history-item:focus-within .persona-history-row-preview,
  .persona-history-view li.persona-history-item:has(button[aria-expanded="true"]) .persona-history-row-preview {
    -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 84px), transparent calc(100% - 36px));
    mask-image: linear-gradient(to right, #000 calc(100% - 84px), transparent calc(100% - 36px));
  }
}
.persona-history-view li.persona-history-item--no-menu:hover time.persona-history-row-time,
.persona-history-view li.persona-history-item--no-menu:focus-within time.persona-history-row-time {
  opacity: 1;
}
.persona-history-view li.persona-history-item--no-menu:hover .persona-history-row-preview,
.persona-history-view li.persona-history-item--no-menu:focus-within .persona-history-row-preview,
.persona-history-view li.persona-history-item--no-menu .persona-history-row-preview {
  -webkit-mask-image: none;
  mask-image: none;
}
.persona-history-view .persona-history-menu {
  position: absolute;
  top: calc(50% + 20px);
  right: 8px;
  z-index: 2;
  min-width: 160px;
  max-width: calc(100% - 16px);
  padding: 4px;
  border: 1px solid var(--persona-history-border);
  border-radius: var(--persona-history-menu-radius, 12px);
  background: var(--persona-history-surface-bg);
  background: var(--persona-history-menu-bg, color-mix(in srgb, var(--persona-history-surface-bg) 92%, #fff));
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
}
.persona-history-view .persona-history-caption .persona-history-menu {
  top: calc(100% - 2px);
  right: 4px;
}
.persona-history-view button.persona-history-menu-item {
  display: block;
  width: 100%;
  min-height: 32px;
  padding: 6px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--persona-history-danger-fg, var(--persona-palette-colors-error-600, #b91c1c));
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.persona-history-view button.persona-history-menu-item:hover:not(:disabled) {
  background: var(--persona-history-row-hover-bg);
}
.persona-history-view .persona-history-row-error {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 12px;
  font-size: 13px;
  color: var(--persona-history-danger-fg, var(--persona-palette-colors-error-600, #b91c1c));
}

.persona-history-view button.persona-history-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 10px 16px;
  margin: 0;
  border: 1px solid var(--persona-history-border);
  border-radius: var(--persona-button-radius, var(--persona-radius-lg, 10px));
  background: transparent;
  color: var(--persona-text, #111827);
  font: inherit;
  font-weight: 500;
  cursor: pointer;
}
.persona-history-view button.persona-history-secondary:hover:not(:disabled) {
  background: var(--persona-history-row-hover-bg);
}
.persona-history-view .persona-history-state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 4px;
}
.persona-history-view .persona-history-state-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--persona-text, #111827);
}
.persona-history-view .persona-history-state-description {
  margin: 0;
  font-size: 13px;
  color: var(--persona-text-muted, #6b7280);
  overflow-wrap: anywhere;
}
.persona-history-view button.persona-history-state-action {
  width: auto;
  min-width: 44px;
}
.persona-history-view .persona-history-view-loading {
  display: flex;
  flex-direction: column;
  /* Show-delay: loads that resolve inside 250ms never flash the skeleton. */
  animation: persona-history-skeleton-in 120ms ease-out 250ms both;
}
@keyframes persona-history-skeleton-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.persona-history-view .persona-history-skeleton-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 9px;
  min-height: var(--persona-history-row-min-height);
  padding: 10px 16px;
}
.persona-history-view .persona-history-skeleton-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.persona-history-view .persona-history-skeleton-bar {
  height: 12px;
  border-radius: 999px;
  background: var(--persona-history-skeleton-bg);
  animation: persona-history-pulse 1400ms ease-in-out infinite;
}
.persona-history-view .persona-history-skeleton-bar--time {
  flex: 0 0 auto;
  width: 22px;
}
.persona-history-view .persona-history-skeleton-bar--preview {
  width: 88%;
}
@keyframes persona-history-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

.persona-history-view--panel .persona-history-list-region {
  gap: 0;
}
.persona-history-view--panel .persona-history-group {
  margin: 0 -16px;
}
.persona-history-view--panel button.persona-history-load-more {
  margin-top: 12px;
}
.persona-history-view--panel button.persona-history-new {
  order: 1;
  position: sticky;
  bottom: 12px;
  z-index: 1;
  align-self: center;
  width: auto;
  min-height: 40px;
  padding: 10px 16px;
  margin: auto 0 0;
  background: var(--persona-button-primary-bg, var(--persona-primary, #2563eb));
  color: var(--persona-button-primary-fg, var(--persona-text-inverse, #ffffff));
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
}

.persona-history-view--rail {
  --persona-history-slide: 12px;
  --persona-history-surface-bg: var(--persona-container, #f7f7f8);
  --persona-history-topbar-bg: transparent;
  --persona-history-topbar-min-height: 48px;
  --persona-history-row-min-height: 36px;
}
.persona-history-view--rail .persona-history-topbar {
  grid-template-columns: minmax(0, 1fr) auto;
  min-height: var(
    --persona-history-rail-header-min-height,
    var(--persona-header-min-height, 56px)
  );
  padding: 2px 6px;
  background: var(
    --persona-history-rail-header-bg,
    var(--persona-history-surface-bg)
  );
  border-bottom: var(--persona-history-rail-header-border, 0);
}
.persona-history-view--rail .persona-history-heading-group {
  text-align: left;
  padding-left: 10px;
}
.persona-history-view--rail-right .persona-history-topbar {
  grid-template-columns: auto minmax(0, 1fr);
}
.persona-history-view--rail-right .persona-history-heading-group {
  padding: 0 10px 0 0;
}
.persona-history-view--rail .persona-history-topbar button.persona-history-icon-button {
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  color: var(--persona-text-muted, #6b7280);
}
@media (pointer: coarse) {
  .persona-history-view--rail .persona-history-topbar button.persona-history-icon-button {
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
  }
  .persona-history-view button.persona-history-menu-item {
    min-height: 44px;
    padding: 10px 12px;
  }
  .persona-history-view .persona-history-row-preview {
    -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 84px), transparent calc(100% - 36px));
    mask-image: linear-gradient(to right, #000 calc(100% - 84px), transparent calc(100% - 36px));
  }
  .persona-history-view button.persona-history-list-options {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
  }
}
.persona-history-view--rail .persona-history-title {
  font-family: var(--persona-components-history-railHeader-title-fontFamily, inherit);
  font-size: var(--persona-components-history-railHeader-title-fontSize, 14px);
  font-weight: var(--persona-components-history-railHeader-title-fontWeight, 600);
  line-height: var(--persona-components-history-railHeader-title-lineHeight, inherit);
  letter-spacing: var(--persona-components-history-railHeader-title-letterSpacing, normal);
  color: var(
    --persona-components-history-railHeader-title-color,
    var(--persona-text-muted, #6b7280)
  );
}
.persona-history-view .persona-history-heading-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.persona-history-view .persona-history-brand-mark {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
}
.persona-history-view .persona-history-brand-mark > img,
.persona-history-view .persona-history-brand-mark > svg {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
.persona-history-view .persona-history-wordmark {
  min-width: 0;
  overflow: hidden;
  color: var(--persona-text, #111827);
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.persona-history-view .persona-history-toggle-brand {
  display: none;
}
.persona-history-view--rail-collapsed .persona-history-back--branded .persona-history-toggle-brand {
  display: flex;
}
.persona-history-view--rail-collapsed .persona-history-back--branded > svg {
  display: none;
}
.persona-history-view--rail-collapsed .persona-history-back--branded:hover .persona-history-toggle-brand,
.persona-history-view--rail-collapsed .persona-history-back--branded:focus-visible .persona-history-toggle-brand {
  display: none;
}
.persona-history-view--rail-collapsed .persona-history-back--branded:hover > svg,
.persona-history-view--rail-collapsed .persona-history-back--branded:focus-visible > svg {
  display: block;
}
@media (pointer: coarse) {
  .persona-history-view--rail-collapsed .persona-history-back--branded .persona-history-toggle-brand {
    display: none;
  }
  .persona-history-view--rail-collapsed .persona-history-back--branded > svg {
    display: block;
  }
}
.persona-history-view--rail .persona-history-body {
  gap: 8px;
  padding: 4px 0 12px;
}
.persona-history-view--rail .persona-history-caption,
.persona-history-view--rail .persona-history-scope-alert,
.persona-history-view--rail .persona-history-state {
  padding-right: 16px;
  padding-left: 16px;
}
.persona-history-view--rail button.persona-history-new {
  width: calc(100% - 12px);
  min-height: 36px;
  padding: 6px 10px;
  margin: 0 6px;
  border-radius: 10px;
  background: transparent;
  color: inherit;
  font-weight: 500;
}
.persona-history-view--rail button.persona-history-new:hover:not(:disabled) {
  background: var(--persona-history-row-hover-bg);
}
.persona-history-view--rail .persona-history-list-region {
  gap: 24px;
}
.persona-history-view .persona-history-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.persona-history-view .persona-history-nav--footer {
  margin-top: auto;
}
/* A render-backed section that yielded nothing keeps its heading out too. */
.persona-history-view .persona-history-nav[hidden] {
  display: none;
}
.persona-history-view button.persona-history-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: calc(100% - 12px);
  min-height: 36px;
  padding: 6px 10px;
  margin: 0 6px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.persona-history-view button.persona-history-nav-item:hover:not(:disabled) {
  background: var(--persona-history-row-hover-bg);
}
.persona-history-view .persona-history-nav-icon {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--persona-text-muted, #6b7280);
}
.persona-history-view .persona-history-nav-icon > * {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
.persona-history-view .persona-history-nav-label {
  flex: 1 1 auto;
  min-width: 0;
}
.persona-history-view .persona-history-nav-badge {
  flex: none;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--persona-history-row-hover-bg);
  color: var(--persona-text-muted, #6b7280);
  font-size: 11px;
  line-height: 18px;
}
.persona-history-view--rail .persona-history-group-heading {
  margin: 0 0 6px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}
.persona-history-view--rail .persona-history-row-avatar,
.persona-history-view--rail .persona-history-row-preview,
.persona-history-view--rail time.persona-history-row-time {
  display: none;
}
.persona-history-view--rail button.persona-history-row {
  min-height: 36px;
  padding: 6px 10px;
  margin: 0 6px;
  width: calc(100% - 12px);
  border-radius: 10px;
}
.persona-history-view--rail .persona-history-row-title {
  font-weight: 400;
}
.persona-history-view--rail button.persona-history-row-menu-button {
  right: 10px;
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
}
.persona-history-view--rail .persona-history-skeleton-row {
  padding: 6px 16px;
}
.persona-history-view--rail .persona-history-skeleton-bar--preview,
.persona-history-view--rail .persona-history-skeleton-bar--time {
  display: none;
}
.persona-history-view--rail-collapsed .persona-history-topbar {
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
  padding: 2px;
}
.persona-history-view--rail-collapsed .persona-history-heading-group,
.persona-history-view--rail-collapsed .persona-history-body > :not(.persona-history-new):not(.persona-history-nav) {
  display: none;
}
.persona-history-view--rail-collapsed button.persona-history-new {
  width: 36px;
  padding: 0;
  margin: 0 auto;
  justify-content: center;
}
.persona-history-view--rail-collapsed button.persona-history-new span {
  display: none;
}
.persona-history-view--rail-collapsed .persona-history-nav .persona-history-group-heading,
.persona-history-view--rail-collapsed button.persona-history-nav-item:not(.persona-history-nav-item--icon),
.persona-history-view--rail-collapsed .persona-history-nav-label,
.persona-history-view--rail-collapsed .persona-history-nav-badge {
  display: none;
}
.persona-history-view--rail-collapsed button.persona-history-nav-item {
  width: 36px;
  padding: 0;
  margin: 0 auto;
  justify-content: center;
}

[data-persona-history-suppressed] { display: none !important; }
.persona-history-header-host {
  display: flex;
  flex: 1 1 auto;
  align-self: stretch;
  align-items: center;
  min-width: 0;
}
.persona-history-rail-host {
  transition: flex-basis 180ms cubic-bezier(0, 0, 0.2, 1);
}
.persona-history-topbar.persona-history-topbar--shell {
  flex: 1 1 auto;
  min-width: 0;
  grid-template-columns: var(--persona-header-control-size, 44px) minmax(0, 1fr) var(--persona-header-control-size, 44px);
}
.persona-history-topbar--shell button.persona-history-icon-button {
  width: var(--persona-header-control-size, 44px);
  height: var(--persona-header-control-size, 44px);
  min-width: var(--persona-header-control-size, 44px);
  min-height: var(--persona-header-control-size, 44px);
}
.persona-history-topbar--shell button.persona-history-icon-button svg {
  width: var(--persona-header-control-icon-size, 20px);
  height: var(--persona-header-control-icon-size, 20px);
}
@media (pointer: coarse) {
  .persona-history-topbar--shell button.persona-history-icon-button {
    min-width: 40px;
    min-height: 40px;
  }
}
.persona-history-topbar--shell.persona-history-topbar--shell-enter {
  animation: persona-history-header-fade 120ms cubic-bezier(0, 0, 0.2, 1) both;
}
@keyframes persona-history-header-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .persona-history-view--enter .persona-history-body { animation: none; }
  .persona-history-topbar--shell.persona-history-topbar--shell-enter {
    animation: none;
  }
  .persona-history-view .persona-history-skeleton-bar { animation: none; }
  .persona-history-rail-host { transition: none; }
}
`;var ue={...rt,emptyTitle:"No conversations yet",emptyDescription:"Start a conversation and it will show up here.",errorTitle:"Could not load conversations",errorDescription:"Something went wrong. Please try again.",retryLabel:"Retry",rateLimitedTitle:"Too many requests",rateLimitedDescription:"Please wait a moment before trying again.",groupStarred:"Starred",groupToday:"Today",groupYesterday:"Yesterday",groupPrevious7Days:"Previous 7 days",groupPrevious30Days:"Previous 30 days",groupMonthYear:"{month} {year}",browserOnlyTitle:"Messages on this device",browserOnlyDescription:"Another browser or device keeps its own separate history.",verifyingTitle:"Checking your account",verifyingDescription:"Looking for messages linked to your account.",verifiedTitle:"Available across signed-in devices",verifiedDescription:"This list refreshes when the chat opens rather than syncing live.",authenticationRequiredTitle:"Sign in to see your messages",authenticationRequiredDescription:"Your session expired. Sign in again to load account history.",identityProviderFailedTitle:"Account history is unavailable",identityProviderFailedDescription:"We could not verify your account, so account history is not shown here.",proofNotAdmittedTitle:"Account history is unavailable",proofNotAdmittedDescription:"This assistant is not set up to accept your account identity.",retryIdentityLabel:"Try again",backLabel:"Back to conversation",closeLabel:"Close conversation list",loadingLabel:"Loading conversations",loadMoreLabel:"Load more",loadingMoreLabel:"Loading more conversations",rowActionsLabel:"Conversation options",listOptionsLabel:"Conversation options",deleteConversationLabel:"Delete",clearHistoryLabel:"Delete all conversations",resetIdentityLabel:"Forget this device",messageCountLabel:"{count} messages",messageCountLabelOne:"1 message",conversationRemovedNotice:"Conversation deleted.",historyClearedNotice:"All conversations were deleted.",unavailableTitle:"Conversation history is unavailable",unavailableDescription:"Try again later.",newConversationRequiredTitle:"Start a new conversation",newConversationRequiredDescription:"The previous conversation is gone. Start a new one to keep chatting.",rateLimitedWaitDescription:"You can try again in {seconds} seconds.",openFailedLabel:"Could not open that conversation.",deleteFailedLabel:"Could not delete that conversation.",relativeNow:"now",relativeMinutes:"{value}m",relativeHours:"{value}h",relativeDays:"{value}d",relativeWeeks:"{value}w",relativeYears:"{value}y"};function he(e){if(!e)return ue;let r={...ue};for(let[i,n]of Object.entries(e))typeof n=="string"&&n.length>0&&(r[i]=n);return r}function T(e,r){return e.replace(/\{(\w+)\}/g,(i,n)=>n in r?String(r[n]):i)}var Pe=864e5;function _t(e){let r=new Date(e);return r.setHours(0,0,0,0),r.getTime()}function _e(e,r){let i=Date.parse(e);return Number.isFinite(i)?i:r}function It(e,r){let i=_e(e,r),n=_t(r);if(i>=n)return"today";if(i>=n-Pe)return"yesterday";if(i>=n-7*Pe)return"previous-7-days";if(i>=n-30*Pe)return"previous-30-days";let l=new Date(i);return`month:${l.getFullYear()}-${l.getMonth()}`}function Vt(e,r,i,n){if(e==="today")return n.groupToday;if(e==="yesterday")return n.groupYesterday;if(e==="previous-7-days")return n.groupPrevious7Days;if(e==="previous-30-days")return n.groupPrevious30Days;let l=new Date(_e(r,i));return T(n.groupMonthYear,{month:l.toLocaleString(void 0,{month:"long"}),year:l.getFullYear()})}function nt(e,r,i){let n=e.filter(d=>d.starred),l=n.length>0?[{key:"starred",label:i.groupStarred,items:n}]:[];for(let d of e){if(d.starred)continue;let f=It(d.updatedAt,r),c=l[l.length-1];if(c&&c.key===f){c.items.push(d);continue}l.push({key:f,label:Vt(f,d.updatedAt,r,i),items:[d]})}return l}function st(e,r,i){let n=Math.max(0,r-_e(e,r)),l=Math.floor(n/6e4);if(l<1)return i.relativeNow;if(l<60)return T(i.relativeMinutes,{value:l});let d=Math.floor(l/60);if(d<24)return T(i.relativeHours,{value:d});let f=Math.floor(d/24);if(f<7)return T(i.relativeDays,{value:f});let c=Math.floor(f/7);return f<365?T(i.relativeWeeks,{value:c}):T(i.relativeYears,{value:Math.floor(f/365)})}function at(e,r){return e===1?r.messageCountLabelOne:T(r.messageCountLabel,{count:e})}var me="http://www.w3.org/2000/svg",Ot={"arrow-left":["m12 19-7-7 7-7","M19 12H5"],plus:["M5 12h14","M12 5v14"],star:["m12 2 2.9 6.2 6.8.7-5.1 4.5 1.4 6.6-6-3.4-6 3.4 1.4-6.6-5.1-4.5 6.8-.7z"],x:["M18 6 6 18","m6 6 12 12"],"panel-left":["M9 3v18"],ellipsis:[]};function q(e,r=20){let i=document.createElementNS(me,"svg");if(i.setAttribute("width",String(r)),i.setAttribute("height",String(r)),i.setAttribute("viewBox","0 0 24 24"),i.setAttribute("fill","none"),i.setAttribute("stroke","currentColor"),i.setAttribute("stroke-width","2"),i.setAttribute("stroke-linecap","round"),i.setAttribute("stroke-linejoin","round"),i.setAttribute("aria-hidden","true"),i.setAttribute("focusable","false"),e==="ellipsis"){for(let n of[12,19,5]){let l=document.createElementNS(me,"circle");l.setAttribute("cx",String(n)),l.setAttribute("cy","12"),l.setAttribute("r","1"),i.appendChild(l)}return i}if(e==="panel-left"){let n=document.createElementNS(me,"rect");n.setAttribute("width","18"),n.setAttribute("height","18"),n.setAttribute("x","3"),n.setAttribute("y","3"),n.setAttribute("rx","2"),i.appendChild(n)}for(let n of Ot[e]){let l=document.createElementNS(me,"path");l.setAttribute("d",n),i.appendChild(l)}return i}var qt=/^(https?:|\/|data:)/i;function Ft(e){let r=s("span",{className:"persona-history-row-avatar",attrs:{"aria-hidden":"true"}});return qt.test(e)?r.appendChild(s("img",{attrs:{src:e,alt:"",loading:"lazy"}})):r.textContent=e,r}var zt=e=>`row:${e}`,$t=e=>`menu:${e}`,te=e=>`menu-item:${e}`;function lt(e){let{conversation:r,copy:i,busy:n,pending:l}=e,d=n||l!==null,f=r.title.trim().length>0,c=r.starred?(()=>{let N=q("star",11);return N.setAttribute("fill","currentColor"),N.setAttribute("stroke-width","1"),s("span",{className:"persona-history-row-star"},N,s("span",{className:"persona-history-sr-only",text:i.groupStarred}))})():null,u=s("div",{className:"persona-history-row-head"},s("span",{className:"persona-history-row-title persona-history-truncate",text:f?r.title:r.preview??""}),c,s("time",{className:"persona-history-row-time",attrs:{datetime:r.updatedAt},text:st(r.updatedAt,e.nowMs,i)})),k=f&&r.preview?s("span",{className:"persona-history-row-preview persona-history-truncate",text:r.preview}):null,w=s("button",{className:_("persona-history-row",e.active&&"persona-history-row--active",l&&`persona-history-row--${l}`),attrs:{type:"button","data-persona-history-focus":zt(r.id),"data-persona-history-conversation":r.id,...e.active?{"aria-current":"page"}:{},...d?{"aria-disabled":"true"}:{},...l?{"aria-busy":"true"}:{}}},e.avatar?Ft(e.avatar):null,s("div",{className:"persona-history-row-body"},u,k,s("span",{className:"persona-history-row-count persona-history-sr-only",text:at(r.messageCount,i)})));w.addEventListener("click",()=>{d||e.onOpen()});let oe=e.showDelete?Ie({className:"persona-history-row-menu-button",label:`${i.rowActionsLabel}: ${r.title}`,focusKey:$t(r.id),open:e.menuOpen,inert:d,onToggle:e.onToggleMenu}):null;return s("li",{className:_("persona-history-item",!e.showDelete&&"persona-history-item--no-menu"),attrs:{"data-persona-history-item":r.id}},w,oe,e.menuOpen&&e.showDelete?Bt(e):null,e.error?Kt(e.error,i,r.id):null)}function Bt(e){let{conversation:r,copy:i}=e;return Ve({label:`${i.rowActionsLabel}: ${r.title}`,items:[{label:i.deleteConversationLabel,focusKey:te(r.id),onSelect:e.onDelete}],onCloseMenu:e.onCloseMenu})}function Ie(e){let r=s("button",{className:_("persona-history-icon-button",e.className),attrs:{type:"button","aria-label":e.label,"aria-haspopup":"menu","aria-expanded":e.open?"true":"false","data-persona-history-focus":e.focusKey,...e.inert?{"aria-disabled":"true"}:{}}});r.appendChild(q("ellipsis",e.iconSize));let i=()=>r.getAttribute("aria-disabled")==="true";return r.addEventListener("click",n=>{n.stopPropagation(),!i()&&e.onToggle()}),r.addEventListener("keydown",n=>{n.key!=="ArrowDown"&&n.key!=="ArrowUp"||(n.preventDefault(),!(i()||r.getAttribute("aria-expanded")==="true")&&e.onToggle())}),r}function Ve(e){let r=s("div",{className:"persona-history-menu",attrs:{role:"menu","aria-label":e.label}});for(let i of e.items){let n=s("button",{className:"persona-history-menu-item",text:i.label,attrs:{type:"button",role:"menuitem",tabindex:"0","data-persona-history-focus":i.focusKey}});n.addEventListener("click",()=>{e.onCloseMenu(),i.onSelect()}),r.appendChild(n)}return r.addEventListener("keydown",i=>{let n=Array.from(r.querySelectorAll('[role="menuitem"]'));if(n.length===0)return;let l=n.indexOf(document.activeElement);if(i.key==="Tab"){e.onCloseMenu({restoreFocus:!0});return}if(i.key==="ArrowDown"){i.preventDefault(),n[(l+1+n.length)%n.length]?.focus();return}if(i.key==="ArrowUp"){i.preventDefault(),n[(l-1+n.length)%n.length]?.focus();return}if(i.key==="Home"){i.preventDefault(),n[0]?.focus();return}i.key==="End"&&(i.preventDefault(),n[n.length-1]?.focus())}),r}function Kt(e,r,i){let n=s("button",{className:"persona-history-secondary persona-history-state-action",text:r.retryLabel,attrs:{type:"button","data-persona-history-focus":`row-retry:${i}`}});return n.addEventListener("click",e.retry),s("div",{className:"persona-history-row-error",attrs:{role:"alert"}},s("span",{text:e.message}),n)}function Yt(e){switch(e){case"authentication_failed":case"authentication_required":case"identity_provider_failed":case"proof_not_admitted":case"unsupported_scope":case"unavailable":return e;default:return"unknown"}}function pt(e){if(ye(e)){if(e.code==="rate_limited")return{kind:"rate_limited",retryAfterSeconds:e.retryAfterSeconds??0};let r=Yt(e.code);return{kind:"error",reason:r,retryable:r!=="unsupported_scope"}}return{kind:"error",reason:"unknown",retryable:!0}}function Wt(e,r){switch(e.state){case"authentication_required":return{title:r.authenticationRequiredTitle,description:r.authenticationRequiredDescription};case"identity_provider_failed":return{title:r.identityProviderFailedTitle,description:r.identityProviderFailedDescription};case"configuration_error":return{title:r.proofNotAdmittedTitle,description:r.proofNotAdmittedDescription};default:return null}}function jt(e,r){switch(e){case"authentication_required":case"authentication_failed":return{title:r.authenticationRequiredTitle,description:r.authenticationRequiredDescription};case"identity_provider_failed":return{title:r.identityProviderFailedTitle,description:r.identityProviderFailedDescription};case"proof_not_admitted":case"unsupported_scope":return{title:r.proofNotAdmittedTitle,description:r.proofNotAdmittedDescription};case"unavailable":return{title:r.unavailableTitle,description:r.unavailableDescription};default:return{title:r.errorTitle,description:r.errorDescription}}}function ve(e,r,i,n){let l=s("button",{className:"persona-history-secondary persona-history-state-action",text:e,attrs:{type:"button","data-persona-history-focus":r,...i?{"aria-disabled":"true"}:{}}});return l.addEventListener("click",()=>{i||n()}),l}function re(e,r,i,n,l){return s("div",{className:"persona-history-state",attrs:{"data-persona-history-state":e,...l?{role:"alert"}:{role:"status"}}},s("p",{className:"persona-history-state-title",text:r}),s("p",{className:"persona-history-state-description",text:i}),n)}function Gt(e){let r=["42%","58%","34%"],i=["94%","78%","88%"],n=[0,1,2].map(l=>s("div",{className:"persona-history-skeleton-row",attrs:{"aria-hidden":"true"}},s("div",{className:"persona-history-skeleton-head"},s("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--title",style:{width:r[l]}}),s("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--time"})),s("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--preview",style:{width:i[l]}})));return s("div",{className:"persona-history-view-loading",attrs:{"data-persona-history-state":"loading",role:"status","aria-label":e.loadingLabel}},...n)}function dt(e){let{state:r,copy:i,busy:n}=e;if(r.kind==="loading")return Gt(i);if(r.kind==="empty"){let c=Wt(e.identityStatus,i);return c?re("identity",c.title,c.description,e.onRetry?ve(i.retryIdentityLabel,"state-retry",n,e.onRetry):null,!0):re("empty",i.emptyTitle,i.emptyDescription,null,!1)}if(r.kind==="rate_limited"){let c=r.retryAfterSeconds>0?T(i.rateLimitedWaitDescription,{seconds:r.retryAfterSeconds}):i.rateLimitedDescription;return re("rate_limited",i.rateLimitedTitle,c,e.onRetry?ve(i.retryLabel,"state-retry",n,e.onRetry):null,!1)}if(r.kind==="new_conversation_required")return re("new_conversation_required",i.newConversationRequiredTitle,i.newConversationRequiredDescription,e.onStartNew?ve(i.newConversationLabel,"state-retry",n,e.onStartNew):null,!0);let{title:l,description:d}=jt(r.reason,i),f=r.reason==="authentication_required"||r.reason==="authentication_failed"||r.reason==="identity_provider_failed"?i.retryIdentityLabel:i.retryLabel;return re("error",l,d,r.retryable&&e.onRetry?ve(f,"state-retry",n,e.onRetry):null,!0)}var Ut=25,F="persona:list-options",Xt=180,ct=120,Zt=160,Jt="cubic-bezier(0.4, 0, 1, 1)",Qt={panel:20,rail:12},er=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,tr=e=>e.finished?e.finished.then(()=>{},()=>{}):Promise.resolve();function fe(e){return`${e.state}:${"reason"in e?e.reason:""}`}function yt(e,r){switch(e.state){case"verified":return{title:r.verifiedTitle,description:r.verifiedDescription,pending:!1};case"verifying":case"resetting":return{title:r.verifyingTitle,description:r.verifyingDescription,pending:!0};case"authentication_required":return{title:r.authenticationRequiredTitle,description:r.authenticationRequiredDescription,pending:!1};case"identity_provider_failed":return{title:r.identityProviderFailedTitle,description:r.identityProviderFailedDescription,pending:!1};case"configuration_error":return{title:r.proofNotAdmittedTitle,description:r.proofNotAdmittedDescription,pending:!1};case"unavailable":return{title:r.unavailableTitle,description:r.unavailableDescription,pending:!1};default:return{title:r.browserOnlyTitle,description:r.browserOnlyDescription,pending:!1}}}function rr(e){return e.state==="verified"||e.state==="browser_only"}function or(e){return e.state==="authentication_required"||e.state==="identity_provider_failed"||e.state==="configuration_error"}function ut(e){let r=he(e.copy),i=e.now??(()=>Date.now()),n=e.pageSize??Ut,l=`persona-history-title-${Math.random().toString(36).slice(2,8)}`,d=[],f=null,c={kind:"loading",phase:"initial"},u=null,k=e.activeConversationId,w=e.provider.getIdentityStatus(),oe=fe(w),x=null,N=!1,h=!1,Y=0,S=e.presentation,ht=e.collapsible!==!1,R=e.collapsed===!0,Oe=e.railSide==="right",W=e.renderDom!==!1,I=new Map,A=null,ge=ot(),ie=t=>{!W&&e.onAnnounce?e.onAnnounce(t):ge.announce(t)},b=()=>u!==null,qe=`${l}-body`,g=s("button",{className:"persona-history-icon-button persona-history-back",attrs:{type:"button"}}),j=()=>S==="rail"&&ht,ne,mt=()=>{if(e.railBrand){if(!j()){g.classList.remove("persona-history-back--branded");return}if(ne===void 0){let t=e.railBrand(!0);ne=t?s("span",{className:"persona-history-brand-mark persona-history-toggle-brand",attrs:{"aria-hidden":"true"}},t):null}ne&&(g.classList.add("persona-history-back--branded"),g.appendChild(ne))}},be=()=>{let t=j(),o=S==="rail";g.setAttribute("data-persona-history-focus",t?"collapse":"close"),g.setAttribute("aria-label",t?R?r.expandLabel:r.collapseLabel:o?r.closeLabel:r.backLabel),t?(g.setAttribute("aria-expanded",R?"false":"true"),g.setAttribute("aria-controls",qe),e.collapseShortcut?.aria&&g.setAttribute("aria-keyshortcuts",e.collapseShortcut.aria)):(g.removeAttribute("aria-expanded"),g.removeAttribute("aria-controls"),g.removeAttribute("aria-keyshortcuts")),g.replaceChildren(q(t?"panel-left":o?"x":"arrow-left")),mt()};be(),g.addEventListener("click",()=>{j()?e.onToggleCollapse?.():e.onClose()});let we=s("h2",{className:"persona-history-title",text:r.viewTitle,attrs:{id:l}}),Fe=s("span",{className:"persona-history-scope-title"}),G=s("p",{className:"persona-history-scope"},Fe),se=s("div",{className:"persona-history-heading-group"},we),ze=!1,ae,xe=()=>{let t=S==="rail",o=t?e.renderRailHeader:void 0,a=null,y=o!==void 0;if(o)try{a=o({collapsed:R,defaultTitle:r.viewTitle})}catch(p){y=!1,ze||(ze=!0,console.warn("[persona] history rail renderHeader threw",p))}if(!y&&t&&e.railBrand){if(ae===void 0){let p=e.railBrand(!1);ae=p?s("span",{className:"persona-history-heading-brand",attrs:{"aria-hidden":"true"}},s("span",{className:"persona-history-brand-mark"},p),s("span",{className:"persona-history-wordmark",text:r.viewTitle})):null}ae&&(y=!0,a=ae)}we.classList.toggle("persona-history-sr-only",y),se.replaceChildren(we),a&&se.appendChild(a)};xe();let z=s("button",{className:"persona-history-icon-button persona-history-new-icon",attrs:{type:"button","data-persona-history-focus":"new-icon","aria-label":r.newConversationLabel}});z.appendChild(q("plus")),z.addEventListener("click",()=>{ee()});let vt=[g,z].map(t=>e.attachTooltip?.({anchor:t,text:()=>t.getAttribute("aria-label")??"",...t===g&&e.collapseShortcut?{hint:()=>j()?e.collapseShortcut.hint:""}:{}})),C=s("div",{className:"persona-history-topbar"}),$e=null,He=()=>{let t=S==="rail",o=t?Oe?"rail-right":"rail":"panel";o!==$e&&($e=o,o==="rail"?C.append(se,g):C.append(g,se),t?z.remove():C.appendChild(z),m.classList.toggle("persona-history-view--rail-right",o==="rail-right"))},V=s("div",{className:"persona-history-scope-alert"}),Be=`${l}-scope`,ft=q("plus",18),ke=s("button",{className:"persona-history-new",attrs:{type:"button","data-persona-history-focus":"new"}},ft,s("span",{text:r.newConversationLabel}));ke.addEventListener("click",()=>{ee()});let Ce=s("div",{className:"persona-history-list-region"}),Ke=e.showDeleteAll!==!1,Ye=!!e.provider.resetDevice,M=Ke||Ye?Ie({className:"persona-history-list-options",label:r.listOptionsLabel,focusKey:`menu:${F}`,open:!1,inert:!0,iconSize:16,onToggle:()=>Je(F)}):null,$=s("div",{className:"persona-history-caption",attrs:{"data-persona-history-item":F}},e.showScopeStatus?G:null,M),B=s("div",{className:"persona-history-body",attrs:{id:qe}},e.showScopeStatus?V:null,ke,e.showScopeStatus||M?$:null,Ce),U=e.headerPlacement??"inline";U==="external"&&C.classList.add("persona-history-topbar--shell","persona-history-topbar--shell-enter");let m=s("div",{className:_("persona-history-view",`persona-history-view--${e.presentation}`,"persona-history-view--enter"),attrs:{role:"region","aria-labelledby":l,"data-persona-history-presentation":e.presentation}},ge.element,U==="inline"?C:null,B),Se=()=>{m.classList.toggle("persona-history-view--rail-collapsed",R&&j())};Se(),He();let gt=(t,o)=>{let a=`${l}-s${o}`,y=s("div",{className:_("persona-history-nav",t.placement==="footer"&&"persona-history-nav--footer"),attrs:{role:"group","data-persona-rail-section":t.id,...t.title?{"aria-labelledby":a}:{"aria-label":t.id}}});t.title&&y.appendChild(s("h3",{className:"persona-history-group-heading",text:t.title,attrs:{id:a}}));for(let p of t.items){let H=p.iconNode?.()??null,P=s("button",{className:_("persona-history-nav-item",H&&"persona-history-nav-item--icon"),attrs:{type:"button","aria-label":p.label,"data-persona-rail-item":p.id}},H?s("span",{className:"persona-history-nav-icon"},H):null,s("span",{className:"persona-history-nav-label persona-history-truncate",text:p.label}),p.badge?s("span",{className:"persona-history-nav-badge",text:p.badge}):null);P.addEventListener("click",()=>p.onSelect()),y.appendChild(P)}return y},X=null,We=null,Le=()=>{!X||!W||S!=="rail"||R===We||(We=R,e.railSections.forEach((t,o)=>{if(!t.render)return;let a=X[o],y=t.title?a.firstElementChild:null,p=null;try{p=t.render(R)}catch(H){t.render=void 0,console.warn("[persona] history rail section threw",t.id,H)}a.replaceChildren(...y?[y]:[],...p?[p]:[]),a.hidden=!p}))},je=()=>{let t=e.railSections;if(t?.length){if(S!=="rail"){X?.forEach(o=>o.remove());return}X??(X=t.map(gt));for(let o of["above-conversations","below-conversations","footer"]){let a=o==="above-conversations"?$.parentNode===B?$:Ce:null;t.forEach((y,p)=>{y.placement===o&&B.insertBefore(X[p],a)})}Le()}};je(),tt(m,"persona-history-view",it);let Ge=(t,o)=>{let a=m.ownerDocument.defaultView?.getComputedStyle(m).getPropertyValue(t),y=Number.parseFloat(a??"");return Number.isFinite(y)&&y>=0?y:o},bt=(t,o)=>m.ownerDocument.defaultView?.getComputedStyle(m).getPropertyValue(t).trim()||o,Z=null,O=()=>{Z!==null&&(clearTimeout(Z),Z=null),m.removeEventListener("animationend",O),m.classList.remove("persona-history-view--enter")};m.addEventListener("animationend",O),Z=setTimeout(()=>{Z=setTimeout(O,Ge("--persona-history-enter-ms",Xt)+60)},0);let J=null,Q=()=>{J!==null&&(clearTimeout(J),J=null),C.classList.remove("persona-history-topbar--shell-enter")},wt=()=>{Q(),C.classList.add("persona-history-topbar--shell-enter"),J=setTimeout(Q,ct+60)};U==="external"&&(J=setTimeout(Q,ct+60));let le=[],pe=null,xt=()=>{if(pe)return pe;if(h||er()||typeof m.animate!="function")return O(),null;let t=m.ownerDocument.defaultView?.getComputedStyle(B).opacity||"1";O(),m.style.pointerEvents="none",D.style.pointerEvents="none";let o={duration:Ge("--persona-history-exit-ms",Zt),easing:bt("--persona-history-exit-easing",Jt),fill:"forwards"},a=Qt[S];return le=[B.animate([{opacity:t,transform:"none"},{opacity:0,transform:`translateX(${a}px)`}],o)],pe=Promise.all(le.map(tr)).then(()=>{}),pe},Te=(t,o)=>{t&&(o?t.setAttribute("aria-disabled","true"):t.removeAttribute("aria-disabled"))},D=C,Re=null,Ht=()=>{let t=e.slots?.header;if(!t)return;let o=`${S}|${fe(w)}|${u?`${u.kind}:${"conversationId"in u?u.conversationId:""}`:""}`;if(o===Re)return;Re=o;let a=t({identityStatus:w,pendingAction:u,copy:r,defaultRenderer:()=>C})??C;a!==D&&(D.replaceWith(a),D=a)},Ue=null,kt=()=>{if(!e.showScopeStatus)return;let t=fe(w);if(t===Ue)return;Ue=t;let o=yt(w,r);Fe.textContent=o.title;let a=rr(w);if(G.hidden=!a,V.replaceChildren(...a?[]:[s("span",{className:"persona-history-scope-alert-title",text:o.title})],s("span",{className:"persona-history-scope-description",text:o.description,attrs:{id:Be}})),V.setAttribute("data-persona-history-scope-tone",a?"ambient":"attention"),a?G.setAttribute("aria-describedby",Be):G.removeAttribute("aria-describedby"),o.pending?V.setAttribute("role","status"):V.removeAttribute("role"),V.setAttribute("data-persona-history-identity",w.state),or(w)){let y=s("button",{className:"persona-history-secondary persona-history-state-action",text:r.retryIdentityLabel,attrs:{type:"button","data-persona-history-focus":"identity-retry"}});y.addEventListener("click",()=>{b()||E("refresh")}),V.appendChild(y)}},Xe=t=>u?u.kind==="open"&&u.conversationId===t?"opening":u.kind==="delete"&&u.conversationId===t?"deleting":null:null,Ct=()=>{let t=document.activeElement;return!(t instanceof HTMLElement)||!m.contains(t)?null:t.getAttribute("data-persona-history-focus")},St=t=>{if(N&&x){N=!1;let o=m.querySelector(`[data-persona-history-focus="${te(x)}"]`);if(o){o.focus();return}}t&&m.querySelector(`[data-persona-history-focus="${t}"]`)?.focus()},Lt=()=>{if(!A)return null;let t=s("button",{className:"persona-history-secondary persona-history-state-action",text:r.retryLabel,attrs:{type:"button","data-persona-history-focus":"action-retry"}}),o=A;return t.addEventListener("click",()=>{b()||o.retry()}),s("div",{className:"persona-history-row-error",attrs:{role:"alert"}},s("span",{text:o.message}),t)},Tt=()=>nt(d,i(),r).map((t,o)=>{let a=`${l}-g${o}`,y=s("ul",{className:"persona-history-list",attrs:{"aria-labelledby":a}});for(let p of t.items){let H=()=>lt({conversation:p,active:p.id===k,pending:Xe(p.id),busy:b(),menuOpen:x===p.id,error:I.get(p.id)??null,avatar:e.rowAvatar,showDelete:e.showDelete!==!1,nowMs:i(),copy:r,onOpen:()=>{de(p.id)},onToggleMenu:()=>Je(p.id),onCloseMenu:De=>L(De),onDelete:()=>{ce(p.id)}}),K=e.slots?.conversation?.({conversation:p,active:p.id===k,pending:Xe(p.id),open:()=>de(p.id),requestDelete:()=>ce(p.id),defaultRenderer:H})??H();y.appendChild(K instanceof HTMLLIElement?K:s("li",{className:"persona-history-item"},K))}return s("div",{className:"persona-history-group",attrs:{"data-persona-history-group":t.key}},s("h3",{className:"persona-history-group-heading",text:t.label,attrs:{id:a}}),y)}),Rt=()=>{if(!f)return null;let t=u?.kind==="load-more"||c.kind==="loading"&&c.phase==="load-more",o=s("button",{className:"persona-history-secondary persona-history-load-more",text:t?r.loadingMoreLabel:r.loadMoreLabel,attrs:{type:"button","data-persona-history-focus":"load-more",...t?{"aria-busy":"true","aria-disabled":"true"}:{},...b()&&!t?{"aria-disabled":"true"}:{}}});return o.addEventListener("click",()=>{b()||E("load-more")}),o},At=()=>{let t=Ct(),o=[Lt()],a=d.length>0;if(a&&(o.push(...Tt()),o.push(Rt())),c.kind!=="ready"&&!(c.kind==="loading"&&c.phase!=="initial"&&a)){let p=c,H=p.kind==="loading"?void 0:()=>E("refresh"),P=p.kind==="new_conversation_required"?()=>ee():void 0,K=()=>dt({state:p,copy:r,identityStatus:w,busy:b(),...H?{onRetry:()=>{H()}}:{},...P?{onStartNew:()=>{P()}}:{}}),De=e.slots?.state?.({state:p,identityStatus:w,copy:r,...H?{retry:H}:{},...P?{startNewConversation:P}:{},defaultRenderer:K});o.push(De??K())}Ce.replaceChildren(...o.filter(p=>!!p)),St(t)},Et=()=>{let t=c.kind==="loading"&&d.length===0,o=[],a=()=>o.length===0?te(F):`${te(F)}-${o.length}`;return Ke&&!(d.length===0&&(c.kind==="empty"||t))&&o.push({label:r.clearHistoryLabel,focusKey:a(),onSelect:()=>{Ee()}}),Ye&&!t&&o.push({label:r.resetIdentityLabel,focusKey:a(),onSelect:()=>{Me()}}),o},Nt=()=>{if(Te(ke,b()),Te(z,b()),M){let t=Et(),o=c.kind==="loading"&&d.length===0;M.hidden=t.length===0&&!o,Te(M,b()||t.length===0),M.setAttribute("aria-expanded",x===F?"true":"false");let a=$.querySelector(".persona-history-menu");if(x!==F||t.length===0)a?.remove();else{let y=Ve({label:r.listOptionsLabel,items:t,onCloseMenu:p=>L(p)});a?a.replaceWith(y):$.appendChild(y)}}$.hidden=(!M||M.hidden)&&(!e.showScopeStatus||G.hidden)},Ze,Mt=()=>{let t=e.onActiveConversationChange;if(!t)return;let o=d.find(y=>y.id===k)??null,a=o?`${o.id}\0${o.title}\0${o.starred?1:0}`:"";a!==Ze&&(Ze=a,t(o))},v=()=>{if(!h){if(Mt(),!W){e.onModelChange?.();return}Ht(),kt(),Nt(),At(),Le()}},L=t=>{if(!x)return;let o=x;x=null,N=!1,v(),t?.restoreFocus&&m.querySelector(`[data-persona-history-focus="menu:${o}"]`)?.focus()},Je=t=>{if(x===t){L({restoreFocus:!0});return}x=t,N=!0,v()},Qe=t=>{if(!x)return;let o=t.target;o instanceof Node&&m.contains(o)&&o.closest?.(`[data-persona-history-item="${x}"]`)||L()};document.addEventListener("pointerdown",Qe,!0);let et=t=>{t.key!=="Escape"||!x||(t.stopPropagation(),L({restoreFocus:!0}))};m.addEventListener("keydown",et);async function E(t){if(h)return;let o=++Y,a=t==="load-more"?f:null;if(!(t==="load-more"&&!a)){u={kind:t==="load-more"?"load-more":"refresh"},c={kind:"loading",phase:t},t!=="load-more"&&(I.clear(),A=null),L(),v();try{let y=await e.provider.list({limit:n,context:e.context,...a?{cursor:a}:{},...e.targetId?{targetId:e.targetId}:{}});if(h||o!==Y)return;d=a?[...d,...y.items]:y.items,f=y.nextCursor,c=d.length===0?{kind:"empty"}:{kind:"ready"}}catch(y){if(h||o!==Y)return;c=pt(y)}finally{!h&&o===Y&&(u=null,v())}}}let Ae=t=>{d=d.filter(o=>o.id!==t),I.delete(t),k===t&&(k=null),d.length===0&&!f&&(c={kind:"empty"})};async function de(t){if(!(b()||h)){I.delete(t),L(),u={kind:"open",conversationId:t},v();try{if(await e.onSelect(t),h)return;k=t}catch{if(h)return;I.set(t,{message:r.openFailedLabel,retry:()=>{de(t)}})}finally{h||(u=null,v())}}}async function ce(t){if(b()||h)return"cancelled";I.delete(t),u={kind:"delete",conversationId:t},v();try{let o=await e.onRequestDeleteConversation(t);return h||o==="deleted"&&(Ae(t),ie(r.conversationRemovedNotice)),o}catch(o){return h||(ye(o)&&o.code==="not_found"?Ae(t):I.set(t,{message:r.deleteFailedLabel,retry:()=>{ce(t)}})),"cancelled"}finally{h||(u=null,v())}}async function ee(){if(!(b()||h)){A=null,L(),u={kind:"start-new"},v();try{if(await e.onStartNew(),h)return;c.kind==="new_conversation_required"&&(c=d.length===0?{kind:"empty"}:{kind:"ready"})}catch{if(h)return;A={message:r.errorDescription,retry:()=>{ee()}}}finally{h||(u=null,v())}}}async function Ee(){if(b()||h)return"cancelled";A=null,L(),u={kind:"clear"},v();try{let t=await e.onRequestClearHistory();return h||t==="cleared"&&(d=[],f=null,k=null,c={kind:"empty"},ie(r.historyClearedNotice)),t}catch{return h||(A={message:r.errorDescription,retry:()=>{Ee()}}),"cancelled"}finally{h||(u=null,v())}}let Ne={outcome:"cancelled"};async function Me(){if(b()||h||!e.onRequestResetIdentity)return Ne;A=null,L(),u={kind:"reset"},v();try{let t=await e.onRequestResetIdentity();return h||t.outcome==="reset"&&(ie(t.remoteRevocationConfirmed?r.identityResetNotice:r.identityResetUnconfirmedNotice),u=null,await E("refresh")),t}catch{return h||(A={message:r.errorDescription,retry:()=>{Me()}}),Ne}finally{!h&&u?.kind==="reset"&&(u=null,v())}}let Dt=e.provider.subscribeIdentityStatus(t=>{if(h)return;let o=fe(t),a=o!==oe;w=t,oe=o,v(),a&&t.state!=="verifying"&&ie(yt(t,r).title)}),Pt=e.provider.subscribeAvailability?.(t=>{if(!h){if(t){E("refresh");return}d=[],f=null,c={kind:"error",reason:"unavailable",retryable:!1},v()}});return v(),E("initial"),{element:m,copy:r,getModel:()=>({conversations:d,activeConversationId:k,state:c,pendingAction:u,identityStatus:w,nextCursor:f}),operations:{refresh:async()=>{b()||await E("refresh")},loadMore:async()=>{b()||await E("load-more")},openConversation:t=>de(t),startNewConversation:()=>ee(),requestDeleteConversation:t=>ce(t),requestClearConversationHistory:()=>Ee(),requestResetHistoryIdentity:()=>Me()},setDomRenderEnabled:t=>{t!==W&&(W=t,t&&v())},refresh:()=>{E("refresh")},setPresentation:t=>{if(t===S)return;O(),S=t,Re=null;let o=t==="rail";m.classList.toggle("persona-history-view--panel",!o),m.classList.toggle("persona-history-view--rail",o),m.setAttribute("data-persona-history-presentation",t),be(),Se(),He(),xe(),je(),v()},setCollapsed:t=>{t!==R&&(R=t,Se(),be(),xe(),Le())},setRailSide:t=>{Oe=t==="right",He()},getHeaderElement:()=>D,setHeaderPlacement:t=>{if(t===U)return;U=t;let o=t==="external";if(C.classList.toggle("persona-history-topbar--shell",o),o){wt(),D.remove();return}Q(),m.insertBefore(D,B)},setActiveConversationId:t=>{k!==t&&(k=t,v())},applyConversationSummary:t=>{let o=d.findIndex(a=>a.id===t.id);o!==-1&&(d[o]=t,v())},removeConversationSummary:t=>{d.some(o=>o.id===t)&&(Ae(t),v())},setNewConversationRequired:t=>{t?c={kind:"new_conversation_required"}:c.kind==="new_conversation_required"&&(c=d.length===0?{kind:"empty"}:{kind:"ready"}),v()},playExit:xt,destroy:()=>{h=!0,Y+=1,O(),Q(),vt.forEach(t=>t?.destroy()),D.remove(),le.forEach(t=>t.cancel()),le=[],Dt(),Pt?.(),document.removeEventListener("pointerdown",Qe,!0),m.removeEventListener("keydown",et),ge.destroy(),m.remove(),m.replaceChildren()}}}export{ue as HISTORY_VIEW_COPY_DEFAULTS,ut as createHistoryView,he as resolveHistoryViewCopy};
