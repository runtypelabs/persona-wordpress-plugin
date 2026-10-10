import{a as it}from"./chunk-MXUTS3LB.js";import{b as ue}from"./chunk-4HPTPUC6.js";import{a as ot}from"./chunk-Q735PSZL.js";import{c as n,d as E}from"./chunk-76IELU7F.js";function nt(){let e=document.createElement("div");e.className="persona-history-sr-only",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("data-persona-history-live-region","");let r;return{element:e,announce(i){r!==void 0&&clearTimeout(r),e.textContent="",r=setTimeout(()=>{r=void 0,e.textContent=i},0)},destroy(){r!==void 0&&clearTimeout(r),e.remove()}}}var st=`
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
`;var he={...it,emptyTitle:"No conversations yet",emptyDescription:"Start a conversation and it will show up here.",errorTitle:"Could not load conversations",errorDescription:"Something went wrong. Please try again.",retryLabel:"Retry",rateLimitedTitle:"Too many requests",rateLimitedDescription:"Please wait a moment before trying again.",groupStarred:"Starred",groupToday:"Today",groupYesterday:"Yesterday",groupPrevious7Days:"Previous 7 days",groupPrevious30Days:"Previous 30 days",groupMonthYear:"{month} {year}",browserOnlyTitle:"On this device",browserOnlyDescription:"Another browser or device keeps its own separate history.",verifyingTitle:"Checking your account",verifyingDescription:"Looking for messages linked to your account.",verifiedTitle:"Available across signed-in devices",verifiedDescription:"This list refreshes when the chat opens rather than syncing live.",authenticationRequiredTitle:"Sign in to see your messages",authenticationRequiredDescription:"Your session expired. Sign in again to load account history.",identityProviderFailedTitle:"Account history is unavailable",identityProviderFailedDescription:"We could not verify your account, so account history is not shown here.",proofNotAdmittedTitle:"Account history is unavailable",proofNotAdmittedDescription:"This assistant is not set up to accept your account identity.",retryIdentityLabel:"Try again",backLabel:"Back to conversation",closeLabel:"Close conversation list",loadingLabel:"Loading conversations",loadMoreLabel:"Load more",loadingMoreLabel:"Loading more conversations",conversationsTitle:"Conversations",rowActionsLabel:"Conversation options",listOptionsLabel:"Conversation options",deleteConversationLabel:"Delete",clearHistoryLabel:"Delete all conversations",resetIdentityLabel:"Forget this device",messageCountLabel:"{count} messages",messageCountLabelOne:"1 message",conversationRemovedNotice:"Conversation deleted.",historyClearedNotice:"All conversations were deleted.",unavailableTitle:"Conversation history is unavailable",unavailableDescription:"Try again later.",newConversationRequiredTitle:"Start a new conversation",newConversationRequiredDescription:"The previous conversation is gone. Start a new one to keep chatting.",rateLimitedWaitDescription:"You can try again in {seconds} seconds.",openFailedLabel:"Could not open that conversation.",deleteFailedLabel:"Could not delete that conversation.",relativeNow:"now",relativeMinutes:"{value}m",relativeHours:"{value}h",relativeDays:"{value}d",relativeWeeks:"{value}w",relativeYears:"{value}y"};function me(e){if(!e)return he;let r={...he};for(let[i,s]of Object.entries(e))typeof s=="string"&&s.length>0&&(r[i]=s);return r}function A(e,r){return e.replace(/\{(\w+)\}/g,(i,s)=>s in r?String(r[s]):i)}var Pe=864e5;function Vt(e){let r=new Date(e);return r.setHours(0,0,0,0),r.getTime()}function Ie(e,r){let i=Date.parse(e);return Number.isFinite(i)?i:r}function Ot(e,r){let i=Ie(e,r),s=Vt(r);if(i>=s)return"today";if(i>=s-Pe)return"yesterday";if(i>=s-7*Pe)return"previous-7-days";if(i>=s-30*Pe)return"previous-30-days";let p=new Date(i);return`month:${p.getFullYear()}-${p.getMonth()}`}function qt(e,r,i,s){if(e==="today")return s.groupToday;if(e==="yesterday")return s.groupYesterday;if(e==="previous-7-days")return s.groupPrevious7Days;if(e==="previous-30-days")return s.groupPrevious30Days;let p=new Date(Ie(r,i));return A(s.groupMonthYear,{month:p.toLocaleString(void 0,{month:"long"}),year:p.getFullYear()})}function at(e,r,i,s="time"){let p=e.filter(h=>h.starred),a=p.length>0?[{key:"starred",label:i.groupStarred,items:p}]:[];if(s==="none"){let h=e.filter(c=>!c.starred);return h.length>0&&a.push({key:"recent",label:i.conversationsTitle,items:h}),a}for(let h of e){if(h.starred)continue;let c=Ot(h.updatedAt,r),y=a[a.length-1];if(y&&y.key===c){y.items.push(h);continue}a.push({key:c,label:qt(c,h.updatedAt,r,i),items:[h]})}return a}function lt(e,r,i){let s=Math.max(0,r-Ie(e,r)),p=Math.floor(s/6e4);if(p<1)return i.relativeNow;if(p<60)return A(i.relativeMinutes,{value:p});let a=Math.floor(p/60);if(a<24)return A(i.relativeHours,{value:a});let h=Math.floor(a/24);if(h<7)return A(i.relativeDays,{value:h});let c=Math.floor(h/7);return h<365?A(i.relativeWeeks,{value:c}):A(i.relativeYears,{value:Math.floor(h/365)})}function pt(e,r){return e===1?r.messageCountLabelOne:A(r.messageCountLabel,{count:e})}var ve="http://www.w3.org/2000/svg",zt={"arrow-left":["m12 19-7-7 7-7","M19 12H5"],plus:["M5 12h14","M12 5v14"],star:["m12 2 2.9 6.2 6.8.7-5.1 4.5 1.4 6.6-6-3.4-6 3.4 1.4-6.6-5.1-4.5 6.8-.7z"],x:["M18 6 6 18","m6 6 12 12"],"panel-left":["M9 3v18"],monitor:["M8 21h8","M12 17v4"],ellipsis:[]},Ft={"panel-left":[3,3,18,18],monitor:[2,3,20,14]};function V(e,r=20){let i=document.createElementNS(ve,"svg");if(i.setAttribute("width",String(r)),i.setAttribute("height",String(r)),i.setAttribute("viewBox","0 0 24 24"),i.setAttribute("fill","none"),i.setAttribute("stroke","currentColor"),i.setAttribute("stroke-width","2"),i.setAttribute("stroke-linecap","round"),i.setAttribute("stroke-linejoin","round"),i.setAttribute("aria-hidden","true"),i.setAttribute("focusable","false"),e==="ellipsis"){for(let p of[12,19,5]){let a=document.createElementNS(ve,"circle");a.setAttribute("cx",String(p)),a.setAttribute("cy","12"),a.setAttribute("r","1"),i.appendChild(a)}return i}let s=Ft[e];if(s){let p=document.createElementNS(ve,"rect");p.setAttribute("x",String(s[0])),p.setAttribute("y",String(s[1])),p.setAttribute("width",String(s[2])),p.setAttribute("height",String(s[3])),p.setAttribute("rx","2"),i.appendChild(p)}for(let p of zt[e]){let a=document.createElementNS(ve,"path");a.setAttribute("d",p),i.appendChild(a)}return i}var $t=/^(https?:|\/|data:)/i;function Kt(e){let r=n("span",{className:"persona-history-row-avatar",attrs:{"aria-hidden":"true"}});return $t.test(e)?r.appendChild(n("img",{attrs:{src:e,alt:"",loading:"lazy"}})):r.textContent=e,r}var Wt=e=>`row:${e}`,Bt=e=>`menu:${e}`,oe=e=>`menu-item:${e}`;function dt(e){let{conversation:r,copy:i,busy:s,pending:p}=e,a=s||p!==null,h=r.title.trim().length>0,c=r.starred?(()=>{let b=V("star",11);return b.setAttribute("fill","currentColor"),b.setAttribute("stroke-width","1"),n("span",{className:"persona-history-row-star"},b,n("span",{className:"persona-history-sr-only",text:i.groupStarred}))})():null,y=n("div",{className:"persona-history-row-head"},n("span",{className:"persona-history-row-title persona-history-truncate",text:h?r.title:r.preview??""}),c,n("time",{className:"persona-history-row-time",attrs:{datetime:r.updatedAt},text:lt(r.updatedAt,e.nowMs,i)})),f=h&&r.preview?n("span",{className:"persona-history-row-preview persona-history-truncate",text:r.preview}):null,w=n("button",{className:E("persona-history-row",e.active&&"persona-history-row--active",p&&`persona-history-row--${p}`),attrs:{type:"button","data-persona-history-focus":Wt(r.id),"data-persona-history-conversation":r.id,...e.active?{"aria-current":"page"}:{},...a?{"aria-disabled":"true"}:{},...p?{"aria-busy":"true"}:{}}},e.avatar?Kt(e.avatar):null,n("div",{className:"persona-history-row-body"},y,f,n("span",{className:"persona-history-row-count persona-history-sr-only",text:pt(r.messageCount,i)})));w.addEventListener("click",()=>{a||e.onOpen()});let R=e.showDelete?Ve({className:"persona-history-row-menu-button",label:`${i.rowActionsLabel}: ${r.title}`,focusKey:Bt(r.id),open:e.menuOpen,inert:a,onToggle:e.onToggleMenu}):null;return n("li",{className:E("persona-history-item",!e.showDelete&&"persona-history-item--no-menu"),attrs:{"data-persona-history-item":r.id}},w,R,e.menuOpen&&e.showDelete?Yt(e):null,e.error?Gt(e.error,i,r.id):null)}function Yt(e){let{conversation:r,copy:i}=e;return Oe({label:`${i.rowActionsLabel}: ${r.title}`,items:[{label:i.deleteConversationLabel,focusKey:oe(r.id),danger:!0,onSelect:e.onDelete}],onCloseMenu:e.onCloseMenu})}function Ve(e){let r=n("button",{className:E("persona-history-icon-button",e.className),attrs:{type:"button","aria-label":e.label,"aria-haspopup":"menu","aria-expanded":e.open?"true":"false","data-persona-history-focus":e.focusKey,...e.inert?{"aria-disabled":"true"}:{}}});r.appendChild(V("ellipsis",e.iconSize));let i=()=>r.getAttribute("aria-disabled")==="true";return r.addEventListener("click",s=>{s.stopPropagation(),!i()&&e.onToggle()}),r.addEventListener("keydown",s=>{s.key!=="ArrowDown"&&s.key!=="ArrowUp"||(s.preventDefault(),!(i()||r.getAttribute("aria-expanded")==="true")&&e.onToggle())}),r}function Oe(e){let r=n("div",{className:"persona-history-menu",attrs:{role:"menu","aria-label":e.label}});for(let i of e.items){let s=n("button",{className:E("persona-history-menu-item",i.danger&&"persona-history-menu-item--danger"),text:i.label,attrs:{type:"button",role:"menuitem",tabindex:"0","data-persona-history-focus":i.focusKey}});s.addEventListener("click",()=>{e.onCloseMenu(),i.onSelect()}),r.appendChild(s)}return r.addEventListener("keydown",i=>{let s=Array.from(r.querySelectorAll('[role="menuitem"]'));if(s.length===0)return;let p=s.indexOf(document.activeElement);if(i.key==="Tab"){e.onCloseMenu({restoreFocus:!0});return}if(i.key==="ArrowDown"){i.preventDefault(),s[(p+1+s.length)%s.length]?.focus();return}if(i.key==="ArrowUp"){i.preventDefault(),s[(p-1+s.length)%s.length]?.focus();return}if(i.key==="Home"){i.preventDefault(),s[0]?.focus();return}i.key==="End"&&(i.preventDefault(),s[s.length-1]?.focus())}),r}function Gt(e,r,i){let s=n("button",{className:"persona-history-secondary persona-history-state-action",text:r.retryLabel,attrs:{type:"button","data-persona-history-focus":`row-retry:${i}`}});return s.addEventListener("click",e.retry),n("div",{className:"persona-history-row-error",attrs:{role:"alert"}},n("span",{text:e.message}),s)}function jt(e){switch(e){case"authentication_failed":case"authentication_required":case"identity_provider_failed":case"proof_not_admitted":case"unsupported_scope":case"unavailable":return e;default:return"unknown"}}function ct(e){if(ue(e)){if(e.code==="rate_limited")return{kind:"rate_limited",retryAfterSeconds:e.retryAfterSeconds??0};let r=jt(e.code);return{kind:"error",reason:r,retryable:r!=="unsupported_scope"}}return{kind:"error",reason:"unknown",retryable:!0}}function Ut(e,r){switch(e.state){case"authentication_required":return{title:r.authenticationRequiredTitle,description:r.authenticationRequiredDescription};case"identity_provider_failed":return{title:r.identityProviderFailedTitle,description:r.identityProviderFailedDescription};case"configuration_error":return{title:r.proofNotAdmittedTitle,description:r.proofNotAdmittedDescription};default:return null}}function Xt(e,r){switch(e){case"authentication_required":case"authentication_failed":return{title:r.authenticationRequiredTitle,description:r.authenticationRequiredDescription};case"identity_provider_failed":return{title:r.identityProviderFailedTitle,description:r.identityProviderFailedDescription};case"proof_not_admitted":case"unsupported_scope":return{title:r.proofNotAdmittedTitle,description:r.proofNotAdmittedDescription};case"unavailable":return{title:r.unavailableTitle,description:r.unavailableDescription};default:return{title:r.errorTitle,description:r.errorDescription}}}function ge(e,r,i,s){let p=n("button",{className:"persona-history-secondary persona-history-state-action",text:e,attrs:{type:"button","data-persona-history-focus":r,...i?{"aria-disabled":"true"}:{}}});return p.addEventListener("click",()=>{i||s()}),p}function ie(e,r,i,s,p){return n("div",{className:"persona-history-state",attrs:{"data-persona-history-state":e,...p?{role:"alert"}:{role:"status"}}},n("p",{className:"persona-history-state-title",text:r}),n("p",{className:"persona-history-state-description",text:i}),s)}function Zt(e){let r=["42%","58%","34%"],i=["94%","78%","88%"],s=[0,1,2].map(p=>n("div",{className:"persona-history-skeleton-row",attrs:{"aria-hidden":"true"}},n("div",{className:"persona-history-skeleton-head"},n("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--title",style:{width:r[p]}}),n("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--time"})),n("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--preview",style:{width:i[p]}})));return n("div",{className:"persona-history-view-loading",attrs:{"data-persona-history-state":"loading",role:"status","aria-label":e.loadingLabel}},...s)}function yt(e){let{state:r,copy:i,busy:s}=e;if(r.kind==="loading")return Zt(i);if(r.kind==="empty"){let c=Ut(e.identityStatus,i);return c?ie("identity",c.title,c.description,e.onRetry?ge(i.retryIdentityLabel,"state-retry",s,e.onRetry):null,!0):ie("empty",i.emptyTitle,i.emptyDescription,null,!1)}if(r.kind==="rate_limited"){let c=r.retryAfterSeconds>0?A(i.rateLimitedWaitDescription,{seconds:r.retryAfterSeconds}):i.rateLimitedDescription;return ie("rate_limited",i.rateLimitedTitle,c,e.onRetry?ge(i.retryLabel,"state-retry",s,e.onRetry):null,!1)}if(r.kind==="new_conversation_required")return ie("new_conversation_required",i.newConversationRequiredTitle,i.newConversationRequiredDescription,e.onStartNew?ge(i.newConversationLabel,"state-retry",s,e.onStartNew):null,!0);let{title:p,description:a}=Xt(r.reason,i),h=r.reason==="authentication_required"||r.reason==="authentication_failed"||r.reason==="identity_provider_failed"?i.retryIdentityLabel:i.retryLabel;return ie("error",p,a,r.retryable&&e.onRetry?ge(h,"state-retry",s,e.onRetry):null,!0)}var Jt=25,$="persona:list-options",Qt=180,ut=120,er=160,tr="cubic-bezier(0.4, 0, 1, 1)",rr={panel:20,rail:12},or=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,ir=e=>e.finished?e.finished.then(()=>{},()=>{}):Promise.resolve();function fe(e){return`${e.state}:${"reason"in e?e.reason:""}`}function ht(e,r){switch(e.state){case"verified":return{title:r.verifiedTitle,description:r.verifiedDescription,pending:!1};case"verifying":case"resetting":return{title:r.verifyingTitle,description:r.verifyingDescription,pending:!0};case"authentication_required":return{title:r.authenticationRequiredTitle,description:r.authenticationRequiredDescription,pending:!1};case"identity_provider_failed":return{title:r.identityProviderFailedTitle,description:r.identityProviderFailedDescription,pending:!1};case"configuration_error":return{title:r.proofNotAdmittedTitle,description:r.proofNotAdmittedDescription,pending:!1};case"unavailable":return{title:r.unavailableTitle,description:r.unavailableDescription,pending:!1};default:return{title:r.browserOnlyTitle,description:r.browserOnlyDescription,pending:!1}}}function nr(e){return e.state==="verified"||e.state==="browser_only"}function sr(e){return e.state==="authentication_required"||e.state==="identity_provider_failed"||e.state==="configuration_error"}function mt(e){let r=me(e.copy),i=e.now??(()=>Date.now()),s=e.pageSize??Jt,p=`persona-history-title-${Math.random().toString(36).slice(2,8)}`,a=[],h=null,c={kind:"loading",phase:"initial"},y=null,f=e.activeConversationId,w=e.provider.getIdentityStatus(),R=fe(w),x=null,b=!1,m=!1,D=0,S=e.presentation,j=e.collapsible!==!1,N=e.collapsed===!0,qe=e.railSide==="right",U=e.renderDom!==!1,O=new Map,M=null,be=nt(),ne=t=>{!U&&e.onAnnounce?e.onAnnounce(t):be.announce(t)},k=()=>y!==null,ze=`${p}-body`,H=n("button",{className:"persona-history-icon-button persona-history-back",attrs:{type:"button"}}),X=()=>S==="rail"&&j,se,vt=()=>{if(e.railBrand){if(!X()){H.classList.remove("persona-history-back--branded");return}if(se===void 0){let t=e.railBrand(!0);se=t?n("span",{className:"persona-history-brand-mark persona-history-toggle-brand",attrs:{"aria-hidden":"true"}},t):null}se&&(H.classList.add("persona-history-back--branded"),H.appendChild(se))}},we=()=>{let t=X(),o=S==="rail";H.setAttribute("data-persona-history-focus",t?"collapse":"close"),H.setAttribute("aria-label",t?N?r.expandLabel:r.collapseLabel:o?r.closeLabel:r.backLabel),t?(H.setAttribute("aria-expanded",N?"false":"true"),H.setAttribute("aria-controls",ze),e.collapseShortcut?.aria&&H.setAttribute("aria-keyshortcuts",e.collapseShortcut.aria)):(H.removeAttribute("aria-expanded"),H.removeAttribute("aria-controls"),H.removeAttribute("aria-keyshortcuts")),H.replaceChildren(V(t?"panel-left":o?"x":"arrow-left")),vt()};we(),H.addEventListener("click",()=>{X()?e.onToggleCollapse?.():e.onClose()});let xe=n("h2",{className:"persona-history-title",text:r.viewTitle,attrs:{id:p}}),Fe=n("span",{className:"persona-history-scope-title"}),K=n("p",{className:"persona-history-scope"},n("span",{className:"persona-history-scope-icon",attrs:{"aria-hidden":"true"}},V("monitor",14)),Fe),ae=n("div",{className:"persona-history-heading-group"},xe),$e=!1,le,He=()=>{let t=S==="rail",o=t?e.renderRailHeader:void 0,l=null,u=o!==void 0;if(o)try{l=o({collapsed:N,defaultTitle:r.viewTitle})}catch(d){u=!1,$e||($e=!0,console.warn("[persona] history rail renderHeader threw",d))}if(!u&&t&&e.railBrand){if(le===void 0){let d=e.railBrand(!1);le=d?n("span",{className:"persona-history-heading-brand",attrs:{"aria-hidden":"true"}},n("span",{className:"persona-history-brand-mark"},d),n("span",{className:"persona-history-wordmark",text:r.viewTitle})):null}le&&(u=!0,l=le)}xe.classList.toggle("persona-history-sr-only",u),ae.replaceChildren(xe),l&&ae.appendChild(l)};He();let W=n("button",{className:"persona-history-icon-button persona-history-new-icon",attrs:{type:"button","data-persona-history-focus":"new-icon","aria-label":r.newConversationLabel}});W.appendChild(V("plus")),W.addEventListener("click",()=>{re()});let gt=[H,W].map(t=>e.attachTooltip?.({anchor:t,text:()=>t.getAttribute("aria-label")??"",...t===H&&e.collapseShortcut?{hint:()=>X()?e.collapseShortcut.hint:""}:{}})),L=n("div",{className:"persona-history-topbar"}),Ke=null,ke=()=>{let t=S==="rail",o=t?qe?"rail-right":"rail":"panel";o!==Ke&&(Ke=o,o==="rail"?L.append(ae,H):L.append(H,ae),t?W.remove():L.appendChild(W),v.classList.toggle("persona-history-view--rail-right",o==="rail-right"))},q=n("div",{className:"persona-history-scope-alert"}),We=`${p}-scope`,ft=V("plus",18),Se=n("button",{className:"persona-history-new",attrs:{type:"button","data-persona-history-focus":"new"}},ft,n("span",{text:r.newConversationLabel}));Se.addEventListener("click",()=>{re()});let Ce=n("div",{className:"persona-history-list-region"}),Be=e.showDeleteAll!==!1,Ye=!!e.provider.resetDevice,Ge=e.listActions??[],z=Be||Ye||Ge.length>0?Ve({className:"persona-history-list-options",label:r.listOptionsLabel,focusKey:`menu:${$}`,open:!1,inert:!0,iconSize:16,onToggle:()=>et($)}):null,bt=n("h3",{className:"persona-history-conversations-title",text:r.conversationsTitle}),B=n("div",{className:"persona-history-caption",attrs:{"data-persona-history-item":$}},bt,e.showScopeStatus?K:null,z),Y=n("div",{className:"persona-history-body",attrs:{id:ze}},e.showScopeStatus?q:null,Se,B,Ce),Z=e.headerPlacement??"inline";Z==="external"&&L.classList.add("persona-history-topbar--shell","persona-history-topbar--shell-enter");let v=n("div",{className:E("persona-history-view",`persona-history-view--${e.presentation}`,"persona-history-view--enter"),attrs:{role:"region","aria-labelledby":p,"data-persona-history-presentation":e.presentation}},be.element,Z==="inline"?L:null,Y),Le=()=>{v.classList.toggle("persona-history-view--rail-collapsed",N&&X())};Le(),ke();let wt=(t,o)=>{let l=`${p}-s${o}`,u=n("div",{className:E("persona-history-nav",t.placement==="footer"&&"persona-history-nav--footer"),attrs:{role:"group","data-persona-rail-section":t.id,...t.title?{"aria-labelledby":l}:{"aria-label":t.id}}});t.title&&u.appendChild(n("h3",{className:"persona-history-group-heading",text:t.title,attrs:{id:l}}));for(let d of t.items){let C=d.iconNode?.()??null,I=n("button",{className:E("persona-history-nav-item",C&&"persona-history-nav-item--icon"),attrs:{type:"button","aria-label":d.label,"data-persona-rail-item":d.id}},C?n("span",{className:"persona-history-nav-icon"},C):null,n("span",{className:"persona-history-nav-label persona-history-truncate",text:d.label}),d.badge?n("span",{className:"persona-history-nav-badge",text:d.badge}):null);I.addEventListener("click",()=>d.onSelect()),u.appendChild(I)}return u},J=null,je=null,Te=()=>{!J||!U||S!=="rail"||N===je||(je=N,e.railSections.forEach((t,o)=>{if(!t.render)return;let l=J[o],u=t.title?l.firstElementChild:null,d=null;try{d=t.render(N)}catch(C){t.render=void 0,console.warn("[persona] history rail section threw",t.id,C)}l.replaceChildren(...u?[u]:[],...d?[d]:[]),l.hidden=!d}))},Ue=()=>{let t=e.railSections;if(v.classList.toggle("persona-history-view--has-nav",S==="rail"&&!!t?.some(o=>o.placement==="above-conversations")),!!t?.length){if(S!=="rail"){J?.forEach(o=>o.remove());return}J??=t.map(wt);for(let o of["above-conversations","below-conversations","footer"]){let l=o==="above-conversations"?B.parentNode===Y?B:Ce:null;t.forEach((u,d)=>{u.placement===o&&Y.insertBefore(J[d],l)})}Te()}};Ue(),ot(v,"persona-history-view",st);let Xe=(t,o)=>{let l=v.ownerDocument.defaultView?.getComputedStyle(v).getPropertyValue(t),u=Number.parseFloat(l??"");return Number.isFinite(u)&&u>=0?u:o},xt=(t,o)=>v.ownerDocument.defaultView?.getComputedStyle(v).getPropertyValue(t).trim()||o,Q=null,F=()=>{Q!==null&&(clearTimeout(Q),Q=null),v.removeEventListener("animationend",F),v.classList.remove("persona-history-view--enter")};v.addEventListener("animationend",F),Q=setTimeout(()=>{Q=setTimeout(F,Xe("--persona-history-enter-ms",Qt)+60)},0);let ee=null,te=()=>{ee!==null&&(clearTimeout(ee),ee=null),L.classList.remove("persona-history-topbar--shell-enter")},Ht=()=>{te(),L.classList.add("persona-history-topbar--shell-enter"),ee=setTimeout(te,ut+60)};Z==="external"&&(ee=setTimeout(te,ut+60));let pe=[],de=null,kt=()=>{if(de)return de;if(m||or()||typeof v.animate!="function")return F(),null;let t=v.ownerDocument.defaultView?.getComputedStyle(Y).opacity||"1";F(),v.style.pointerEvents="none",P.style.pointerEvents="none";let o={duration:Xe("--persona-history-exit-ms",er),easing:xt("--persona-history-exit-easing",tr),fill:"forwards"},l=rr[S];return pe=[Y.animate([{opacity:t,transform:"none"},{opacity:0,transform:`translateX(${l}px)`}],o)],de=Promise.all(pe.map(ir)).then(()=>{}),de},Ee=(t,o)=>{t&&(o?t.setAttribute("aria-disabled","true"):t.removeAttribute("aria-disabled"))},P=L,Ae=null,St=()=>{let t=e.slots?.header;if(!t)return;let o=`${S}|${fe(w)}|${y?`${y.kind}:${"conversationId"in y?y.conversationId:""}`:""}`;if(o===Ae)return;Ae=o;let l=t({identityStatus:w,pendingAction:y,copy:r,defaultRenderer:()=>L})??L;l!==P&&(P.replaceWith(l),P=l)},Ze=null,Ct=()=>{if(!e.showScopeStatus)return;let t=fe(w);if(t===Ze)return;Ze=t;let o=ht(w,r);Fe.textContent=o.title;let l=nr(w);if(K.hidden=!l,q.replaceChildren(...l?[]:[n("span",{className:"persona-history-scope-alert-title",text:o.title})],n("span",{className:"persona-history-scope-description",text:o.description,attrs:{id:We}})),q.setAttribute("data-persona-history-scope-tone",l?"ambient":"attention"),l?K.setAttribute("aria-describedby",We):K.removeAttribute("aria-describedby"),o.pending?q.setAttribute("role","status"):q.removeAttribute("role"),q.setAttribute("data-persona-history-identity",w.state),K.setAttribute("data-persona-history-identity",w.state),sr(w)){let u=n("button",{className:"persona-history-secondary persona-history-state-action",text:r.retryIdentityLabel,attrs:{type:"button","data-persona-history-focus":"identity-retry"}});u.addEventListener("click",()=>{k()||_("refresh")}),q.appendChild(u)}},Je=t=>y?y.kind==="open"&&y.conversationId===t?"opening":y.kind==="delete"&&y.conversationId===t?"deleting":null:null,Lt=()=>{let t=document.activeElement;return!(t instanceof HTMLElement)||!v.contains(t)?null:t.getAttribute("data-persona-history-focus")},Tt=t=>{if(b&&x){b=!1;let o=v.querySelector(`[data-persona-history-focus="${oe(x)}"]`);if(o){o.focus();return}}t&&v.querySelector(`[data-persona-history-focus="${t}"]`)?.focus()},Et=()=>{if(!M)return null;let t=n("button",{className:"persona-history-secondary persona-history-state-action",text:r.retryLabel,attrs:{type:"button","data-persona-history-focus":"action-retry"}}),o=M;return t.addEventListener("click",()=>{k()||o.retry()}),n("div",{className:"persona-history-row-error",attrs:{role:"alert"}},n("span",{text:o.message}),t)},At=()=>at(a,i(),r,e.grouping).map((t,o)=>{let l=`${p}-g${o}`,u=n("ul",{className:"persona-history-list",attrs:{"aria-labelledby":l}});for(let d of t.items){let C=()=>dt({conversation:d,active:d.id===f,pending:Je(d.id),busy:k(),menuOpen:x===d.id,error:O.get(d.id)??null,avatar:e.rowAvatar,showDelete:e.showDelete!==!1,nowMs:i(),copy:r,onOpen:()=>{ce(d.id)},onToggleMenu:()=>et(d.id),onCloseMenu:De=>T(De),onDelete:()=>{ye(d.id)}}),G=e.slots?.conversation?.({conversation:d,active:d.id===f,pending:Je(d.id),open:()=>ce(d.id),requestDelete:()=>ye(d.id),defaultRenderer:C})??C();u.appendChild(G instanceof HTMLLIElement?G:n("li",{className:"persona-history-item"},G))}return n("div",{className:"persona-history-group",attrs:{"data-persona-history-group":t.key}},n("h3",{className:E("persona-history-group-heading",t.key==="recent"&&"persona-history-sr-only"),text:t.label,attrs:{id:l}}),u)}),Rt=()=>{if(!h)return null;let t=y?.kind==="load-more"||c.kind==="loading"&&c.phase==="load-more",o=n("button",{className:"persona-history-secondary persona-history-load-more",text:t?r.loadingMoreLabel:r.loadMoreLabel,attrs:{type:"button","data-persona-history-focus":"load-more",...t?{"aria-busy":"true","aria-disabled":"true"}:{},...k()&&!t?{"aria-disabled":"true"}:{}}});return o.addEventListener("click",()=>{k()||_("load-more")}),o},Nt=()=>{let t=Lt(),o=[Et()],l=a.length>0;if(l&&(o.push(...At()),o.push(Rt())),c.kind!=="ready"&&!(c.kind==="loading"&&c.phase!=="initial"&&l)){let d=c,C=d.kind==="loading"?void 0:()=>_("refresh"),I=d.kind==="new_conversation_required"?()=>re():void 0,G=()=>yt({state:d,copy:r,identityStatus:w,busy:k(),...C?{onRetry:()=>{C()}}:{},...I?{onStartNew:()=>{I()}}:{}}),De=e.slots?.state?.({state:d,identityStatus:w,copy:r,...C?{retry:C}:{},...I?{startNewConversation:I}:{},defaultRenderer:G});o.push(De??G())}Ce.replaceChildren(...o.filter(d=>!!d)),Tt(t)},Mt=()=>{let t=c.kind==="loading"&&a.length===0,o=[],l=()=>o.length===0?oe($):`${oe($)}-${o.length}`;if(!t)for(let u of Ge)o.push({label:u.label,focusKey:l(),danger:u.danger===!0,onSelect:()=>{u.onSelect({conversations:[...a]})}});return Be&&!(a.length===0&&(c.kind==="empty"||t))&&o.push({label:r.clearHistoryLabel,focusKey:l(),danger:!0,onSelect:()=>{Ne()}}),Ye&&!t&&o.push({label:r.resetIdentityLabel,focusKey:l(),danger:!0,onSelect:()=>{_e()}}),o},_t=()=>{if(Ee(Se,k()),Ee(W,k()),z){let t=Mt(),o=c.kind==="loading"&&a.length===0;z.hidden=t.length===0&&!o,Ee(z,k()||t.length===0),z.setAttribute("aria-expanded",x===$?"true":"false");let l=B.querySelector(".persona-history-menu");if(x!==$||t.length===0)l?.remove();else{let u=Oe({label:r.listOptionsLabel,items:t,onCloseMenu:d=>T(d)});l?l.replaceWith(u):B.appendChild(u)}}B.hidden=S!=="rail"&&(!z||z.hidden)&&(!e.showScopeStatus||K.hidden)},Qe,Dt=()=>{let t=e.onActiveConversationChange;if(!t)return;let o=a.find(u=>u.id===f)??null,l=o?`${o.id}\0${o.title}\0${o.starred?1:0}`:"";l!==Qe&&(Qe=l,t(o))},g=()=>{if(!m){if(Dt(),!U){e.onModelChange?.();return}St(),Ct(),_t(),Nt(),Te()}},T=t=>{if(!x)return;let o=x;x=null,b=!1,g(),t?.restoreFocus&&v.querySelector(`[data-persona-history-focus="menu:${o}"]`)?.focus()},et=t=>{if(x===t){T({restoreFocus:!0});return}x=t,b=!0,g()},tt=t=>{if(!x)return;let o=t.target;o instanceof Node&&v.contains(o)&&o.closest?.(`[data-persona-history-item="${x}"]`)||T()};document.addEventListener("pointerdown",tt,!0);let rt=t=>{t.key!=="Escape"||!x||(t.stopPropagation(),T({restoreFocus:!0}))};v.addEventListener("keydown",rt);async function _(t){if(m)return;let o=++D,l=t==="load-more"?h:null;if(!(t==="load-more"&&!l)){y={kind:t==="load-more"?"load-more":"refresh"},c={kind:"loading",phase:t},t!=="load-more"&&(O.clear(),M=null),T(),g();try{let u=await e.provider.list({limit:s,context:e.context,...l?{cursor:l}:{},...e.targetId?{targetId:e.targetId}:{}});if(m||o!==D)return;a=l?[...a,...u.items]:u.items,h=u.nextCursor,c=a.length===0?{kind:"empty"}:{kind:"ready"}}catch(u){if(m||o!==D)return;c=ct(u)}finally{!m&&o===D&&(y=null,g())}}}let Re=t=>{a=a.filter(o=>o.id!==t),O.delete(t),f===t&&(f=null),a.length===0&&!h&&(c={kind:"empty"})};async function ce(t){if(!(k()||m)){O.delete(t),T(),y={kind:"open",conversationId:t},g();try{if(await e.onSelect(t),m)return;f=t}catch{if(m)return;O.set(t,{message:r.openFailedLabel,retry:()=>{ce(t)}})}finally{m||(y=null,g())}}}async function ye(t){if(k()||m)return"cancelled";O.delete(t),y={kind:"delete",conversationId:t},g();try{let o=await e.onRequestDeleteConversation(t);return m||o==="deleted"&&(Re(t),ne(r.conversationRemovedNotice)),o}catch(o){return m||(ue(o)&&o.code==="not_found"?Re(t):O.set(t,{message:r.deleteFailedLabel,retry:()=>{ye(t)}})),"cancelled"}finally{m||(y=null,g())}}async function re(){if(!(k()||m)){M=null,T(),y={kind:"start-new"},g();try{if(await e.onStartNew(),m)return;c.kind==="new_conversation_required"&&(c=a.length===0?{kind:"empty"}:{kind:"ready"})}catch{if(m)return;M={message:r.errorDescription,retry:()=>{re()}}}finally{m||(y=null,g())}}}async function Ne(){if(k()||m)return"cancelled";M=null,T(),y={kind:"clear"},g();try{let t=await e.onRequestClearHistory();return m||t==="cleared"&&(a=[],h=null,f=null,c={kind:"empty"},ne(r.historyClearedNotice)),t}catch{return m||(M={message:r.errorDescription,retry:()=>{Ne()}}),"cancelled"}finally{m||(y=null,g())}}let Me={outcome:"cancelled"};async function _e(){if(k()||m||!e.onRequestResetIdentity)return Me;M=null,T(),y={kind:"reset"},g();try{let t=await e.onRequestResetIdentity();return m||t.outcome==="reset"&&(ne(t.remoteRevocationConfirmed?r.identityResetNotice:r.identityResetUnconfirmedNotice),y=null,await _("refresh")),t}catch{return m||(M={message:r.errorDescription,retry:()=>{_e()}}),Me}finally{!m&&y?.kind==="reset"&&(y=null,g())}}let Pt=e.provider.subscribeIdentityStatus(t=>{if(m)return;let o=fe(t),l=o!==R;w=t,R=o,g(),l&&t.state!=="verifying"&&ne(ht(t,r).title)}),It=e.provider.subscribeAvailability?.(t=>{if(!m){if(t){_("refresh");return}a=[],h=null,c={kind:"error",reason:"unavailable",retryable:!1},g()}});return g(),_("initial"),{element:v,copy:r,getModel:()=>({conversations:a,activeConversationId:f,state:c,pendingAction:y,identityStatus:w,nextCursor:h}),operations:{refresh:async()=>{k()||await _("refresh")},loadMore:async()=>{k()||await _("load-more")},openConversation:t=>ce(t),startNewConversation:()=>re(),requestDeleteConversation:t=>ye(t),requestClearConversationHistory:()=>Ne(),requestResetHistoryIdentity:()=>_e()},setDomRenderEnabled:t=>{t!==U&&(U=t,t&&g())},refresh:()=>{_("refresh")},setPresentation:t=>{if(t===S)return;F(),S=t,Ae=null;let o=t==="rail";v.classList.toggle("persona-history-view--panel",!o),v.classList.toggle("persona-history-view--rail",o),v.setAttribute("data-persona-history-presentation",t),we(),Le(),ke(),He(),Ue(),g()},setCollapsed:t=>{t!==N&&(N=t,Le(),we(),He(),Te())},setRailSide:t=>{qe=t==="right",ke()},getHeaderElement:()=>P,setHeaderPlacement:t=>{if(t===Z)return;Z=t;let o=t==="external";if(L.classList.toggle("persona-history-topbar--shell",o),o){Ht(),P.remove();return}te(),v.insertBefore(P,Y)},setActiveConversationId:t=>{f!==t&&(f=t,g())},applyConversationSummary:t=>{let o=a.findIndex(l=>l.id===t.id);o!==-1&&(a[o]=t,g())},removeConversationSummary:t=>{a.some(o=>o.id===t)&&(Re(t),g())},setNewConversationRequired:t=>{t?c={kind:"new_conversation_required"}:c.kind==="new_conversation_required"&&(c=a.length===0?{kind:"empty"}:{kind:"ready"}),g()},playExit:kt,destroy:()=>{m=!0,D+=1,F(),te(),gt.forEach(t=>t?.destroy()),P.remove(),pe.forEach(t=>t.cancel()),pe=[],Pt(),It?.(),document.removeEventListener("pointerdown",tt,!0),v.removeEventListener("keydown",rt),be.destroy(),v.remove(),v.replaceChildren()}}}var ar="button:not([disabled])";function lr(e){let r=document.activeElement instanceof HTMLElement?document.activeElement:null,i=Math.random().toString(36).slice(2,8),s=`persona-history-confirm-title-${i}`,p=`persona-history-confirm-desc-${i}`,a=n("button",{className:"persona-history-confirm__cancel",text:e.cancelLabel,attrs:{type:"button"}}),h=n("button",{className:"persona-history-confirm__confirm",text:e.confirmLabel,attrs:{type:"button","data-persona-destructive":"true"}}),c=n("div",{className:"persona-history-confirm__dialog",attrs:{role:"alertdialog","aria-modal":"true","aria-labelledby":s,"aria-describedby":p},style:{maxWidth:"22rem",width:"100%",borderRadius:"var(--persona-radius-lg, 0.75rem)",background:"var(--persona-surface, #ffffff)",color:"var(--persona-text, #111827)",boxShadow:"var(--persona-history-confirm-shadow, 0 20px 40px -12px rgba(0, 0, 0, 0.35))",padding:"20px",display:"flex",flexDirection:"column",gap:"12px"}},n("h2",{className:"persona-history-confirm__title",text:e.title,attrs:{id:s},style:{margin:"0",fontSize:"1rem",fontWeight:"600"}}),n("p",{className:"persona-history-confirm__description",text:e.description,attrs:{id:p},style:{margin:"0",fontSize:"0.875rem",lineHeight:"1.4"}}),n("div",{className:"persona-history-confirm__actions",style:{display:"flex",gap:"8px",justifyContent:"flex-end",flexWrap:"wrap"}},a,h));for(let f of[a,h])f.style.minHeight="44px",f.style.minWidth="88px",f.style.padding="0 16px",f.style.borderRadius="var(--persona-radius-md, 0.5rem)",f.style.cursor="pointer",f.style.font="inherit";a.style.border="1px solid var(--persona-border, rgba(0,0,0,0.12))",a.style.background="transparent",a.style.color="inherit",h.style.border="none",h.style.background="var(--persona-danger, #b42318)",h.style.color="var(--persona-danger-fg, #ffffff)";let y=n("div",{className:"persona-history-confirm",style:{position:"absolute",inset:"0",zIndex:"40",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",background:"var(--persona-history-confirm-scrim, rgba(15, 23, 42, 0.45))"}},c);return new Promise(f=>{let w=!1,R=b=>{w||(w=!0,y.removeEventListener("keydown",x,!0),y.remove(),r?.focus(),f(b))};function x(b){if(b.key==="Escape"){b.preventDefault(),b.stopPropagation(),R(!1);return}if(b.key!=="Tab")return;let m=Array.from(c.querySelectorAll(ar));if(m.length===0)return;let D=m[0],S=m[m.length-1],j=document.activeElement;b.shiftKey&&(j===D||!c.contains(j))?(b.preventDefault(),S.focus()):!b.shiftKey&&j===S&&(b.preventDefault(),D.focus())}y.addEventListener("keydown",x,!0),y.addEventListener("pointerdown",b=>{b.target===y&&R(!1)}),a.addEventListener("click",()=>R(!1)),h.addEventListener("click",()=>R(!0)),e.host.appendChild(y),a.focus()})}export{he as HISTORY_VIEW_COPY_DEFAULTS,mt as createHistoryView,me as resolveHistoryViewCopy,lr as showHistoryConfirm};
