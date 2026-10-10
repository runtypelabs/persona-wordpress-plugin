var T=(r,e)=>{let t=document.createElement(r);return e&&(t.className=e),t};var M=(r,e={},...t)=>{let o=document.createElement(r);if(e.className&&(o.className=e.className),e.text!==void 0&&(o.textContent=e.text),e.attrs)for(let[s,n]of Object.entries(e.attrs))o.setAttribute(s,n);if(e.style){let s=o.style,n=e.style;for(let i of Object.keys(n)){let f=n[i];f!=null&&(s[i]=f)}}let a=t.filter(s=>s!=null);return a.length>0&&o.append(...a),o};var ee=[["path",{d:"m21 21-4.34-4.34"}],["circle",{cx:"11",cy:"11",r:"8"}]];var te=[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]];var V=(r,e=24,t="currentColor",o=2)=>{if(!Array.isArray(r))return null;let a=document.createElementNS("http://www.w3.org/2000/svg","svg");return a.setAttribute("width",String(e)),a.setAttribute("height",String(e)),a.setAttribute("viewBox","0 0 24 24"),a.setAttribute("fill","none"),a.setAttribute("stroke",t),a.setAttribute("stroke-width",String(o)),a.setAttribute("stroke-linecap","round"),a.setAttribute("stroke-linejoin","round"),a.setAttribute("aria-hidden","true"),r.forEach(s=>{if(!Array.isArray(s)||s.length<2)return;let n=s[0],i=s[1];if(!i)return;let f=document.createElementNS("http://www.w3.org/2000/svg",n);Object.entries(i).forEach(([l,d])=>{l!=="stroke"&&f.setAttribute(l,String(d))}),a.appendChild(f)}),a};var fe=null,le=r=>{fe=r},K=(r,e,t,o)=>fe?.(r,e,t,o)??null;function ie(r){let{ref:e,config:t,onRemove:o}=r;if(t.renderMentionChip){let x="resolving",v,k=t.renderMentionChip({ref:e,status:x,payload:v,remove:o});return{get el(){return k},setStatus:(g,A)=>{if(g===x&&A===v)return;x=g,v=A;let P=t.renderMentionChip({ref:e,status:x,payload:v,remove:o});k.replaceWith(P),k=P}}}let a=e.iconName??t.chipIconName??"at-sign",s=M("div",{className:"persona-mention-chip",attrs:{"data-persona-mention-chip":"","data-status":"resolving",title:e.label}}),n=T("span","persona-mention-chip-icon"),i=x=>{n.replaceChildren();let v=K(x,13,"currentColor",2);v&&n.appendChild(v)};i(a);let f=T("span","persona-mention-chip-spinner"),l=M("span",{className:"persona-mention-chip-label",text:e.label}),d=M("button",{className:"persona-mention-chip-remove",attrs:{type:"button","aria-label":`Remove ${e.label} context`}}),c=V(te,11,"currentColor",2.5);return c?d.appendChild(c):d.textContent="\xD7",d.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),o()}),s.appendChild(f),s.appendChild(l),s.appendChild(d),{el:s,setStatus:x=>{s.setAttribute("data-status",x),x==="resolving"?(f.parentNode!==s&&s.insertBefore(f,l),n.parentNode===s&&n.remove(),s.setAttribute("title",e.label)):(f.parentNode===s&&f.remove(),n.parentNode!==s&&s.insertBefore(n,l),x==="error"?(i("triangle-alert"),s.setAttribute("title",`Couldn't add ${e.label} to context`)):(i(a),s.setAttribute("title",e.label)))}}}function ue(r){r.style.display=r.childElementCount>0?"flex":"none"}function we(r){let e=0;for(let t of r.split(`
`)){let o=/^ {0,3}(`+)/.exec(t);o&&o[1].length>e&&(e=o[1].length)}return e}function oe(r,e){let t="`".repeat(Math.max(3,we(e)+1));return`${t}${r}
${e}
${t}`}function Ae(r,e,t){return e.includes("</document_content>")?oe(r,e):`<document index="${t+1}">
<source>${r}</source>
<document_content>
${e}
</document_content>
</document>`}function de(r,e,t="fenced"){if(typeof t=="function")try{return t(r,e)}catch(o){return console.warn("[persona] contextMentions.llmFormat threw; falling back to the fenced format for this mention",o),oe(r.label,r.text)}return t==="document"?Ae(r.label,r.text,e):oe(r.label,r.text)}function X(r,e){return{sourceId:r.id,itemId:e.id,label:e.label,iconName:e.iconName,color:e.color}}var pe=(r,e)=>`${r}\0${e}`,$=class{constructor(e){this.mentions=[];this.#e=e,this.#s()}#e;get#i(){return this.#e.mentionConfig.maxMentions??8}hasMentions(){return this.mentions.length>0}add(e,t,o=""){let a=pe(e.id,t.id);if(this.mentions.some(i=>i.key===a))return this.#r(e,t,"duplicate");if(this.atLimit())return this.#r(e,t,"limit");let s=X(e,t),n={key:a,source:e,item:t,ref:s,status:"resolving",args:o};return n.chip=ie({ref:s,config:this.#e.mentionConfig,onRemove:()=>this.remove(a)}),n.chip.el.setAttribute("data-persona-chip-enter",""),n.chip.el.addEventListener("animationend",()=>n.chip?.el.removeAttribute("data-persona-chip-enter"),{once:!0}),this.#e.contextRow.appendChild(n.chip.el),this.#m(n),this.#s(),!0}atLimit(){return this.mentions.length>=this.#i}admit(e,t){return this.atLimit()?this.#r(e,t,"limit"):!0}track(e,t,o,a="",s){let n={key:e,source:t,item:o,ref:X(t,o),status:"resolving",args:a,reportStatus:s};this.#m(n)}#r(e,t,o){return this.#e.mentionConfig.onMentionRejected?.(t,o),this.#e.emit?.("rejected",{sourceId:e.id,itemId:t.id,reason:o}),!1}#m(e){this.mentions.push(e),e.source.resolveOn==="submit"?(e.status="ready",e.chip?.setStatus("ready"),e.reportStatus?.("resolved")):e.resolvePromise=this.#n(e),this.#e.announce(`Added ${e.ref.label} to context`)}#h(e,t,o=this.#e.getComposerText()){return{messages:this.#e.getMessages(),config:this.#e.getConfig(),composerText:o,args:t,signal:e}}async#n(e){let t=new AbortController;e.abort=t;try{let o=await e.source.resolve(e.item,this.#h(t.signal,e.args));if(t.signal.aborted)return;e.payload=o,e.status="ready",e.chip?.setStatus("ready",o),e.reportStatus?.("resolved")}catch(o){if(t.signal.aborted)return;e.status="error",e.chip?.setStatus("error"),e.reportStatus?.("error"),(this.#e.announceError??this.#e.announce)(`Couldn't attach ${e.ref.label} to context`),this.#e.mentionConfig.onMentionResolveError?.(e.item,o),this.#e.emit?.("resolve-error",{sourceId:e.source.id,itemId:e.item.id})}}remove(e){let t=this.mentions.findIndex(a=>a.key===e);if(t===-1)return;let[o]=this.mentions.splice(t,1);o.abort?.abort(),o.chip?.el.remove(),this.#s(),this.#e.announce(`Removed ${o.ref.label} from context`)}getRefs(){return this.mentions.map(e=>e.ref)}removeLast(){let e=this.mentions[this.mentions.length-1];return e?(this.remove(e.key),!0):!1}clear(){for(let e of this.mentions)e.abort?.abort(),e.chip?.el.remove();this.mentions.length=0,this.#s()}collectForSubmit(){let e=[...this.mentions],t=e.map(s=>s.ref),o=this.#e.getComposerText();for(let s of e)s.chip?.el.remove();return this.mentions.length=0,this.#s(),{refs:t,finalize:async()=>{let s=await Promise.all(e.map(async d=>{try{return d.source.resolveOn==="submit"?await d.source.resolve(d.item,this.#h(new AbortController().signal,d.args,o)):(d.resolvePromise&&await d.resolvePromise,d.payload??null)}catch(c){try{this.#e.mentionConfig.onMentionResolveError?.(d.item,c)}catch(p){typeof console<"u"&&console.warn("[Persona] onMentionResolveError callback threw",p)}return this.#e.emit?.("resolve-error",{sourceId:d.source.id,itemId:d.item.id}),null}})),n=[],i=[],f={},l=new Set;for(let d=0;d<e.length;d++){let c=e[d],p=s[d];if(!p)continue;let x=pe(c.source.id,c.item.id);if(!l.has(x)){if(l.add(x),p.llmAppend&&p.llmAppend.trim())try{n.push(de({label:c.ref.label,text:p.llmAppend,ref:c.ref,item:c.item},n.length,this.#e.mentionConfig.llmFormat))}catch(v){typeof console<"u"&&console.warn("[Persona] context-mention llmFormat threw",v)}p.contentParts?.length&&i.push(...p.contentParts),p.context&&((f[c.source.id]??={})[c.item.id]=p.context)}}return{blocks:n,contentParts:i,context:f}}}}#s(){ue(this.#e.contextRow)}};var _=r=>r.nodeType===Node.DOCUMENT_NODE,xe=r=>r.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&r.host!==void 0;function me(r){let e=r.getRootNode?.();return e&&xe(e)||e&&_(e)?e:r.ownerDocument??document}function Z(r,e,t){let o=_(r)?r.head:r,a=e.replace(/["\\]/g,"\\$&");if(o.querySelector(`style[data-persona-plugin-style="${a}"]`))return;let n=(_(r)?r:r.ownerDocument??document).createElement("style");n.setAttribute("data-persona-plugin-style",e),n.textContent=t,o.appendChild(n)}function ce(r,e,t){if(_(r)||xe(r)){Z(r,e,t);return}let o=r;if(o.isConnected){Z(me(o),e,t);return}let a=o.ownerDocument??document;Z(a,e,t),queueMicrotask(()=>{let s=me(o);s!==a&&Z(s,e,t)})}function Pe(r){let e=r.getRootNode?.();return e instanceof ShadowRoot?e:(r.ownerDocument??document).body}function ge(r){let{anchor:e,content:t,placement:o="bottom-start",offset:a=6,matchAnchorWidth:s=!1,horizontalOffset:n,verticalOffset:i,zIndex:f=2147483e3,onOpen:l,onDismiss:d}=r,c=r.container??Pe(e),p=!1,x=null,v=()=>{if(!p)return;let g=e.getBoundingClientRect();t.style.position="fixed",s&&(t.style.minWidth=`${g.width}px`),n&&(t.style.maxWidth=`${g.width}px`);let A=t.getBoundingClientRect(),P=i?.()??null,O=P!=null?g.top+P:g.top,N=o==="top-start"||o==="top-end"?O-a-A.height:g.bottom+a,W=o==="bottom-end"||o==="top-end"?g.right-A.width:g.left,J=n?.()??null;if(J!=null){let se=Math.max(g.left,g.right-A.width);W=Math.min(Math.max(g.left+J,g.left),se)}t.style.top=`${N}px`,t.style.left=`${W}px`},k=()=>{p&&(p=!1,x&&(x(),x=null),t.remove())},E=()=>{if(p)return;p=!0,f!=null&&(t.style.zIndex=String(f)),c.appendChild(t),v();let g=(e.ownerDocument??document).defaultView??window,A=e.ownerDocument??document,P=()=>{if(!e.isConnected){k(),d?.("anchor-removed");return}v()},O=G=>{let W=typeof G.composedPath=="function"?G.composedPath():[];W.includes(t)||W.includes(e)||(k(),d?.("outside"))},N=g.setTimeout(()=>{A.addEventListener("pointerdown",O,!0)},0);g.addEventListener("scroll",P,!0),g.addEventListener("resize",P),x=()=>{g.clearTimeout(N),A.removeEventListener("pointerdown",O,!0),g.removeEventListener("scroll",P,!0),g.removeEventListener("resize",P)},l?.()};return{get isOpen(){return p},open:E,close:k,toggle:()=>p?k():E(),reposition:v,destroy:k}}var he=`
.persona-mention-menu {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: var(--persona-mention-menu-max-height, 280px);
  overflow: hidden;
  background: var(--persona-mention-menu-bg, var(--persona-surface, #ffffff));
  border: 1px solid var(--persona-mention-menu-border, var(--persona-border, #e5e7eb));
  border-radius: var(--persona-mention-menu-radius, 10px);
  box-shadow: var(--persona-mention-menu-shadow, 0 8px 28px rgba(0, 0, 0, 0.12));
  font-family: var(--persona-font-family, inherit);
}
.persona-mention-list {
  min-height: 0;
  overflow-y: auto;
  padding: 4px;
}
.persona-mention-search {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--persona-mention-menu-border, var(--persona-border, #e5e7eb));
}
.persona-mention-search-icon {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  color: var(--persona-mention-group-fg, var(--persona-muted, #6b7280));
}
.persona-mention-search-input {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  /* 16px, not 14px: iOS Safari zooms the page when focusing an input under 16px. */
  font-size: 16px;
  line-height: 1.4;
  color: var(--persona-text, #111827);
}
.persona-mention-search-input::placeholder {
  color: var(--persona-mention-group-fg, var(--persona-muted, #6b7280));
}
.persona-mention-group + .persona-mention-group {
  margin-top: 2px;
  border-top: 1px solid var(--persona-mention-menu-border, var(--persona-border, #f1f1f1));
  padding-top: 2px;
}
.persona-mention-group-header {
  padding: 6px 8px 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--persona-mention-group-fg, var(--persona-muted, #6b7280));
}
.persona-mention-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--persona-text, #111827);
}
.persona-mention-option[data-active="true"] {
  background: var(--persona-mention-option-active-bg, var(--persona-container, #f1f5f9));
}
.persona-mention-option-icon {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  opacity: 0.7;
}
.persona-mention-option-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.persona-mention-option-labelline {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
}
.persona-mention-option-label {
  font-size: 13px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.persona-mention-option-arghint {
  flex: 0 0 auto;
  font-size: 12px;
  line-height: 1.3;
  color: var(--persona-muted, #6b7280);
  opacity: 0.85;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.persona-mention-option-desc {
  font-size: 11px;
  line-height: 1.3;
  color: var(--persona-muted, #6b7280);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.persona-mention-status,
.persona-mention-empty,
.persona-mention-hint {
  padding: 7px 8px;
  font-size: 12px;
  color: var(--persona-muted, #6b7280);
}
.persona-mention-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--persona-mention-error, #dc2626);
}
.persona-mention-error-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.persona-mention-retry {
  flex: 0 0 auto;
  padding: 4px 8px;
  border: 1px solid var(--persona-mention-error, #dc2626);
  border-radius: 6px;
  background: transparent;
  color: var(--persona-mention-error, #dc2626);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.persona-mention-retry:hover {
  background: var(--persona-palette-colors-black-alpha-50, rgba(0, 0, 0, 0.06));
}
.persona-mention-hint {
  font-style: italic;
  opacity: 0.8;
}
@media (pointer: coarse) {
  .persona-mention-option {
    min-height: 44px;
  }
  .persona-mention-retry {
    min-height: 36px;
  }
}
`;var Ce=/\s/;function ke(r,e,t){if(t==="input-start")return e===0;let o=e>0?r[e-1]:"";return t==="line-start"?o===""||o===`
`:o===""||Ce.test(o)}function Re(r,e,t="@",o="anywhere",a=!1){if(!t||e<=0||e>r.length)return null;let s=e-1;for(;s>=0;){let n=r[s];if(n===t)return ke(r,s,o)?{triggerIndex:s,query:r.slice(s+1,e)}:null;if(n===`
`||n==="\uFFFC"||!a&&Ce.test(n))return null;s--}return null}function re(r,e,t){for(let o of t){let a=Re(r,e,o.trigger,o.position??"anywhere",o.allowSpaces??!1);if(a)return{channel:o,match:a}}return null}function Se(r,e,t){return{value:r.slice(0,e.triggerIndex)+r.slice(t),caret:e.triggerIndex}}function Me(r){let e={trigger:r.trigger??"@",position:r.triggerPosition??"anywhere",allowSpaces:!1,sources:Array.isArray(r.sources)?r.sources:[],searchPlaceholder:r.searchPlaceholder,showButton:r.showButton!==!1,buttonIconName:r.buttonIconName,buttonTooltipText:r.buttonTooltipText},t=(r.triggers??[]).map(o=>({trigger:o.trigger,position:o.triggerPosition??"anywhere",allowSpaces:o.allowSpaces??!1,sources:Array.isArray(o.sources)?o.sources:[],searchPlaceholder:o.searchPlaceholder,showButton:o.showButton===!0,buttonIconName:o.buttonIconName,buttonTooltipText:o.buttonTooltipText}));return[e,...t]}function Q(r){let e=r.replace(/^\s+/,""),t=e.search(/\s/);return t===-1?{name:e,args:""}:{name:e.slice(0,t),args:e.slice(t+1).trim()}}var be=new Map,Te=(r,e,t)=>{let o=`${r}|${e}|${t}`,a=be.get(o);return a===void 0&&(a=K(r,e,"currentColor",t),be.set(o,a)),a?a.cloneNode(!0):null};function ve(r){let{config:e,listboxId:t}=r,o=M("div",{className:"persona-mention-menu",attrs:{"data-persona-mention-menu":""}}),a=M("div",{className:"persona-mention-search",style:{display:"none"}}),s=T("span","persona-mention-search-icon"),n=V(ee,15,"currentColor",2);n&&s.appendChild(n);let i=M("input",{className:"persona-mention-search-input",attrs:{type:"text",role:"combobox","aria-autocomplete":"list","aria-expanded":"false","aria-controls":t,"aria-label":e.searchPlaceholder??"Search context",placeholder:e.searchPlaceholder??"Search context\u2026",autocomplete:"off",autocapitalize:"off",spellcheck:"false"}});a.append(s,i),i.addEventListener("input",()=>r.onSearchInput?.(i.value)),i.addEventListener("keydown",u=>r.onSearchKeydown?.(u));let f=M("div",{className:"persona-mention-list",attrs:{role:"listbox",id:t,"aria-label":"Context mentions"}});o.append(a,f);let l=[],d=[],c=-1,p=new Map,x=(u,m)=>`${u}\0${m}`,v=u=>`${t}-opt-${u}`,k=u=>`${t}-grp-${u}`,E=(u,m)=>{let C=l[u];C&&(m?C.setAttribute("data-active","true"):C.removeAttribute("data-active"),C.setAttribute("aria-selected",m?"true":"false"),d[u]?.(m))},g=(u,m=!0)=>{c>=0&&c!==u&&E(c,!1),c=u;let C=l[u];C?(E(u,!0),m&&C.scrollIntoView?.({block:"nearest"}),f.setAttribute("aria-activedescendant",C.id),i.setAttribute("aria-activedescendant",C.id)):(f.removeAttribute("aria-activedescendant"),i.removeAttribute("aria-activedescendant"))},A=(u,m)=>{let C=k(m),b=M("div",{className:"persona-mention-group",attrs:{role:"group","aria-labelledby":C}});return b.appendChild(M("div",{className:"persona-mention-group-header",attrs:{id:C},text:u})),b},P=()=>{let u=M("div",{className:"persona-mention-option",attrs:{role:"option","aria-selected":"false"}}),m=T("span","persona-mention-option-icon");u.appendChild(m);let C="",b=T("span","persona-mention-option-text"),L=T("span","persona-mention-option-labelline"),R=T("span","persona-mention-option-label");L.appendChild(R),b.appendChild(L),u.appendChild(b);let w=null,y=null,S={el:u,index:0,update:(h,q,F)=>{S.index=q,u.id=v(q),u.setAttribute("aria-setsize",String(F)),u.setAttribute("aria-posinset",String(q+1)),u.removeAttribute("data-active"),u.setAttribute("aria-selected","false");let B=h.iconName??e.chipIconName??"at-sign";if(B!==C){C=B;let H=Te(B,15,2);m.replaceChildren(...H?[H]:[])}R.textContent!==h.label&&(R.textContent=h.label);let I=h.commandArgsPlaceholder?`\u2039${h.commandArgsPlaceholder}\u203A`:null;I?(w||(w=T("span","persona-mention-option-arghint"),L.appendChild(w)),w.textContent!==I&&(w.textContent=I)):w&&(w.remove(),w=null),h.description?(y||(y=T("span","persona-mention-option-desc"),b.appendChild(y)),y.textContent!==h.description&&(y.textContent=h.description)):y&&(y.remove(),y=null)}};return u.addEventListener("mousedown",h=>{h.button===0&&(h.preventDefault(),r.onSelectIndex(S.index))}),u.addEventListener("mouseenter",()=>r.onHoverIndex(S.index)),S},O=(u,m,C,b,L)=>{let R=M("div",{className:"persona-mention-option",attrs:{role:"option",id:v(b),"aria-selected":"false","aria-setsize":String(L),"aria-posinset":String(b+1)}}),w=y=>{R.replaceChildren(e.renderMentionItem({item:u,source:m,query:C,active:y,index:b}))};return w(!1),R.addEventListener("mousedown",y=>{y.button===0&&(y.preventDefault(),r.onSelectIndex(b))}),R.addEventListener("mouseenter",()=>r.onHoverIndex(b)),{el:R,paint:w}},N=u=>{let m=M("div",{className:"persona-mention-status persona-mention-error"});if(m.appendChild(M("span",{className:"persona-mention-error-text",text:`Couldn't load ${u.label}`})),r.onRetry){let C=M("button",{className:"persona-mention-retry",attrs:{type:"button"},text:"Retry"});C.addEventListener("mousedown",b=>b.preventDefault()),C.addEventListener("click",b=>{b.preventDefault(),r.onRetry(u.id)}),m.appendChild(C)}return m};return{el:o,render:u=>{f.replaceChildren(),l=[],d=[],c=-1;let m=new Set,C=0,b=0,L=0,R=0,w=0,y=u.groups.reduce((S,h)=>h.status==="ready"?S+h.items.length:S,0);for(let S of u.groups)if(S.status==="loading"){L++;let h=A(S.source.label,w++);h.appendChild(M("div",{className:"persona-mention-status persona-mention-loading",attrs:{role:"presentation"},text:"Loading\u2026"})),f.appendChild(h)}else if(S.status==="error"){R++;let h=A(S.source.label,w++);h.appendChild(N(S.source)),f.appendChild(h)}else if(S.status==="ready"&&S.items.length>0){let h=new Map;for(let F of S.items){let B=F.group??S.source.label,I=h.get(B);I?I.push(F):h.set(B,[F])}let q=Array.from(h.entries());q.forEach(([F,B],I)=>{let H=A(F,w++);for(let Y of B){let ne=C++,z;if(e.renderMentionItem){let D=O(Y,S.source,u.query,ne,y);z=D.el,d.push(D.paint)}else{let D=x(S.source.id,Y.id),U=m.has(D)?void 0:p.get(D);U||(U=P(),m.has(D)||p.set(D,U)),m.add(D),U.update(Y,ne,y),z=U.el,d.push(null)}l.push(z),H.appendChild(z),b++}S.truncated&&I===q.length-1&&H.appendChild(M("div",{className:"persona-mention-hint",attrs:{role:"presentation"},text:"Keep typing to narrow\u2026"})),f.appendChild(H)})}for(let S of p.keys())m.has(S)||p.delete(S);b===0&&L===0&&R===0&&f.appendChild(M("div",{className:"persona-mention-empty",attrs:{role:"presentation"},text:"No matches"})),l.length>0?g(Math.min(Math.max(0,u.activeIndex),l.length-1)):(f.removeAttribute("aria-activedescendant"),i.removeAttribute("aria-activedescendant"))},setActiveIndex:g,destroy:()=>{f.replaceChildren(),l=[],p.clear(),o.remove()},showSearch:(u,m)=>{i.value=u,m&&(i.placeholder=m),a.style.display="",i.setAttribute("aria-expanded","true"),i.focus(),typeof requestAnimationFrame=="function"&&requestAnimationFrame(()=>{a.style.display!=="none"&&i.focus()})},hideSearch:()=>{a.style.display="none",i.value="",i.setAttribute("aria-expanded","false"),i.removeAttribute("aria-activedescendant")}}}var Le=r=>!!r&&(typeof r=="object"||typeof r=="function")&&typeof r.then=="function",Be=0,j=class{#e;#i;#r;#m;#h;#n;#s;#d=null;#C=null;#f=!1;#u="";#o=null;#a=0;#y=null;#S=!1;#w=null;#l=[];#t=[];#x=0;#c=null;#p=null;#P=new Set;#k=new Set;#R=-1;#A=null;#F=null;constructor(e){this.#e=e;let t=e.mentionConfig,o=Me(t),a=o.filter(n=>n.sources.length>0);this.#i=a.length>0?a:[o[0]],this.#r=this.#i[0],this.#m=t.maxItemsPerGroup??6,this.#h=t.searchDebounceMs??150,this.#s=`persona-mention-listbox-${++Be}`,this.#n=e.mentionConfig.renderMentionMenu?this.#$():ve({config:e.mentionConfig,listboxId:this.#s,onSelectIndex:n=>this.#N(n),onHoverIndex:n=>this.#v(n,!1),onRetry:n=>this.#J(n),onSearchInput:n=>this.#M(n),onSearchKeydown:n=>{this.handleKeydown(n)}});let s=e.composerInput.element;s.setAttribute("aria-haspopup","listbox"),s.setAttribute("aria-controls",this.#s)}get input(){return this.#e.composerInput}#$(){let e=document.createElement("div");e.setAttribute("data-persona-mention-menu",""),e.setAttribute("role","listbox"),e.id=this.#s;let t=()=>{let o=this.#e.mentionConfig.renderMentionMenu({query:this.#u,groups:this.#l.map(a=>({source:a.source,items:a.items})),status:Object.fromEntries(this.#l.map(a=>[a.source.id,a.status])),activeIndex:this.#a,select:a=>{let s=this.#l.find(n=>n.items.includes(a));s&&this.#G(s.source,a)},close:()=>this.close()});e.replaceChildren(o)};return{el:e,render:t,setActiveIndex:t,destroy:()=>e.remove()}}isOpen(){return this.#f}openFromButton(e){let t=e&&this.#i.find(n=>n.trigger===e)||this.#i[0],o=this.input.getSelection().start,a=re(this.input.getLogicalText(),o,[t]);if(a){this.#S=!1,this.#o=a.match,this.#f?(this.#T(t),this.#M(a.match.query)):this.#L(a.match.query,t),this.input.focus();return}let s=this.#w;this.#S=!0,this.#w=t.trigger,this.#o=null,this.#f?(s&&s!==t.trigger&&this.#e.onPickerOpenChange?.(!1,s,this.#s),this.#T(t),this.#M("")):this.#L("",t),this.#n.showSearch?this.#n.showSearch("",t.searchPlaceholder):this.input.focus(),this.#e.onPickerOpenChange?.(!0,t.trigger,this.#s)}onInput(){let e=this.input.getSelection().start,t=re(this.input.getLogicalText(),e,this.#i);if(!t){this.#f&&this.close();return}if(this.#te(t.channel,t.match.query)){this.#o=null,this.#f&&this.close(!1);return}this.#o=t.match,this.#f?(this.#T(t.channel),this.#F!==t.match.triggerIndex&&this.#B(),this.#M(t.match.query)):this.#L(t.match.query,t.channel)}#T(e){e!==this.#r&&(this.#r=e,this.#l=[],this.#a=0)}#L(e,t){if(this.#f=!0,this.#r=t,this.#l=[],this.#a=0,this.#R=-1,!this.#d){let o=this.#_();if(this.#d=ge({anchor:this.#e.anchor,content:this.#n.el,placement:"top-start",matchAnchorWidth:!o,offset:6,container:this.#e.popoverContainer,horizontalOffset:o?()=>this.#A?.x??null:void 0,verticalOffset:o?()=>this.#A?.y??null:void 0,onDismiss:()=>this.close(!1)}),o){let a=this.#e.anchor.getBoundingClientRect().width;this.#n.el.style.minWidth=`${Math.min(220,a)}px`}}this.#B(),this.#d.open(),ce(this.#n.el,"persona-mention-menu",he),this.#Z(),this.#e.emit?.("opened",{trigger:t.trigger}),this.#M(e)}#Z(){typeof ResizeObserver>"u"||this.#C||(this.#C=new ResizeObserver(()=>{this.#f&&(this.#B(),this.#d?.reposition())}),this.#C.observe(this.#e.anchor))}#E(){this.#C?.disconnect(),this.#C=null}#_(){return this.#z()&&!!this.input.getLogicalRangeRect}#B(){let e=this.#o,t=this.input.getLogicalRangeRect;if(this.#F=e?.triggerIndex??null,this.#A=null,!e||!t)return;let o=t(e.triggerIndex,e.triggerIndex+1);if(!o)return;let a=this.#e.anchor.getBoundingClientRect(),s=o.top-a.top,n=this.input.element,i=typeof getComputedStyle=="function"&&getComputedStyle(n).direction==="rtl";this.#A={x:i?null:o.left-a.left,y:s}}close(e=!0){this.#f&&(this.#f=!1,this.#E(),this.#p&&clearTimeout(this.#p),this.#c?.abort(),this.#x++,this.#d?.close(),this.input.element.removeAttribute("aria-activedescendant"),this.#S&&(this.#S=!1,this.#n.hideSearch?.(),this.#e.onPickerOpenChange?.(!1,this.#w??this.#r.trigger,this.#s),this.#w=null,e&&this.input.focus()))}#M(e){this.#u=e,this.#a=0,this.#y=null;let t=++this.#x;this.#k.clear(),this.#c?.abort(),this.#c=new AbortController;for(let o of this.#r.sources)this.#P.has(o.id)?this.#b(o.id,"loading"):(this.#k.add(o.id),this.#I(o,t));this.#g(),this.#p&&clearTimeout(this.#p),this.#p=setTimeout(()=>{if(t===this.#x)for(let o of this.#r.sources)this.#P.has(o.id)&&!this.#k.has(o.id)&&this.#I(o,t)},this.#h)}#I(e,t){let o={messages:this.#e.getMessages(),config:this.#e.getConfig(),signal:this.#c.signal},a;try{a=e.search(this.#u,o)}catch{this.#b(e.id,"error"),this.#g();return}Le(a)?(this.#P.add(e.id),this.#b(e.id,"loading"),a.then(s=>{t===this.#x&&(this.#W(e.id,s),this.#g())}).catch(()=>{t===this.#x&&(this.#b(e.id,"error"),this.#g())})):this.#W(e.id,a)}#O(e){let t=this.#l.find(o=>o.source.id===e.id);if(!t){t={source:e,items:[],status:"loading",truncated:!1};let o=this.#r.sources;this.#l.push(t),this.#l.sort((a,s)=>o.findIndex(n=>n.id===a.source.id)-o.findIndex(n=>n.id===s.source.id))}return t}#b(e,t){let o=this.#r.sources.find(a=>a.id===e);o&&(this.#O(o).status=t)}#W(e,t){let o=this.#r.sources.find(s=>s.id===e);if(!o)return;let a=this.#O(o);a.truncated=t.length>this.#m,a.items=t.slice(0,this.#m),a.status=a.items.length===0?"empty":"ready"}#q(e){return JSON.stringify([e.source.id,e.item.id])}#Q(){this.#t=[];for(let e of this.#l)if(e.status==="ready")for(let t of e.items)this.#t.push({source:e.source,item:t});if(this.#y){let e=this.#t.findIndex(t=>this.#q(t)===this.#y);this.#a=e>=0?e:Math.min(this.#a,Math.max(0,this.#t.length-1))}else this.#a>=this.#t.length&&(this.#a=Math.max(0,this.#t.length-1))}#j(){return{query:this.#u,groups:this.#l,activeIndex:this.#a}}#g(){this.#Q(),this.#n.render(this.#j()),this.#H(),this.#d?.reposition();let e=this.#l.some(t=>t.status==="loading");this.#t.length===0&&e||this.#t.length!==this.#R&&(this.#R=this.#t.length,this.#e.announce(this.#t.length===0?"No matches":this.#t.length===1?"1 result":`${this.#t.length} results`),this.#e.emit?.("searched",{query:this.#u,results:this.#t.length}))}#v(e,t=!0){e<0||e>=this.#t.length||(this.#a=e,this.#y=this.#q(this.#t[e]),this.#n.setActiveIndex(e,t),this.#H())}#H(){this.#f&&!this.#S&&this.#a>=0&&this.#a<this.#t.length?this.input.element.setAttribute("aria-activedescendant",`${this.#s}-opt-${this.#a}`):this.input.element.removeAttribute("aria-activedescendant")}#J(e){let t=this.#r.sources.find(o=>o.id===e);!t||!this.#c||(this.#b(e,"loading"),this.#g(),this.#I(t,this.#x),this.#g())}handleKeydown(e){if(!this.#f)return!1;switch(e.key){case"ArrowDown":return this.#t.length===0||(e.preventDefault(),this.#v((this.#a+1)%this.#t.length)),!0;case"ArrowUp":return this.#t.length===0||(e.preventDefault(),this.#v((this.#a-1+this.#t.length)%this.#t.length)),!0;case"Home":return this.#t.length===0||(e.preventDefault(),this.#v(0)),!0;case"End":return this.#t.length===0||(e.preventDefault(),this.#v(this.#t.length-1)),!0;case"Enter":case"Tab":return this.#t.length===0?(this.close(),!1):(e.preventDefault(),this.#N(this.#a),!0);case"Escape":return e.preventDefault(),this.close(),!0;case"Backspace":return this.#u.length===0&&this.close(),!1;default:return!1}}#N(e){let t=this.#t[e];t&&this.#G(t.source,t.item)}#U(e){return Q(e).args}#D(e){return e.command==="server"||e.commandArgsPlaceholder!=null}#G(e,t){let o=t.command;if(this.#D(t)){this.#ee(e,t);return}if(o==="action"){let s=this.#U(this.#u);this.#X(),this.close(),this.#K(t,s),this.#e.emit?.("command",{sourceId:e.id,itemId:t.id,kind:"action",args:s}),this.input.focus();return}if(o==="prompt"){let s=this.#U(this.#u),n=this.#re();this.close(),this.#ae(e,t,s,n),this.#e.emit?.("command",{sourceId:e.id,itemId:t.id,kind:"prompt",args:s});return}if(this.#z()){this.#Y(e,t);return}this.#e.onSelect(e,t,"")&&(this.#X(),this.#e.emit?.("selected",{sourceId:e.id,itemId:t.id,label:t.label})),this.close(),this.input.focus()}#z(){return this.#e.mentionConfig.display==="inline"&&!!this.#e.onInsertMention&&!!this.input.insertMentionAtTrigger}#Y(e,t){if(this.#e.admitMention&&!this.#e.admitMention(e,t)){this.close(),this.input.focus();return}let o=X(e,t),a=this.#o?this.input.insertMentionAtTrigger(o,this.#o):this.input.insertMentionAtSelection?.(o)??null;a?(this.#e.onInsertMention(a,e,t,""),this.#e.emit?.("selected",{sourceId:e.id,itemId:t.id,label:t.label})):(this.#e.mentionConfig.onMentionRejected?.(t,"stale"),this.#e.emit?.("rejected",{sourceId:e.id,itemId:t.id,reason:"stale"})),this.#o=null,this.close(),this.input.focus()}#ee(e,t){let o=`${this.#r.trigger}${t.label} `,a=this.input.getSelection().start,s=this.#o?this.#o.triggerIndex:a;if(this.input.replaceLogicalRange)this.input.replaceLogicalRange(s,a,o);else{let n=this.input.getValue();this.input.setValueWithCaret(n.slice(0,s)+o+n.slice(a),s+o.length)}this.#o=null,this.close(),this.#e.emit?.("command",{sourceId:e.id,itemId:t.id,kind:t.command??"prompt",phase:"armed"}),this.input.dispatchInput(),this.input.focus()}#te(e,t){let{name:o}=Q(t);return!o||t.length<=o.length?!1:e.sources.some(a=>{let s=a.matchCommand?.(o);return!!s&&this.#D(s)})}#oe(e){for(let t of this.#i){if(!t.trigger)continue;let o=t.position==="anywhere"?[e]:t.position==="line-start"?e.split(`
`):[e.split(`
`)[0]];for(let a of o){if(!a.startsWith(t.trigger))continue;let{name:s,args:n}=Q(a.slice(t.trigger.length));if(s)for(let i of t.sources){let f=i.matchCommand?.(s);if(f&&this.#D(f))return{source:i,item:f,args:n}}}}return null}async dispatchInlineCommand(e){let t=this.#oe(e);if(!t)return null;let{source:o,item:a,args:s}=t,n=a.command??"prompt";if(this.#e.emit?.("command",{sourceId:o.id,itemId:a.id,kind:n,args:s}),n==="action")return this.#K(a,s),{kind:"action"};if(n==="prompt"){let f;try{f=await o.resolve(a,this.#V(s,e))}catch(l){return typeof console<"u"&&console.warn("[Persona] inline prompt command resolve failed",l),null}return{kind:"prompt",sendText:f.insertText??f.llmAppend??e}}return{kind:"server",mentions:{refs:[],finalize:async()=>{let f=await o.resolve(a,this.#V(s,e)),l={};return f.context&&(l[o.id]={[a.id]:f.context}),{blocks:[],contentParts:f.contentParts??[],context:l}}}}}#V(e,t){return{messages:this.#e.getMessages(),config:this.#e.getConfig(),composerText:t,args:e,signal:new AbortController().signal}}#K(e,t){if(e.action)try{Promise.resolve(e.action({args:t,config:this.#e.getConfig(),messages:this.#e.getMessages(),composer:this.input})).catch(o=>{typeof console<"u"&&console.warn("[Persona] context-mention command action failed",o)})}catch(o){typeof console<"u"&&console.warn("[Persona] context-mention command action failed",o)}}#re(){return this.#o?{value:this.input.getValue(),start:this.#o.triggerIndex,end:this.input.getSelection().start}:null}async#ae(e,t,o,a){let s=this.input,n;try{n=await e.resolve(t,{messages:this.#e.getMessages(),config:this.#e.getConfig(),composerText:s.getValue(),args:o,signal:new AbortController().signal})}catch(f){typeof console<"u"&&console.warn("[Persona] context-mention prompt resolve failed",f);return}let i=n.insertText??n.llmAppend??"";t.insertMode==="insert-at-caret"&&a?s.replaceLogicalRange?(s.replaceLogicalRange(a.start,a.end,i),s.dispatchInput()):s.setValue(a.value.slice(0,a.start)+i+a.value.slice(a.end)):s.setValue(i),t.submitOnSelect&&s.submit()}#X(){if(!this.#o)return;let e=this.input.getSelection().start;if(this.input.replaceLogicalRange)this.input.replaceLogicalRange(this.#o.triggerIndex,e,"");else{let t=Se(this.input.getValue(),this.#o,e);this.input.setValueWithCaret(t.value,t.caret)}this.input.dispatchInput(),this.#o=null}destroy(){this.#E(),this.#p&&clearTimeout(this.#p),this.#c?.abort(),this.#d?.destroy(),this.#n.destroy();let e=this.input.element;e.removeAttribute("aria-haspopup"),e.removeAttribute("aria-controls"),e.removeAttribute("aria-activedescendant")}};function Ie(r){r&&(typeof r.requestSubmit=="function"?r.requestSubmit():r.dispatchEvent(new Event("submit",{bubbles:!0,cancelable:!0})))}function ye(r){let e=()=>{r.dispatchEvent(new Event("input",{bubbles:!0}))};return{element:r,getValue:()=>r.value,getLogicalText:()=>r.value,getSelection:()=>({start:r.selectionStart??0,end:r.selectionEnd??0}),setSelection:(t,o=t)=>{r.setSelectionRange(t,o)},setValueWithCaret:(t,o)=>{r.value=t,r.setSelectionRange(o,o)},setValue:t=>{r.value=t,r.setSelectionRange(t.length,t.length),e(),r.focus()},submit:()=>Ie(r.form),dispatchInput:e,focus:()=>r.focus()}}var De={position:"absolute",width:"1px",height:"1px",margin:"-1px",padding:"0",overflow:"hidden",clip:"rect(0 0 0 0)",clipPath:"inset(50%)",whiteSpace:"nowrap",border:"0"};function ae(r,e){let t=document.createElement("div");t.className="persona-sr-only",t.setAttribute("aria-live",r),t.setAttribute("aria-atomic","true"),t.setAttribute("role",r==="assertive"?"alert":"status"),t.setAttribute("data-persona-mention-live-region","");let o=e.getRootNode();typeof ShadowRoot<"u"&&o instanceof ShadowRoot?(Object.assign(t.style,De),document.body.appendChild(t)):e.appendChild(t);let s;return{announce:n=>{s!==void 0&&clearTimeout(s),t.textContent="",s=setTimeout(()=>{s=void 0,t.textContent=n},0)},destroy:()=>{s!==void 0&&clearTimeout(s),t.remove()}}}function Fe(r){let e=r.composerInput??ye(r.textarea),t=ae("polite",r.liveRegionHost),o=ae("assertive",r.liveRegionHost),a=l=>t.announce(l),s=l=>o.announce(l),n=new $({mentionConfig:r.mentionConfig,contextRow:r.contextRow,getMessages:r.getMessages,getConfig:r.getConfig,getComposerText:()=>e.getValue(),announce:a,announceError:s,emit:r.emit}),i=()=>new j({mentionConfig:r.mentionConfig,composerInput:e,anchor:r.anchor,getMessages:r.getMessages,getConfig:r.getConfig,onSelect:(l,d,c)=>n.add(l,d,c),onInsertMention:(l,d,c,p)=>n.track(l,d,c,p,x=>e.setMentionStatus?.(l,x)),admitMention:(l,d)=>n.admit(l,d),announce:a,popoverContainer:r.popoverContainer,onPickerOpenChange:r.onPickerOpenChange,emit:r.emit}),f=i();return{openMenu:l=>f.openFromButton(l),isMenuOpen:()=>f.isOpen(),handleInput:()=>f.onInput(),handleKeydown:l=>f.handleKeydown(l),hasMentions:()=>n.hasMentions(),getMentionRefs:()=>n.getRefs(),removeLastChip:()=>n.removeLast(),dispatchInlineCommand:l=>f.dispatchInlineCommand(l),collectForSubmit:()=>n.hasMentions()?n.collectForSubmit():null,untrackMention:l=>n.remove(l),rebindComposer:l=>{l!==e&&(f.destroy(),e=l,f=i())},clear:()=>n.clear(),destroy:()=>{f.destroy(),n.clear(),t.destroy(),o.destroy()}}}export{Fe as mountContextMentions,le as setMentionIconRenderer};
/*! Bundled license information:

lucide/dist/esm/icons/search.mjs:
lucide/dist/esm/icons/x.mjs:
lucide/dist/esm/lucide.mjs:
  (**
   * @license lucide v1.18.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
