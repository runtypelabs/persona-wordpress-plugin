var ue=e=>e.nodeType===Node.DOCUMENT_NODE,it=e=>e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&e.host!==void 0;function nt(e){let t=e.getRootNode?.();return t&&it(t)||t&&ue(t)?t:e.ownerDocument??document}function ye(e,t,o){let i=ue(e)?e.head:e,a=t.replace(/["\\]/g,"\\$&");if(i.querySelector(`style[data-persona-plugin-style="${a}"]`))return;let h=(ue(e)?e:e.ownerDocument??document).createElement("style");h.setAttribute("data-persona-plugin-style",t),h.textContent=o,i.appendChild(h)}function st(e,t,o){if(ue(e)||it(e)){ye(e,t,o);return}let i=e;if(i.isConnected){ye(nt(i),t,o);return}let a=i.ownerDocument??document;ye(a,t,o),queueMicrotask(()=>{let d=nt(i);d!==a&&ye(d,t,o)})}var s=(e,t={},...o)=>{let i=document.createElement(e);if(t.className&&(i.className=t.className),t.text!==void 0&&(i.textContent=t.text),t.attrs)for(let[d,h]of Object.entries(t.attrs))i.setAttribute(d,h);if(t.style){let d=i.style,h=t.style;for(let c of Object.keys(h)){let u=h[c];u!=null&&(d[c]=u)}}let a=o.filter(d=>d!=null);return a.length>0&&i.append(...a),i},_=(...e)=>e.filter(Boolean).join(" ");function at(){let e=document.createElement("div");e.className="persona-history-sr-only",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("data-persona-history-live-region","");let t;return{element:e,announce(o){t!==void 0&&clearTimeout(t),e.textContent="",t=setTimeout(()=>{t=void 0,e.textContent=o},0)},destroy(){t!==void 0&&clearTimeout(t),e.remove()}}}var lt=`
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
`;var dt={viewTitle:"Messages",openHistoryLabel:"Messages",openHistoryBusyLabel:"Messages, available once the reply finishes",newConversationLabel:"New conversation",expandLabel:"Expand conversation list",collapseLabel:"Collapse conversation list",resizeLabel:"Resize conversation list",showEarlierMessagesLabel:"Show earlier messages",openConversationLoadingLabel:"Loading conversation",openConversationErrorTitle:"Could not open the conversation.",openConversationRetryLabel:"Try again",openConversationBackLabel:"Back to messages",confirmCancelLabel:"Cancel",deleteConversationConfirmTitle:"Delete conversation",deleteConversationConfirm:"Delete this conversation? This cannot be undone.",deleteConversationConfirmLabel:"Delete",clearHistoryConfirmTitle:"Delete all conversations",clearHistoryConfirm:"Delete all conversations for this assistant on this browser? This cannot be undone.",clearHistoryVerifiedConfirm:"Delete all conversations for this assistant and signed-in user? This cannot be undone.",clearHistoryConfirmLabel:"Delete all",resetIdentityConfirmTitle:"Forget this device",resetIdentityConfirm:"Forget this device? All Persona data stored in this browser is cleared. Records are not deleted elsewhere.",resetIdentityConfirmLabel:"Forget this device",conversationDeletedNotice:"That conversation was deleted. You are now in a new conversation.",identityResetNotice:"This device was forgotten.",identityResetUnconfirmedNotice:"This device was cleared here, but the server could not confirm it."};var he={...dt,emptyTitle:"No conversations yet",emptyDescription:"Start a conversation and it will show up here.",errorTitle:"Could not load conversations",errorDescription:"Something went wrong. Please try again.",retryLabel:"Retry",rateLimitedTitle:"Too many requests",rateLimitedDescription:"Please wait a moment before trying again.",groupStarred:"Starred",groupToday:"Today",groupYesterday:"Yesterday",groupPrevious7Days:"Previous 7 days",groupPrevious30Days:"Previous 30 days",groupMonthYear:"{month} {year}",browserOnlyTitle:"Messages on this device",browserOnlyDescription:"Another browser or device keeps its own separate history.",verifyingTitle:"Checking your account",verifyingDescription:"Looking for messages linked to your account.",verifiedTitle:"Available across signed-in devices",verifiedDescription:"This list refreshes when the chat opens rather than syncing live.",authenticationRequiredTitle:"Sign in to see your messages",authenticationRequiredDescription:"Your session expired. Sign in again to load account history.",identityProviderFailedTitle:"Account history is unavailable",identityProviderFailedDescription:"We could not verify your account, so account history is not shown here.",proofNotAdmittedTitle:"Account history is unavailable",proofNotAdmittedDescription:"This assistant is not set up to accept your account identity.",retryIdentityLabel:"Try again",backLabel:"Back to conversation",closeLabel:"Close conversation list",loadingLabel:"Loading conversations",loadMoreLabel:"Load more",loadingMoreLabel:"Loading more conversations",rowActionsLabel:"Conversation options",listOptionsLabel:"Conversation options",deleteConversationLabel:"Delete",clearHistoryLabel:"Delete all conversations",resetIdentityLabel:"Forget this device",messageCountLabel:"{count} messages",messageCountLabelOne:"1 message",conversationRemovedNotice:"Conversation deleted.",historyClearedNotice:"All conversations were deleted.",unavailableTitle:"Conversation history is unavailable",unavailableDescription:"Try again later.",newConversationRequiredTitle:"Start a new conversation",newConversationRequiredDescription:"The previous conversation is gone. Start a new one to keep chatting.",rateLimitedWaitDescription:"You can try again in {seconds} seconds.",openFailedLabel:"Could not open that conversation.",deleteFailedLabel:"Could not delete that conversation.",relativeNow:"now",relativeMinutes:"{value}m",relativeHours:"{value}h",relativeDays:"{value}d",relativeWeeks:"{value}w",relativeYears:"{value}y"};function me(e){if(!e)return he;let t={...he};for(let[o,i]of Object.entries(e))typeof i=="string"&&i.length>0&&(t[o]=i);return t}function T(e,t){return e.replace(/\{(\w+)\}/g,(o,i)=>i in t?String(t[i]):o)}var Ie=864e5;function qt(e){let t=new Date(e);return t.setHours(0,0,0,0),t.getTime()}function Oe(e,t){let o=Date.parse(e);return Number.isFinite(o)?o:t}function zt(e,t){let o=Oe(e,t),i=qt(t);if(o>=i)return"today";if(o>=i-Ie)return"yesterday";if(o>=i-7*Ie)return"previous-7-days";if(o>=i-30*Ie)return"previous-30-days";let a=new Date(o);return`month:${a.getFullYear()}-${a.getMonth()}`}function $t(e,t,o,i){if(e==="today")return i.groupToday;if(e==="yesterday")return i.groupYesterday;if(e==="previous-7-days")return i.groupPrevious7Days;if(e==="previous-30-days")return i.groupPrevious30Days;let a=new Date(Oe(t,o));return T(i.groupMonthYear,{month:a.toLocaleString(void 0,{month:"long"}),year:a.getFullYear()})}function pt(e,t,o){let i=e.filter(d=>d.starred),a=i.length>0?[{key:"starred",label:o.groupStarred,items:i}]:[];for(let d of e){if(d.starred)continue;let h=zt(d.updatedAt,t),c=a[a.length-1];if(c&&c.key===h){c.items.push(d);continue}a.push({key:h,label:$t(h,d.updatedAt,t,o),items:[d]})}return a}function ct(e,t,o){let i=Math.max(0,t-Oe(e,t)),a=Math.floor(i/6e4);if(a<1)return o.relativeNow;if(a<60)return T(o.relativeMinutes,{value:a});let d=Math.floor(a/60);if(d<24)return T(o.relativeHours,{value:d});let h=Math.floor(d/24);if(h<7)return T(o.relativeDays,{value:h});let c=Math.floor(h/7);return h<365?T(o.relativeWeeks,{value:c}):T(o.relativeYears,{value:Math.floor(h/365)})}function yt(e,t){return e===1?t.messageCountLabelOne:T(t.messageCountLabel,{count:e})}var ve="http://www.w3.org/2000/svg",Kt={"arrow-left":["m12 19-7-7 7-7","M19 12H5"],plus:["M5 12h14","M12 5v14"],star:["m12 2 2.9 6.2 6.8.7-5.1 4.5 1.4 6.6-6-3.4-6 3.4 1.4-6.6-5.1-4.5 6.8-.7z"],x:["M18 6 6 18","m6 6 12 12"],"panel-left":["M9 3v18"],ellipsis:[]};function F(e,t=20){let o=document.createElementNS(ve,"svg");if(o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("viewBox","0 0 24 24"),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true"),o.setAttribute("focusable","false"),e==="ellipsis"){for(let i of[12,19,5]){let a=document.createElementNS(ve,"circle");a.setAttribute("cx",String(i)),a.setAttribute("cy","12"),a.setAttribute("r","1"),o.appendChild(a)}return o}if(e==="panel-left"){let i=document.createElementNS(ve,"rect");i.setAttribute("width","18"),i.setAttribute("height","18"),i.setAttribute("x","3"),i.setAttribute("y","3"),i.setAttribute("rx","2"),o.appendChild(i)}for(let i of Kt[e]){let a=document.createElementNS(ve,"path");a.setAttribute("d",i),o.appendChild(a)}return o}var Bt=/^(https?:|\/|data:)/i;function Wt(e){let t=s("span",{className:"persona-history-row-avatar",attrs:{"aria-hidden":"true"}});return Bt.test(e)?t.appendChild(s("img",{attrs:{src:e,alt:"",loading:"lazy"}})):t.textContent=e,t}var Yt=e=>`row:${e}`,jt=e=>`menu:${e}`,te=e=>`menu-item:${e}`;function ut(e){let{conversation:t,copy:o,busy:i,pending:a}=e,d=i||a!==null,h=t.title.trim().length>0,c=t.starred?(()=>{let N=F("star",11);return N.setAttribute("fill","currentColor"),N.setAttribute("stroke-width","1"),s("span",{className:"persona-history-row-star"},N,s("span",{className:"persona-history-sr-only",text:o.groupStarred}))})():null,u=s("div",{className:"persona-history-row-head"},s("span",{className:"persona-history-row-title persona-history-truncate",text:h?t.title:t.preview??""}),c,s("time",{className:"persona-history-row-time",attrs:{datetime:t.updatedAt},text:ct(t.updatedAt,e.nowMs,o)})),C=h&&t.preview?s("span",{className:"persona-history-row-preview persona-history-truncate",text:t.preview}):null,w=s("button",{className:_("persona-history-row",e.active&&"persona-history-row--active",a&&`persona-history-row--${a}`),attrs:{type:"button","data-persona-history-focus":Yt(t.id),"data-persona-history-conversation":t.id,...e.active?{"aria-current":"page"}:{},...d?{"aria-disabled":"true"}:{},...a?{"aria-busy":"true"}:{}}},e.avatar?Wt(e.avatar):null,s("div",{className:"persona-history-row-body"},u,C,s("span",{className:"persona-history-row-count persona-history-sr-only",text:yt(t.messageCount,o)})));w.addEventListener("click",()=>{d||e.onOpen()});let oe=e.showDelete?Ve({className:"persona-history-row-menu-button",label:`${o.rowActionsLabel}: ${t.title}`,focusKey:jt(t.id),open:e.menuOpen,inert:d,onToggle:e.onToggleMenu}):null;return s("li",{className:_("persona-history-item",!e.showDelete&&"persona-history-item--no-menu"),attrs:{"data-persona-history-item":t.id}},w,oe,e.menuOpen&&e.showDelete?Ut(e):null,e.error?Gt(e.error,o,t.id):null)}function Ut(e){let{conversation:t,copy:o}=e;return Fe({label:`${o.rowActionsLabel}: ${t.title}`,items:[{label:o.deleteConversationLabel,focusKey:te(t.id),onSelect:e.onDelete}],onCloseMenu:e.onCloseMenu})}function Ve(e){let t=s("button",{className:_("persona-history-icon-button",e.className),attrs:{type:"button","aria-label":e.label,"aria-haspopup":"menu","aria-expanded":e.open?"true":"false","data-persona-history-focus":e.focusKey,...e.inert?{"aria-disabled":"true"}:{}}});t.appendChild(F("ellipsis",e.iconSize));let o=()=>t.getAttribute("aria-disabled")==="true";return t.addEventListener("click",i=>{i.stopPropagation(),!o()&&e.onToggle()}),t.addEventListener("keydown",i=>{i.key!=="ArrowDown"&&i.key!=="ArrowUp"||(i.preventDefault(),!(o()||t.getAttribute("aria-expanded")==="true")&&e.onToggle())}),t}function Fe(e){let t=s("div",{className:"persona-history-menu",attrs:{role:"menu","aria-label":e.label}});for(let o of e.items){let i=s("button",{className:"persona-history-menu-item",text:o.label,attrs:{type:"button",role:"menuitem",tabindex:"0","data-persona-history-focus":o.focusKey}});i.addEventListener("click",()=>{e.onCloseMenu(),o.onSelect()}),t.appendChild(i)}return t.addEventListener("keydown",o=>{let i=Array.from(t.querySelectorAll('[role="menuitem"]'));if(i.length===0)return;let a=i.indexOf(document.activeElement);if(o.key==="Tab"){e.onCloseMenu({restoreFocus:!0});return}if(o.key==="ArrowDown"){o.preventDefault(),i[(a+1+i.length)%i.length]?.focus();return}if(o.key==="ArrowUp"){o.preventDefault(),i[(a-1+i.length)%i.length]?.focus();return}if(o.key==="Home"){o.preventDefault(),i[0]?.focus();return}o.key==="End"&&(o.preventDefault(),i[i.length-1]?.focus())}),t}function Gt(e,t,o){let i=s("button",{className:"persona-history-secondary persona-history-state-action",text:t.retryLabel,attrs:{type:"button","data-persona-history-focus":`row-retry:${o}`}});return i.addEventListener("click",e.retry),s("div",{className:"persona-history-row-error",attrs:{role:"alert"}},s("span",{text:e.message}),i)}var qe=class extends Error{constructor(t,o,i){super(o),this.name="HistoryProviderError",this.code=t,i?.retryAfterSeconds!==void 0&&(this.retryAfterSeconds=i.retryAfterSeconds)}};function fe(e){return e instanceof qe}function Xt(e){switch(e){case"authentication_failed":case"authentication_required":case"identity_provider_failed":case"proof_not_admitted":case"unsupported_scope":case"unavailable":return e;default:return"unknown"}}function ht(e){if(fe(e)){if(e.code==="rate_limited")return{kind:"rate_limited",retryAfterSeconds:e.retryAfterSeconds??0};let t=Xt(e.code);return{kind:"error",reason:t,retryable:t!=="unsupported_scope"}}return{kind:"error",reason:"unknown",retryable:!0}}function Zt(e,t){switch(e.state){case"authentication_required":return{title:t.authenticationRequiredTitle,description:t.authenticationRequiredDescription};case"identity_provider_failed":return{title:t.identityProviderFailedTitle,description:t.identityProviderFailedDescription};case"configuration_error":return{title:t.proofNotAdmittedTitle,description:t.proofNotAdmittedDescription};default:return null}}function Jt(e,t){switch(e){case"authentication_required":case"authentication_failed":return{title:t.authenticationRequiredTitle,description:t.authenticationRequiredDescription};case"identity_provider_failed":return{title:t.identityProviderFailedTitle,description:t.identityProviderFailedDescription};case"proof_not_admitted":case"unsupported_scope":return{title:t.proofNotAdmittedTitle,description:t.proofNotAdmittedDescription};case"unavailable":return{title:t.unavailableTitle,description:t.unavailableDescription};default:return{title:t.errorTitle,description:t.errorDescription}}}function ge(e,t,o,i){let a=s("button",{className:"persona-history-secondary persona-history-state-action",text:e,attrs:{type:"button","data-persona-history-focus":t,...o?{"aria-disabled":"true"}:{}}});return a.addEventListener("click",()=>{o||i()}),a}function re(e,t,o,i,a){return s("div",{className:"persona-history-state",attrs:{"data-persona-history-state":e,...a?{role:"alert"}:{role:"status"}}},s("p",{className:"persona-history-state-title",text:t}),s("p",{className:"persona-history-state-description",text:o}),i)}function Qt(e){let t=["42%","58%","34%"],o=["94%","78%","88%"],i=[0,1,2].map(a=>s("div",{className:"persona-history-skeleton-row",attrs:{"aria-hidden":"true"}},s("div",{className:"persona-history-skeleton-head"},s("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--title",style:{width:t[a]}}),s("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--time"})),s("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--preview",style:{width:o[a]}})));return s("div",{className:"persona-history-view-loading",attrs:{"data-persona-history-state":"loading",role:"status","aria-label":e.loadingLabel}},...i)}function mt(e){let{state:t,copy:o,busy:i}=e;if(t.kind==="loading")return Qt(o);if(t.kind==="empty"){let c=Zt(e.identityStatus,o);return c?re("identity",c.title,c.description,e.onRetry?ge(o.retryIdentityLabel,"state-retry",i,e.onRetry):null,!0):re("empty",o.emptyTitle,o.emptyDescription,null,!1)}if(t.kind==="rate_limited"){let c=t.retryAfterSeconds>0?T(o.rateLimitedWaitDescription,{seconds:t.retryAfterSeconds}):o.rateLimitedDescription;return re("rate_limited",o.rateLimitedTitle,c,e.onRetry?ge(o.retryLabel,"state-retry",i,e.onRetry):null,!1)}if(t.kind==="new_conversation_required")return re("new_conversation_required",o.newConversationRequiredTitle,o.newConversationRequiredDescription,e.onStartNew?ge(o.newConversationLabel,"state-retry",i,e.onStartNew):null,!0);let{title:a,description:d}=Jt(t.reason,o),h=t.reason==="authentication_required"||t.reason==="authentication_failed"||t.reason==="identity_provider_failed"?o.retryIdentityLabel:o.retryLabel;return re("error",a,d,t.retryable&&e.onRetry?ge(h,"state-retry",i,e.onRetry):null,!0)}var er=25,q="persona:list-options",tr=180,vt=120,rr=160,or="cubic-bezier(0.4, 0, 1, 1)",nr={panel:20,rail:12},ir=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,sr=e=>e.finished?e.finished.then(()=>{},()=>{}):Promise.resolve();function be(e){return`${e.state}:${"reason"in e?e.reason:""}`}function ft(e,t){switch(e.state){case"verified":return{title:t.verifiedTitle,description:t.verifiedDescription,pending:!1};case"verifying":case"resetting":return{title:t.verifyingTitle,description:t.verifyingDescription,pending:!0};case"authentication_required":return{title:t.authenticationRequiredTitle,description:t.authenticationRequiredDescription,pending:!1};case"identity_provider_failed":return{title:t.identityProviderFailedTitle,description:t.identityProviderFailedDescription,pending:!1};case"configuration_error":return{title:t.proofNotAdmittedTitle,description:t.proofNotAdmittedDescription,pending:!1};case"unavailable":return{title:t.unavailableTitle,description:t.unavailableDescription,pending:!1};default:return{title:t.browserOnlyTitle,description:t.browserOnlyDescription,pending:!1}}}function ar(e){return e.state==="verified"||e.state==="browser_only"}function lr(e){return e.state==="authentication_required"||e.state==="identity_provider_failed"||e.state==="configuration_error"}function gt(e){let t=me(e.copy),o=e.now??(()=>Date.now()),i=e.pageSize??er,a=`persona-history-title-${Math.random().toString(36).slice(2,8)}`,d=[],h=null,c={kind:"loading",phase:"initial"},u=null,C=e.activeConversationId,w=e.provider.getIdentityStatus(),oe=be(w),x=null,N=!1,m=!1,W=0,L=e.presentation,bt=e.collapsible!==!1,E=e.collapsed===!0,ze=e.railSide==="right",Y=e.renderDom!==!1,I=new Map,R=null,we=at(),ne=r=>{!Y&&e.onAnnounce?e.onAnnounce(r):we.announce(r)},b=()=>u!==null,$e=`${a}-body`,g=s("button",{className:"persona-history-icon-button persona-history-back",attrs:{type:"button"}}),j=()=>L==="rail"&&bt,ie,wt=()=>{if(e.railBrand){if(!j()){g.classList.remove("persona-history-back--branded");return}if(ie===void 0){let r=e.railBrand(!0);ie=r?s("span",{className:"persona-history-brand-mark persona-history-toggle-brand",attrs:{"aria-hidden":"true"}},r):null}ie&&(g.classList.add("persona-history-back--branded"),g.appendChild(ie))}},xe=()=>{let r=j(),n=L==="rail";g.setAttribute("data-persona-history-focus",r?"collapse":"close"),g.setAttribute("aria-label",r?E?t.expandLabel:t.collapseLabel:n?t.closeLabel:t.backLabel),r?(g.setAttribute("aria-expanded",E?"false":"true"),g.setAttribute("aria-controls",$e),e.collapseShortcut?.aria&&g.setAttribute("aria-keyshortcuts",e.collapseShortcut.aria)):(g.removeAttribute("aria-expanded"),g.removeAttribute("aria-controls"),g.removeAttribute("aria-keyshortcuts")),g.replaceChildren(F(r?"panel-left":n?"x":"arrow-left")),wt()};xe(),g.addEventListener("click",()=>{j()?e.onToggleCollapse?.():e.onClose()});let He=s("h2",{className:"persona-history-title",text:t.viewTitle,attrs:{id:a}}),Ke=s("span",{className:"persona-history-scope-title"}),U=s("p",{className:"persona-history-scope"},Ke),se=s("div",{className:"persona-history-heading-group"},He),Be=!1,ae,Ce=()=>{let r=L==="rail",n=r?e.renderRailHeader:void 0,l=null,y=n!==void 0;if(n)try{l=n({collapsed:E,defaultTitle:t.viewTitle})}catch(p){y=!1,Be||(Be=!0,console.warn("[persona] history rail renderHeader threw",p))}if(!y&&r&&e.railBrand){if(ae===void 0){let p=e.railBrand(!1);ae=p?s("span",{className:"persona-history-heading-brand",attrs:{"aria-hidden":"true"}},s("span",{className:"persona-history-brand-mark"},p),s("span",{className:"persona-history-wordmark",text:t.viewTitle})):null}ae&&(y=!0,l=ae)}He.classList.toggle("persona-history-sr-only",y),se.replaceChildren(He),l&&se.appendChild(l)};Ce();let z=s("button",{className:"persona-history-icon-button persona-history-new-icon",attrs:{type:"button","data-persona-history-focus":"new-icon","aria-label":t.newConversationLabel}});z.appendChild(F("plus")),z.addEventListener("click",()=>{ee()});let xt=[g,z].map(r=>e.attachTooltip?.({anchor:r,text:()=>r.getAttribute("aria-label")??"",...r===g&&e.collapseShortcut?{hint:()=>j()?e.collapseShortcut.hint:""}:{}})),S=s("div",{className:"persona-history-topbar"}),We=null,Se=()=>{let r=L==="rail",n=r?ze?"rail-right":"rail":"panel";n!==We&&(We=n,n==="rail"?S.append(se,g):S.append(g,se),r?z.remove():S.appendChild(z),v.classList.toggle("persona-history-view--rail-right",n==="rail-right"))},O=s("div",{className:"persona-history-scope-alert"}),Ye=`${a}-scope`,Ht=F("plus",18),Le=s("button",{className:"persona-history-new",attrs:{type:"button","data-persona-history-focus":"new"}},Ht,s("span",{text:t.newConversationLabel}));Le.addEventListener("click",()=>{ee()});let ke=s("div",{className:"persona-history-list-region"}),je=e.showDeleteAll!==!1,Ue=!!e.provider.resetDevice,M=je||Ue?Ve({className:"persona-history-list-options",label:t.listOptionsLabel,focusKey:`menu:${q}`,open:!1,inert:!0,iconSize:16,onToggle:()=>tt(q)}):null,$=s("div",{className:"persona-history-caption",attrs:{"data-persona-history-item":q}},e.showScopeStatus?U:null,M),K=s("div",{className:"persona-history-body",attrs:{id:$e}},e.showScopeStatus?O:null,Le,e.showScopeStatus||M?$:null,ke),G=e.headerPlacement??"inline";G==="external"&&S.classList.add("persona-history-topbar--shell","persona-history-topbar--shell-enter");let v=s("div",{className:_("persona-history-view",`persona-history-view--${e.presentation}`,"persona-history-view--enter"),attrs:{role:"region","aria-labelledby":a,"data-persona-history-presentation":e.presentation}},we.element,G==="inline"?S:null,K),Te=()=>{v.classList.toggle("persona-history-view--rail-collapsed",E&&j())};Te(),Se();let Ct=(r,n)=>{let l=`${a}-s${n}`,y=s("div",{className:_("persona-history-nav",r.placement==="footer"&&"persona-history-nav--footer"),attrs:{role:"group","data-persona-rail-section":r.id,...r.title?{"aria-labelledby":l}:{"aria-label":r.id}}});r.title&&y.appendChild(s("h3",{className:"persona-history-group-heading",text:r.title,attrs:{id:l}}));for(let p of r.items){let H=p.iconNode?.()??null,D=s("button",{className:_("persona-history-nav-item",H&&"persona-history-nav-item--icon"),attrs:{type:"button","aria-label":p.label,"data-persona-rail-item":p.id}},H?s("span",{className:"persona-history-nav-icon"},H):null,s("span",{className:"persona-history-nav-label persona-history-truncate",text:p.label}),p.badge?s("span",{className:"persona-history-nav-badge",text:p.badge}):null);D.addEventListener("click",()=>p.onSelect()),y.appendChild(D)}return y},X=null,Ge=null,Ee=()=>{!X||!Y||L!=="rail"||E===Ge||(Ge=E,e.railSections.forEach((r,n)=>{if(!r.render)return;let l=X[n],y=r.title?l.firstElementChild:null,p=null;try{p=r.render(E)}catch(H){r.render=void 0,console.warn("[persona] history rail section threw",r.id,H)}l.replaceChildren(...y?[y]:[],...p?[p]:[]),l.hidden=!p}))},Xe=()=>{let r=e.railSections;if(r?.length){if(L!=="rail"){X?.forEach(n=>n.remove());return}X??(X=r.map(Ct));for(let n of["above-conversations","below-conversations","footer"]){let l=n==="above-conversations"?$.parentNode===K?$:ke:null;r.forEach((y,p)=>{y.placement===n&&K.insertBefore(X[p],l)})}Ee()}};Xe(),st(v,"persona-history-view",lt);let Ze=(r,n)=>{let l=v.ownerDocument.defaultView?.getComputedStyle(v).getPropertyValue(r),y=Number.parseFloat(l??"");return Number.isFinite(y)&&y>=0?y:n},St=(r,n)=>v.ownerDocument.defaultView?.getComputedStyle(v).getPropertyValue(r).trim()||n,Z=null,V=()=>{Z!==null&&(clearTimeout(Z),Z=null),v.removeEventListener("animationend",V),v.classList.remove("persona-history-view--enter")};v.addEventListener("animationend",V),Z=setTimeout(()=>{Z=setTimeout(V,Ze("--persona-history-enter-ms",tr)+60)},0);let J=null,Q=()=>{J!==null&&(clearTimeout(J),J=null),S.classList.remove("persona-history-topbar--shell-enter")},Lt=()=>{Q(),S.classList.add("persona-history-topbar--shell-enter"),J=setTimeout(Q,vt+60)};G==="external"&&(J=setTimeout(Q,vt+60));let le=[],de=null,kt=()=>{if(de)return de;if(m||ir()||typeof v.animate!="function")return V(),null;let r=v.ownerDocument.defaultView?.getComputedStyle(K).opacity||"1";V(),v.style.pointerEvents="none",P.style.pointerEvents="none";let n={duration:Ze("--persona-history-exit-ms",rr),easing:St("--persona-history-exit-easing",or),fill:"forwards"},l=nr[L];return le=[K.animate([{opacity:r,transform:"none"},{opacity:0,transform:`translateX(${l}px)`}],n)],de=Promise.all(le.map(sr)).then(()=>{}),de},Re=(r,n)=>{r&&(n?r.setAttribute("aria-disabled","true"):r.removeAttribute("aria-disabled"))},P=S,Ae=null,Tt=()=>{let r=e.slots?.header;if(!r)return;let n=`${L}|${be(w)}|${u?`${u.kind}:${"conversationId"in u?u.conversationId:""}`:""}`;if(n===Ae)return;Ae=n;let l=r({identityStatus:w,pendingAction:u,copy:t,defaultRenderer:()=>S})??S;l!==P&&(P.replaceWith(l),P=l)},Je=null,Et=()=>{if(!e.showScopeStatus)return;let r=be(w);if(r===Je)return;Je=r;let n=ft(w,t);Ke.textContent=n.title;let l=ar(w);if(U.hidden=!l,O.replaceChildren(...l?[]:[s("span",{className:"persona-history-scope-alert-title",text:n.title})],s("span",{className:"persona-history-scope-description",text:n.description,attrs:{id:Ye}})),O.setAttribute("data-persona-history-scope-tone",l?"ambient":"attention"),l?U.setAttribute("aria-describedby",Ye):U.removeAttribute("aria-describedby"),n.pending?O.setAttribute("role","status"):O.removeAttribute("role"),O.setAttribute("data-persona-history-identity",w.state),lr(w)){let y=s("button",{className:"persona-history-secondary persona-history-state-action",text:t.retryIdentityLabel,attrs:{type:"button","data-persona-history-focus":"identity-retry"}});y.addEventListener("click",()=>{b()||A("refresh")}),O.appendChild(y)}},Qe=r=>u?u.kind==="open"&&u.conversationId===r?"opening":u.kind==="delete"&&u.conversationId===r?"deleting":null:null,Rt=()=>{let r=document.activeElement;return!(r instanceof HTMLElement)||!v.contains(r)?null:r.getAttribute("data-persona-history-focus")},At=r=>{if(N&&x){N=!1;let n=v.querySelector(`[data-persona-history-focus="${te(x)}"]`);if(n){n.focus();return}}r&&v.querySelector(`[data-persona-history-focus="${r}"]`)?.focus()},Nt=()=>{if(!R)return null;let r=s("button",{className:"persona-history-secondary persona-history-state-action",text:t.retryLabel,attrs:{type:"button","data-persona-history-focus":"action-retry"}}),n=R;return r.addEventListener("click",()=>{b()||n.retry()}),s("div",{className:"persona-history-row-error",attrs:{role:"alert"}},s("span",{text:n.message}),r)},Mt=()=>pt(d,o(),t).map((r,n)=>{let l=`${a}-g${n}`,y=s("ul",{className:"persona-history-list",attrs:{"aria-labelledby":l}});for(let p of r.items){let H=()=>ut({conversation:p,active:p.id===C,pending:Qe(p.id),busy:b(),menuOpen:x===p.id,error:I.get(p.id)??null,avatar:e.rowAvatar,showDelete:e.showDelete!==!1,nowMs:o(),copy:t,onOpen:()=>{pe(p.id)},onToggleMenu:()=>tt(p.id),onCloseMenu:_e=>k(_e),onDelete:()=>{ce(p.id)}}),B=e.slots?.conversation?.({conversation:p,active:p.id===C,pending:Qe(p.id),open:()=>pe(p.id),requestDelete:()=>ce(p.id),defaultRenderer:H})??H();y.appendChild(B instanceof HTMLLIElement?B:s("li",{className:"persona-history-item"},B))}return s("div",{className:"persona-history-group",attrs:{"data-persona-history-group":r.key}},s("h3",{className:"persona-history-group-heading",text:r.label,attrs:{id:l}}),y)}),Pt=()=>{if(!h)return null;let r=u?.kind==="load-more"||c.kind==="loading"&&c.phase==="load-more",n=s("button",{className:"persona-history-secondary persona-history-load-more",text:r?t.loadingMoreLabel:t.loadMoreLabel,attrs:{type:"button","data-persona-history-focus":"load-more",...r?{"aria-busy":"true","aria-disabled":"true"}:{},...b()&&!r?{"aria-disabled":"true"}:{}}});return n.addEventListener("click",()=>{b()||A("load-more")}),n},Dt=()=>{let r=Rt(),n=[Nt()],l=d.length>0;if(l&&(n.push(...Mt()),n.push(Pt())),c.kind!=="ready"&&!(c.kind==="loading"&&c.phase!=="initial"&&l)){let p=c,H=p.kind==="loading"?void 0:()=>A("refresh"),D=p.kind==="new_conversation_required"?()=>ee():void 0,B=()=>mt({state:p,copy:t,identityStatus:w,busy:b(),...H?{onRetry:()=>{H()}}:{},...D?{onStartNew:()=>{D()}}:{}}),_e=e.slots?.state?.({state:p,identityStatus:w,copy:t,...H?{retry:H}:{},...D?{startNewConversation:D}:{},defaultRenderer:B});n.push(_e??B())}ke.replaceChildren(...n.filter(p=>!!p)),At(r)},_t=()=>{let r=c.kind==="loading"&&d.length===0,n=[],l=()=>n.length===0?te(q):`${te(q)}-${n.length}`;return je&&!(d.length===0&&(c.kind==="empty"||r))&&n.push({label:t.clearHistoryLabel,focusKey:l(),onSelect:()=>{Me()}}),Ue&&!r&&n.push({label:t.resetIdentityLabel,focusKey:l(),onSelect:()=>{De()}}),n},It=()=>{if(Re(Le,b()),Re(z,b()),M){let r=_t(),n=c.kind==="loading"&&d.length===0;M.hidden=r.length===0&&!n,Re(M,b()||r.length===0),M.setAttribute("aria-expanded",x===q?"true":"false");let l=$.querySelector(".persona-history-menu");if(x!==q||r.length===0)l?.remove();else{let y=Fe({label:t.listOptionsLabel,items:r,onCloseMenu:p=>k(p)});l?l.replaceWith(y):$.appendChild(y)}}$.hidden=(!M||M.hidden)&&(!e.showScopeStatus||U.hidden)},et,Ot=()=>{let r=e.onActiveConversationChange;if(!r)return;let n=d.find(y=>y.id===C)??null,l=n?`${n.id}\0${n.title}\0${n.starred?1:0}`:"";l!==et&&(et=l,r(n))},f=()=>{if(!m){if(Ot(),!Y){e.onModelChange?.();return}Tt(),Et(),It(),Dt(),Ee()}},k=r=>{if(!x)return;let n=x;x=null,N=!1,f(),r?.restoreFocus&&v.querySelector(`[data-persona-history-focus="menu:${n}"]`)?.focus()},tt=r=>{if(x===r){k({restoreFocus:!0});return}x=r,N=!0,f()},rt=r=>{if(!x)return;let n=r.target;n instanceof Node&&v.contains(n)&&n.closest?.(`[data-persona-history-item="${x}"]`)||k()};document.addEventListener("pointerdown",rt,!0);let ot=r=>{r.key!=="Escape"||!x||(r.stopPropagation(),k({restoreFocus:!0}))};v.addEventListener("keydown",ot);async function A(r){if(m)return;let n=++W,l=r==="load-more"?h:null;if(!(r==="load-more"&&!l)){u={kind:r==="load-more"?"load-more":"refresh"},c={kind:"loading",phase:r},r!=="load-more"&&(I.clear(),R=null),k(),f();try{let y=await e.provider.list({limit:i,context:e.context,...l?{cursor:l}:{},...e.targetId?{targetId:e.targetId}:{}});if(m||n!==W)return;d=l?[...d,...y.items]:y.items,h=y.nextCursor,c=d.length===0?{kind:"empty"}:{kind:"ready"}}catch(y){if(m||n!==W)return;c=ht(y)}finally{!m&&n===W&&(u=null,f())}}}let Ne=r=>{d=d.filter(n=>n.id!==r),I.delete(r),C===r&&(C=null),d.length===0&&!h&&(c={kind:"empty"})};async function pe(r){if(!(b()||m)){I.delete(r),k(),u={kind:"open",conversationId:r},f();try{if(await e.onSelect(r),m)return;C=r}catch{if(m)return;I.set(r,{message:t.openFailedLabel,retry:()=>{pe(r)}})}finally{m||(u=null,f())}}}async function ce(r){if(b()||m)return"cancelled";I.delete(r),u={kind:"delete",conversationId:r},f();try{let n=await e.onRequestDeleteConversation(r);return m||n==="deleted"&&(Ne(r),ne(t.conversationRemovedNotice)),n}catch(n){return m||(fe(n)&&n.code==="not_found"?Ne(r):I.set(r,{message:t.deleteFailedLabel,retry:()=>{ce(r)}})),"cancelled"}finally{m||(u=null,f())}}async function ee(){if(!(b()||m)){R=null,k(),u={kind:"start-new"},f();try{if(await e.onStartNew(),m)return;c.kind==="new_conversation_required"&&(c=d.length===0?{kind:"empty"}:{kind:"ready"})}catch{if(m)return;R={message:t.errorDescription,retry:()=>{ee()}}}finally{m||(u=null,f())}}}async function Me(){if(b()||m)return"cancelled";R=null,k(),u={kind:"clear"},f();try{let r=await e.onRequestClearHistory();return m||r==="cleared"&&(d=[],h=null,C=null,c={kind:"empty"},ne(t.historyClearedNotice)),r}catch{return m||(R={message:t.errorDescription,retry:()=>{Me()}}),"cancelled"}finally{m||(u=null,f())}}let Pe={outcome:"cancelled"};async function De(){if(b()||m||!e.onRequestResetIdentity)return Pe;R=null,k(),u={kind:"reset"},f();try{let r=await e.onRequestResetIdentity();return m||r.outcome==="reset"&&(ne(r.remoteRevocationConfirmed?t.identityResetNotice:t.identityResetUnconfirmedNotice),u=null,await A("refresh")),r}catch{return m||(R={message:t.errorDescription,retry:()=>{De()}}),Pe}finally{!m&&u?.kind==="reset"&&(u=null,f())}}let Vt=e.provider.subscribeIdentityStatus(r=>{if(m)return;let n=be(r),l=n!==oe;w=r,oe=n,f(),l&&r.state!=="verifying"&&ne(ft(r,t).title)}),Ft=e.provider.subscribeAvailability?.(r=>{if(!m){if(r){A("refresh");return}d=[],h=null,c={kind:"error",reason:"unavailable",retryable:!1},f()}});return f(),A("initial"),{element:v,copy:t,getModel:()=>({conversations:d,activeConversationId:C,state:c,pendingAction:u,identityStatus:w,nextCursor:h}),operations:{refresh:async()=>{b()||await A("refresh")},loadMore:async()=>{b()||await A("load-more")},openConversation:r=>pe(r),startNewConversation:()=>ee(),requestDeleteConversation:r=>ce(r),requestClearConversationHistory:()=>Me(),requestResetHistoryIdentity:()=>De()},setDomRenderEnabled:r=>{r!==Y&&(Y=r,r&&f())},refresh:()=>{A("refresh")},setPresentation:r=>{if(r===L)return;V(),L=r,Ae=null;let n=r==="rail";v.classList.toggle("persona-history-view--panel",!n),v.classList.toggle("persona-history-view--rail",n),v.setAttribute("data-persona-history-presentation",r),xe(),Te(),Se(),Ce(),Xe(),f()},setCollapsed:r=>{r!==E&&(E=r,Te(),xe(),Ce(),Ee())},setRailSide:r=>{ze=r==="right",Se()},getHeaderElement:()=>P,setHeaderPlacement:r=>{if(r===G)return;G=r;let n=r==="external";if(S.classList.toggle("persona-history-topbar--shell",n),n){Lt(),P.remove();return}Q(),v.insertBefore(P,K)},setActiveConversationId:r=>{C!==r&&(C=r,f())},applyConversationSummary:r=>{let n=d.findIndex(l=>l.id===r.id);n!==-1&&(d[n]=r,f())},removeConversationSummary:r=>{d.some(n=>n.id===r)&&(Ne(r),f())},setNewConversationRequired:r=>{r?c={kind:"new_conversation_required"}:c.kind==="new_conversation_required"&&(c=d.length===0?{kind:"empty"}:{kind:"ready"}),f()},playExit:kt,destroy:()=>{m=!0,W+=1,V(),Q(),xt.forEach(r=>r?.destroy()),P.remove(),le.forEach(r=>r.cancel()),le=[],Vt(),Ft?.(),document.removeEventListener("pointerdown",rt,!0),v.removeEventListener("keydown",ot),we.destroy(),v.remove(),v.replaceChildren()}}}export{he as HISTORY_VIEW_COPY_DEFAULTS,gt as createHistoryView,me as resolveHistoryViewCopy};
