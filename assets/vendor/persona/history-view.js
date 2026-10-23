const e=e=>e.nodeType===Node.DOCUMENT_NODE,t=e=>e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&e.host!==void 0;function n(n){let r=n.getRootNode?.();return r&&t(r)||r&&e(r)?r:n.ownerDocument??document}function r(t,n,r){let i=e(t)?t.head:t,a=n.replace(/["\\]/g,`\\$&`);if(i.querySelector(`style[data-persona-plugin-style="${a}"]`))return;let o=(e(t)?t:t.ownerDocument??document).createElement(`style`);o.setAttribute(`data-persona-plugin-style`,n),o.textContent=r,i.appendChild(o)}function i(i,a,o){if(e(i)||t(i)){r(i,a,o);return}let s=i;if(s.isConnected){r(n(s),a,o);return}let c=s.ownerDocument??document;r(c,a,o),queueMicrotask(()=>{let e=n(s);e!==c&&r(e,a,o)})}const a=(e,t={},...n)=>{let r=document.createElement(e);if(t.className&&(r.className=t.className),t.text!==void 0&&(r.textContent=t.text),t.attrs)for(let[e,n]of Object.entries(t.attrs))r.setAttribute(e,n);if(t.style){let e=r.style,n=t.style;for(let t of Object.keys(n)){let r=n[t];r!=null&&(e[t]=r)}}let i=n.filter(e=>e!=null);return i.length>0&&r.append(...i),r},o=(...e)=>e.filter(Boolean).join(` `);function s(){let e=document.createElement(`div`);e.className=`persona-history-sr-only`,e.setAttribute(`role`,`status`),e.setAttribute(`aria-live`,`polite`),e.setAttribute(`aria-atomic`,`true`),e.setAttribute(`data-persona-history-live-region`,``);let t;return{element:e,announce(n){t!==void 0&&clearTimeout(t),e.textContent=``,t=setTimeout(()=>{t=void 0,e.textContent=n},0)},destroy(){t!==void 0&&clearTimeout(t),e.remove()}}}const c={viewTitle:`Messages`,openHistoryLabel:`Messages`,openHistoryBusyLabel:`Messages, available once the reply finishes`,newConversationLabel:`New conversation`,expandLabel:`Expand conversation list`,collapseLabel:`Collapse conversation list`,resizeLabel:`Resize conversation list`,showEarlierMessagesLabel:`Show earlier messages`,openConversationLoadingLabel:`Loading conversation`,openConversationErrorTitle:`Could not open the conversation.`,openConversationRetryLabel:`Try again`,openConversationBackLabel:`Back to messages`,confirmCancelLabel:`Cancel`,deleteConversationConfirmTitle:`Delete conversation`,deleteConversationConfirm:`Delete this conversation? This cannot be undone.`,deleteConversationConfirmLabel:`Delete`,clearHistoryConfirmTitle:`Delete all conversations`,clearHistoryConfirm:`Delete all conversations for this assistant on this browser? This cannot be undone.`,clearHistoryVerifiedConfirm:`Delete all conversations for this assistant and signed-in user? This cannot be undone.`,clearHistoryConfirmLabel:`Delete all`,resetIdentityConfirmTitle:`Forget this device`,resetIdentityConfirm:`Forget this device? All Persona data stored in this browser is cleared. Records are not deleted elsewhere.`,resetIdentityConfirmLabel:`Forget this device`,conversationDeletedNotice:`That conversation was deleted. You are now in a new conversation.`,identityResetNotice:`This device was forgotten.`,identityResetUnconfirmedNotice:`This device was cleared here, but the server could not confirm it.`,emptyTitle:`No conversations yet`,emptyDescription:`Start a conversation and it will show up here.`,errorTitle:`Could not load conversations`,errorDescription:`Something went wrong. Please try again.`,retryLabel:`Retry`,rateLimitedTitle:`Too many requests`,rateLimitedDescription:`Please wait a moment before trying again.`,groupStarred:`Starred`,groupToday:`Today`,groupYesterday:`Yesterday`,groupPrevious7Days:`Previous 7 days`,groupPrevious30Days:`Previous 30 days`,groupMonthYear:`{month} {year}`,browserOnlyTitle:`On this device`,browserOnlyDescription:`Another browser or device keeps its own separate history.`,verifyingTitle:`Checking your account`,verifyingDescription:`Looking for messages linked to your account.`,verifiedTitle:`Available across signed-in devices`,verifiedDescription:`This list refreshes when the chat opens rather than syncing live.`,authenticationRequiredTitle:`Sign in to see your messages`,authenticationRequiredDescription:`Your session expired. Sign in again to load account history.`,identityProviderFailedTitle:`Account history is unavailable`,identityProviderFailedDescription:`We could not verify your account, so account history is not shown here.`,proofNotAdmittedTitle:`Account history is unavailable`,proofNotAdmittedDescription:`This assistant is not set up to accept your account identity.`,retryIdentityLabel:`Try again`,backLabel:`Back to conversation`,closeLabel:`Close conversation list`,loadingLabel:`Loading conversations`,loadMoreLabel:`Load more`,loadingMoreLabel:`Loading more conversations`,conversationsTitle:`Conversations`,rowActionsLabel:`Conversation options`,listOptionsLabel:`Conversation options`,deleteConversationLabel:`Delete`,clearHistoryLabel:`Delete all conversations`,resetIdentityLabel:`Forget this device`,messageCountLabel:`{count} messages`,messageCountLabelOne:`1 message`,conversationRemovedNotice:`Conversation deleted.`,historyClearedNotice:`All conversations were deleted.`,unavailableTitle:`Conversation history is unavailable`,unavailableDescription:`Try again later.`,newConversationRequiredTitle:`Start a new conversation`,newConversationRequiredDescription:`The previous conversation is gone. Start a new one to keep chatting.`,rateLimitedWaitDescription:`You can try again in {seconds} seconds.`,openFailedLabel:`Could not open that conversation.`,deleteFailedLabel:`Could not delete that conversation.`,relativeNow:`now`,relativeMinutes:`{value}m`,relativeHours:`{value}h`,relativeDays:`{value}d`,relativeWeeks:`{value}w`,relativeYears:`{value}y`};function l(e){if(!e)return c;let t={...c};for(let[n,r]of Object.entries(e))typeof r==`string`&&r.length>0&&(t[n]=r);return t}function u(e,t){return e.replace(/\{(\w+)\}/g,(e,n)=>n in t?String(t[n]):e)}const d=864e5;function f(e){let t=new Date(e);return t.setHours(0,0,0,0),t.getTime()}function p(e,t){let n=Date.parse(e);return Number.isFinite(n)?n:t}function m(e,t){let n=p(e,t),r=f(t);if(n>=r)return`today`;if(n>=r-d)return`yesterday`;if(n>=r-7*d)return`previous-7-days`;if(n>=r-30*d)return`previous-30-days`;let i=new Date(n);return`month:${i.getFullYear()}-${i.getMonth()}`}function h(e,t,n,r){if(e===`today`)return r.groupToday;if(e===`yesterday`)return r.groupYesterday;if(e===`previous-7-days`)return r.groupPrevious7Days;if(e===`previous-30-days`)return r.groupPrevious30Days;let i=new Date(p(t,n));return u(r.groupMonthYear,{month:i.toLocaleString(void 0,{month:`long`}),year:i.getFullYear()})}function ee(e,t,n,r=`time`){let i=e.filter(e=>e.starred),a=i.length>0?[{key:`starred`,label:n.groupStarred,items:i}]:[];if(r===`none`){let t=e.filter(e=>!e.starred);return t.length>0&&a.push({key:`recent`,label:n.conversationsTitle,items:t}),a}for(let r of e){if(r.starred)continue;let e=m(r.updatedAt,t),i=a[a.length-1];i&&i.key===e?i.items.push(r):a.push({key:e,label:h(e,r.updatedAt,t,n),items:[r]})}return a}function te(e,t,n){let r=Math.max(0,t-p(e,t)),i=Math.floor(r/6e4);if(i<1)return n.relativeNow;if(i<60)return u(n.relativeMinutes,{value:i});let a=Math.floor(i/60);if(a<24)return u(n.relativeHours,{value:a});let o=Math.floor(a/24);if(o<7)return u(n.relativeDays,{value:o});let s=Math.floor(o/7);return o<365?u(n.relativeWeeks,{value:s}):u(n.relativeYears,{value:Math.floor(o/365)})}function g(e,t){return e===1?t.messageCountLabelOne:u(t.messageCountLabel,{count:e})}const _=`http://www.w3.org/2000/svg`,v={"arrow-left":[`m12 19-7-7 7-7`,`M19 12H5`],plus:[`M5 12h14`,`M12 5v14`],star:[`m12 2 2.9 6.2 6.8.7-5.1 4.5 1.4 6.6-6-3.4-6 3.4 1.4-6.6-5.1-4.5 6.8-.7z`],x:[`M18 6 6 18`,`m6 6 12 12`],"panel-left":[`M9 3v18`],monitor:[`M8 21h8`,`M12 17v4`],ellipsis:[]},y={"panel-left":[3,3,18,18],monitor:[2,3,20,14]};function b(e,t=20){let n=document.createElementNS(_,`svg`);if(n.setAttribute(`width`,String(t)),n.setAttribute(`height`,String(t)),n.setAttribute(`viewBox`,`0 0 24 24`),n.setAttribute(`fill`,`none`),n.setAttribute(`stroke`,`currentColor`),n.setAttribute(`stroke-width`,`2`),n.setAttribute(`stroke-linecap`,`round`),n.setAttribute(`stroke-linejoin`,`round`),n.setAttribute(`aria-hidden`,`true`),n.setAttribute(`focusable`,`false`),e===`ellipsis`){for(let e of[12,19,5]){let t=document.createElementNS(_,`circle`);t.setAttribute(`cx`,String(e)),t.setAttribute(`cy`,`12`),t.setAttribute(`r`,`1`),n.appendChild(t)}return n}let r=y[e];if(r){let e=document.createElementNS(_,`rect`);e.setAttribute(`x`,String(r[0])),e.setAttribute(`y`,String(r[1])),e.setAttribute(`width`,String(r[2])),e.setAttribute(`height`,String(r[3])),e.setAttribute(`rx`,`2`),n.appendChild(e)}for(let t of v[e]){let e=document.createElementNS(_,`path`);e.setAttribute(`d`,t),n.appendChild(e)}return n}const x=/^(https?:|\/|data:)/i;function ne(e){let t=a(`span`,{className:`persona-history-row-avatar`,attrs:{"aria-hidden":`true`}});return x.test(e)?t.appendChild(a(`img`,{attrs:{src:e,alt:``,loading:`lazy`}})):t.textContent=e,t}const S=e=>`row:${e}`,re=e=>`menu:${e}`,ie=e=>`menu-item:${e}`;function ae(e){let{conversation:t,copy:n,busy:r,pending:i}=e,s=r||i!==null,c=t.title.trim().length>0,l=t.starred?(()=>{let e=b(`star`,11);return e.setAttribute(`fill`,`currentColor`),e.setAttribute(`stroke-width`,`1`),a(`span`,{className:`persona-history-row-star`},e,a(`span`,{className:`persona-history-sr-only`,text:n.groupStarred}))})():null,u=a(`div`,{className:`persona-history-row-head`},a(`span`,{className:`persona-history-row-title persona-history-truncate`,text:c?t.title:t.preview??``}),l,a(`time`,{className:`persona-history-row-time`,attrs:{datetime:t.updatedAt},text:te(t.updatedAt,e.nowMs,n)})),d=c&&t.preview?a(`span`,{className:`persona-history-row-preview persona-history-truncate`,text:t.preview}):null,f=a(`button`,{className:o(`persona-history-row`,e.active&&`persona-history-row--active`,i&&`persona-history-row--${i}`),attrs:{type:`button`,"data-persona-history-focus":S(t.id),"data-persona-history-conversation":t.id,...e.active?{"aria-current":`page`}:{},...s?{"aria-disabled":`true`}:{},...i?{"aria-busy":`true`}:{}}},e.avatar?ne(e.avatar):null,a(`div`,{className:`persona-history-row-body`},u,d,a(`span`,{className:`persona-history-row-count persona-history-sr-only`,text:g(t.messageCount,n)})));f.addEventListener(`click`,()=>{s||e.onOpen()});let p=e.showDelete?oe({className:`persona-history-row-menu-button`,label:`${n.rowActionsLabel}: ${t.title}`,focusKey:re(t.id),open:e.menuOpen,inert:s,onToggle:e.onToggleMenu}):null;return a(`li`,{className:o(`persona-history-item`,!e.showDelete&&`persona-history-item--no-menu`),attrs:{"data-persona-history-item":t.id}},f,p,e.menuOpen&&e.showDelete?C(e):null,e.error?w(e.error,n,t.id):null)}function C(e){let{conversation:t,copy:n}=e;return se({label:`${n.rowActionsLabel}: ${t.title}`,items:[{label:n.deleteConversationLabel,focusKey:ie(t.id),danger:!0,onSelect:e.onDelete}],onCloseMenu:e.onCloseMenu})}function oe(e){let t=a(`button`,{className:o(`persona-history-icon-button`,e.className),attrs:{type:`button`,"aria-label":e.label,"aria-haspopup":`menu`,"aria-expanded":e.open?`true`:`false`,"data-persona-history-focus":e.focusKey,...e.inert?{"aria-disabled":`true`}:{}}});t.appendChild(b(`ellipsis`,e.iconSize));let n=()=>t.getAttribute(`aria-disabled`)===`true`;return t.addEventListener(`click`,t=>{t.stopPropagation(),!n()&&e.onToggle()}),t.addEventListener(`keydown`,r=>{(r.key===`ArrowDown`||r.key===`ArrowUp`)&&(r.preventDefault(),!(n()||t.getAttribute(`aria-expanded`)===`true`)&&e.onToggle())}),t}function se(e){let t=a(`div`,{className:`persona-history-menu`,attrs:{role:`menu`,"aria-label":e.label}});for(let n of e.items){let r=a(`button`,{className:o(`persona-history-menu-item`,n.danger&&`persona-history-menu-item--danger`),text:n.label,attrs:{type:`button`,role:`menuitem`,tabindex:`0`,"data-persona-history-focus":n.focusKey}});r.addEventListener(`click`,()=>{e.onCloseMenu(),n.onSelect()}),t.appendChild(r)}return t.addEventListener(`keydown`,n=>{let r=Array.from(t.querySelectorAll(`[role="menuitem"]`));if(r.length===0)return;let i=r.indexOf(document.activeElement);n.key===`Tab`?e.onCloseMenu({restoreFocus:!0}):n.key===`ArrowDown`?(n.preventDefault(),r[(i+1+r.length)%r.length]?.focus()):n.key===`ArrowUp`?(n.preventDefault(),r[(i-1+r.length)%r.length]?.focus()):n.key===`Home`?(n.preventDefault(),r[0]?.focus()):n.key===`End`&&(n.preventDefault(),r[r.length-1]?.focus())}),t}function w(e,t,n){let r=a(`button`,{className:`persona-history-secondary persona-history-state-action`,text:t.retryLabel,attrs:{type:`button`,"data-persona-history-focus":`row-retry:${n}`}});return r.addEventListener(`click`,e.retry),a(`div`,{className:`persona-history-row-error`,attrs:{role:`alert`}},a(`span`,{text:e.message}),r)}var T=class extends Error{constructor(e,t,n){super(t),this.name=`HistoryProviderError`,this.code=e,n?.retryAfterSeconds!==void 0&&(this.retryAfterSeconds=n.retryAfterSeconds)}};function ce(e){return e instanceof T}function le(e){switch(e){case`authentication_failed`:case`authentication_required`:case`identity_provider_failed`:case`proof_not_admitted`:case`unsupported_scope`:case`unavailable`:return e;default:return`unknown`}}function ue(e){if(ce(e)){if(e.code===`rate_limited`)return{kind:`rate_limited`,retryAfterSeconds:e.retryAfterSeconds??0};let t=le(e.code);return{kind:`error`,reason:t,retryable:t!==`unsupported_scope`}}return{kind:`error`,reason:`unknown`,retryable:!0}}function E(e,t){switch(e.state){case`authentication_required`:return{title:t.authenticationRequiredTitle,description:t.authenticationRequiredDescription};case`identity_provider_failed`:return{title:t.identityProviderFailedTitle,description:t.identityProviderFailedDescription};case`configuration_error`:return{title:t.proofNotAdmittedTitle,description:t.proofNotAdmittedDescription};default:return null}}function D(e,t){switch(e){case`authentication_required`:case`authentication_failed`:return{title:t.authenticationRequiredTitle,description:t.authenticationRequiredDescription};case`identity_provider_failed`:return{title:t.identityProviderFailedTitle,description:t.identityProviderFailedDescription};case`proof_not_admitted`:case`unsupported_scope`:return{title:t.proofNotAdmittedTitle,description:t.proofNotAdmittedDescription};case`unavailable`:return{title:t.unavailableTitle,description:t.unavailableDescription};default:return{title:t.errorTitle,description:t.errorDescription}}}function O(e,t,n,r){let i=a(`button`,{className:`persona-history-secondary persona-history-state-action`,text:e,attrs:{type:`button`,"data-persona-history-focus":t,...n?{"aria-disabled":`true`}:{}}});return i.addEventListener(`click`,()=>{n||r()}),i}function k(e,t,n,r,i){return a(`div`,{className:`persona-history-state`,attrs:{"data-persona-history-state":e,...i?{role:`alert`}:{role:`status`}}},a(`p`,{className:`persona-history-state-title`,text:t}),a(`p`,{className:`persona-history-state-description`,text:n}),r)}function A(e){let t=[`42%`,`58%`,`34%`],n=[`94%`,`78%`,`88%`],r=[0,1,2].map(e=>a(`div`,{className:`persona-history-skeleton-row`,attrs:{"aria-hidden":`true`}},a(`div`,{className:`persona-history-skeleton-head`},a(`div`,{className:`persona-history-skeleton-bar persona-history-skeleton-bar--title`,style:{width:t[e]}}),a(`div`,{className:`persona-history-skeleton-bar persona-history-skeleton-bar--time`})),a(`div`,{className:`persona-history-skeleton-bar persona-history-skeleton-bar--preview`,style:{width:n[e]}})));return a(`div`,{className:`persona-history-view-loading`,attrs:{"data-persona-history-state":`loading`,role:`status`,"aria-label":e.loadingLabel}},...r)}function de(e){let{state:t,copy:n,busy:r}=e;if(t.kind===`loading`)return A(n);if(t.kind===`empty`){let t=E(e.identityStatus,n);return t?k(`identity`,t.title,t.description,e.onRetry?O(n.retryIdentityLabel,`state-retry`,r,e.onRetry):null,!0):k(`empty`,n.emptyTitle,n.emptyDescription,null,!1)}if(t.kind===`rate_limited`){let i=t.retryAfterSeconds>0?u(n.rateLimitedWaitDescription,{seconds:t.retryAfterSeconds}):n.rateLimitedDescription;return k(`rate_limited`,n.rateLimitedTitle,i,e.onRetry?O(n.retryLabel,`state-retry`,r,e.onRetry):null,!1)}if(t.kind===`new_conversation_required`)return k(`new_conversation_required`,n.newConversationRequiredTitle,n.newConversationRequiredDescription,e.onStartNew?O(n.newConversationLabel,`state-retry`,r,e.onStartNew):null,!0);let{title:i,description:a}=D(t.reason,n),o=t.reason===`authentication_required`||t.reason===`authentication_failed`||t.reason===`identity_provider_failed`?n.retryIdentityLabel:n.retryLabel;return k(`error`,i,a,t.retryable&&e.onRetry?O(o,`state-retry`,r,e.onRetry):null,!0)}const j=`persona:list-options`,fe={panel:20,rail:12},pe=()=>typeof window<`u`&&typeof window.matchMedia==`function`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,me=e=>e.finished?e.finished.then(()=>void 0,()=>void 0):Promise.resolve();function M(e){return`${e.state}:${`reason`in e?e.reason:``}`}function he(e,t){switch(e.state){case`verified`:return{title:t.verifiedTitle,description:t.verifiedDescription,pending:!1};case`verifying`:case`resetting`:return{title:t.verifyingTitle,description:t.verifyingDescription,pending:!0};case`authentication_required`:return{title:t.authenticationRequiredTitle,description:t.authenticationRequiredDescription,pending:!1};case`identity_provider_failed`:return{title:t.identityProviderFailedTitle,description:t.identityProviderFailedDescription,pending:!1};case`configuration_error`:return{title:t.proofNotAdmittedTitle,description:t.proofNotAdmittedDescription,pending:!1};case`unavailable`:return{title:t.unavailableTitle,description:t.unavailableDescription,pending:!1};default:return{title:t.browserOnlyTitle,description:t.browserOnlyDescription,pending:!1}}}function ge(e){return e.state===`verified`||e.state===`browser_only`}function _e(e){return e.state===`authentication_required`||e.state===`identity_provider_failed`||e.state===`configuration_error`}function N(e){let t=l(e.copy),n=e.now??(()=>Date.now()),r=e.pageSize??25,c=`persona-history-title-${Math.random().toString(36).slice(2,8)}`,u=[],d=null,f={kind:`loading`,phase:`initial`},p=null,m=e.activeConversationId,h=e.provider.getIdentityStatus(),te=M(h),g=null,_=!1,v=!1,y=0,x=e.presentation,ne=e.collapsible!==!1,S=e.collapsed===!0,re=e.railSide===`right`,C=e.renderDom!==!1,w=/* @__PURE__ */ new Map,T=null,le=s(),E=t=>{!C&&e.onAnnounce?e.onAnnounce(t):le.announce(t)},D=()=>p!==null,O=`${c}-body`,k=a(`button`,{className:`persona-history-icon-button persona-history-back`,attrs:{type:`button`}}),A=()=>x===`rail`&&ne,N,ve=()=>{if(e.railBrand){if(!A())k.classList.remove(`persona-history-back--branded`);else{if(N===void 0){let t=e.railBrand(!0);N=t?a(`span`,{className:`persona-history-brand-mark persona-history-toggle-brand`,attrs:{"aria-hidden":`true`}},t):null}N&&(k.classList.add(`persona-history-back--branded`),k.appendChild(N))}}},ye=()=>{let n=A(),r=x===`rail`;k.setAttribute(`data-persona-history-focus`,n?`collapse`:`close`),k.setAttribute(`aria-label`,n?S?t.expandLabel:t.collapseLabel:r?t.closeLabel:t.backLabel),n?(k.setAttribute(`aria-expanded`,S?`false`:`true`),k.setAttribute(`aria-controls`,O),e.collapseShortcut?.aria&&k.setAttribute(`aria-keyshortcuts`,e.collapseShortcut.aria)):(k.removeAttribute(`aria-expanded`),k.removeAttribute(`aria-controls`),k.removeAttribute(`aria-keyshortcuts`)),k.replaceChildren(b(n?`panel-left`:r?`x`:`arrow-left`)),ve()};ye(),k.addEventListener(`click`,()=>{A()?e.onToggleCollapse?.():e.onClose()});let be=a(`h2`,{className:`persona-history-title`,text:t.viewTitle,attrs:{id:c}}),xe=a(`span`,{className:`persona-history-scope-title`}),P=a(`p`,{className:`persona-history-scope`},a(`span`,{className:`persona-history-scope-icon`,attrs:{"aria-hidden":`true`}},b(`monitor`,14)),xe),F=a(`div`,{className:`persona-history-heading-group`},be),Se=!1,Ce,we=()=>{let n=x===`rail`,r=n?e.renderRailHeader:void 0,i=null,o=r!==void 0;if(r)try{i=r({collapsed:S,defaultTitle:t.viewTitle})}catch(e){o=!1,Se||(Se=!0,console.warn(`[persona] history rail renderHeader threw`,e))}if(!o&&n&&e.railBrand){if(Ce===void 0){let n=e.railBrand(!1);Ce=n?a(`span`,{className:`persona-history-heading-brand`,attrs:{"aria-hidden":`true`}},a(`span`,{className:`persona-history-brand-mark`},n),a(`span`,{className:`persona-history-wordmark`,text:t.viewTitle})):null}Ce&&(o=!0,i=Ce)}be.classList.toggle(`persona-history-sr-only`,o),F.replaceChildren(be),i&&F.appendChild(i)};we();let I=a(`button`,{className:`persona-history-icon-button persona-history-new-icon`,attrs:{type:`button`,"data-persona-history-focus":`new-icon`,"aria-label":t.newConversationLabel}});I.appendChild(b(`plus`)),I.addEventListener(`click`,()=>void $());let Te=[k,I].map(t=>e.attachTooltip?.({anchor:t,text:()=>t.getAttribute(`aria-label`)??``,...t===k&&e.collapseShortcut?{hint:()=>A()?e.collapseShortcut.hint:``}:{}})),L=a(`div`,{className:`persona-history-topbar`}),Ee=null,De=()=>{let e=x===`rail`,t=e?re?`rail-right`:`rail`:`panel`;t!==Ee&&(Ee=t,t===`rail`?L.append(F,k):L.append(k,F),e?I.remove():L.appendChild(I),U.classList.toggle(`persona-history-view--rail-right`,t===`rail-right`))},R=a(`div`,{className:`persona-history-scope-alert`}),Oe=`${c}-scope`,ke=b(`plus`,18),Ae=a(`button`,{className:`persona-history-new`,attrs:{type:`button`,"data-persona-history-focus":`new`}},ke,a(`span`,{text:t.newConversationLabel}));Ae.addEventListener(`click`,()=>void $());let je=a(`div`,{className:`persona-history-list-region`}),Me=e.showDeleteAll!==!1,Ne=!!e.provider.resetDevice,Pe=e.listActions??[],z=Me||Ne||Pe.length>0?oe({className:`persona-history-list-options`,label:t.listOptionsLabel,focusKey:`menu:${j}`,open:!1,inert:!0,iconSize:16,onToggle:()=>lt(j)}):null,Fe=a(`h3`,{className:`persona-history-conversations-title`,text:t.conversationsTitle}),B=a(`div`,{className:`persona-history-caption`,attrs:{"data-persona-history-item":j}},Fe,e.showScopeStatus?P:null,z),V=a(`div`,{className:`persona-history-body`,attrs:{id:O}},e.showScopeStatus?R:null,Ae,B,je),H=e.headerPlacement??`inline`;H===`external`&&L.classList.add(`persona-history-topbar--shell`,`persona-history-topbar--shell-enter`);let U=a(`div`,{className:o(`persona-history-view`,`persona-history-view--${e.presentation}`,`persona-history-view--enter`),attrs:{role:`region`,"aria-labelledby":c,"data-persona-history-presentation":e.presentation}},le.element,H===`inline`?L:null,V),Ie=()=>{U.classList.toggle(`persona-history-view--rail-collapsed`,S&&A())};Ie(),De();let Le=(e,t)=>{let n=`${c}-s${t}`,r=a(`div`,{className:o(`persona-history-nav`,e.placement===`footer`&&`persona-history-nav--footer`),attrs:{role:`group`,"data-persona-rail-section":e.id,...e.title?{"aria-labelledby":n}:{"aria-label":e.id}}});e.title&&r.appendChild(a(`h3`,{className:`persona-history-group-heading`,text:e.title,attrs:{id:n}}));for(let t of e.items){let e=t.iconNode?.()??null,n=a(`button`,{className:o(`persona-history-nav-item`,e&&`persona-history-nav-item--icon`),attrs:{type:`button`,"aria-label":t.label,"data-persona-rail-item":t.id}},e?a(`span`,{className:`persona-history-nav-icon`},e):null,a(`span`,{className:`persona-history-nav-label persona-history-truncate`,text:t.label}),t.badge?a(`span`,{className:`persona-history-nav-badge`,text:t.badge}):null);n.addEventListener(`click`,()=>t.onSelect()),r.appendChild(n)}return r},W=null,Re=null,ze=()=>{W&&C&&x===`rail`&&S!==Re&&(Re=S,e.railSections.forEach((e,t)=>{if(!e.render)return;let n=W[t],r=e.title?n.firstElementChild:null,i=null;try{i=e.render(S)}catch(t){e.render=void 0,console.warn(`[persona] history rail section threw`,e.id,t)}n.replaceChildren(...r?[r]:[],...i?[i]:[]),n.hidden=!i}))},Be=()=>{let t=e.railSections;if(U.classList.toggle(`persona-history-view--has-nav`,x===`rail`&&!!t?.some(e=>e.placement===`above-conversations`)),t?.length){if(x!==`rail`)W?.forEach(e=>e.remove());else{W??=t.map(Le);for(let e of[`above-conversations`,`below-conversations`,`footer`]){let n=e===`above-conversations`?B.parentNode===V?B:je:null;t.forEach((t,r)=>{t.placement===e&&V.insertBefore(W[r],n)})}ze()}}};Be(),i(U,`persona-history-view`,`
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
  width: var(--persona-header-control-icon-size, 16px);
  height: var(--persona-header-control-icon-size, 16px);
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
`);let Ve=(e,t)=>{let n=U.ownerDocument.defaultView?.getComputedStyle(U).getPropertyValue(e),r=Number.parseFloat(n??``);return Number.isFinite(r)&&r>=0?r:t},He=(e,t)=>U.ownerDocument.defaultView?.getComputedStyle(U).getPropertyValue(e).trim()||t,G=null,K=()=>{G!==null&&(clearTimeout(G),G=null),U.removeEventListener(`animationend`,K),U.classList.remove(`persona-history-view--enter`)};U.addEventListener(`animationend`,K),G=setTimeout(()=>{G=setTimeout(K,Ve(`--persona-history-enter-ms`,180)+60)},0);let q=null,J=()=>{q!==null&&(clearTimeout(q),q=null),L.classList.remove(`persona-history-topbar--shell-enter`)},Ue=()=>{J(),L.classList.add(`persona-history-topbar--shell-enter`),q=setTimeout(J,180)};H===`external`&&(q=setTimeout(J,180));let We=[],Ge=null,Ke=()=>{if(Ge)return Ge;if(v||pe()||typeof U.animate!=`function`)return K(),null;let e=U.ownerDocument.defaultView?.getComputedStyle(V).opacity||`1`;K(),U.style.pointerEvents=`none`,Y.style.pointerEvents=`none`;let t={duration:Ve(`--persona-history-exit-ms`,160),easing:He(`--persona-history-exit-easing`,`cubic-bezier(0.4, 0, 1, 1)`),fill:`forwards`},n=fe[x];return We=[V.animate([{opacity:e,transform:`none`},{opacity:0,transform:`translateX(${n}px)`}],t)],Ge=Promise.all(We.map(me)).then(()=>void 0),Ge},qe=(e,t)=>{e&&(t?e.setAttribute(`aria-disabled`,`true`):e.removeAttribute(`aria-disabled`))},Y=L,Je=null,Ye=()=>{let n=e.slots?.header;if(!n)return;let r=`${x}|${M(h)}|${p?`${p.kind}:${`conversationId`in p?p.conversationId:``}`:``}`;if(r===Je)return;Je=r;let i=n({identityStatus:h,pendingAction:p,copy:t,defaultRenderer:()=>L})??L;i!==Y&&(Y.replaceWith(i),Y=i)},Xe=null,Ze=()=>{if(!e.showScopeStatus)return;let n=M(h);if(n===Xe)return;Xe=n;let r=he(h,t);xe.textContent=r.title;let i=ge(h);if(P.hidden=!i,R.replaceChildren(...i?[]:[a(`span`,{className:`persona-history-scope-alert-title`,text:r.title})],a(`span`,{className:`persona-history-scope-description`,text:r.description,attrs:{id:Oe}})),R.setAttribute(`data-persona-history-scope-tone`,i?`ambient`:`attention`),i?P.setAttribute(`aria-describedby`,Oe):P.removeAttribute(`aria-describedby`),r.pending?R.setAttribute(`role`,`status`):R.removeAttribute(`role`),R.setAttribute(`data-persona-history-identity`,h.state),P.setAttribute(`data-persona-history-identity`,h.state),_e(h)){let e=a(`button`,{className:`persona-history-secondary persona-history-state-action`,text:t.retryIdentityLabel,attrs:{type:`button`,"data-persona-history-focus":`identity-retry`}});e.addEventListener(`click`,()=>{D()||Q(`refresh`)}),R.appendChild(e)}},Qe=e=>p?p.kind===`open`&&p.conversationId===e?`opening`:p.kind===`delete`&&p.conversationId===e?`deleting`:null:null,$e=()=>{let e=document.activeElement;return!(e instanceof HTMLElement)||!U.contains(e)?null:e.getAttribute(`data-persona-history-focus`)},et=e=>{if(_&&g){_=!1;let e=U.querySelector(`[data-persona-history-focus="${ie(g)}"]`);if(e){e.focus();return}}e&&U.querySelector(`[data-persona-history-focus="${e}"]`)?.focus()},tt=()=>{if(!T)return null;let e=a(`button`,{className:`persona-history-secondary persona-history-state-action`,text:t.retryLabel,attrs:{type:`button`,"data-persona-history-focus":`action-retry`}}),n=T;return e.addEventListener(`click`,()=>{D()||n.retry()}),a(`div`,{className:`persona-history-row-error`,attrs:{role:`alert`}},a(`span`,{text:n.message}),e)},nt=()=>ee(u,n(),t,e.grouping).map((r,i)=>{let s=`${c}-g${i}`,l=a(`ul`,{className:`persona-history-list`,attrs:{"aria-labelledby":s}});for(let i of r.items){let r=()=>ae({conversation:i,active:i.id===m,pending:Qe(i.id),busy:D(),menuOpen:g===i.id,error:w.get(i.id)??null,avatar:e.rowAvatar,showDelete:e.showDelete!==!1,nowMs:n(),copy:t,onOpen:()=>void pt(i.id),onToggleMenu:()=>lt(i.id),onCloseMenu:e=>Z(e),onDelete:()=>void mt(i.id)}),o=e.slots?.conversation?.({conversation:i,active:i.id===m,pending:Qe(i.id),open:()=>pt(i.id),requestDelete:()=>mt(i.id),defaultRenderer:r})??r();l.appendChild(o instanceof HTMLLIElement?o:a(`li`,{className:`persona-history-item`},o))}return a(`div`,{className:`persona-history-group`,attrs:{"data-persona-history-group":r.key}},a(`h3`,{className:o(`persona-history-group-heading`,r.key===`recent`&&`persona-history-sr-only`),text:r.label,attrs:{id:s}}),l)}),rt=()=>{if(!d)return null;let e=p?.kind===`load-more`||f.kind===`loading`&&f.phase===`load-more`,n=a(`button`,{className:`persona-history-secondary persona-history-load-more`,text:e?t.loadingMoreLabel:t.loadMoreLabel,attrs:{type:`button`,"data-persona-history-focus":`load-more`,...e?{"aria-busy":`true`,"aria-disabled":`true`}:{},...D()&&!e?{"aria-disabled":`true`}:{}}});return n.addEventListener(`click`,()=>{D()||Q(`load-more`)}),n},it=()=>{let n=$e(),r=[tt()],i=u.length>0;if(i&&(r.push(...nt()),r.push(rt())),f.kind!==`ready`&&!(f.kind===`loading`&&f.phase!==`initial`&&i)){let n=f,i=n.kind===`loading`?void 0:()=>Q(`refresh`),a=n.kind===`new_conversation_required`?()=>$():void 0,o=()=>de({state:n,copy:t,identityStatus:h,busy:D(),...i?{onRetry:()=>void i()}:{},...a?{onStartNew:()=>void a()}:{}}),s=e.slots?.state?.({state:n,identityStatus:h,copy:t,...i?{retry:i}:{},...a?{startNewConversation:a}:{},defaultRenderer:o});r.push(s??o())}je.replaceChildren(...r.filter(e=>!!e)),et(n)},at=()=>{let e=f.kind===`loading`&&u.length===0,n=[],r=()=>n.length===0?ie(j):`${ie(j)}-${n.length}`;if(!e)for(let e of Pe)n.push({label:e.label,focusKey:r(),danger:e.danger===!0,onSelect:()=>void e.onSelect({conversations:[...u]})});return Me&&(u.length!==0||f.kind!==`empty`&&!e)&&n.push({label:t.clearHistoryLabel,focusKey:r(),danger:!0,onSelect:()=>void ht()}),Ne&&!e&&n.push({label:t.resetIdentityLabel,focusKey:r(),danger:!0,onSelect:()=>void _t()}),n},ot=()=>{if(qe(Ae,D()),qe(I,D()),z){let e=at(),n=f.kind===`loading`&&u.length===0;z.hidden=e.length===0&&!n,qe(z,D()||e.length===0),z.setAttribute(`aria-expanded`,g===j?`true`:`false`);let r=B.querySelector(`.persona-history-menu`);if(g!==j||e.length===0)r?.remove();else{let n=se({label:t.listOptionsLabel,items:e,onCloseMenu:e=>Z(e)});r?r.replaceWith(n):B.appendChild(n)}}B.hidden=x!==`rail`&&(!z||z.hidden)&&(!e.showScopeStatus||P.hidden)},st,ct=()=>{let t=e.onActiveConversationChange;if(!t)return;let n=u.find(e=>e.id===m)??null,r=n?`${n.id}\0${n.title}\0${+!!n.starred}`:``;r!==st&&(st=r,t(n))},X=()=>{v||(ct(),C?(Ye(),Ze(),ot(),it(),ze()):e.onModelChange?.())},Z=e=>{if(!g)return;let t=g;g=null,_=!1,X(),e?.restoreFocus&&U.querySelector(`[data-persona-history-focus="menu:${t}"]`)?.focus()},lt=e=>{g===e?Z({restoreFocus:!0}):(g=e,_=!0,X())},ut=e=>{if(!g)return;let t=e.target;t instanceof Node&&U.contains(t)&&t.closest?.(`[data-persona-history-item="${g}"]`)||Z()};document.addEventListener(`pointerdown`,ut,!0);let dt=e=>{e.key===`Escape`&&g&&(e.stopPropagation(),Z({restoreFocus:!0}))};U.addEventListener(`keydown`,dt);async function Q(t){if(v)return;let n=++y,i=t===`load-more`?d:null;if(t!==`load-more`||i){p={kind:t===`load-more`?`load-more`:`refresh`},f={kind:`loading`,phase:t},t!==`load-more`&&(w.clear(),T=null),Z(),X();try{let t=await e.provider.list({limit:r,context:e.context,...i?{cursor:i}:{},...e.targetId?{targetId:e.targetId}:{}});if(v||n!==y)return;u=i?[...u,...t.items]:t.items,d=t.nextCursor,f=u.length===0?{kind:`empty`}:{kind:`ready`}}catch(e){if(v||n!==y)return;f=ue(e)}finally{!v&&n===y&&(p=null,X())}}}let ft=e=>{u=u.filter(t=>t.id!==e),w.delete(e),m===e&&(m=null),u.length===0&&!d&&(f={kind:`empty`})};async function pt(n){if(!(D()||v)){w.delete(n),Z(),p={kind:`open`,conversationId:n},X();try{if(await e.onSelect(n),v)return;m=n}catch{if(v)return;w.set(n,{message:t.openFailedLabel,retry:()=>void pt(n)})}finally{v||(p=null,X())}}}async function mt(n){if(D()||v)return`cancelled`;w.delete(n),p={kind:`delete`,conversationId:n},X();try{let r=await e.onRequestDeleteConversation(n);return v||r===`deleted`&&(ft(n),E(t.conversationRemovedNotice)),r}catch(e){return v||(ce(e)&&e.code===`not_found`?ft(n):w.set(n,{message:t.deleteFailedLabel,retry:()=>void mt(n)})),`cancelled`}finally{v||(p=null,X())}}async function $(){if(!(D()||v)){T=null,Z(),p={kind:`start-new`},X();try{if(await e.onStartNew(),v)return;f.kind===`new_conversation_required`&&(f=u.length===0?{kind:`empty`}:{kind:`ready`})}catch{if(v)return;T={message:t.errorDescription,retry:()=>void $()}}finally{v||(p=null,X())}}}async function ht(){if(D()||v)return`cancelled`;T=null,Z(),p={kind:`clear`},X();try{let n=await e.onRequestClearHistory();return v||n===`cleared`&&(u=[],d=null,m=null,f={kind:`empty`},E(t.historyClearedNotice)),n}catch{return v||(T={message:t.errorDescription,retry:()=>void ht()}),`cancelled`}finally{v||(p=null,X())}}let gt={outcome:`cancelled`};async function _t(){if(D()||v||!e.onRequestResetIdentity)return gt;T=null,Z(),p={kind:`reset`},X();try{let n=await e.onRequestResetIdentity();return v||n.outcome===`reset`&&(E(n.remoteRevocationConfirmed?t.identityResetNotice:t.identityResetUnconfirmedNotice),p=null,await Q(`refresh`)),n}catch{return v||(T={message:t.errorDescription,retry:()=>void _t()}),gt}finally{!v&&p?.kind===`reset`&&(p=null,X())}}let vt=e.provider.subscribeIdentityStatus(e=>{if(v)return;let n=M(e),r=n!==te;h=e,te=n,X(),r&&e.state!==`verifying`&&E(he(e,t).title)}),yt=e.provider.subscribeAvailability?.(e=>{v||(e?Q(`refresh`):(u=[],d=null,f={kind:`error`,reason:`unavailable`,retryable:!1},X()))});return X(),Q(`initial`),{element:U,copy:t,getModel:()=>({conversations:u,activeConversationId:m,state:f,pendingAction:p,identityStatus:h,nextCursor:d}),operations:{refresh:async()=>{D()||await Q(`refresh`)},loadMore:async()=>{D()||await Q(`load-more`)},openConversation:e=>pt(e),startNewConversation:()=>$(),requestDeleteConversation:e=>mt(e),requestClearConversationHistory:()=>ht(),requestResetHistoryIdentity:()=>_t()},setDomRenderEnabled:e=>{e!==C&&(C=e,e&&X())},refresh:()=>{Q(`refresh`)},setPresentation:e=>{if(e===x)return;K(),x=e,Je=null;let t=e===`rail`;U.classList.toggle(`persona-history-view--panel`,!t),U.classList.toggle(`persona-history-view--rail`,t),U.setAttribute(`data-persona-history-presentation`,e),ye(),Ie(),De(),we(),Be(),X()},setCollapsed:e=>{e!==S&&(S=e,Ie(),ye(),we(),ze())},setRailSide:e=>{re=e===`right`,De()},getHeaderElement:()=>Y,setHeaderPlacement:e=>{if(e===H)return;H=e;let t=e===`external`;L.classList.toggle(`persona-history-topbar--shell`,t),t?(Ue(),Y.remove()):(J(),U.insertBefore(Y,V))},setActiveConversationId:e=>{m!==e&&(m=e,X())},applyConversationSummary:e=>{let t=u.findIndex(t=>t.id===e.id);t!==-1&&(u[t]=e,X())},removeConversationSummary:e=>{u.some(t=>t.id===e)&&(ft(e),X())},setNewConversationRequired:e=>{e?f={kind:`new_conversation_required`}:f.kind===`new_conversation_required`&&(f=u.length===0?{kind:`empty`}:{kind:`ready`}),X()},playExit:Ke,destroy:()=>{v=!0,y+=1,K(),J(),Te.forEach(e=>e?.destroy()),Y.remove(),We.forEach(e=>e.cancel()),We=[],vt(),yt?.(),document.removeEventListener(`pointerdown`,ut,!0),U.removeEventListener(`keydown`,dt),le.destroy(),U.remove(),U.replaceChildren()}}}function ve(e){let t=document.activeElement instanceof HTMLElement?document.activeElement:null,n=Math.random().toString(36).slice(2,8),r=`persona-history-confirm-title-${n}`,i=`persona-history-confirm-desc-${n}`,o=a(`button`,{className:`persona-history-confirm__cancel`,text:e.cancelLabel,attrs:{type:`button`}}),s=a(`button`,{className:`persona-history-confirm__confirm`,text:e.confirmLabel,attrs:{type:`button`,"data-persona-destructive":`true`}}),c=a(`div`,{className:`persona-history-confirm__dialog`,attrs:{role:`alertdialog`,"aria-modal":`true`,"aria-labelledby":r,"aria-describedby":i},style:{maxWidth:`22rem`,width:`100%`,borderRadius:`var(--persona-radius-lg, 0.75rem)`,background:`var(--persona-surface, #ffffff)`,color:`var(--persona-text, #111827)`,boxShadow:`var(--persona-history-confirm-shadow, 0 20px 40px -12px rgba(0, 0, 0, 0.35))`,padding:`20px`,display:`flex`,flexDirection:`column`,gap:`12px`}},a(`h2`,{className:`persona-history-confirm__title`,text:e.title,attrs:{id:r},style:{margin:`0`,fontSize:`1rem`,fontWeight:`600`}}),a(`p`,{className:`persona-history-confirm__description`,text:e.description,attrs:{id:i},style:{margin:`0`,fontSize:`0.875rem`,lineHeight:`1.4`}}),a(`div`,{className:`persona-history-confirm__actions`,style:{display:`flex`,gap:`8px`,justifyContent:`flex-end`,flexWrap:`wrap`}},o,s));for(let e of[o,s])e.style.minHeight=`44px`,e.style.minWidth=`88px`,e.style.padding=`0 16px`,e.style.borderRadius=`var(--persona-radius-md, 0.5rem)`,e.style.cursor=`pointer`,e.style.font=`inherit`;o.style.border=`1px solid var(--persona-border, rgba(0,0,0,0.12))`,o.style.background=`transparent`,o.style.color=`inherit`,s.style.border=`none`,s.style.background=`var(--persona-danger, #b42318)`,s.style.color=`var(--persona-danger-fg, #ffffff)`;let l=a(`div`,{className:`persona-history-confirm`,style:{position:`absolute`,inset:`0`,zIndex:`40`,display:`flex`,alignItems:`center`,justifyContent:`center`,padding:`16px`,background:`var(--persona-history-confirm-scrim, rgba(15, 23, 42, 0.45))`}},c);return new Promise(n=>{let r=!1,i=e=>{r||(r=!0,l.removeEventListener(`keydown`,a,!0),l.remove(),t?.focus(),n(e))};function a(e){if(e.key===`Escape`){e.preventDefault(),e.stopPropagation(),i(!1);return}if(e.key!==`Tab`)return;let t=Array.from(c.querySelectorAll(`button:not([disabled])`));if(t.length===0)return;let n=t[0],r=t[t.length-1],a=document.activeElement;e.shiftKey&&(a===n||!c.contains(a))?(e.preventDefault(),r.focus()):!e.shiftKey&&a===r&&(e.preventDefault(),n.focus())}l.addEventListener(`keydown`,a,!0),l.addEventListener(`pointerdown`,e=>{e.target===l&&i(!1)}),o.addEventListener(`click`,()=>i(!1)),s.addEventListener(`click`,()=>i(!0)),e.host.appendChild(l),o.focus()})}export{c as HISTORY_VIEW_COPY_DEFAULTS,N as createHistoryView,l as resolveHistoryViewCopy,ve as showHistoryConfirm};