import{b as ye,c as ot}from"./chunk-EFJBUH5F.js";import{a as rt}from"./chunk-Q735PSZL.js";import{c as n,d as T}from"./chunk-76IELU7F.js";function it(){let e=document.createElement("div");e.className="persona-history-sr-only",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("data-persona-history-live-region","");let r;return{element:e,announce(i){r!==void 0&&clearTimeout(r),e.textContent="",r=setTimeout(()=>{r=void 0,e.textContent=i},0)},destroy(){r!==void 0&&clearTimeout(r),e.remove()}}}var nt=`
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
.persona-history-view--panel .persona-history-conversations-title,
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
.persona-history-view .persona-history-conversations-title {
  margin: 0;
  font-family: var(--persona-components-history-listHeading-fontFamily, inherit);
  font-size: var(--persona-components-history-listHeading-fontSize, 14px);
  font-weight: var(--persona-components-history-listHeading-fontWeight, 600);
  line-height: var(--persona-components-history-listHeading-lineHeight, 20px);
  letter-spacing: var(--persona-components-history-listHeading-letterSpacing, normal);
  color: var(--persona-components-history-listHeading-color, var(--persona-text, #111827));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.persona-history-view .persona-history-scope-icon {
  display: none;
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
  font-family: var(--persona-components-history-groupHeading-fontFamily, inherit);
  font-size: var(--persona-components-history-groupHeading-fontSize, 12px);
  font-weight: var(--persona-components-history-groupHeading-fontWeight, 600);
  line-height: var(--persona-components-history-groupHeading-lineHeight, 1.35);
  letter-spacing: var(--persona-components-history-groupHeading-letterSpacing, normal);
  color: var(--persona-components-history-groupHeading-color, var(--persona-text-muted, #6b7280));
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
.persona-history-view--rail .persona-history-caption .persona-history-menu {
  grid-row: 1 / 2;
  grid-column: 1 / -1;
  top: calc(100% + 2px);
  right: 0;
}
.persona-history-view button.persona-history-menu-item {
  display: block;
  width: 100%;
  min-height: 32px;
  padding: 6px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--persona-text, #111827);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.persona-history-view button.persona-history-menu-item--danger {
  color: var(--persona-history-danger-fg, var(--persona-palette-colors-error-600, #b91c1c));
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
    var(--persona-text, #111827)
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
.persona-history-view--rail .persona-history-caption {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  /* Explicit rows: the abspos menu is grid-placed into row 1, and abspos
     grid placement only resolves against explicit lines (implicit/auto ends
     fall back to the padding-box edge, i.e. below the scope line). */
  grid-template-rows: auto auto;
  align-items: center;
  row-gap: 2px;
}
.persona-history-view--rail .persona-history-conversations-title {
  grid-row: 1;
  grid-column: 1;
}
.persona-history-view--rail .persona-history-caption button.persona-history-list-options {
  grid-row: 1;
  grid-column: 2;
  margin-left: 0;
}
.persona-history-view--rail .persona-history-scope {
  grid-row: 2;
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 6px;
}
.persona-history-view--rail .persona-history-scope[hidden] {
  display: none;
}
.persona-history-view--rail .persona-history-scope-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.persona-history-view--rail .persona-history-scope[data-persona-history-identity="browser_only"] .persona-history-scope-icon {
  display: flex;
  flex: none;
  align-items: center;
}
.persona-history-view--rail.persona-history-view--has-nav .persona-history-caption {
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid var(--persona-history-border);
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
  font-size: var(--persona-components-history-groupHeading-fontSize, 13px);
  font-weight: var(--persona-components-history-groupHeading-fontWeight, 500);
  line-height: var(--persona-components-history-groupHeading-lineHeight, 20px);
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
`;var ue={...ot,emptyTitle:"No conversations yet",emptyDescription:"Start a conversation and it will show up here.",errorTitle:"Could not load conversations",errorDescription:"Something went wrong. Please try again.",retryLabel:"Retry",rateLimitedTitle:"Too many requests",rateLimitedDescription:"Please wait a moment before trying again.",groupStarred:"Starred",groupToday:"Today",groupYesterday:"Yesterday",groupPrevious7Days:"Previous 7 days",groupPrevious30Days:"Previous 30 days",groupMonthYear:"{month} {year}",browserOnlyTitle:"On this device",browserOnlyDescription:"Another browser or device keeps its own separate history.",verifyingTitle:"Checking your account",verifyingDescription:"Looking for messages linked to your account.",verifiedTitle:"Available across signed-in devices",verifiedDescription:"This list refreshes when the chat opens rather than syncing live.",authenticationRequiredTitle:"Sign in to see your messages",authenticationRequiredDescription:"Your session expired. Sign in again to load account history.",identityProviderFailedTitle:"Account history is unavailable",identityProviderFailedDescription:"We could not verify your account, so account history is not shown here.",proofNotAdmittedTitle:"Account history is unavailable",proofNotAdmittedDescription:"This assistant is not set up to accept your account identity.",retryIdentityLabel:"Try again",backLabel:"Back to conversation",closeLabel:"Close conversation list",loadingLabel:"Loading conversations",loadMoreLabel:"Load more",loadingMoreLabel:"Loading more conversations",conversationsTitle:"Conversations",rowActionsLabel:"Conversation options",listOptionsLabel:"Conversation options",deleteConversationLabel:"Delete",clearHistoryLabel:"Delete all conversations",resetIdentityLabel:"Forget this device",messageCountLabel:"{count} messages",messageCountLabelOne:"1 message",conversationRemovedNotice:"Conversation deleted.",historyClearedNotice:"All conversations were deleted.",unavailableTitle:"Conversation history is unavailable",unavailableDescription:"Try again later.",newConversationRequiredTitle:"Start a new conversation",newConversationRequiredDescription:"The previous conversation is gone. Start a new one to keep chatting.",rateLimitedWaitDescription:"You can try again in {seconds} seconds.",openFailedLabel:"Could not open that conversation.",deleteFailedLabel:"Could not delete that conversation.",relativeNow:"now",relativeMinutes:"{value}m",relativeHours:"{value}h",relativeDays:"{value}d",relativeWeeks:"{value}w",relativeYears:"{value}y"};function he(e){if(!e)return ue;let r={...ue};for(let[i,s]of Object.entries(e))typeof s=="string"&&s.length>0&&(r[i]=s);return r}function A(e,r){return e.replace(/\{(\w+)\}/g,(i,s)=>s in r?String(r[s]):i)}var Pe=864e5;function Vt(e){let r=new Date(e);return r.setHours(0,0,0,0),r.getTime()}function _e(e,r){let i=Date.parse(e);return Number.isFinite(i)?i:r}function Ot(e,r){let i=_e(e,r),s=Vt(r);if(i>=s)return"today";if(i>=s-Pe)return"yesterday";if(i>=s-7*Pe)return"previous-7-days";if(i>=s-30*Pe)return"previous-30-days";let l=new Date(i);return`month:${l.getFullYear()}-${l.getMonth()}`}function qt(e,r,i,s){if(e==="today")return s.groupToday;if(e==="yesterday")return s.groupYesterday;if(e==="previous-7-days")return s.groupPrevious7Days;if(e==="previous-30-days")return s.groupPrevious30Days;let l=new Date(_e(r,i));return A(s.groupMonthYear,{month:l.toLocaleString(void 0,{month:"long"}),year:l.getFullYear()})}function st(e,r,i,s="time"){let l=e.filter(h=>h.starred),p=l.length>0?[{key:"starred",label:i.groupStarred,items:l}]:[];if(s==="none"){let h=e.filter(y=>!y.starred);return h.length>0&&p.push({key:"recent",label:i.conversationsTitle,items:h}),p}for(let h of e){if(h.starred)continue;let y=Ot(h.updatedAt,r),u=p[p.length-1];if(u&&u.key===y){u.items.push(h);continue}p.push({key:y,label:qt(y,h.updatedAt,r,i),items:[h]})}return p}function at(e,r,i){let s=Math.max(0,r-_e(e,r)),l=Math.floor(s/6e4);if(l<1)return i.relativeNow;if(l<60)return A(i.relativeMinutes,{value:l});let p=Math.floor(l/60);if(p<24)return A(i.relativeHours,{value:p});let h=Math.floor(p/24);if(h<7)return A(i.relativeDays,{value:h});let y=Math.floor(h/7);return h<365?A(i.relativeWeeks,{value:y}):A(i.relativeYears,{value:Math.floor(h/365)})}function lt(e,r){return e===1?r.messageCountLabelOne:A(r.messageCountLabel,{count:e})}var me="http://www.w3.org/2000/svg",Ft={"arrow-left":["m12 19-7-7 7-7","M19 12H5"],plus:["M5 12h14","M12 5v14"],star:["m12 2 2.9 6.2 6.8.7-5.1 4.5 1.4 6.6-6-3.4-6 3.4 1.4-6.6-5.1-4.5 6.8-.7z"],x:["M18 6 6 18","m6 6 12 12"],"panel-left":["M9 3v18"],monitor:["M8 21h8","M12 17v4"],ellipsis:[]},zt={"panel-left":[3,3,18,18],monitor:[2,3,20,14]};function _(e,r=20){let i=document.createElementNS(me,"svg");if(i.setAttribute("width",String(r)),i.setAttribute("height",String(r)),i.setAttribute("viewBox","0 0 24 24"),i.setAttribute("fill","none"),i.setAttribute("stroke","currentColor"),i.setAttribute("stroke-width","2"),i.setAttribute("stroke-linecap","round"),i.setAttribute("stroke-linejoin","round"),i.setAttribute("aria-hidden","true"),i.setAttribute("focusable","false"),e==="ellipsis"){for(let l of[12,19,5]){let p=document.createElementNS(me,"circle");p.setAttribute("cx",String(l)),p.setAttribute("cy","12"),p.setAttribute("r","1"),i.appendChild(p)}return i}let s=zt[e];if(s){let l=document.createElementNS(me,"rect");l.setAttribute("x",String(s[0])),l.setAttribute("y",String(s[1])),l.setAttribute("width",String(s[2])),l.setAttribute("height",String(s[3])),l.setAttribute("rx","2"),i.appendChild(l)}for(let l of Ft[e]){let p=document.createElementNS(me,"path");p.setAttribute("d",l),i.appendChild(p)}return i}var $t=/^(https?:|\/|data:)/i;function Kt(e){let r=n("span",{className:"persona-history-row-avatar",attrs:{"aria-hidden":"true"}});return $t.test(e)?r.appendChild(n("img",{attrs:{src:e,alt:"",loading:"lazy"}})):r.textContent=e,r}var Bt=e=>`row:${e}`,Wt=e=>`menu:${e}`,te=e=>`menu-item:${e}`;function pt(e){let{conversation:r,copy:i,busy:s,pending:l}=e,p=s||l!==null,h=r.title.trim().length>0,y=r.starred?(()=>{let M=_("star",11);return M.setAttribute("fill","currentColor"),M.setAttribute("stroke-width","1"),n("span",{className:"persona-history-row-star"},M,n("span",{className:"persona-history-sr-only",text:i.groupStarred}))})():null,u=n("div",{className:"persona-history-row-head"},n("span",{className:"persona-history-row-title persona-history-truncate",text:h?r.title:r.preview??""}),y,n("time",{className:"persona-history-row-time",attrs:{datetime:r.updatedAt},text:at(r.updatedAt,e.nowMs,i)})),S=h&&r.preview?n("span",{className:"persona-history-row-preview persona-history-truncate",text:r.preview}):null,b=n("button",{className:T("persona-history-row",e.active&&"persona-history-row--active",l&&`persona-history-row--${l}`),attrs:{type:"button","data-persona-history-focus":Bt(r.id),"data-persona-history-conversation":r.id,...e.active?{"aria-current":"page"}:{},...p?{"aria-disabled":"true"}:{},...l?{"aria-busy":"true"}:{}}},e.avatar?Kt(e.avatar):null,n("div",{className:"persona-history-row-body"},u,S,n("span",{className:"persona-history-row-count persona-history-sr-only",text:lt(r.messageCount,i)})));b.addEventListener("click",()=>{p||e.onOpen()});let oe=e.showDelete?Ie({className:"persona-history-row-menu-button",label:`${i.rowActionsLabel}: ${r.title}`,focusKey:Wt(r.id),open:e.menuOpen,inert:p,onToggle:e.onToggleMenu}):null;return n("li",{className:T("persona-history-item",!e.showDelete&&"persona-history-item--no-menu"),attrs:{"data-persona-history-item":r.id}},b,oe,e.menuOpen&&e.showDelete?Yt(e):null,e.error?Gt(e.error,i,r.id):null)}function Yt(e){let{conversation:r,copy:i}=e;return Ve({label:`${i.rowActionsLabel}: ${r.title}`,items:[{label:i.deleteConversationLabel,focusKey:te(r.id),danger:!0,onSelect:e.onDelete}],onCloseMenu:e.onCloseMenu})}function Ie(e){let r=n("button",{className:T("persona-history-icon-button",e.className),attrs:{type:"button","aria-label":e.label,"aria-haspopup":"menu","aria-expanded":e.open?"true":"false","data-persona-history-focus":e.focusKey,...e.inert?{"aria-disabled":"true"}:{}}});r.appendChild(_("ellipsis",e.iconSize));let i=()=>r.getAttribute("aria-disabled")==="true";return r.addEventListener("click",s=>{s.stopPropagation(),!i()&&e.onToggle()}),r.addEventListener("keydown",s=>{s.key!=="ArrowDown"&&s.key!=="ArrowUp"||(s.preventDefault(),!(i()||r.getAttribute("aria-expanded")==="true")&&e.onToggle())}),r}function Ve(e){let r=n("div",{className:"persona-history-menu",attrs:{role:"menu","aria-label":e.label}});for(let i of e.items){let s=n("button",{className:T("persona-history-menu-item",i.danger&&"persona-history-menu-item--danger"),text:i.label,attrs:{type:"button",role:"menuitem",tabindex:"0","data-persona-history-focus":i.focusKey}});s.addEventListener("click",()=>{e.onCloseMenu(),i.onSelect()}),r.appendChild(s)}return r.addEventListener("keydown",i=>{let s=Array.from(r.querySelectorAll('[role="menuitem"]'));if(s.length===0)return;let l=s.indexOf(document.activeElement);if(i.key==="Tab"){e.onCloseMenu({restoreFocus:!0});return}if(i.key==="ArrowDown"){i.preventDefault(),s[(l+1+s.length)%s.length]?.focus();return}if(i.key==="ArrowUp"){i.preventDefault(),s[(l-1+s.length)%s.length]?.focus();return}if(i.key==="Home"){i.preventDefault(),s[0]?.focus();return}i.key==="End"&&(i.preventDefault(),s[s.length-1]?.focus())}),r}function Gt(e,r,i){let s=n("button",{className:"persona-history-secondary persona-history-state-action",text:r.retryLabel,attrs:{type:"button","data-persona-history-focus":`row-retry:${i}`}});return s.addEventListener("click",e.retry),n("div",{className:"persona-history-row-error",attrs:{role:"alert"}},n("span",{text:e.message}),s)}function jt(e){switch(e){case"authentication_failed":case"authentication_required":case"identity_provider_failed":case"proof_not_admitted":case"unsupported_scope":case"unavailable":return e;default:return"unknown"}}function dt(e){if(ye(e)){if(e.code==="rate_limited")return{kind:"rate_limited",retryAfterSeconds:e.retryAfterSeconds??0};let r=jt(e.code);return{kind:"error",reason:r,retryable:r!=="unsupported_scope"}}return{kind:"error",reason:"unknown",retryable:!0}}function Ut(e,r){switch(e.state){case"authentication_required":return{title:r.authenticationRequiredTitle,description:r.authenticationRequiredDescription};case"identity_provider_failed":return{title:r.identityProviderFailedTitle,description:r.identityProviderFailedDescription};case"configuration_error":return{title:r.proofNotAdmittedTitle,description:r.proofNotAdmittedDescription};default:return null}}function Xt(e,r){switch(e){case"authentication_required":case"authentication_failed":return{title:r.authenticationRequiredTitle,description:r.authenticationRequiredDescription};case"identity_provider_failed":return{title:r.identityProviderFailedTitle,description:r.identityProviderFailedDescription};case"proof_not_admitted":case"unsupported_scope":return{title:r.proofNotAdmittedTitle,description:r.proofNotAdmittedDescription};case"unavailable":return{title:r.unavailableTitle,description:r.unavailableDescription};default:return{title:r.errorTitle,description:r.errorDescription}}}function ve(e,r,i,s){let l=n("button",{className:"persona-history-secondary persona-history-state-action",text:e,attrs:{type:"button","data-persona-history-focus":r,...i?{"aria-disabled":"true"}:{}}});return l.addEventListener("click",()=>{i||s()}),l}function re(e,r,i,s,l){return n("div",{className:"persona-history-state",attrs:{"data-persona-history-state":e,...l?{role:"alert"}:{role:"status"}}},n("p",{className:"persona-history-state-title",text:r}),n("p",{className:"persona-history-state-description",text:i}),s)}function Zt(e){let r=["42%","58%","34%"],i=["94%","78%","88%"],s=[0,1,2].map(l=>n("div",{className:"persona-history-skeleton-row",attrs:{"aria-hidden":"true"}},n("div",{className:"persona-history-skeleton-head"},n("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--title",style:{width:r[l]}}),n("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--time"})),n("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--preview",style:{width:i[l]}})));return n("div",{className:"persona-history-view-loading",attrs:{"data-persona-history-state":"loading",role:"status","aria-label":e.loadingLabel}},...s)}function ct(e){let{state:r,copy:i,busy:s}=e;if(r.kind==="loading")return Zt(i);if(r.kind==="empty"){let y=Ut(e.identityStatus,i);return y?re("identity",y.title,y.description,e.onRetry?ve(i.retryIdentityLabel,"state-retry",s,e.onRetry):null,!0):re("empty",i.emptyTitle,i.emptyDescription,null,!1)}if(r.kind==="rate_limited"){let y=r.retryAfterSeconds>0?A(i.rateLimitedWaitDescription,{seconds:r.retryAfterSeconds}):i.rateLimitedDescription;return re("rate_limited",i.rateLimitedTitle,y,e.onRetry?ve(i.retryLabel,"state-retry",s,e.onRetry):null,!1)}if(r.kind==="new_conversation_required")return re("new_conversation_required",i.newConversationRequiredTitle,i.newConversationRequiredDescription,e.onStartNew?ve(i.newConversationLabel,"state-retry",s,e.onStartNew):null,!0);let{title:l,description:p}=Xt(r.reason,i),h=r.reason==="authentication_required"||r.reason==="authentication_failed"||r.reason==="identity_provider_failed"?i.retryIdentityLabel:i.retryLabel;return re("error",l,p,r.retryable&&e.onRetry?ve(h,"state-retry",s,e.onRetry):null,!0)}var Jt=25,F="persona:list-options",Qt=180,yt=120,er=160,tr="cubic-bezier(0.4, 0, 1, 1)",rr={panel:20,rail:12},or=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,ir=e=>e.finished?e.finished.then(()=>{},()=>{}):Promise.resolve();function ge(e){return`${e.state}:${"reason"in e?e.reason:""}`}function ut(e,r){switch(e.state){case"verified":return{title:r.verifiedTitle,description:r.verifiedDescription,pending:!1};case"verifying":case"resetting":return{title:r.verifyingTitle,description:r.verifyingDescription,pending:!0};case"authentication_required":return{title:r.authenticationRequiredTitle,description:r.authenticationRequiredDescription,pending:!1};case"identity_provider_failed":return{title:r.identityProviderFailedTitle,description:r.identityProviderFailedDescription,pending:!1};case"configuration_error":return{title:r.proofNotAdmittedTitle,description:r.proofNotAdmittedDescription,pending:!1};case"unavailable":return{title:r.unavailableTitle,description:r.unavailableDescription,pending:!1};default:return{title:r.browserOnlyTitle,description:r.browserOnlyDescription,pending:!1}}}function nr(e){return e.state==="verified"||e.state==="browser_only"}function sr(e){return e.state==="authentication_required"||e.state==="identity_provider_failed"||e.state==="configuration_error"}function ht(e){let r=he(e.copy),i=e.now??(()=>Date.now()),s=e.pageSize??Jt,l=`persona-history-title-${Math.random().toString(36).slice(2,8)}`,p=[],h=null,y={kind:"loading",phase:"initial"},u=null,S=e.activeConversationId,b=e.provider.getIdentityStatus(),oe=ge(b),x=null,M=!1,m=!1,Y=0,k=e.presentation,mt=e.collapsible!==!1,R=e.collapsed===!0,Oe=e.railSide==="right",G=e.renderDom!==!1,I=new Map,E=null,fe=it(),ie=t=>{!G&&e.onAnnounce?e.onAnnounce(t):fe.announce(t)},w=()=>u!==null,qe=`${l}-body`,f=n("button",{className:"persona-history-icon-button persona-history-back",attrs:{type:"button"}}),j=()=>k==="rail"&&mt,ne,vt=()=>{if(e.railBrand){if(!j()){f.classList.remove("persona-history-back--branded");return}if(ne===void 0){let t=e.railBrand(!0);ne=t?n("span",{className:"persona-history-brand-mark persona-history-toggle-brand",attrs:{"aria-hidden":"true"}},t):null}ne&&(f.classList.add("persona-history-back--branded"),f.appendChild(ne))}},be=()=>{let t=j(),o=k==="rail";f.setAttribute("data-persona-history-focus",t?"collapse":"close"),f.setAttribute("aria-label",t?R?r.expandLabel:r.collapseLabel:o?r.closeLabel:r.backLabel),t?(f.setAttribute("aria-expanded",R?"false":"true"),f.setAttribute("aria-controls",qe),e.collapseShortcut?.aria&&f.setAttribute("aria-keyshortcuts",e.collapseShortcut.aria)):(f.removeAttribute("aria-expanded"),f.removeAttribute("aria-controls"),f.removeAttribute("aria-keyshortcuts")),f.replaceChildren(_(t?"panel-left":o?"x":"arrow-left")),vt()};be(),f.addEventListener("click",()=>{j()?e.onToggleCollapse?.():e.onClose()});let we=n("h2",{className:"persona-history-title",text:r.viewTitle,attrs:{id:l}}),Fe=n("span",{className:"persona-history-scope-title"}),z=n("p",{className:"persona-history-scope"},n("span",{className:"persona-history-scope-icon",attrs:{"aria-hidden":"true"}},_("monitor",14)),Fe),se=n("div",{className:"persona-history-heading-group"},we),ze=!1,ae,xe=()=>{let t=k==="rail",o=t?e.renderRailHeader:void 0,a=null,c=o!==void 0;if(o)try{a=o({collapsed:R,defaultTitle:r.viewTitle})}catch(d){c=!1,ze||(ze=!0,console.warn("[persona] history rail renderHeader threw",d))}if(!c&&t&&e.railBrand){if(ae===void 0){let d=e.railBrand(!1);ae=d?n("span",{className:"persona-history-heading-brand",attrs:{"aria-hidden":"true"}},n("span",{className:"persona-history-brand-mark"},d),n("span",{className:"persona-history-wordmark",text:r.viewTitle})):null}ae&&(c=!0,a=ae)}we.classList.toggle("persona-history-sr-only",c),se.replaceChildren(we),a&&se.appendChild(a)};xe();let $=n("button",{className:"persona-history-icon-button persona-history-new-icon",attrs:{type:"button","data-persona-history-focus":"new-icon","aria-label":r.newConversationLabel}});$.appendChild(_("plus")),$.addEventListener("click",()=>{ee()});let gt=[f,$].map(t=>e.attachTooltip?.({anchor:t,text:()=>t.getAttribute("aria-label")??"",...t===f&&e.collapseShortcut?{hint:()=>j()?e.collapseShortcut.hint:""}:{}})),C=n("div",{className:"persona-history-topbar"}),$e=null,He=()=>{let t=k==="rail",o=t?Oe?"rail-right":"rail":"panel";o!==$e&&($e=o,o==="rail"?C.append(se,f):C.append(f,se),t?$.remove():C.appendChild($),v.classList.toggle("persona-history-view--rail-right",o==="rail-right"))},V=n("div",{className:"persona-history-scope-alert"}),Ke=`${l}-scope`,ft=_("plus",18),Se=n("button",{className:"persona-history-new",attrs:{type:"button","data-persona-history-focus":"new"}},ft,n("span",{text:r.newConversationLabel}));Se.addEventListener("click",()=>{ee()});let ke=n("div",{className:"persona-history-list-region"}),Be=e.showDeleteAll!==!1,We=!!e.provider.resetDevice,Ye=e.listActions??[],O=Be||We||Ye.length>0?Ie({className:"persona-history-list-options",label:r.listOptionsLabel,focusKey:`menu:${F}`,open:!1,inert:!0,iconSize:16,onToggle:()=>Qe(F)}):null,bt=n("h3",{className:"persona-history-conversations-title",text:r.conversationsTitle}),K=n("div",{className:"persona-history-caption",attrs:{"data-persona-history-item":F}},bt,e.showScopeStatus?z:null,O),B=n("div",{className:"persona-history-body",attrs:{id:qe}},e.showScopeStatus?V:null,Se,K,ke),U=e.headerPlacement??"inline";U==="external"&&C.classList.add("persona-history-topbar--shell","persona-history-topbar--shell-enter");let v=n("div",{className:T("persona-history-view",`persona-history-view--${e.presentation}`,"persona-history-view--enter"),attrs:{role:"region","aria-labelledby":l,"data-persona-history-presentation":e.presentation}},fe.element,U==="inline"?C:null,B),Ce=()=>{v.classList.toggle("persona-history-view--rail-collapsed",R&&j())};Ce(),He();let wt=(t,o)=>{let a=`${l}-s${o}`,c=n("div",{className:T("persona-history-nav",t.placement==="footer"&&"persona-history-nav--footer"),attrs:{role:"group","data-persona-rail-section":t.id,...t.title?{"aria-labelledby":a}:{"aria-label":t.id}}});t.title&&c.appendChild(n("h3",{className:"persona-history-group-heading",text:t.title,attrs:{id:a}}));for(let d of t.items){let H=d.iconNode?.()??null,P=n("button",{className:T("persona-history-nav-item",H&&"persona-history-nav-item--icon"),attrs:{type:"button","aria-label":d.label,"data-persona-rail-item":d.id}},H?n("span",{className:"persona-history-nav-icon"},H):null,n("span",{className:"persona-history-nav-label persona-history-truncate",text:d.label}),d.badge?n("span",{className:"persona-history-nav-badge",text:d.badge}):null);P.addEventListener("click",()=>d.onSelect()),c.appendChild(P)}return c},X=null,Ge=null,Le=()=>{!X||!G||k!=="rail"||R===Ge||(Ge=R,e.railSections.forEach((t,o)=>{if(!t.render)return;let a=X[o],c=t.title?a.firstElementChild:null,d=null;try{d=t.render(R)}catch(H){t.render=void 0,console.warn("[persona] history rail section threw",t.id,H)}a.replaceChildren(...c?[c]:[],...d?[d]:[]),a.hidden=!d}))},je=()=>{let t=e.railSections;if(v.classList.toggle("persona-history-view--has-nav",k==="rail"&&!!t?.some(o=>o.placement==="above-conversations")),!!t?.length){if(k!=="rail"){X?.forEach(o=>o.remove());return}X??(X=t.map(wt));for(let o of["above-conversations","below-conversations","footer"]){let a=o==="above-conversations"?K.parentNode===B?K:ke:null;t.forEach((c,d)=>{c.placement===o&&B.insertBefore(X[d],a)})}Le()}};je(),rt(v,"persona-history-view",nt);let Ue=(t,o)=>{let a=v.ownerDocument.defaultView?.getComputedStyle(v).getPropertyValue(t),c=Number.parseFloat(a??"");return Number.isFinite(c)&&c>=0?c:o},xt=(t,o)=>v.ownerDocument.defaultView?.getComputedStyle(v).getPropertyValue(t).trim()||o,Z=null,q=()=>{Z!==null&&(clearTimeout(Z),Z=null),v.removeEventListener("animationend",q),v.classList.remove("persona-history-view--enter")};v.addEventListener("animationend",q),Z=setTimeout(()=>{Z=setTimeout(q,Ue("--persona-history-enter-ms",Qt)+60)},0);let J=null,Q=()=>{J!==null&&(clearTimeout(J),J=null),C.classList.remove("persona-history-topbar--shell-enter")},Ht=()=>{Q(),C.classList.add("persona-history-topbar--shell-enter"),J=setTimeout(Q,yt+60)};U==="external"&&(J=setTimeout(Q,yt+60));let le=[],pe=null,St=()=>{if(pe)return pe;if(m||or()||typeof v.animate!="function")return q(),null;let t=v.ownerDocument.defaultView?.getComputedStyle(B).opacity||"1";q(),v.style.pointerEvents="none",D.style.pointerEvents="none";let o={duration:Ue("--persona-history-exit-ms",er),easing:xt("--persona-history-exit-easing",tr),fill:"forwards"},a=rr[k];return le=[B.animate([{opacity:t,transform:"none"},{opacity:0,transform:`translateX(${a}px)`}],o)],pe=Promise.all(le.map(ir)).then(()=>{}),pe},Te=(t,o)=>{t&&(o?t.setAttribute("aria-disabled","true"):t.removeAttribute("aria-disabled"))},D=C,Ae=null,kt=()=>{let t=e.slots?.header;if(!t)return;let o=`${k}|${ge(b)}|${u?`${u.kind}:${"conversationId"in u?u.conversationId:""}`:""}`;if(o===Ae)return;Ae=o;let a=t({identityStatus:b,pendingAction:u,copy:r,defaultRenderer:()=>C})??C;a!==D&&(D.replaceWith(a),D=a)},Xe=null,Ct=()=>{if(!e.showScopeStatus)return;let t=ge(b);if(t===Xe)return;Xe=t;let o=ut(b,r);Fe.textContent=o.title;let a=nr(b);if(z.hidden=!a,V.replaceChildren(...a?[]:[n("span",{className:"persona-history-scope-alert-title",text:o.title})],n("span",{className:"persona-history-scope-description",text:o.description,attrs:{id:Ke}})),V.setAttribute("data-persona-history-scope-tone",a?"ambient":"attention"),a?z.setAttribute("aria-describedby",Ke):z.removeAttribute("aria-describedby"),o.pending?V.setAttribute("role","status"):V.removeAttribute("role"),V.setAttribute("data-persona-history-identity",b.state),z.setAttribute("data-persona-history-identity",b.state),sr(b)){let c=n("button",{className:"persona-history-secondary persona-history-state-action",text:r.retryIdentityLabel,attrs:{type:"button","data-persona-history-focus":"identity-retry"}});c.addEventListener("click",()=>{w()||N("refresh")}),V.appendChild(c)}},Ze=t=>u?u.kind==="open"&&u.conversationId===t?"opening":u.kind==="delete"&&u.conversationId===t?"deleting":null:null,Lt=()=>{let t=document.activeElement;return!(t instanceof HTMLElement)||!v.contains(t)?null:t.getAttribute("data-persona-history-focus")},Tt=t=>{if(M&&x){M=!1;let o=v.querySelector(`[data-persona-history-focus="${te(x)}"]`);if(o){o.focus();return}}t&&v.querySelector(`[data-persona-history-focus="${t}"]`)?.focus()},At=()=>{if(!E)return null;let t=n("button",{className:"persona-history-secondary persona-history-state-action",text:r.retryLabel,attrs:{type:"button","data-persona-history-focus":"action-retry"}}),o=E;return t.addEventListener("click",()=>{w()||o.retry()}),n("div",{className:"persona-history-row-error",attrs:{role:"alert"}},n("span",{text:o.message}),t)},Rt=()=>st(p,i(),r,e.grouping).map((t,o)=>{let a=`${l}-g${o}`,c=n("ul",{className:"persona-history-list",attrs:{"aria-labelledby":a}});for(let d of t.items){let H=()=>pt({conversation:d,active:d.id===S,pending:Ze(d.id),busy:w(),menuOpen:x===d.id,error:I.get(d.id)??null,avatar:e.rowAvatar,showDelete:e.showDelete!==!1,nowMs:i(),copy:r,onOpen:()=>{de(d.id)},onToggleMenu:()=>Qe(d.id),onCloseMenu:De=>L(De),onDelete:()=>{ce(d.id)}}),W=e.slots?.conversation?.({conversation:d,active:d.id===S,pending:Ze(d.id),open:()=>de(d.id),requestDelete:()=>ce(d.id),defaultRenderer:H})??H();c.appendChild(W instanceof HTMLLIElement?W:n("li",{className:"persona-history-item"},W))}return n("div",{className:"persona-history-group",attrs:{"data-persona-history-group":t.key}},n("h3",{className:T("persona-history-group-heading",t.key==="recent"&&"persona-history-sr-only"),text:t.label,attrs:{id:a}}),c)}),Et=()=>{if(!h)return null;let t=u?.kind==="load-more"||y.kind==="loading"&&y.phase==="load-more",o=n("button",{className:"persona-history-secondary persona-history-load-more",text:t?r.loadingMoreLabel:r.loadMoreLabel,attrs:{type:"button","data-persona-history-focus":"load-more",...t?{"aria-busy":"true","aria-disabled":"true"}:{},...w()&&!t?{"aria-disabled":"true"}:{}}});return o.addEventListener("click",()=>{w()||N("load-more")}),o},Nt=()=>{let t=Lt(),o=[At()],a=p.length>0;if(a&&(o.push(...Rt()),o.push(Et())),y.kind!=="ready"&&!(y.kind==="loading"&&y.phase!=="initial"&&a)){let d=y,H=d.kind==="loading"?void 0:()=>N("refresh"),P=d.kind==="new_conversation_required"?()=>ee():void 0,W=()=>ct({state:d,copy:r,identityStatus:b,busy:w(),...H?{onRetry:()=>{H()}}:{},...P?{onStartNew:()=>{P()}}:{}}),De=e.slots?.state?.({state:d,identityStatus:b,copy:r,...H?{retry:H}:{},...P?{startNewConversation:P}:{},defaultRenderer:W});o.push(De??W())}ke.replaceChildren(...o.filter(d=>!!d)),Tt(t)},Mt=()=>{let t=y.kind==="loading"&&p.length===0,o=[],a=()=>o.length===0?te(F):`${te(F)}-${o.length}`;if(!t)for(let c of Ye)o.push({label:c.label,focusKey:a(),danger:c.danger===!0,onSelect:()=>{c.onSelect({conversations:[...p]})}});return Be&&!(p.length===0&&(y.kind==="empty"||t))&&o.push({label:r.clearHistoryLabel,focusKey:a(),danger:!0,onSelect:()=>{Ee()}}),We&&!t&&o.push({label:r.resetIdentityLabel,focusKey:a(),danger:!0,onSelect:()=>{Me()}}),o},Dt=()=>{if(Te(Se,w()),Te($,w()),O){let t=Mt(),o=y.kind==="loading"&&p.length===0;O.hidden=t.length===0&&!o,Te(O,w()||t.length===0),O.setAttribute("aria-expanded",x===F?"true":"false");let a=K.querySelector(".persona-history-menu");if(x!==F||t.length===0)a?.remove();else{let c=Ve({label:r.listOptionsLabel,items:t,onCloseMenu:d=>L(d)});a?a.replaceWith(c):K.appendChild(c)}}K.hidden=k!=="rail"&&(!O||O.hidden)&&(!e.showScopeStatus||z.hidden)},Je,Pt=()=>{let t=e.onActiveConversationChange;if(!t)return;let o=p.find(c=>c.id===S)??null,a=o?`${o.id}\0${o.title}\0${o.starred?1:0}`:"";a!==Je&&(Je=a,t(o))},g=()=>{if(!m){if(Pt(),!G){e.onModelChange?.();return}kt(),Ct(),Dt(),Nt(),Le()}},L=t=>{if(!x)return;let o=x;x=null,M=!1,g(),t?.restoreFocus&&v.querySelector(`[data-persona-history-focus="menu:${o}"]`)?.focus()},Qe=t=>{if(x===t){L({restoreFocus:!0});return}x=t,M=!0,g()},et=t=>{if(!x)return;let o=t.target;o instanceof Node&&v.contains(o)&&o.closest?.(`[data-persona-history-item="${x}"]`)||L()};document.addEventListener("pointerdown",et,!0);let tt=t=>{t.key!=="Escape"||!x||(t.stopPropagation(),L({restoreFocus:!0}))};v.addEventListener("keydown",tt);async function N(t){if(m)return;let o=++Y,a=t==="load-more"?h:null;if(!(t==="load-more"&&!a)){u={kind:t==="load-more"?"load-more":"refresh"},y={kind:"loading",phase:t},t!=="load-more"&&(I.clear(),E=null),L(),g();try{let c=await e.provider.list({limit:s,context:e.context,...a?{cursor:a}:{},...e.targetId?{targetId:e.targetId}:{}});if(m||o!==Y)return;p=a?[...p,...c.items]:c.items,h=c.nextCursor,y=p.length===0?{kind:"empty"}:{kind:"ready"}}catch(c){if(m||o!==Y)return;y=dt(c)}finally{!m&&o===Y&&(u=null,g())}}}let Re=t=>{p=p.filter(o=>o.id!==t),I.delete(t),S===t&&(S=null),p.length===0&&!h&&(y={kind:"empty"})};async function de(t){if(!(w()||m)){I.delete(t),L(),u={kind:"open",conversationId:t},g();try{if(await e.onSelect(t),m)return;S=t}catch{if(m)return;I.set(t,{message:r.openFailedLabel,retry:()=>{de(t)}})}finally{m||(u=null,g())}}}async function ce(t){if(w()||m)return"cancelled";I.delete(t),u={kind:"delete",conversationId:t},g();try{let o=await e.onRequestDeleteConversation(t);return m||o==="deleted"&&(Re(t),ie(r.conversationRemovedNotice)),o}catch(o){return m||(ye(o)&&o.code==="not_found"?Re(t):I.set(t,{message:r.deleteFailedLabel,retry:()=>{ce(t)}})),"cancelled"}finally{m||(u=null,g())}}async function ee(){if(!(w()||m)){E=null,L(),u={kind:"start-new"},g();try{if(await e.onStartNew(),m)return;y.kind==="new_conversation_required"&&(y=p.length===0?{kind:"empty"}:{kind:"ready"})}catch{if(m)return;E={message:r.errorDescription,retry:()=>{ee()}}}finally{m||(u=null,g())}}}async function Ee(){if(w()||m)return"cancelled";E=null,L(),u={kind:"clear"},g();try{let t=await e.onRequestClearHistory();return m||t==="cleared"&&(p=[],h=null,S=null,y={kind:"empty"},ie(r.historyClearedNotice)),t}catch{return m||(E={message:r.errorDescription,retry:()=>{Ee()}}),"cancelled"}finally{m||(u=null,g())}}let Ne={outcome:"cancelled"};async function Me(){if(w()||m||!e.onRequestResetIdentity)return Ne;E=null,L(),u={kind:"reset"},g();try{let t=await e.onRequestResetIdentity();return m||t.outcome==="reset"&&(ie(t.remoteRevocationConfirmed?r.identityResetNotice:r.identityResetUnconfirmedNotice),u=null,await N("refresh")),t}catch{return m||(E={message:r.errorDescription,retry:()=>{Me()}}),Ne}finally{!m&&u?.kind==="reset"&&(u=null,g())}}let _t=e.provider.subscribeIdentityStatus(t=>{if(m)return;let o=ge(t),a=o!==oe;b=t,oe=o,g(),a&&t.state!=="verifying"&&ie(ut(t,r).title)}),It=e.provider.subscribeAvailability?.(t=>{if(!m){if(t){N("refresh");return}p=[],h=null,y={kind:"error",reason:"unavailable",retryable:!1},g()}});return g(),N("initial"),{element:v,copy:r,getModel:()=>({conversations:p,activeConversationId:S,state:y,pendingAction:u,identityStatus:b,nextCursor:h}),operations:{refresh:async()=>{w()||await N("refresh")},loadMore:async()=>{w()||await N("load-more")},openConversation:t=>de(t),startNewConversation:()=>ee(),requestDeleteConversation:t=>ce(t),requestClearConversationHistory:()=>Ee(),requestResetHistoryIdentity:()=>Me()},setDomRenderEnabled:t=>{t!==G&&(G=t,t&&g())},refresh:()=>{N("refresh")},setPresentation:t=>{if(t===k)return;q(),k=t,Ae=null;let o=t==="rail";v.classList.toggle("persona-history-view--panel",!o),v.classList.toggle("persona-history-view--rail",o),v.setAttribute("data-persona-history-presentation",t),be(),Ce(),He(),xe(),je(),g()},setCollapsed:t=>{t!==R&&(R=t,Ce(),be(),xe(),Le())},setRailSide:t=>{Oe=t==="right",He()},getHeaderElement:()=>D,setHeaderPlacement:t=>{if(t===U)return;U=t;let o=t==="external";if(C.classList.toggle("persona-history-topbar--shell",o),o){Ht(),D.remove();return}Q(),v.insertBefore(D,B)},setActiveConversationId:t=>{S!==t&&(S=t,g())},applyConversationSummary:t=>{let o=p.findIndex(a=>a.id===t.id);o!==-1&&(p[o]=t,g())},removeConversationSummary:t=>{p.some(o=>o.id===t)&&(Re(t),g())},setNewConversationRequired:t=>{t?y={kind:"new_conversation_required"}:y.kind==="new_conversation_required"&&(y=p.length===0?{kind:"empty"}:{kind:"ready"}),g()},playExit:St,destroy:()=>{m=!0,Y+=1,q(),Q(),gt.forEach(t=>t?.destroy()),D.remove(),le.forEach(t=>t.cancel()),le=[],_t(),It?.(),document.removeEventListener("pointerdown",et,!0),v.removeEventListener("keydown",tt),fe.destroy(),v.remove(),v.replaceChildren()}}}export{ue as HISTORY_VIEW_COPY_DEFAULTS,ht as createHistoryView,he as resolveHistoryViewCopy};
