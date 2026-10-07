var ue=e=>e.nodeType===Node.DOCUMENT_NODE,st=e=>e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&e.host!==void 0;function it(e){let t=e.getRootNode?.();return t&&st(t)||t&&ue(t)?t:e.ownerDocument??document}function ye(e,t,o){let i=ue(e)?e.head:e,a=t.replace(/["\\]/g,"\\$&");if(i.querySelector(`style[data-persona-plugin-style="${a}"]`))return;let u=(ue(e)?e:e.ownerDocument??document).createElement("style");u.setAttribute("data-persona-plugin-style",t),u.textContent=o,i.appendChild(u)}function at(e,t,o){if(ue(e)||st(e)){ye(e,t,o);return}let i=e;if(i.isConnected){ye(it(i),t,o);return}let a=i.ownerDocument??document;ye(a,t,o),queueMicrotask(()=>{let l=it(i);l!==a&&ye(l,t,o)})}var s=(e,t={},...o)=>{let i=document.createElement(e);if(t.className&&(i.className=t.className),t.text!==void 0&&(i.textContent=t.text),t.attrs)for(let[l,u]of Object.entries(t.attrs))i.setAttribute(l,u);if(t.style){let l=i.style,u=t.style;for(let c of Object.keys(u)){let h=u[c];h!=null&&(l[c]=h)}}let a=o.filter(l=>l!=null);return a.length>0&&i.append(...a),i},T=(...e)=>e.filter(Boolean).join(" ");function lt(){let e=document.createElement("div");e.className="persona-history-sr-only",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("data-persona-history-live-region","");let t;return{element:e,announce(o){t!==void 0&&clearTimeout(t),e.textContent="",t=setTimeout(()=>{t=void 0,e.textContent=o},0)},destroy(){t!==void 0&&clearTimeout(t),e.remove()}}}var pt=`
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
`;var dt={viewTitle:"Messages",openHistoryLabel:"Messages",openHistoryBusyLabel:"Messages, available once the reply finishes",newConversationLabel:"New conversation",expandLabel:"Expand conversation list",collapseLabel:"Collapse conversation list",resizeLabel:"Resize conversation list",showEarlierMessagesLabel:"Show earlier messages",openConversationLoadingLabel:"Loading conversation",openConversationErrorTitle:"Could not open the conversation.",openConversationRetryLabel:"Try again",openConversationBackLabel:"Back to messages",confirmCancelLabel:"Cancel",deleteConversationConfirmTitle:"Delete conversation",deleteConversationConfirm:"Delete this conversation? This cannot be undone.",deleteConversationConfirmLabel:"Delete",clearHistoryConfirmTitle:"Delete all conversations",clearHistoryConfirm:"Delete all conversations for this assistant on this browser? This cannot be undone.",clearHistoryVerifiedConfirm:"Delete all conversations for this assistant and signed-in user? This cannot be undone.",clearHistoryConfirmLabel:"Delete all",resetIdentityConfirmTitle:"Forget this device",resetIdentityConfirm:"Forget this device? All Persona data stored in this browser is cleared. Records are not deleted elsewhere.",resetIdentityConfirmLabel:"Forget this device",conversationDeletedNotice:"That conversation was deleted. You are now in a new conversation.",identityResetNotice:"This device was forgotten.",identityResetUnconfirmedNotice:"This device was cleared here, but the server could not confirm it."};var he={...dt,emptyTitle:"No conversations yet",emptyDescription:"Start a conversation and it will show up here.",errorTitle:"Could not load conversations",errorDescription:"Something went wrong. Please try again.",retryLabel:"Retry",rateLimitedTitle:"Too many requests",rateLimitedDescription:"Please wait a moment before trying again.",groupStarred:"Starred",groupToday:"Today",groupYesterday:"Yesterday",groupPrevious7Days:"Previous 7 days",groupPrevious30Days:"Previous 30 days",groupMonthYear:"{month} {year}",browserOnlyTitle:"On this device",browserOnlyDescription:"Another browser or device keeps its own separate history.",verifyingTitle:"Checking your account",verifyingDescription:"Looking for messages linked to your account.",verifiedTitle:"Available across signed-in devices",verifiedDescription:"This list refreshes when the chat opens rather than syncing live.",authenticationRequiredTitle:"Sign in to see your messages",authenticationRequiredDescription:"Your session expired. Sign in again to load account history.",identityProviderFailedTitle:"Account history is unavailable",identityProviderFailedDescription:"We could not verify your account, so account history is not shown here.",proofNotAdmittedTitle:"Account history is unavailable",proofNotAdmittedDescription:"This assistant is not set up to accept your account identity.",retryIdentityLabel:"Try again",backLabel:"Back to conversation",closeLabel:"Close conversation list",loadingLabel:"Loading conversations",loadMoreLabel:"Load more",loadingMoreLabel:"Loading more conversations",conversationsTitle:"Conversations",rowActionsLabel:"Conversation options",listOptionsLabel:"Conversation options",deleteConversationLabel:"Delete",clearHistoryLabel:"Delete all conversations",resetIdentityLabel:"Forget this device",messageCountLabel:"{count} messages",messageCountLabelOne:"1 message",conversationRemovedNotice:"Conversation deleted.",historyClearedNotice:"All conversations were deleted.",unavailableTitle:"Conversation history is unavailable",unavailableDescription:"Try again later.",newConversationRequiredTitle:"Start a new conversation",newConversationRequiredDescription:"The previous conversation is gone. Start a new one to keep chatting.",rateLimitedWaitDescription:"You can try again in {seconds} seconds.",openFailedLabel:"Could not open that conversation.",deleteFailedLabel:"Could not delete that conversation.",relativeNow:"now",relativeMinutes:"{value}m",relativeHours:"{value}h",relativeDays:"{value}d",relativeWeeks:"{value}w",relativeYears:"{value}y"};function me(e){if(!e)return he;let t={...he};for(let[o,i]of Object.entries(e))typeof i=="string"&&i.length>0&&(t[o]=i);return t}function E(e,t){return e.replace(/\{(\w+)\}/g,(o,i)=>i in t?String(t[i]):o)}var Ie=864e5;function $t(e){let t=new Date(e);return t.setHours(0,0,0,0),t.getTime()}function Oe(e,t){let o=Date.parse(e);return Number.isFinite(o)?o:t}function Kt(e,t){let o=Oe(e,t),i=$t(t);if(o>=i)return"today";if(o>=i-Ie)return"yesterday";if(o>=i-7*Ie)return"previous-7-days";if(o>=i-30*Ie)return"previous-30-days";let a=new Date(o);return`month:${a.getFullYear()}-${a.getMonth()}`}function Bt(e,t,o,i){if(e==="today")return i.groupToday;if(e==="yesterday")return i.groupYesterday;if(e==="previous-7-days")return i.groupPrevious7Days;if(e==="previous-30-days")return i.groupPrevious30Days;let a=new Date(Oe(t,o));return E(i.groupMonthYear,{month:a.toLocaleString(void 0,{month:"long"}),year:a.getFullYear()})}function ct(e,t,o,i="time"){let a=e.filter(u=>u.starred),l=a.length>0?[{key:"starred",label:o.groupStarred,items:a}]:[];if(i==="none"){let u=e.filter(c=>!c.starred);return u.length>0&&l.push({key:"recent",label:o.conversationsTitle,items:u}),l}for(let u of e){if(u.starred)continue;let c=Kt(u.updatedAt,t),h=l[l.length-1];if(h&&h.key===c){h.items.push(u);continue}l.push({key:c,label:Bt(c,u.updatedAt,t,o),items:[u]})}return l}function yt(e,t,o){let i=Math.max(0,t-Oe(e,t)),a=Math.floor(i/6e4);if(a<1)return o.relativeNow;if(a<60)return E(o.relativeMinutes,{value:a});let l=Math.floor(a/60);if(l<24)return E(o.relativeHours,{value:l});let u=Math.floor(l/24);if(u<7)return E(o.relativeDays,{value:u});let c=Math.floor(u/7);return u<365?E(o.relativeWeeks,{value:c}):E(o.relativeYears,{value:Math.floor(u/365)})}function ut(e,t){return e===1?t.messageCountLabelOne:E(t.messageCountLabel,{count:e})}var ve="http://www.w3.org/2000/svg",Wt={"arrow-left":["m12 19-7-7 7-7","M19 12H5"],plus:["M5 12h14","M12 5v14"],star:["m12 2 2.9 6.2 6.8.7-5.1 4.5 1.4 6.6-6-3.4-6 3.4 1.4-6.6-5.1-4.5 6.8-.7z"],x:["M18 6 6 18","m6 6 12 12"],"panel-left":["M9 3v18"],monitor:["M8 21h8","M12 17v4"],ellipsis:[]},Yt={"panel-left":[3,3,18,18],monitor:[2,3,20,14]};function _(e,t=20){let o=document.createElementNS(ve,"svg");if(o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("viewBox","0 0 24 24"),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true"),o.setAttribute("focusable","false"),e==="ellipsis"){for(let a of[12,19,5]){let l=document.createElementNS(ve,"circle");l.setAttribute("cx",String(a)),l.setAttribute("cy","12"),l.setAttribute("r","1"),o.appendChild(l)}return o}let i=Yt[e];if(i){let a=document.createElementNS(ve,"rect");a.setAttribute("x",String(i[0])),a.setAttribute("y",String(i[1])),a.setAttribute("width",String(i[2])),a.setAttribute("height",String(i[3])),a.setAttribute("rx","2"),o.appendChild(a)}for(let a of Wt[e]){let l=document.createElementNS(ve,"path");l.setAttribute("d",a),o.appendChild(l)}return o}var jt=/^(https?:|\/|data:)/i;function Gt(e){let t=s("span",{className:"persona-history-row-avatar",attrs:{"aria-hidden":"true"}});return jt.test(e)?t.appendChild(s("img",{attrs:{src:e,alt:"",loading:"lazy"}})):t.textContent=e,t}var Ut=e=>`row:${e}`,Xt=e=>`menu:${e}`,te=e=>`menu-item:${e}`;function ht(e){let{conversation:t,copy:o,busy:i,pending:a}=e,l=i||a!==null,u=t.title.trim().length>0,c=t.starred?(()=>{let M=_("star",11);return M.setAttribute("fill","currentColor"),M.setAttribute("stroke-width","1"),s("span",{className:"persona-history-row-star"},M,s("span",{className:"persona-history-sr-only",text:o.groupStarred}))})():null,h=s("div",{className:"persona-history-row-head"},s("span",{className:"persona-history-row-title persona-history-truncate",text:u?t.title:t.preview??""}),c,s("time",{className:"persona-history-row-time",attrs:{datetime:t.updatedAt},text:yt(t.updatedAt,e.nowMs,o)})),C=u&&t.preview?s("span",{className:"persona-history-row-preview persona-history-truncate",text:t.preview}):null,b=s("button",{className:T("persona-history-row",e.active&&"persona-history-row--active",a&&`persona-history-row--${a}`),attrs:{type:"button","data-persona-history-focus":Ut(t.id),"data-persona-history-conversation":t.id,...e.active?{"aria-current":"page"}:{},...l?{"aria-disabled":"true"}:{},...a?{"aria-busy":"true"}:{}}},e.avatar?Gt(e.avatar):null,s("div",{className:"persona-history-row-body"},h,C,s("span",{className:"persona-history-row-count persona-history-sr-only",text:ut(t.messageCount,o)})));b.addEventListener("click",()=>{l||e.onOpen()});let oe=e.showDelete?Ve({className:"persona-history-row-menu-button",label:`${o.rowActionsLabel}: ${t.title}`,focusKey:Xt(t.id),open:e.menuOpen,inert:l,onToggle:e.onToggleMenu}):null;return s("li",{className:T("persona-history-item",!e.showDelete&&"persona-history-item--no-menu"),attrs:{"data-persona-history-item":t.id}},b,oe,e.menuOpen&&e.showDelete?Zt(e):null,e.error?Jt(e.error,o,t.id):null)}function Zt(e){let{conversation:t,copy:o}=e;return ze({label:`${o.rowActionsLabel}: ${t.title}`,items:[{label:o.deleteConversationLabel,focusKey:te(t.id),danger:!0,onSelect:e.onDelete}],onCloseMenu:e.onCloseMenu})}function Ve(e){let t=s("button",{className:T("persona-history-icon-button",e.className),attrs:{type:"button","aria-label":e.label,"aria-haspopup":"menu","aria-expanded":e.open?"true":"false","data-persona-history-focus":e.focusKey,...e.inert?{"aria-disabled":"true"}:{}}});t.appendChild(_("ellipsis",e.iconSize));let o=()=>t.getAttribute("aria-disabled")==="true";return t.addEventListener("click",i=>{i.stopPropagation(),!o()&&e.onToggle()}),t.addEventListener("keydown",i=>{i.key!=="ArrowDown"&&i.key!=="ArrowUp"||(i.preventDefault(),!(o()||t.getAttribute("aria-expanded")==="true")&&e.onToggle())}),t}function ze(e){let t=s("div",{className:"persona-history-menu",attrs:{role:"menu","aria-label":e.label}});for(let o of e.items){let i=s("button",{className:T("persona-history-menu-item",o.danger&&"persona-history-menu-item--danger"),text:o.label,attrs:{type:"button",role:"menuitem",tabindex:"0","data-persona-history-focus":o.focusKey}});i.addEventListener("click",()=>{e.onCloseMenu(),o.onSelect()}),t.appendChild(i)}return t.addEventListener("keydown",o=>{let i=Array.from(t.querySelectorAll('[role="menuitem"]'));if(i.length===0)return;let a=i.indexOf(document.activeElement);if(o.key==="Tab"){e.onCloseMenu({restoreFocus:!0});return}if(o.key==="ArrowDown"){o.preventDefault(),i[(a+1+i.length)%i.length]?.focus();return}if(o.key==="ArrowUp"){o.preventDefault(),i[(a-1+i.length)%i.length]?.focus();return}if(o.key==="Home"){o.preventDefault(),i[0]?.focus();return}o.key==="End"&&(o.preventDefault(),i[i.length-1]?.focus())}),t}function Jt(e,t,o){let i=s("button",{className:"persona-history-secondary persona-history-state-action",text:t.retryLabel,attrs:{type:"button","data-persona-history-focus":`row-retry:${o}`}});return i.addEventListener("click",e.retry),s("div",{className:"persona-history-row-error",attrs:{role:"alert"}},s("span",{text:e.message}),i)}var Fe=class extends Error{constructor(t,o,i){super(o),this.name="HistoryProviderError",this.code=t,i?.retryAfterSeconds!==void 0&&(this.retryAfterSeconds=i.retryAfterSeconds)}};function ge(e){return e instanceof Fe}function Qt(e){switch(e){case"authentication_failed":case"authentication_required":case"identity_provider_failed":case"proof_not_admitted":case"unsupported_scope":case"unavailable":return e;default:return"unknown"}}function mt(e){if(ge(e)){if(e.code==="rate_limited")return{kind:"rate_limited",retryAfterSeconds:e.retryAfterSeconds??0};let t=Qt(e.code);return{kind:"error",reason:t,retryable:t!=="unsupported_scope"}}return{kind:"error",reason:"unknown",retryable:!0}}function er(e,t){switch(e.state){case"authentication_required":return{title:t.authenticationRequiredTitle,description:t.authenticationRequiredDescription};case"identity_provider_failed":return{title:t.identityProviderFailedTitle,description:t.identityProviderFailedDescription};case"configuration_error":return{title:t.proofNotAdmittedTitle,description:t.proofNotAdmittedDescription};default:return null}}function tr(e,t){switch(e){case"authentication_required":case"authentication_failed":return{title:t.authenticationRequiredTitle,description:t.authenticationRequiredDescription};case"identity_provider_failed":return{title:t.identityProviderFailedTitle,description:t.identityProviderFailedDescription};case"proof_not_admitted":case"unsupported_scope":return{title:t.proofNotAdmittedTitle,description:t.proofNotAdmittedDescription};case"unavailable":return{title:t.unavailableTitle,description:t.unavailableDescription};default:return{title:t.errorTitle,description:t.errorDescription}}}function fe(e,t,o,i){let a=s("button",{className:"persona-history-secondary persona-history-state-action",text:e,attrs:{type:"button","data-persona-history-focus":t,...o?{"aria-disabled":"true"}:{}}});return a.addEventListener("click",()=>{o||i()}),a}function re(e,t,o,i,a){return s("div",{className:"persona-history-state",attrs:{"data-persona-history-state":e,...a?{role:"alert"}:{role:"status"}}},s("p",{className:"persona-history-state-title",text:t}),s("p",{className:"persona-history-state-description",text:o}),i)}function rr(e){let t=["42%","58%","34%"],o=["94%","78%","88%"],i=[0,1,2].map(a=>s("div",{className:"persona-history-skeleton-row",attrs:{"aria-hidden":"true"}},s("div",{className:"persona-history-skeleton-head"},s("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--title",style:{width:t[a]}}),s("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--time"})),s("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--preview",style:{width:o[a]}})));return s("div",{className:"persona-history-view-loading",attrs:{"data-persona-history-state":"loading",role:"status","aria-label":e.loadingLabel}},...i)}function vt(e){let{state:t,copy:o,busy:i}=e;if(t.kind==="loading")return rr(o);if(t.kind==="empty"){let c=er(e.identityStatus,o);return c?re("identity",c.title,c.description,e.onRetry?fe(o.retryIdentityLabel,"state-retry",i,e.onRetry):null,!0):re("empty",o.emptyTitle,o.emptyDescription,null,!1)}if(t.kind==="rate_limited"){let c=t.retryAfterSeconds>0?E(o.rateLimitedWaitDescription,{seconds:t.retryAfterSeconds}):o.rateLimitedDescription;return re("rate_limited",o.rateLimitedTitle,c,e.onRetry?fe(o.retryLabel,"state-retry",i,e.onRetry):null,!1)}if(t.kind==="new_conversation_required")return re("new_conversation_required",o.newConversationRequiredTitle,o.newConversationRequiredDescription,e.onStartNew?fe(o.newConversationLabel,"state-retry",i,e.onStartNew):null,!0);let{title:a,description:l}=tr(t.reason,o),u=t.reason==="authentication_required"||t.reason==="authentication_failed"||t.reason==="identity_provider_failed"?o.retryIdentityLabel:o.retryLabel;return re("error",a,l,t.retryable&&e.onRetry?fe(u,"state-retry",i,e.onRetry):null,!0)}var or=25,F="persona:list-options",nr=180,gt=120,ir=160,sr="cubic-bezier(0.4, 0, 1, 1)",ar={panel:20,rail:12},lr=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,pr=e=>e.finished?e.finished.then(()=>{},()=>{}):Promise.resolve();function be(e){return`${e.state}:${"reason"in e?e.reason:""}`}function ft(e,t){switch(e.state){case"verified":return{title:t.verifiedTitle,description:t.verifiedDescription,pending:!1};case"verifying":case"resetting":return{title:t.verifyingTitle,description:t.verifyingDescription,pending:!0};case"authentication_required":return{title:t.authenticationRequiredTitle,description:t.authenticationRequiredDescription,pending:!1};case"identity_provider_failed":return{title:t.identityProviderFailedTitle,description:t.identityProviderFailedDescription,pending:!1};case"configuration_error":return{title:t.proofNotAdmittedTitle,description:t.proofNotAdmittedDescription,pending:!1};case"unavailable":return{title:t.unavailableTitle,description:t.unavailableDescription,pending:!1};default:return{title:t.browserOnlyTitle,description:t.browserOnlyDescription,pending:!1}}}function dr(e){return e.state==="verified"||e.state==="browser_only"}function cr(e){return e.state==="authentication_required"||e.state==="identity_provider_failed"||e.state==="configuration_error"}function bt(e){let t=me(e.copy),o=e.now??(()=>Date.now()),i=e.pageSize??or,a=`persona-history-title-${Math.random().toString(36).slice(2,8)}`,l=[],u=null,c={kind:"loading",phase:"initial"},h=null,C=e.activeConversationId,b=e.provider.getIdentityStatus(),oe=be(b),x=null,M=!1,m=!1,Y=0,S=e.presentation,wt=e.collapsible!==!1,R=e.collapsed===!0,qe=e.railSide==="right",j=e.renderDom!==!1,I=new Map,A=null,we=lt(),ne=r=>{!j&&e.onAnnounce?e.onAnnounce(r):we.announce(r)},w=()=>h!==null,$e=`${a}-body`,f=s("button",{className:"persona-history-icon-button persona-history-back",attrs:{type:"button"}}),G=()=>S==="rail"&&wt,ie,xt=()=>{if(e.railBrand){if(!G()){f.classList.remove("persona-history-back--branded");return}if(ie===void 0){let r=e.railBrand(!0);ie=r?s("span",{className:"persona-history-brand-mark persona-history-toggle-brand",attrs:{"aria-hidden":"true"}},r):null}ie&&(f.classList.add("persona-history-back--branded"),f.appendChild(ie))}},xe=()=>{let r=G(),n=S==="rail";f.setAttribute("data-persona-history-focus",r?"collapse":"close"),f.setAttribute("aria-label",r?R?t.expandLabel:t.collapseLabel:n?t.closeLabel:t.backLabel),r?(f.setAttribute("aria-expanded",R?"false":"true"),f.setAttribute("aria-controls",$e),e.collapseShortcut?.aria&&f.setAttribute("aria-keyshortcuts",e.collapseShortcut.aria)):(f.removeAttribute("aria-expanded"),f.removeAttribute("aria-controls"),f.removeAttribute("aria-keyshortcuts")),f.replaceChildren(_(r?"panel-left":n?"x":"arrow-left")),xt()};xe(),f.addEventListener("click",()=>{G()?e.onToggleCollapse?.():e.onClose()});let He=s("h2",{className:"persona-history-title",text:t.viewTitle,attrs:{id:a}}),Ke=s("span",{className:"persona-history-scope-title"}),q=s("p",{className:"persona-history-scope"},s("span",{className:"persona-history-scope-icon",attrs:{"aria-hidden":"true"}},_("monitor",14)),Ke),se=s("div",{className:"persona-history-heading-group"},He),Be=!1,ae,Ce=()=>{let r=S==="rail",n=r?e.renderRailHeader:void 0,p=null,y=n!==void 0;if(n)try{p=n({collapsed:R,defaultTitle:t.viewTitle})}catch(d){y=!1,Be||(Be=!0,console.warn("[persona] history rail renderHeader threw",d))}if(!y&&r&&e.railBrand){if(ae===void 0){let d=e.railBrand(!1);ae=d?s("span",{className:"persona-history-heading-brand",attrs:{"aria-hidden":"true"}},s("span",{className:"persona-history-brand-mark"},d),s("span",{className:"persona-history-wordmark",text:t.viewTitle})):null}ae&&(y=!0,p=ae)}He.classList.toggle("persona-history-sr-only",y),se.replaceChildren(He),p&&se.appendChild(p)};Ce();let $=s("button",{className:"persona-history-icon-button persona-history-new-icon",attrs:{type:"button","data-persona-history-focus":"new-icon","aria-label":t.newConversationLabel}});$.appendChild(_("plus")),$.addEventListener("click",()=>{ee()});let Ht=[f,$].map(r=>e.attachTooltip?.({anchor:r,text:()=>r.getAttribute("aria-label")??"",...r===f&&e.collapseShortcut?{hint:()=>G()?e.collapseShortcut.hint:""}:{}})),L=s("div",{className:"persona-history-topbar"}),We=null,Se=()=>{let r=S==="rail",n=r?qe?"rail-right":"rail":"panel";n!==We&&(We=n,n==="rail"?L.append(se,f):L.append(f,se),r?$.remove():L.appendChild($),v.classList.toggle("persona-history-view--rail-right",n==="rail-right"))},O=s("div",{className:"persona-history-scope-alert"}),Ye=`${a}-scope`,Ct=_("plus",18),Le=s("button",{className:"persona-history-new",attrs:{type:"button","data-persona-history-focus":"new"}},Ct,s("span",{text:t.newConversationLabel}));Le.addEventListener("click",()=>{ee()});let ke=s("div",{className:"persona-history-list-region"}),je=e.showDeleteAll!==!1,Ge=!!e.provider.resetDevice,Ue=e.listActions??[],V=je||Ge||Ue.length>0?Ve({className:"persona-history-list-options",label:t.listOptionsLabel,focusKey:`menu:${F}`,open:!1,inert:!0,iconSize:16,onToggle:()=>rt(F)}):null,St=s("h3",{className:"persona-history-conversations-title",text:t.conversationsTitle}),K=s("div",{className:"persona-history-caption",attrs:{"data-persona-history-item":F}},St,e.showScopeStatus?q:null,V),B=s("div",{className:"persona-history-body",attrs:{id:$e}},e.showScopeStatus?O:null,Le,K,ke),U=e.headerPlacement??"inline";U==="external"&&L.classList.add("persona-history-topbar--shell","persona-history-topbar--shell-enter");let v=s("div",{className:T("persona-history-view",`persona-history-view--${e.presentation}`,"persona-history-view--enter"),attrs:{role:"region","aria-labelledby":a,"data-persona-history-presentation":e.presentation}},we.element,U==="inline"?L:null,B),Te=()=>{v.classList.toggle("persona-history-view--rail-collapsed",R&&G())};Te(),Se();let Lt=(r,n)=>{let p=`${a}-s${n}`,y=s("div",{className:T("persona-history-nav",r.placement==="footer"&&"persona-history-nav--footer"),attrs:{role:"group","data-persona-rail-section":r.id,...r.title?{"aria-labelledby":p}:{"aria-label":r.id}}});r.title&&y.appendChild(s("h3",{className:"persona-history-group-heading",text:r.title,attrs:{id:p}}));for(let d of r.items){let H=d.iconNode?.()??null,D=s("button",{className:T("persona-history-nav-item",H&&"persona-history-nav-item--icon"),attrs:{type:"button","aria-label":d.label,"data-persona-rail-item":d.id}},H?s("span",{className:"persona-history-nav-icon"},H):null,s("span",{className:"persona-history-nav-label persona-history-truncate",text:d.label}),d.badge?s("span",{className:"persona-history-nav-badge",text:d.badge}):null);D.addEventListener("click",()=>d.onSelect()),y.appendChild(D)}return y},X=null,Xe=null,Ee=()=>{!X||!j||S!=="rail"||R===Xe||(Xe=R,e.railSections.forEach((r,n)=>{if(!r.render)return;let p=X[n],y=r.title?p.firstElementChild:null,d=null;try{d=r.render(R)}catch(H){r.render=void 0,console.warn("[persona] history rail section threw",r.id,H)}p.replaceChildren(...y?[y]:[],...d?[d]:[]),p.hidden=!d}))},Ze=()=>{let r=e.railSections;if(v.classList.toggle("persona-history-view--has-nav",S==="rail"&&!!r?.some(n=>n.placement==="above-conversations")),!!r?.length){if(S!=="rail"){X?.forEach(n=>n.remove());return}X??(X=r.map(Lt));for(let n of["above-conversations","below-conversations","footer"]){let p=n==="above-conversations"?K.parentNode===B?K:ke:null;r.forEach((y,d)=>{y.placement===n&&B.insertBefore(X[d],p)})}Ee()}};Ze(),at(v,"persona-history-view",pt);let Je=(r,n)=>{let p=v.ownerDocument.defaultView?.getComputedStyle(v).getPropertyValue(r),y=Number.parseFloat(p??"");return Number.isFinite(y)&&y>=0?y:n},kt=(r,n)=>v.ownerDocument.defaultView?.getComputedStyle(v).getPropertyValue(r).trim()||n,Z=null,z=()=>{Z!==null&&(clearTimeout(Z),Z=null),v.removeEventListener("animationend",z),v.classList.remove("persona-history-view--enter")};v.addEventListener("animationend",z),Z=setTimeout(()=>{Z=setTimeout(z,Je("--persona-history-enter-ms",nr)+60)},0);let J=null,Q=()=>{J!==null&&(clearTimeout(J),J=null),L.classList.remove("persona-history-topbar--shell-enter")},Tt=()=>{Q(),L.classList.add("persona-history-topbar--shell-enter"),J=setTimeout(Q,gt+60)};U==="external"&&(J=setTimeout(Q,gt+60));let le=[],pe=null,Et=()=>{if(pe)return pe;if(m||lr()||typeof v.animate!="function")return z(),null;let r=v.ownerDocument.defaultView?.getComputedStyle(B).opacity||"1";z(),v.style.pointerEvents="none",P.style.pointerEvents="none";let n={duration:Je("--persona-history-exit-ms",ir),easing:kt("--persona-history-exit-easing",sr),fill:"forwards"},p=ar[S];return le=[B.animate([{opacity:r,transform:"none"},{opacity:0,transform:`translateX(${p}px)`}],n)],pe=Promise.all(le.map(pr)).then(()=>{}),pe},Re=(r,n)=>{r&&(n?r.setAttribute("aria-disabled","true"):r.removeAttribute("aria-disabled"))},P=L,Ae=null,Rt=()=>{let r=e.slots?.header;if(!r)return;let n=`${S}|${be(b)}|${h?`${h.kind}:${"conversationId"in h?h.conversationId:""}`:""}`;if(n===Ae)return;Ae=n;let p=r({identityStatus:b,pendingAction:h,copy:t,defaultRenderer:()=>L})??L;p!==P&&(P.replaceWith(p),P=p)},Qe=null,At=()=>{if(!e.showScopeStatus)return;let r=be(b);if(r===Qe)return;Qe=r;let n=ft(b,t);Ke.textContent=n.title;let p=dr(b);if(q.hidden=!p,O.replaceChildren(...p?[]:[s("span",{className:"persona-history-scope-alert-title",text:n.title})],s("span",{className:"persona-history-scope-description",text:n.description,attrs:{id:Ye}})),O.setAttribute("data-persona-history-scope-tone",p?"ambient":"attention"),p?q.setAttribute("aria-describedby",Ye):q.removeAttribute("aria-describedby"),n.pending?O.setAttribute("role","status"):O.removeAttribute("role"),O.setAttribute("data-persona-history-identity",b.state),q.setAttribute("data-persona-history-identity",b.state),cr(b)){let y=s("button",{className:"persona-history-secondary persona-history-state-action",text:t.retryIdentityLabel,attrs:{type:"button","data-persona-history-focus":"identity-retry"}});y.addEventListener("click",()=>{w()||N("refresh")}),O.appendChild(y)}},et=r=>h?h.kind==="open"&&h.conversationId===r?"opening":h.kind==="delete"&&h.conversationId===r?"deleting":null:null,Nt=()=>{let r=document.activeElement;return!(r instanceof HTMLElement)||!v.contains(r)?null:r.getAttribute("data-persona-history-focus")},Mt=r=>{if(M&&x){M=!1;let n=v.querySelector(`[data-persona-history-focus="${te(x)}"]`);if(n){n.focus();return}}r&&v.querySelector(`[data-persona-history-focus="${r}"]`)?.focus()},Pt=()=>{if(!A)return null;let r=s("button",{className:"persona-history-secondary persona-history-state-action",text:t.retryLabel,attrs:{type:"button","data-persona-history-focus":"action-retry"}}),n=A;return r.addEventListener("click",()=>{w()||n.retry()}),s("div",{className:"persona-history-row-error",attrs:{role:"alert"}},s("span",{text:n.message}),r)},Dt=()=>ct(l,o(),t,e.grouping).map((r,n)=>{let p=`${a}-g${n}`,y=s("ul",{className:"persona-history-list",attrs:{"aria-labelledby":p}});for(let d of r.items){let H=()=>ht({conversation:d,active:d.id===C,pending:et(d.id),busy:w(),menuOpen:x===d.id,error:I.get(d.id)??null,avatar:e.rowAvatar,showDelete:e.showDelete!==!1,nowMs:o(),copy:t,onOpen:()=>{de(d.id)},onToggleMenu:()=>rt(d.id),onCloseMenu:_e=>k(_e),onDelete:()=>{ce(d.id)}}),W=e.slots?.conversation?.({conversation:d,active:d.id===C,pending:et(d.id),open:()=>de(d.id),requestDelete:()=>ce(d.id),defaultRenderer:H})??H();y.appendChild(W instanceof HTMLLIElement?W:s("li",{className:"persona-history-item"},W))}return s("div",{className:"persona-history-group",attrs:{"data-persona-history-group":r.key}},s("h3",{className:T("persona-history-group-heading",r.key==="recent"&&"persona-history-sr-only"),text:r.label,attrs:{id:p}}),y)}),_t=()=>{if(!u)return null;let r=h?.kind==="load-more"||c.kind==="loading"&&c.phase==="load-more",n=s("button",{className:"persona-history-secondary persona-history-load-more",text:r?t.loadingMoreLabel:t.loadMoreLabel,attrs:{type:"button","data-persona-history-focus":"load-more",...r?{"aria-busy":"true","aria-disabled":"true"}:{},...w()&&!r?{"aria-disabled":"true"}:{}}});return n.addEventListener("click",()=>{w()||N("load-more")}),n},It=()=>{let r=Nt(),n=[Pt()],p=l.length>0;if(p&&(n.push(...Dt()),n.push(_t())),c.kind!=="ready"&&!(c.kind==="loading"&&c.phase!=="initial"&&p)){let d=c,H=d.kind==="loading"?void 0:()=>N("refresh"),D=d.kind==="new_conversation_required"?()=>ee():void 0,W=()=>vt({state:d,copy:t,identityStatus:b,busy:w(),...H?{onRetry:()=>{H()}}:{},...D?{onStartNew:()=>{D()}}:{}}),_e=e.slots?.state?.({state:d,identityStatus:b,copy:t,...H?{retry:H}:{},...D?{startNewConversation:D}:{},defaultRenderer:W});n.push(_e??W())}ke.replaceChildren(...n.filter(d=>!!d)),Mt(r)},Ot=()=>{let r=c.kind==="loading"&&l.length===0,n=[],p=()=>n.length===0?te(F):`${te(F)}-${n.length}`;if(!r)for(let y of Ue)n.push({label:y.label,focusKey:p(),danger:y.danger===!0,onSelect:()=>{y.onSelect({conversations:[...l]})}});return je&&!(l.length===0&&(c.kind==="empty"||r))&&n.push({label:t.clearHistoryLabel,focusKey:p(),danger:!0,onSelect:()=>{Me()}}),Ge&&!r&&n.push({label:t.resetIdentityLabel,focusKey:p(),danger:!0,onSelect:()=>{De()}}),n},Vt=()=>{if(Re(Le,w()),Re($,w()),V){let r=Ot(),n=c.kind==="loading"&&l.length===0;V.hidden=r.length===0&&!n,Re(V,w()||r.length===0),V.setAttribute("aria-expanded",x===F?"true":"false");let p=K.querySelector(".persona-history-menu");if(x!==F||r.length===0)p?.remove();else{let y=ze({label:t.listOptionsLabel,items:r,onCloseMenu:d=>k(d)});p?p.replaceWith(y):K.appendChild(y)}}K.hidden=S!=="rail"&&(!V||V.hidden)&&(!e.showScopeStatus||q.hidden)},tt,zt=()=>{let r=e.onActiveConversationChange;if(!r)return;let n=l.find(y=>y.id===C)??null,p=n?`${n.id}\0${n.title}\0${n.starred?1:0}`:"";p!==tt&&(tt=p,r(n))},g=()=>{if(!m){if(zt(),!j){e.onModelChange?.();return}Rt(),At(),Vt(),It(),Ee()}},k=r=>{if(!x)return;let n=x;x=null,M=!1,g(),r?.restoreFocus&&v.querySelector(`[data-persona-history-focus="menu:${n}"]`)?.focus()},rt=r=>{if(x===r){k({restoreFocus:!0});return}x=r,M=!0,g()},ot=r=>{if(!x)return;let n=r.target;n instanceof Node&&v.contains(n)&&n.closest?.(`[data-persona-history-item="${x}"]`)||k()};document.addEventListener("pointerdown",ot,!0);let nt=r=>{r.key!=="Escape"||!x||(r.stopPropagation(),k({restoreFocus:!0}))};v.addEventListener("keydown",nt);async function N(r){if(m)return;let n=++Y,p=r==="load-more"?u:null;if(!(r==="load-more"&&!p)){h={kind:r==="load-more"?"load-more":"refresh"},c={kind:"loading",phase:r},r!=="load-more"&&(I.clear(),A=null),k(),g();try{let y=await e.provider.list({limit:i,context:e.context,...p?{cursor:p}:{},...e.targetId?{targetId:e.targetId}:{}});if(m||n!==Y)return;l=p?[...l,...y.items]:y.items,u=y.nextCursor,c=l.length===0?{kind:"empty"}:{kind:"ready"}}catch(y){if(m||n!==Y)return;c=mt(y)}finally{!m&&n===Y&&(h=null,g())}}}let Ne=r=>{l=l.filter(n=>n.id!==r),I.delete(r),C===r&&(C=null),l.length===0&&!u&&(c={kind:"empty"})};async function de(r){if(!(w()||m)){I.delete(r),k(),h={kind:"open",conversationId:r},g();try{if(await e.onSelect(r),m)return;C=r}catch{if(m)return;I.set(r,{message:t.openFailedLabel,retry:()=>{de(r)}})}finally{m||(h=null,g())}}}async function ce(r){if(w()||m)return"cancelled";I.delete(r),h={kind:"delete",conversationId:r},g();try{let n=await e.onRequestDeleteConversation(r);return m||n==="deleted"&&(Ne(r),ne(t.conversationRemovedNotice)),n}catch(n){return m||(ge(n)&&n.code==="not_found"?Ne(r):I.set(r,{message:t.deleteFailedLabel,retry:()=>{ce(r)}})),"cancelled"}finally{m||(h=null,g())}}async function ee(){if(!(w()||m)){A=null,k(),h={kind:"start-new"},g();try{if(await e.onStartNew(),m)return;c.kind==="new_conversation_required"&&(c=l.length===0?{kind:"empty"}:{kind:"ready"})}catch{if(m)return;A={message:t.errorDescription,retry:()=>{ee()}}}finally{m||(h=null,g())}}}async function Me(){if(w()||m)return"cancelled";A=null,k(),h={kind:"clear"},g();try{let r=await e.onRequestClearHistory();return m||r==="cleared"&&(l=[],u=null,C=null,c={kind:"empty"},ne(t.historyClearedNotice)),r}catch{return m||(A={message:t.errorDescription,retry:()=>{Me()}}),"cancelled"}finally{m||(h=null,g())}}let Pe={outcome:"cancelled"};async function De(){if(w()||m||!e.onRequestResetIdentity)return Pe;A=null,k(),h={kind:"reset"},g();try{let r=await e.onRequestResetIdentity();return m||r.outcome==="reset"&&(ne(r.remoteRevocationConfirmed?t.identityResetNotice:t.identityResetUnconfirmedNotice),h=null,await N("refresh")),r}catch{return m||(A={message:t.errorDescription,retry:()=>{De()}}),Pe}finally{!m&&h?.kind==="reset"&&(h=null,g())}}let Ft=e.provider.subscribeIdentityStatus(r=>{if(m)return;let n=be(r),p=n!==oe;b=r,oe=n,g(),p&&r.state!=="verifying"&&ne(ft(r,t).title)}),qt=e.provider.subscribeAvailability?.(r=>{if(!m){if(r){N("refresh");return}l=[],u=null,c={kind:"error",reason:"unavailable",retryable:!1},g()}});return g(),N("initial"),{element:v,copy:t,getModel:()=>({conversations:l,activeConversationId:C,state:c,pendingAction:h,identityStatus:b,nextCursor:u}),operations:{refresh:async()=>{w()||await N("refresh")},loadMore:async()=>{w()||await N("load-more")},openConversation:r=>de(r),startNewConversation:()=>ee(),requestDeleteConversation:r=>ce(r),requestClearConversationHistory:()=>Me(),requestResetHistoryIdentity:()=>De()},setDomRenderEnabled:r=>{r!==j&&(j=r,r&&g())},refresh:()=>{N("refresh")},setPresentation:r=>{if(r===S)return;z(),S=r,Ae=null;let n=r==="rail";v.classList.toggle("persona-history-view--panel",!n),v.classList.toggle("persona-history-view--rail",n),v.setAttribute("data-persona-history-presentation",r),xe(),Te(),Se(),Ce(),Ze(),g()},setCollapsed:r=>{r!==R&&(R=r,Te(),xe(),Ce(),Ee())},setRailSide:r=>{qe=r==="right",Se()},getHeaderElement:()=>P,setHeaderPlacement:r=>{if(r===U)return;U=r;let n=r==="external";if(L.classList.toggle("persona-history-topbar--shell",n),n){Tt(),P.remove();return}Q(),v.insertBefore(P,B)},setActiveConversationId:r=>{C!==r&&(C=r,g())},applyConversationSummary:r=>{let n=l.findIndex(p=>p.id===r.id);n!==-1&&(l[n]=r,g())},removeConversationSummary:r=>{l.some(n=>n.id===r)&&(Ne(r),g())},setNewConversationRequired:r=>{r?c={kind:"new_conversation_required"}:c.kind==="new_conversation_required"&&(c=l.length===0?{kind:"empty"}:{kind:"ready"}),g()},playExit:Et,destroy:()=>{m=!0,Y+=1,z(),Q(),Ht.forEach(r=>r?.destroy()),P.remove(),le.forEach(r=>r.cancel()),le=[],Ft(),qt?.(),document.removeEventListener("pointerdown",ot,!0),v.removeEventListener("keydown",nt),we.destroy(),v.remove(),v.replaceChildren()}}}export{he as HISTORY_VIEW_COPY_DEFAULTS,bt as createHistoryView,me as resolveHistoryViewCopy};
