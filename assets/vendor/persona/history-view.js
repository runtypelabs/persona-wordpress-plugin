var he=e=>e.nodeType===Node.DOCUMENT_NODE,at=e=>e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&e.host!==void 0;function st(e){let t=e.getRootNode?.();return t&&at(t)||t&&he(t)?t:e.ownerDocument??document}function ue(e,t,o){let i=he(e)?e.head:e,l=t.replace(/["\\]/g,"\\$&");if(i.querySelector(`style[data-persona-plugin-style="${l}"]`))return;let d=(he(e)?e:e.ownerDocument??document).createElement("style");d.setAttribute("data-persona-plugin-style",t),d.textContent=o,i.appendChild(d)}function lt(e,t,o){if(he(e)||at(e)){ue(e,t,o);return}let i=e;if(i.isConnected){ue(st(i),t,o);return}let l=i.ownerDocument??document;ue(l,t,o),queueMicrotask(()=>{let a=st(i);a!==l&&ue(a,t,o)})}var s=(e,t={},...o)=>{let i=document.createElement(e);if(t.className&&(i.className=t.className),t.text!==void 0&&(i.textContent=t.text),t.attrs)for(let[a,d]of Object.entries(t.attrs))i.setAttribute(a,d);if(t.style){let a=i.style,d=t.style;for(let c of Object.keys(d)){let y=d[c];y!=null&&(a[c]=y)}}let l=o.filter(a=>a!=null);return l.length>0&&i.append(...l),i},T=(...e)=>e.filter(Boolean).join(" ");function pt(){let e=document.createElement("div");e.className="persona-history-sr-only",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("data-persona-history-live-region","");let t;return{element:e,announce(o){t!==void 0&&clearTimeout(t),e.textContent="",t=setTimeout(()=>{t=void 0,e.textContent=o},0)},destroy(){t!==void 0&&clearTimeout(t),e.remove()}}}var dt=`
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
`;var ct={viewTitle:"Messages",openHistoryLabel:"Messages",openHistoryBusyLabel:"Messages, available once the reply finishes",newConversationLabel:"New conversation",expandLabel:"Expand conversation list",collapseLabel:"Collapse conversation list",resizeLabel:"Resize conversation list",showEarlierMessagesLabel:"Show earlier messages",openConversationLoadingLabel:"Loading conversation",openConversationErrorTitle:"Could not open the conversation.",openConversationRetryLabel:"Try again",openConversationBackLabel:"Back to messages",confirmCancelLabel:"Cancel",deleteConversationConfirmTitle:"Delete conversation",deleteConversationConfirm:"Delete this conversation? This cannot be undone.",deleteConversationConfirmLabel:"Delete",clearHistoryConfirmTitle:"Delete all conversations",clearHistoryConfirm:"Delete all conversations for this assistant on this browser? This cannot be undone.",clearHistoryVerifiedConfirm:"Delete all conversations for this assistant and signed-in user? This cannot be undone.",clearHistoryConfirmLabel:"Delete all",resetIdentityConfirmTitle:"Forget this device",resetIdentityConfirm:"Forget this device? All Persona data stored in this browser is cleared. Records are not deleted elsewhere.",resetIdentityConfirmLabel:"Forget this device",conversationDeletedNotice:"That conversation was deleted. You are now in a new conversation.",identityResetNotice:"This device was forgotten.",identityResetUnconfirmedNotice:"This device was cleared here, but the server could not confirm it."};var me={...ct,emptyTitle:"No conversations yet",emptyDescription:"Start a conversation and it will show up here.",errorTitle:"Could not load conversations",errorDescription:"Something went wrong. Please try again.",retryLabel:"Retry",rateLimitedTitle:"Too many requests",rateLimitedDescription:"Please wait a moment before trying again.",groupStarred:"Starred",groupToday:"Today",groupYesterday:"Yesterday",groupPrevious7Days:"Previous 7 days",groupPrevious30Days:"Previous 30 days",groupMonthYear:"{month} {year}",browserOnlyTitle:"On this device",browserOnlyDescription:"Another browser or device keeps its own separate history.",verifyingTitle:"Checking your account",verifyingDescription:"Looking for messages linked to your account.",verifiedTitle:"Available across signed-in devices",verifiedDescription:"This list refreshes when the chat opens rather than syncing live.",authenticationRequiredTitle:"Sign in to see your messages",authenticationRequiredDescription:"Your session expired. Sign in again to load account history.",identityProviderFailedTitle:"Account history is unavailable",identityProviderFailedDescription:"We could not verify your account, so account history is not shown here.",proofNotAdmittedTitle:"Account history is unavailable",proofNotAdmittedDescription:"This assistant is not set up to accept your account identity.",retryIdentityLabel:"Try again",backLabel:"Back to conversation",closeLabel:"Close conversation list",loadingLabel:"Loading conversations",loadMoreLabel:"Load more",loadingMoreLabel:"Loading more conversations",conversationsTitle:"Conversations",rowActionsLabel:"Conversation options",listOptionsLabel:"Conversation options",deleteConversationLabel:"Delete",clearHistoryLabel:"Delete all conversations",resetIdentityLabel:"Forget this device",messageCountLabel:"{count} messages",messageCountLabelOne:"1 message",conversationRemovedNotice:"Conversation deleted.",historyClearedNotice:"All conversations were deleted.",unavailableTitle:"Conversation history is unavailable",unavailableDescription:"Try again later.",newConversationRequiredTitle:"Start a new conversation",newConversationRequiredDescription:"The previous conversation is gone. Start a new one to keep chatting.",rateLimitedWaitDescription:"You can try again in {seconds} seconds.",openFailedLabel:"Could not open that conversation.",deleteFailedLabel:"Could not delete that conversation.",relativeNow:"now",relativeMinutes:"{value}m",relativeHours:"{value}h",relativeDays:"{value}d",relativeWeeks:"{value}w",relativeYears:"{value}y"};function ve(e){if(!e)return me;let t={...me};for(let[o,i]of Object.entries(e))typeof i=="string"&&i.length>0&&(t[o]=i);return t}function R(e,t){return e.replace(/\{(\w+)\}/g,(o,i)=>i in t?String(t[i]):o)}var Oe=864e5;function Kt(e){let t=new Date(e);return t.setHours(0,0,0,0),t.getTime()}function Ve(e,t){let o=Date.parse(e);return Number.isFinite(o)?o:t}function $t(e,t){let o=Ve(e,t),i=Kt(t);if(o>=i)return"today";if(o>=i-Oe)return"yesterday";if(o>=i-7*Oe)return"previous-7-days";if(o>=i-30*Oe)return"previous-30-days";let l=new Date(o);return`month:${l.getFullYear()}-${l.getMonth()}`}function Wt(e,t,o,i){if(e==="today")return i.groupToday;if(e==="yesterday")return i.groupYesterday;if(e==="previous-7-days")return i.groupPrevious7Days;if(e==="previous-30-days")return i.groupPrevious30Days;let l=new Date(Ve(t,o));return R(i.groupMonthYear,{month:l.toLocaleString(void 0,{month:"long"}),year:l.getFullYear()})}function yt(e,t,o,i="time"){let l=e.filter(d=>d.starred),a=l.length>0?[{key:"starred",label:o.groupStarred,items:l}]:[];if(i==="none"){let d=e.filter(c=>!c.starred);return d.length>0&&a.push({key:"recent",label:o.conversationsTitle,items:d}),a}for(let d of e){if(d.starred)continue;let c=$t(d.updatedAt,t),y=a[a.length-1];if(y&&y.key===c){y.items.push(d);continue}a.push({key:c,label:Wt(c,d.updatedAt,t,o),items:[d]})}return a}function ut(e,t,o){let i=Math.max(0,t-Ve(e,t)),l=Math.floor(i/6e4);if(l<1)return o.relativeNow;if(l<60)return R(o.relativeMinutes,{value:l});let a=Math.floor(l/60);if(a<24)return R(o.relativeHours,{value:a});let d=Math.floor(a/24);if(d<7)return R(o.relativeDays,{value:d});let c=Math.floor(d/7);return d<365?R(o.relativeWeeks,{value:c}):R(o.relativeYears,{value:Math.floor(d/365)})}function ht(e,t){return e===1?t.messageCountLabelOne:R(t.messageCountLabel,{count:e})}var fe="http://www.w3.org/2000/svg",Bt={"arrow-left":["m12 19-7-7 7-7","M19 12H5"],plus:["M5 12h14","M12 5v14"],star:["m12 2 2.9 6.2 6.8.7-5.1 4.5 1.4 6.6-6-3.4-6 3.4 1.4-6.6-5.1-4.5 6.8-.7z"],x:["M18 6 6 18","m6 6 12 12"],"panel-left":["M9 3v18"],monitor:["M8 21h8","M12 17v4"],ellipsis:[]},Yt={"panel-left":[3,3,18,18],monitor:[2,3,20,14]};function O(e,t=20){let o=document.createElementNS(fe,"svg");if(o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("viewBox","0 0 24 24"),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true"),o.setAttribute("focusable","false"),e==="ellipsis"){for(let l of[12,19,5]){let a=document.createElementNS(fe,"circle");a.setAttribute("cx",String(l)),a.setAttribute("cy","12"),a.setAttribute("r","1"),o.appendChild(a)}return o}let i=Yt[e];if(i){let l=document.createElementNS(fe,"rect");l.setAttribute("x",String(i[0])),l.setAttribute("y",String(i[1])),l.setAttribute("width",String(i[2])),l.setAttribute("height",String(i[3])),l.setAttribute("rx","2"),o.appendChild(l)}for(let l of Bt[e]){let a=document.createElementNS(fe,"path");a.setAttribute("d",l),o.appendChild(a)}return o}var jt=/^(https?:|\/|data:)/i;function Gt(e){let t=s("span",{className:"persona-history-row-avatar",attrs:{"aria-hidden":"true"}});return jt.test(e)?t.appendChild(s("img",{attrs:{src:e,alt:"",loading:"lazy"}})):t.textContent=e,t}var Ut=e=>`row:${e}`,Xt=e=>`menu:${e}`,oe=e=>`menu-item:${e}`;function mt(e){let{conversation:t,copy:o,busy:i,pending:l}=e,a=i||l!==null,d=t.title.trim().length>0,c=t.starred?(()=>{let b=O("star",11);return b.setAttribute("fill","currentColor"),b.setAttribute("stroke-width","1"),s("span",{className:"persona-history-row-star"},b,s("span",{className:"persona-history-sr-only",text:o.groupStarred}))})():null,y=s("div",{className:"persona-history-row-head"},s("span",{className:"persona-history-row-title persona-history-truncate",text:d?t.title:t.preview??""}),c,s("time",{className:"persona-history-row-time",attrs:{datetime:t.updatedAt},text:ut(t.updatedAt,e.nowMs,o)})),g=d&&t.preview?s("span",{className:"persona-history-row-preview persona-history-truncate",text:t.preview}):null,w=s("button",{className:T("persona-history-row",e.active&&"persona-history-row--active",l&&`persona-history-row--${l}`),attrs:{type:"button","data-persona-history-focus":Ut(t.id),"data-persona-history-conversation":t.id,...e.active?{"aria-current":"page"}:{},...a?{"aria-disabled":"true"}:{},...l?{"aria-busy":"true"}:{}}},e.avatar?Gt(e.avatar):null,s("div",{className:"persona-history-row-body"},y,g,s("span",{className:"persona-history-row-count persona-history-sr-only",text:ht(t.messageCount,o)})));w.addEventListener("click",()=>{a||e.onOpen()});let A=e.showDelete?ze({className:"persona-history-row-menu-button",label:`${o.rowActionsLabel}: ${t.title}`,focusKey:Xt(t.id),open:e.menuOpen,inert:a,onToggle:e.onToggleMenu}):null;return s("li",{className:T("persona-history-item",!e.showDelete&&"persona-history-item--no-menu"),attrs:{"data-persona-history-item":t.id}},w,A,e.menuOpen&&e.showDelete?Zt(e):null,e.error?Jt(e.error,o,t.id):null)}function Zt(e){let{conversation:t,copy:o}=e;return Fe({label:`${o.rowActionsLabel}: ${t.title}`,items:[{label:o.deleteConversationLabel,focusKey:oe(t.id),danger:!0,onSelect:e.onDelete}],onCloseMenu:e.onCloseMenu})}function ze(e){let t=s("button",{className:T("persona-history-icon-button",e.className),attrs:{type:"button","aria-label":e.label,"aria-haspopup":"menu","aria-expanded":e.open?"true":"false","data-persona-history-focus":e.focusKey,...e.inert?{"aria-disabled":"true"}:{}}});t.appendChild(O("ellipsis",e.iconSize));let o=()=>t.getAttribute("aria-disabled")==="true";return t.addEventListener("click",i=>{i.stopPropagation(),!o()&&e.onToggle()}),t.addEventListener("keydown",i=>{i.key!=="ArrowDown"&&i.key!=="ArrowUp"||(i.preventDefault(),!(o()||t.getAttribute("aria-expanded")==="true")&&e.onToggle())}),t}function Fe(e){let t=s("div",{className:"persona-history-menu",attrs:{role:"menu","aria-label":e.label}});for(let o of e.items){let i=s("button",{className:T("persona-history-menu-item",o.danger&&"persona-history-menu-item--danger"),text:o.label,attrs:{type:"button",role:"menuitem",tabindex:"0","data-persona-history-focus":o.focusKey}});i.addEventListener("click",()=>{e.onCloseMenu(),o.onSelect()}),t.appendChild(i)}return t.addEventListener("keydown",o=>{let i=Array.from(t.querySelectorAll('[role="menuitem"]'));if(i.length===0)return;let l=i.indexOf(document.activeElement);if(o.key==="Tab"){e.onCloseMenu({restoreFocus:!0});return}if(o.key==="ArrowDown"){o.preventDefault(),i[(l+1+i.length)%i.length]?.focus();return}if(o.key==="ArrowUp"){o.preventDefault(),i[(l-1+i.length)%i.length]?.focus();return}if(o.key==="Home"){o.preventDefault(),i[0]?.focus();return}o.key==="End"&&(o.preventDefault(),i[i.length-1]?.focus())}),t}function Jt(e,t,o){let i=s("button",{className:"persona-history-secondary persona-history-state-action",text:t.retryLabel,attrs:{type:"button","data-persona-history-focus":`row-retry:${o}`}});return i.addEventListener("click",e.retry),s("div",{className:"persona-history-row-error",attrs:{role:"alert"}},s("span",{text:e.message}),i)}var qe=class extends Error{constructor(t,o,i){super(o),this.name="HistoryProviderError",this.code=t,i?.retryAfterSeconds!==void 0&&(this.retryAfterSeconds=i.retryAfterSeconds)}};function ge(e){return e instanceof qe}function Qt(e){switch(e){case"authentication_failed":case"authentication_required":case"identity_provider_failed":case"proof_not_admitted":case"unsupported_scope":case"unavailable":return e;default:return"unknown"}}function vt(e){if(ge(e)){if(e.code==="rate_limited")return{kind:"rate_limited",retryAfterSeconds:e.retryAfterSeconds??0};let t=Qt(e.code);return{kind:"error",reason:t,retryable:t!=="unsupported_scope"}}return{kind:"error",reason:"unknown",retryable:!0}}function er(e,t){switch(e.state){case"authentication_required":return{title:t.authenticationRequiredTitle,description:t.authenticationRequiredDescription};case"identity_provider_failed":return{title:t.identityProviderFailedTitle,description:t.identityProviderFailedDescription};case"configuration_error":return{title:t.proofNotAdmittedTitle,description:t.proofNotAdmittedDescription};default:return null}}function tr(e,t){switch(e){case"authentication_required":case"authentication_failed":return{title:t.authenticationRequiredTitle,description:t.authenticationRequiredDescription};case"identity_provider_failed":return{title:t.identityProviderFailedTitle,description:t.identityProviderFailedDescription};case"proof_not_admitted":case"unsupported_scope":return{title:t.proofNotAdmittedTitle,description:t.proofNotAdmittedDescription};case"unavailable":return{title:t.unavailableTitle,description:t.unavailableDescription};default:return{title:t.errorTitle,description:t.errorDescription}}}function be(e,t,o,i){let l=s("button",{className:"persona-history-secondary persona-history-state-action",text:e,attrs:{type:"button","data-persona-history-focus":t,...o?{"aria-disabled":"true"}:{}}});return l.addEventListener("click",()=>{o||i()}),l}function ne(e,t,o,i,l){return s("div",{className:"persona-history-state",attrs:{"data-persona-history-state":e,...l?{role:"alert"}:{role:"status"}}},s("p",{className:"persona-history-state-title",text:t}),s("p",{className:"persona-history-state-description",text:o}),i)}function rr(e){let t=["42%","58%","34%"],o=["94%","78%","88%"],i=[0,1,2].map(l=>s("div",{className:"persona-history-skeleton-row",attrs:{"aria-hidden":"true"}},s("div",{className:"persona-history-skeleton-head"},s("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--title",style:{width:t[l]}}),s("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--time"})),s("div",{className:"persona-history-skeleton-bar persona-history-skeleton-bar--preview",style:{width:o[l]}})));return s("div",{className:"persona-history-view-loading",attrs:{"data-persona-history-state":"loading",role:"status","aria-label":e.loadingLabel}},...i)}function ft(e){let{state:t,copy:o,busy:i}=e;if(t.kind==="loading")return rr(o);if(t.kind==="empty"){let c=er(e.identityStatus,o);return c?ne("identity",c.title,c.description,e.onRetry?be(o.retryIdentityLabel,"state-retry",i,e.onRetry):null,!0):ne("empty",o.emptyTitle,o.emptyDescription,null,!1)}if(t.kind==="rate_limited"){let c=t.retryAfterSeconds>0?R(o.rateLimitedWaitDescription,{seconds:t.retryAfterSeconds}):o.rateLimitedDescription;return ne("rate_limited",o.rateLimitedTitle,c,e.onRetry?be(o.retryLabel,"state-retry",i,e.onRetry):null,!1)}if(t.kind==="new_conversation_required")return ne("new_conversation_required",o.newConversationRequiredTitle,o.newConversationRequiredDescription,e.onStartNew?be(o.newConversationLabel,"state-retry",i,e.onStartNew):null,!0);let{title:l,description:a}=tr(t.reason,o),d=t.reason==="authentication_required"||t.reason==="authentication_failed"||t.reason==="identity_provider_failed"?o.retryIdentityLabel:o.retryLabel;return ne("error",l,a,t.retryable&&e.onRetry?be(d,"state-retry",i,e.onRetry):null,!0)}var or=25,K="persona:list-options",nr=180,gt=120,ir=160,sr="cubic-bezier(0.4, 0, 1, 1)",ar={panel:20,rail:12},lr=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,pr=e=>e.finished?e.finished.then(()=>{},()=>{}):Promise.resolve();function we(e){return`${e.state}:${"reason"in e?e.reason:""}`}function bt(e,t){switch(e.state){case"verified":return{title:t.verifiedTitle,description:t.verifiedDescription,pending:!1};case"verifying":case"resetting":return{title:t.verifyingTitle,description:t.verifyingDescription,pending:!0};case"authentication_required":return{title:t.authenticationRequiredTitle,description:t.authenticationRequiredDescription,pending:!1};case"identity_provider_failed":return{title:t.identityProviderFailedTitle,description:t.identityProviderFailedDescription,pending:!1};case"configuration_error":return{title:t.proofNotAdmittedTitle,description:t.proofNotAdmittedDescription,pending:!1};case"unavailable":return{title:t.unavailableTitle,description:t.unavailableDescription,pending:!1};default:return{title:t.browserOnlyTitle,description:t.browserOnlyDescription,pending:!1}}}function dr(e){return e.state==="verified"||e.state==="browser_only"}function cr(e){return e.state==="authentication_required"||e.state==="identity_provider_failed"||e.state==="configuration_error"}function wt(e){let t=ve(e.copy),o=e.now??(()=>Date.now()),i=e.pageSize??or,l=`persona-history-title-${Math.random().toString(36).slice(2,8)}`,a=[],d=null,c={kind:"loading",phase:"initial"},y=null,g=e.activeConversationId,w=e.provider.getIdentityStatus(),A=we(w),x=null,b=!1,m=!1,D=0,S=e.presentation,G=e.collapsible!==!1,N=e.collapsed===!0,Ke=e.railSide==="right",U=e.renderDom!==!1,V=new Map,M=null,xe=pt(),ie=r=>{!U&&e.onAnnounce?e.onAnnounce(r):xe.announce(r)},C=()=>y!==null,$e=`${l}-body`,H=s("button",{className:"persona-history-icon-button persona-history-back",attrs:{type:"button"}}),X=()=>S==="rail"&&G,se,xt=()=>{if(e.railBrand){if(!X()){H.classList.remove("persona-history-back--branded");return}if(se===void 0){let r=e.railBrand(!0);se=r?s("span",{className:"persona-history-brand-mark persona-history-toggle-brand",attrs:{"aria-hidden":"true"}},r):null}se&&(H.classList.add("persona-history-back--branded"),H.appendChild(se))}},He=()=>{let r=X(),n=S==="rail";H.setAttribute("data-persona-history-focus",r?"collapse":"close"),H.setAttribute("aria-label",r?N?t.expandLabel:t.collapseLabel:n?t.closeLabel:t.backLabel),r?(H.setAttribute("aria-expanded",N?"false":"true"),H.setAttribute("aria-controls",$e),e.collapseShortcut?.aria&&H.setAttribute("aria-keyshortcuts",e.collapseShortcut.aria)):(H.removeAttribute("aria-expanded"),H.removeAttribute("aria-controls"),H.removeAttribute("aria-keyshortcuts")),H.replaceChildren(O(r?"panel-left":n?"x":"arrow-left")),xt()};He(),H.addEventListener("click",()=>{X()?e.onToggleCollapse?.():e.onClose()});let Ce=s("h2",{className:"persona-history-title",text:t.viewTitle,attrs:{id:l}}),We=s("span",{className:"persona-history-scope-title"}),$=s("p",{className:"persona-history-scope"},s("span",{className:"persona-history-scope-icon",attrs:{"aria-hidden":"true"}},O("monitor",14)),We),ae=s("div",{className:"persona-history-heading-group"},Ce),Be=!1,le,Se=()=>{let r=S==="rail",n=r?e.renderRailHeader:void 0,p=null,h=n!==void 0;if(n)try{p=n({collapsed:N,defaultTitle:t.viewTitle})}catch(u){h=!1,Be||(Be=!0,console.warn("[persona] history rail renderHeader threw",u))}if(!h&&r&&e.railBrand){if(le===void 0){let u=e.railBrand(!1);le=u?s("span",{className:"persona-history-heading-brand",attrs:{"aria-hidden":"true"}},s("span",{className:"persona-history-brand-mark"},u),s("span",{className:"persona-history-wordmark",text:t.viewTitle})):null}le&&(h=!0,p=le)}Ce.classList.toggle("persona-history-sr-only",h),ae.replaceChildren(Ce),p&&ae.appendChild(p)};Se();let W=s("button",{className:"persona-history-icon-button persona-history-new-icon",attrs:{type:"button","data-persona-history-focus":"new-icon","aria-label":t.newConversationLabel}});W.appendChild(O("plus")),W.addEventListener("click",()=>{re()});let Ht=[H,W].map(r=>e.attachTooltip?.({anchor:r,text:()=>r.getAttribute("aria-label")??"",...r===H&&e.collapseShortcut?{hint:()=>X()?e.collapseShortcut.hint:""}:{}})),k=s("div",{className:"persona-history-topbar"}),Ye=null,Le=()=>{let r=S==="rail",n=r?Ke?"rail-right":"rail":"panel";n!==Ye&&(Ye=n,n==="rail"?k.append(ae,H):k.append(H,ae),r?W.remove():k.appendChild(W),v.classList.toggle("persona-history-view--rail-right",n==="rail-right"))},z=s("div",{className:"persona-history-scope-alert"}),je=`${l}-scope`,Ct=O("plus",18),ke=s("button",{className:"persona-history-new",attrs:{type:"button","data-persona-history-focus":"new"}},Ct,s("span",{text:t.newConversationLabel}));ke.addEventListener("click",()=>{re()});let Ee=s("div",{className:"persona-history-list-region"}),Ge=e.showDeleteAll!==!1,Ue=!!e.provider.resetDevice,Xe=e.listActions??[],F=Ge||Ue||Xe.length>0?ze({className:"persona-history-list-options",label:t.listOptionsLabel,focusKey:`menu:${K}`,open:!1,inert:!0,iconSize:16,onToggle:()=>ot(K)}):null,St=s("h3",{className:"persona-history-conversations-title",text:t.conversationsTitle}),B=s("div",{className:"persona-history-caption",attrs:{"data-persona-history-item":K}},St,e.showScopeStatus?$:null,F),Y=s("div",{className:"persona-history-body",attrs:{id:$e}},e.showScopeStatus?z:null,ke,B,Ee),Z=e.headerPlacement??"inline";Z==="external"&&k.classList.add("persona-history-topbar--shell","persona-history-topbar--shell-enter");let v=s("div",{className:T("persona-history-view",`persona-history-view--${e.presentation}`,"persona-history-view--enter"),attrs:{role:"region","aria-labelledby":l,"data-persona-history-presentation":e.presentation}},xe.element,Z==="inline"?k:null,Y),Te=()=>{v.classList.toggle("persona-history-view--rail-collapsed",N&&X())};Te(),Le();let Lt=(r,n)=>{let p=`${l}-s${n}`,h=s("div",{className:T("persona-history-nav",r.placement==="footer"&&"persona-history-nav--footer"),attrs:{role:"group","data-persona-rail-section":r.id,...r.title?{"aria-labelledby":p}:{"aria-label":r.id}}});r.title&&h.appendChild(s("h3",{className:"persona-history-group-heading",text:r.title,attrs:{id:p}}));for(let u of r.items){let L=u.iconNode?.()??null,I=s("button",{className:T("persona-history-nav-item",L&&"persona-history-nav-item--icon"),attrs:{type:"button","aria-label":u.label,"data-persona-rail-item":u.id}},L?s("span",{className:"persona-history-nav-icon"},L):null,s("span",{className:"persona-history-nav-label persona-history-truncate",text:u.label}),u.badge?s("span",{className:"persona-history-nav-badge",text:u.badge}):null);I.addEventListener("click",()=>u.onSelect()),h.appendChild(I)}return h},J=null,Ze=null,Re=()=>{!J||!U||S!=="rail"||N===Ze||(Ze=N,e.railSections.forEach((r,n)=>{if(!r.render)return;let p=J[n],h=r.title?p.firstElementChild:null,u=null;try{u=r.render(N)}catch(L){r.render=void 0,console.warn("[persona] history rail section threw",r.id,L)}p.replaceChildren(...h?[h]:[],...u?[u]:[]),p.hidden=!u}))},Je=()=>{let r=e.railSections;if(v.classList.toggle("persona-history-view--has-nav",S==="rail"&&!!r?.some(n=>n.placement==="above-conversations")),!!r?.length){if(S!=="rail"){J?.forEach(n=>n.remove());return}J??=r.map(Lt);for(let n of["above-conversations","below-conversations","footer"]){let p=n==="above-conversations"?B.parentNode===Y?B:Ee:null;r.forEach((h,u)=>{h.placement===n&&Y.insertBefore(J[u],p)})}Re()}};Je(),lt(v,"persona-history-view",dt);let Qe=(r,n)=>{let p=v.ownerDocument.defaultView?.getComputedStyle(v).getPropertyValue(r),h=Number.parseFloat(p??"");return Number.isFinite(h)&&h>=0?h:n},kt=(r,n)=>v.ownerDocument.defaultView?.getComputedStyle(v).getPropertyValue(r).trim()||n,Q=null,q=()=>{Q!==null&&(clearTimeout(Q),Q=null),v.removeEventListener("animationend",q),v.classList.remove("persona-history-view--enter")};v.addEventListener("animationend",q),Q=setTimeout(()=>{Q=setTimeout(q,Qe("--persona-history-enter-ms",nr)+60)},0);let ee=null,te=()=>{ee!==null&&(clearTimeout(ee),ee=null),k.classList.remove("persona-history-topbar--shell-enter")},Et=()=>{te(),k.classList.add("persona-history-topbar--shell-enter"),ee=setTimeout(te,gt+60)};Z==="external"&&(ee=setTimeout(te,gt+60));let pe=[],de=null,Tt=()=>{if(de)return de;if(m||lr()||typeof v.animate!="function")return q(),null;let r=v.ownerDocument.defaultView?.getComputedStyle(Y).opacity||"1";q(),v.style.pointerEvents="none",_.style.pointerEvents="none";let n={duration:Qe("--persona-history-exit-ms",ir),easing:kt("--persona-history-exit-easing",sr),fill:"forwards"},p=ar[S];return pe=[Y.animate([{opacity:r,transform:"none"},{opacity:0,transform:`translateX(${p}px)`}],n)],de=Promise.all(pe.map(pr)).then(()=>{}),de},Ae=(r,n)=>{r&&(n?r.setAttribute("aria-disabled","true"):r.removeAttribute("aria-disabled"))},_=k,Ne=null,Rt=()=>{let r=e.slots?.header;if(!r)return;let n=`${S}|${we(w)}|${y?`${y.kind}:${"conversationId"in y?y.conversationId:""}`:""}`;if(n===Ne)return;Ne=n;let p=r({identityStatus:w,pendingAction:y,copy:t,defaultRenderer:()=>k})??k;p!==_&&(_.replaceWith(p),_=p)},et=null,At=()=>{if(!e.showScopeStatus)return;let r=we(w);if(r===et)return;et=r;let n=bt(w,t);We.textContent=n.title;let p=dr(w);if($.hidden=!p,z.replaceChildren(...p?[]:[s("span",{className:"persona-history-scope-alert-title",text:n.title})],s("span",{className:"persona-history-scope-description",text:n.description,attrs:{id:je}})),z.setAttribute("data-persona-history-scope-tone",p?"ambient":"attention"),p?$.setAttribute("aria-describedby",je):$.removeAttribute("aria-describedby"),n.pending?z.setAttribute("role","status"):z.removeAttribute("role"),z.setAttribute("data-persona-history-identity",w.state),$.setAttribute("data-persona-history-identity",w.state),cr(w)){let h=s("button",{className:"persona-history-secondary persona-history-state-action",text:t.retryIdentityLabel,attrs:{type:"button","data-persona-history-focus":"identity-retry"}});h.addEventListener("click",()=>{C()||P("refresh")}),z.appendChild(h)}},tt=r=>y?y.kind==="open"&&y.conversationId===r?"opening":y.kind==="delete"&&y.conversationId===r?"deleting":null:null,Nt=()=>{let r=document.activeElement;return!(r instanceof HTMLElement)||!v.contains(r)?null:r.getAttribute("data-persona-history-focus")},Mt=r=>{if(b&&x){b=!1;let n=v.querySelector(`[data-persona-history-focus="${oe(x)}"]`);if(n){n.focus();return}}r&&v.querySelector(`[data-persona-history-focus="${r}"]`)?.focus()},Pt=()=>{if(!M)return null;let r=s("button",{className:"persona-history-secondary persona-history-state-action",text:t.retryLabel,attrs:{type:"button","data-persona-history-focus":"action-retry"}}),n=M;return r.addEventListener("click",()=>{C()||n.retry()}),s("div",{className:"persona-history-row-error",attrs:{role:"alert"}},s("span",{text:n.message}),r)},Dt=()=>yt(a,o(),t,e.grouping).map((r,n)=>{let p=`${l}-g${n}`,h=s("ul",{className:"persona-history-list",attrs:{"aria-labelledby":p}});for(let u of r.items){let L=()=>mt({conversation:u,active:u.id===g,pending:tt(u.id),busy:C(),menuOpen:x===u.id,error:V.get(u.id)??null,avatar:e.rowAvatar,showDelete:e.showDelete!==!1,nowMs:o(),copy:t,onOpen:()=>{ce(u.id)},onToggleMenu:()=>ot(u.id),onCloseMenu:Ie=>E(Ie),onDelete:()=>{ye(u.id)}}),j=e.slots?.conversation?.({conversation:u,active:u.id===g,pending:tt(u.id),open:()=>ce(u.id),requestDelete:()=>ye(u.id),defaultRenderer:L})??L();h.appendChild(j instanceof HTMLLIElement?j:s("li",{className:"persona-history-item"},j))}return s("div",{className:"persona-history-group",attrs:{"data-persona-history-group":r.key}},s("h3",{className:T("persona-history-group-heading",r.key==="recent"&&"persona-history-sr-only"),text:r.label,attrs:{id:p}}),h)}),_t=()=>{if(!d)return null;let r=y?.kind==="load-more"||c.kind==="loading"&&c.phase==="load-more",n=s("button",{className:"persona-history-secondary persona-history-load-more",text:r?t.loadingMoreLabel:t.loadMoreLabel,attrs:{type:"button","data-persona-history-focus":"load-more",...r?{"aria-busy":"true","aria-disabled":"true"}:{},...C()&&!r?{"aria-disabled":"true"}:{}}});return n.addEventListener("click",()=>{C()||P("load-more")}),n},It=()=>{let r=Nt(),n=[Pt()],p=a.length>0;if(p&&(n.push(...Dt()),n.push(_t())),c.kind!=="ready"&&!(c.kind==="loading"&&c.phase!=="initial"&&p)){let u=c,L=u.kind==="loading"?void 0:()=>P("refresh"),I=u.kind==="new_conversation_required"?()=>re():void 0,j=()=>ft({state:u,copy:t,identityStatus:w,busy:C(),...L?{onRetry:()=>{L()}}:{},...I?{onStartNew:()=>{I()}}:{}}),Ie=e.slots?.state?.({state:u,identityStatus:w,copy:t,...L?{retry:L}:{},...I?{startNewConversation:I}:{},defaultRenderer:j});n.push(Ie??j())}Ee.replaceChildren(...n.filter(u=>!!u)),Mt(r)},Ot=()=>{let r=c.kind==="loading"&&a.length===0,n=[],p=()=>n.length===0?oe(K):`${oe(K)}-${n.length}`;if(!r)for(let h of Xe)n.push({label:h.label,focusKey:p(),danger:h.danger===!0,onSelect:()=>{h.onSelect({conversations:[...a]})}});return Ge&&!(a.length===0&&(c.kind==="empty"||r))&&n.push({label:t.clearHistoryLabel,focusKey:p(),danger:!0,onSelect:()=>{Pe()}}),Ue&&!r&&n.push({label:t.resetIdentityLabel,focusKey:p(),danger:!0,onSelect:()=>{_e()}}),n},Vt=()=>{if(Ae(ke,C()),Ae(W,C()),F){let r=Ot(),n=c.kind==="loading"&&a.length===0;F.hidden=r.length===0&&!n,Ae(F,C()||r.length===0),F.setAttribute("aria-expanded",x===K?"true":"false");let p=B.querySelector(".persona-history-menu");if(x!==K||r.length===0)p?.remove();else{let h=Fe({label:t.listOptionsLabel,items:r,onCloseMenu:u=>E(u)});p?p.replaceWith(h):B.appendChild(h)}}B.hidden=S!=="rail"&&(!F||F.hidden)&&(!e.showScopeStatus||$.hidden)},rt,zt=()=>{let r=e.onActiveConversationChange;if(!r)return;let n=a.find(h=>h.id===g)??null,p=n?`${n.id}\0${n.title}\0${n.starred?1:0}`:"";p!==rt&&(rt=p,r(n))},f=()=>{if(!m){if(zt(),!U){e.onModelChange?.();return}Rt(),At(),Vt(),It(),Re()}},E=r=>{if(!x)return;let n=x;x=null,b=!1,f(),r?.restoreFocus&&v.querySelector(`[data-persona-history-focus="menu:${n}"]`)?.focus()},ot=r=>{if(x===r){E({restoreFocus:!0});return}x=r,b=!0,f()},nt=r=>{if(!x)return;let n=r.target;n instanceof Node&&v.contains(n)&&n.closest?.(`[data-persona-history-item="${x}"]`)||E()};document.addEventListener("pointerdown",nt,!0);let it=r=>{r.key!=="Escape"||!x||(r.stopPropagation(),E({restoreFocus:!0}))};v.addEventListener("keydown",it);async function P(r){if(m)return;let n=++D,p=r==="load-more"?d:null;if(!(r==="load-more"&&!p)){y={kind:r==="load-more"?"load-more":"refresh"},c={kind:"loading",phase:r},r!=="load-more"&&(V.clear(),M=null),E(),f();try{let h=await e.provider.list({limit:i,context:e.context,...p?{cursor:p}:{},...e.targetId?{targetId:e.targetId}:{}});if(m||n!==D)return;a=p?[...a,...h.items]:h.items,d=h.nextCursor,c=a.length===0?{kind:"empty"}:{kind:"ready"}}catch(h){if(m||n!==D)return;c=vt(h)}finally{!m&&n===D&&(y=null,f())}}}let Me=r=>{a=a.filter(n=>n.id!==r),V.delete(r),g===r&&(g=null),a.length===0&&!d&&(c={kind:"empty"})};async function ce(r){if(!(C()||m)){V.delete(r),E(),y={kind:"open",conversationId:r},f();try{if(await e.onSelect(r),m)return;g=r}catch{if(m)return;V.set(r,{message:t.openFailedLabel,retry:()=>{ce(r)}})}finally{m||(y=null,f())}}}async function ye(r){if(C()||m)return"cancelled";V.delete(r),y={kind:"delete",conversationId:r},f();try{let n=await e.onRequestDeleteConversation(r);return m||n==="deleted"&&(Me(r),ie(t.conversationRemovedNotice)),n}catch(n){return m||(ge(n)&&n.code==="not_found"?Me(r):V.set(r,{message:t.deleteFailedLabel,retry:()=>{ye(r)}})),"cancelled"}finally{m||(y=null,f())}}async function re(){if(!(C()||m)){M=null,E(),y={kind:"start-new"},f();try{if(await e.onStartNew(),m)return;c.kind==="new_conversation_required"&&(c=a.length===0?{kind:"empty"}:{kind:"ready"})}catch{if(m)return;M={message:t.errorDescription,retry:()=>{re()}}}finally{m||(y=null,f())}}}async function Pe(){if(C()||m)return"cancelled";M=null,E(),y={kind:"clear"},f();try{let r=await e.onRequestClearHistory();return m||r==="cleared"&&(a=[],d=null,g=null,c={kind:"empty"},ie(t.historyClearedNotice)),r}catch{return m||(M={message:t.errorDescription,retry:()=>{Pe()}}),"cancelled"}finally{m||(y=null,f())}}let De={outcome:"cancelled"};async function _e(){if(C()||m||!e.onRequestResetIdentity)return De;M=null,E(),y={kind:"reset"},f();try{let r=await e.onRequestResetIdentity();return m||r.outcome==="reset"&&(ie(r.remoteRevocationConfirmed?t.identityResetNotice:t.identityResetUnconfirmedNotice),y=null,await P("refresh")),r}catch{return m||(M={message:t.errorDescription,retry:()=>{_e()}}),De}finally{!m&&y?.kind==="reset"&&(y=null,f())}}let Ft=e.provider.subscribeIdentityStatus(r=>{if(m)return;let n=we(r),p=n!==A;w=r,A=n,f(),p&&r.state!=="verifying"&&ie(bt(r,t).title)}),qt=e.provider.subscribeAvailability?.(r=>{if(!m){if(r){P("refresh");return}a=[],d=null,c={kind:"error",reason:"unavailable",retryable:!1},f()}});return f(),P("initial"),{element:v,copy:t,getModel:()=>({conversations:a,activeConversationId:g,state:c,pendingAction:y,identityStatus:w,nextCursor:d}),operations:{refresh:async()=>{C()||await P("refresh")},loadMore:async()=>{C()||await P("load-more")},openConversation:r=>ce(r),startNewConversation:()=>re(),requestDeleteConversation:r=>ye(r),requestClearConversationHistory:()=>Pe(),requestResetHistoryIdentity:()=>_e()},setDomRenderEnabled:r=>{r!==U&&(U=r,r&&f())},refresh:()=>{P("refresh")},setPresentation:r=>{if(r===S)return;q(),S=r,Ne=null;let n=r==="rail";v.classList.toggle("persona-history-view--panel",!n),v.classList.toggle("persona-history-view--rail",n),v.setAttribute("data-persona-history-presentation",r),He(),Te(),Le(),Se(),Je(),f()},setCollapsed:r=>{r!==N&&(N=r,Te(),He(),Se(),Re())},setRailSide:r=>{Ke=r==="right",Le()},getHeaderElement:()=>_,setHeaderPlacement:r=>{if(r===Z)return;Z=r;let n=r==="external";if(k.classList.toggle("persona-history-topbar--shell",n),n){Et(),_.remove();return}te(),v.insertBefore(_,Y)},setActiveConversationId:r=>{g!==r&&(g=r,f())},applyConversationSummary:r=>{let n=a.findIndex(p=>p.id===r.id);n!==-1&&(a[n]=r,f())},removeConversationSummary:r=>{a.some(n=>n.id===r)&&(Me(r),f())},setNewConversationRequired:r=>{r?c={kind:"new_conversation_required"}:c.kind==="new_conversation_required"&&(c=a.length===0?{kind:"empty"}:{kind:"ready"}),f()},playExit:Tt,destroy:()=>{m=!0,D+=1,q(),te(),Ht.forEach(r=>r?.destroy()),_.remove(),pe.forEach(r=>r.cancel()),pe=[],Ft(),qt?.(),document.removeEventListener("pointerdown",nt,!0),v.removeEventListener("keydown",it),xe.destroy(),v.remove(),v.replaceChildren()}}}var yr="button:not([disabled])";function ur(e){let t=document.activeElement instanceof HTMLElement?document.activeElement:null,o=Math.random().toString(36).slice(2,8),i=`persona-history-confirm-title-${o}`,l=`persona-history-confirm-desc-${o}`,a=s("button",{className:"persona-history-confirm__cancel",text:e.cancelLabel,attrs:{type:"button"}}),d=s("button",{className:"persona-history-confirm__confirm",text:e.confirmLabel,attrs:{type:"button","data-persona-destructive":"true"}}),c=s("div",{className:"persona-history-confirm__dialog",attrs:{role:"alertdialog","aria-modal":"true","aria-labelledby":i,"aria-describedby":l},style:{maxWidth:"22rem",width:"100%",borderRadius:"var(--persona-radius-lg, 0.75rem)",background:"var(--persona-surface, #ffffff)",color:"var(--persona-text, #111827)",boxShadow:"var(--persona-history-confirm-shadow, 0 20px 40px -12px rgba(0, 0, 0, 0.35))",padding:"20px",display:"flex",flexDirection:"column",gap:"12px"}},s("h2",{className:"persona-history-confirm__title",text:e.title,attrs:{id:i},style:{margin:"0",fontSize:"1rem",fontWeight:"600"}}),s("p",{className:"persona-history-confirm__description",text:e.description,attrs:{id:l},style:{margin:"0",fontSize:"0.875rem",lineHeight:"1.4"}}),s("div",{className:"persona-history-confirm__actions",style:{display:"flex",gap:"8px",justifyContent:"flex-end",flexWrap:"wrap"}},a,d));for(let g of[a,d])g.style.minHeight="44px",g.style.minWidth="88px",g.style.padding="0 16px",g.style.borderRadius="var(--persona-radius-md, 0.5rem)",g.style.cursor="pointer",g.style.font="inherit";a.style.border="1px solid var(--persona-border, rgba(0,0,0,0.12))",a.style.background="transparent",a.style.color="inherit",d.style.border="none",d.style.background="var(--persona-danger, #b42318)",d.style.color="var(--persona-danger-fg, #ffffff)";let y=s("div",{className:"persona-history-confirm",style:{position:"absolute",inset:"0",zIndex:"40",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",background:"var(--persona-history-confirm-scrim, rgba(15, 23, 42, 0.45))"}},c);return new Promise(g=>{let w=!1,A=b=>{w||(w=!0,y.removeEventListener("keydown",x,!0),y.remove(),t?.focus(),g(b))};function x(b){if(b.key==="Escape"){b.preventDefault(),b.stopPropagation(),A(!1);return}if(b.key!=="Tab")return;let m=Array.from(c.querySelectorAll(yr));if(m.length===0)return;let D=m[0],S=m[m.length-1],G=document.activeElement;b.shiftKey&&(G===D||!c.contains(G))?(b.preventDefault(),S.focus()):!b.shiftKey&&G===S&&(b.preventDefault(),D.focus())}y.addEventListener("keydown",x,!0),y.addEventListener("pointerdown",b=>{b.target===y&&A(!1)}),a.addEventListener("click",()=>A(!1)),d.addEventListener("click",()=>A(!0)),e.host.appendChild(y),a.focus()})}export{me as HISTORY_VIEW_COPY_DEFAULTS,wt as createHistoryView,ve as resolveHistoryViewCopy,ur as showHistoryConfirm};
