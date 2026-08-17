import{a as X}from"./chunk-PDPVORUF.js";import{b as ee}from"./chunk-UPO4GUFC.js";import{a as _,c as Y}from"./chunk-IO5VVUKP.js";import{a as N}from"./chunk-3I2S3I5P.js";import{a as J,b as Z}from"./chunk-Q735PSZL.js";import{a as S,c as C}from"./chunk-76IELU7F.js";function te(s){let{ref:e,config:t,onRemove:n}=s;if(t.renderMentionChip){let u="resolving",A,T=t.renderMentionChip({ref:e,status:u,payload:A,remove:n});return{get el(){return T},setStatus:(z,E)=>{if(z===u&&E===A)return;u=z,A=E;let B=t.renderMentionChip({ref:e,status:u,payload:A,remove:n});T.replaceWith(B),T=B}}}let i=e.iconName??t.chipIconName??"at-sign",o=C("div",{className:"persona-mention-chip",attrs:{"data-persona-mention-chip":"","data-status":"resolving",title:e.label}}),r=S("span","persona-mention-chip-icon"),d=u=>{r.replaceChildren();let A=N(u,13,"currentColor",2);A&&r.appendChild(A)};d(i);let a=S("span","persona-mention-chip-spinner"),l=C("span",{className:"persona-mention-chip-label",text:e.label}),x=C("button",{className:"persona-mention-chip-remove",attrs:{type:"button","aria-label":`Remove ${e.label} context`}}),p=N("x",11,"currentColor",2.5);return p?x.appendChild(p):x.textContent="\xD7",x.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation(),n()}),o.appendChild(a),o.appendChild(l),o.appendChild(x),{el:o,setStatus:u=>{o.setAttribute("data-status",u),u==="resolving"?(a.parentNode!==o&&o.insertBefore(a,l),r.parentNode===o&&r.remove(),o.setAttribute("title",e.label)):(a.parentNode===o&&a.remove(),r.parentNode!==o&&o.insertBefore(r,l),u==="error"?(d("triangle-alert"),o.setAttribute("title",`Couldn't add ${e.label} to context`)):(d(i),o.setAttribute("title",e.label)))}}}function ce(s){let e=0;for(let t of s.split(`
`)){let n=/^ {0,3}(`+)/.exec(t);n&&n[1].length>e&&(e=n[1].length)}return e}function Q(s,e){let t="`".repeat(Math.max(3,ce(e)+1));return`${t}${s}
${e}
${t}`}function de(s,e,t){return e.includes("</document_content>")?Q(s,e):`<document index="${t+1}">
<source>${s}</source>
<document_content>
${e}
</document_content>
</document>`}function ne(s,e,t="fenced"){if(typeof t=="function")try{return t(s,e)}catch(n){return console.warn("[persona] contextMentions.llmFormat threw; falling back to the fenced format for this mention",n),Q(s.label,s.text)}return t==="document"?de(s.label,s.text,e):Q(s.label,s.text)}function G(s,e){return{sourceId:s.id,itemId:e.id,label:e.label,iconName:e.iconName,color:e.color}}var ie=(s,e)=>`${s}\0${e}`,D=class{constructor(e){this.mentions=[];this.opts=e,this.updateRowVisibility()}get maxMentions(){return this.opts.mentionConfig.maxMentions??8}hasMentions(){return this.mentions.length>0}add(e,t,n=""){let i=ie(e.id,t.id);if(this.mentions.some(d=>d.key===i))return this.reject(e,t,"duplicate");if(this.atLimit())return this.reject(e,t,"limit");let o=G(e,t),r={key:i,source:e,item:t,ref:o,status:"resolving",args:n};return r.chip=te({ref:o,config:this.opts.mentionConfig,onRemove:()=>this.remove(i)}),this.opts.contextRow.appendChild(r.chip.el),this.startPending(r),this.updateRowVisibility(),!0}atLimit(){return this.mentions.length>=this.maxMentions}admit(e,t){return this.atLimit()?this.reject(e,t,"limit"):!0}track(e,t,n,i="",o){let r={key:e,source:t,item:n,ref:G(t,n),status:"resolving",args:i,reportStatus:o};this.startPending(r)}reject(e,t,n){return this.opts.mentionConfig.onMentionRejected?.(t,n),this.opts.emit?.("rejected",{sourceId:e.id,itemId:t.id,reason:n}),!1}startPending(e){this.mentions.push(e),e.source.resolveOn==="submit"?(e.status="ready",e.chip?.setStatus("ready"),e.reportStatus?.("resolved")):e.resolvePromise=this.resolvePending(e),this.opts.announce(`Added ${e.ref.label} to context`)}buildResolveContext(e,t,n=this.opts.getComposerText()){return{messages:this.opts.getMessages(),config:this.opts.getConfig(),composerText:n,args:t,signal:e}}async resolvePending(e){let t=new AbortController;e.abort=t;try{let n=await e.source.resolve(e.item,this.buildResolveContext(t.signal,e.args));if(t.signal.aborted)return;e.payload=n,e.status="ready",e.chip?.setStatus("ready",n),e.reportStatus?.("resolved")}catch(n){if(t.signal.aborted)return;e.status="error",e.chip?.setStatus("error"),e.reportStatus?.("error"),(this.opts.announceError??this.opts.announce)(`Couldn't attach ${e.ref.label} to context`),this.opts.mentionConfig.onMentionResolveError?.(e.item,n),this.opts.emit?.("resolve-error",{sourceId:e.source.id,itemId:e.item.id})}}remove(e){let t=this.mentions.findIndex(i=>i.key===e);if(t===-1)return;let[n]=this.mentions.splice(t,1);n.abort?.abort(),n.chip?.el.remove(),this.updateRowVisibility(),this.opts.announce(`Removed ${n.ref.label} from context`)}removeLast(){let e=this.mentions[this.mentions.length-1];return e?(this.remove(e.key),!0):!1}clear(){for(let e of this.mentions)e.abort?.abort(),e.chip?.el.remove();this.mentions.length=0,this.updateRowVisibility()}collectForSubmit(){let e=[...this.mentions],t=e.map(o=>o.ref),n=this.opts.getComposerText();for(let o of e)o.chip?.el.remove();return this.mentions.length=0,this.updateRowVisibility(),{refs:t,finalize:async()=>{var x;let o=await Promise.all(e.map(async p=>{try{return p.source.resolveOn==="submit"?await p.source.resolve(p.item,this.buildResolveContext(new AbortController().signal,p.args,n)):(p.resolvePromise&&await p.resolvePromise,p.payload??null)}catch(M){try{this.opts.mentionConfig.onMentionResolveError?.(p.item,M)}catch(u){typeof console<"u"&&console.warn("[Persona] onMentionResolveError callback threw",u)}return this.opts.emit?.("resolve-error",{sourceId:p.source.id,itemId:p.item.id}),null}})),r=[],d=[],a={},l=new Set;for(let p=0;p<e.length;p++){let M=e[p],u=o[p];if(!u)continue;let A=ie(M.source.id,M.item.id);if(!l.has(A)){if(l.add(A),u.llmAppend&&u.llmAppend.trim())try{r.push(ne({label:M.ref.label,text:u.llmAppend,ref:M.ref,item:M.item},r.length,this.opts.mentionConfig.llmFormat))}catch(T){typeof console<"u"&&console.warn("[Persona] context-mention llmFormat threw",T)}u.contentParts?.length&&d.push(...u.contentParts),u.context&&((a[x=M.source.id]??(a[x]={}))[M.item.id]=u.context)}}return{blocks:r,contentParts:d,context:a}}}}updateRowVisibility(){this.opts.contextRow.style.display=this.mentions.length>0?"flex":"none"}};var oe=`
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
`;function q(s){let e=s.replace(/^\s+/,""),t=e.search(/\s/);return t===-1?{name:e,args:""}:{name:e.slice(0,t),args:e.slice(t+1).trim()}}var re=new Map,pe=(s,e,t)=>{let n=`${s}|${e}|${t}`,i=re.get(n);return i===void 0&&(i=N(s,e,"currentColor",t),re.set(n,i)),i?i.cloneNode(!0):null};function se(s){let{config:e,listboxId:t}=s,n=C("div",{className:"persona-mention-menu",attrs:{"data-persona-mention-menu":""}}),i=C("div",{className:"persona-mention-search",style:{display:"none"}}),o=S("span","persona-mention-search-icon"),r=N("search",15,"currentColor",2);r&&o.appendChild(r);let d=C("input",{className:"persona-mention-search-input",attrs:{type:"text",role:"combobox","aria-autocomplete":"list","aria-expanded":"false","aria-controls":t,"aria-label":e.searchPlaceholder??"Search context",placeholder:e.searchPlaceholder??"Search context\u2026",autocomplete:"off",autocapitalize:"off",spellcheck:"false"}});i.append(o,d),d.addEventListener("input",()=>s.onSearchInput?.(d.value)),d.addEventListener("keydown",c=>s.onSearchKeydown?.(c));let a=C("div",{className:"persona-mention-list",attrs:{role:"listbox",id:t,"aria-label":"Context mentions"}});n.append(i,a);let l=[],x=[],p=-1,M=new Map,u=(c,h)=>`${c}\0${h}`,A=c=>`${t}-opt-${c}`,T=c=>`${t}-grp-${c}`,V=(c,h)=>{let m=l[c];m&&(h?m.setAttribute("data-active","true"):m.removeAttribute("data-active"),m.setAttribute("aria-selected",h?"true":"false"),x[c]?.(h))},z=(c,h=!0)=>{p>=0&&p!==c&&V(p,!1),p=c;let m=l[c];m?(V(c,!0),h&&m.scrollIntoView?.({block:"nearest"}),a.setAttribute("aria-activedescendant",m.id),d.setAttribute("aria-activedescendant",m.id)):(a.removeAttribute("aria-activedescendant"),d.removeAttribute("aria-activedescendant"))},E=(c,h)=>{let m=T(h),v=C("div",{className:"persona-mention-group",attrs:{role:"group","aria-labelledby":m}});return v.appendChild(C("div",{className:"persona-mention-group-header",attrs:{id:m},text:c})),v},B=()=>{let c=C("div",{className:"persona-mention-option",attrs:{role:"option","aria-selected":"false"}}),h=S("span","persona-mention-option-icon");c.appendChild(h);let m="",v=S("span","persona-mention-option-text"),w=S("span","persona-mention-option-labelline"),I=S("span","persona-mention-option-label");w.appendChild(I),v.appendChild(w),c.appendChild(v);let y=null,b=null,f={el:c,index:0,update:(g,O,P)=>{f.index=O,c.id=A(O),c.setAttribute("aria-setsize",String(P)),c.setAttribute("aria-posinset",String(O+1)),c.removeAttribute("data-active"),c.setAttribute("aria-selected","false");let W=g.iconName??e.chipIconName??"at-sign";if(W!==m){m=W;let L=pe(W,15,2);h.replaceChildren(...L?[L]:[])}I.textContent!==g.label&&(I.textContent=g.label);let R=g.commandArgsPlaceholder?`\u2039${g.commandArgsPlaceholder}\u203A`:null;R?(y||(y=S("span","persona-mention-option-arghint"),w.appendChild(y)),y.textContent!==R&&(y.textContent=R)):y&&(y.remove(),y=null),g.description?(b||(b=S("span","persona-mention-option-desc"),v.appendChild(b)),b.textContent!==g.description&&(b.textContent=g.description)):b&&(b.remove(),b=null)}};return c.addEventListener("mousedown",g=>{g.button===0&&(g.preventDefault(),s.onSelectIndex(f.index))}),c.addEventListener("mouseenter",()=>s.onHoverIndex(f.index)),f},ae=(c,h,m,v,w)=>{let I=C("div",{className:"persona-mention-option",attrs:{role:"option",id:A(v),"aria-selected":"false","aria-setsize":String(w),"aria-posinset":String(v+1)}}),y=b=>{I.replaceChildren(e.renderMentionItem({item:c,source:h,query:m,active:b,index:v}))};return y(!1),I.addEventListener("mousedown",b=>{b.button===0&&(b.preventDefault(),s.onSelectIndex(v))}),I.addEventListener("mouseenter",()=>s.onHoverIndex(v)),{el:I,paint:y}},le=c=>{let h=C("div",{className:"persona-mention-status persona-mention-error"});if(h.appendChild(C("span",{className:"persona-mention-error-text",text:`Couldn't load ${c.label}`})),s.onRetry){let m=C("button",{className:"persona-mention-retry",attrs:{type:"button"},text:"Retry"});m.addEventListener("mousedown",v=>v.preventDefault()),m.addEventListener("click",v=>{v.preventDefault(),s.onRetry(c.id)}),h.appendChild(m)}return h};return{el:n,render:c=>{a.replaceChildren(),l=[],x=[],p=-1;let h=new Set,m=0,v=0,w=0,I=0,y=0,b=c.groups.reduce((f,g)=>g.status==="ready"?f+g.items.length:f,0);for(let f of c.groups)if(f.status==="loading"){w++;let g=E(f.source.label,y++);g.appendChild(C("div",{className:"persona-mention-status persona-mention-loading",attrs:{role:"presentation"},text:"Loading\u2026"})),a.appendChild(g)}else if(f.status==="error"){I++;let g=E(f.source.label,y++);g.appendChild(le(f.source)),a.appendChild(g)}else if(f.status==="ready"&&f.items.length>0){let g=new Map;for(let P of f.items){let W=P.group??f.source.label,R=g.get(W);R?R.push(P):g.set(W,[P])}let O=Array.from(g.entries());O.forEach(([P,W],R)=>{let L=E(P,y++);for(let K of W){let U=m++,$;if(e.renderMentionItem){let k=ae(K,f.source,c.query,U,b);$=k.el,x.push(k.paint)}else{let k=u(f.source.id,K.id),H=h.has(k)?void 0:M.get(k);H||(H=B(),h.has(k)||M.set(k,H)),h.add(k),H.update(K,U,b),$=H.el,x.push(null)}l.push($),L.appendChild($),v++}f.truncated&&R===O.length-1&&L.appendChild(C("div",{className:"persona-mention-hint",attrs:{role:"presentation"},text:"Keep typing to narrow\u2026"})),a.appendChild(L)})}for(let f of M.keys())h.has(f)||M.delete(f);v===0&&w===0&&I===0&&a.appendChild(C("div",{className:"persona-mention-empty",attrs:{role:"presentation"},text:"No matches"})),l.length>0?z(Math.min(Math.max(0,c.activeIndex),l.length-1)):(a.removeAttribute("aria-activedescendant"),d.removeAttribute("aria-activedescendant"))},setActiveIndex:z,destroy:()=>{a.replaceChildren(),l=[],M.clear(),n.remove()},showSearch:(c,h)=>{d.value=c,h&&(d.placeholder=h),i.style.display="",d.setAttribute("aria-expanded","true"),d.focus(),typeof requestAnimationFrame=="function"&&requestAnimationFrame(()=>{i.style.display!=="none"&&d.focus()})},hideSearch:()=>{i.style.display="none",d.value="",d.setAttribute("aria-expanded","false"),d.removeAttribute("aria-activedescendant")}}}var ue=s=>!!s&&(typeof s=="object"||typeof s=="function")&&typeof s.then=="function",he=0,F=class{constructor(e){this.popover=null;this.resizeObserver=null;this.isOpenState=!1;this.query="";this.triggerMatch=null;this.activeIndex=0;this.activeKey=null;this.pickerMode=!1;this.pickerTrigger=null;this.groups=[];this.flat=[];this.searchToken=0;this.searchAbort=null;this.debounceTimer=null;this.knownAsync=new Set;this.invokedForToken=new Set;this.lastAnnouncedCount=-1;this.triggerAnchorOffset=null;this.measuredTriggerIndex=null;this.opts=e;let t=e.mentionConfig,n=X(t),i=n.filter(r=>r.sources.length>0);this.channels=i.length>0?i:[n[0]],this.activeChannel=this.channels[0],this.maxPerGroup=t.maxItemsPerGroup??6,this.debounceMs=t.searchDebounceMs??150,this.listboxId=`persona-mention-listbox-${++he}`,this.menu=e.mentionConfig.renderMentionMenu?this.createHostMenu():se({config:e.mentionConfig,listboxId:this.listboxId,onSelectIndex:r=>this.selectIndex(r),onHoverIndex:r=>this.setActiveIndex(r,!1),onRetry:r=>this.retrySource(r),onSearchInput:r=>this.setQuery(r),onSearchKeydown:r=>{this.handleKeydown(r)}});let o=e.composerInput.element;o.setAttribute("aria-haspopup","listbox"),o.setAttribute("aria-controls",this.listboxId)}get input(){return this.opts.composerInput}createHostMenu(){let e=document.createElement("div");e.setAttribute("data-persona-mention-menu",""),e.setAttribute("role","listbox"),e.id=this.listboxId;let t=()=>{let n=this.opts.mentionConfig.renderMentionMenu({query:this.query,groups:this.groups.map(i=>({source:i.source,items:i.items})),status:Object.fromEntries(this.groups.map(i=>[i.source.id,i.status])),activeIndex:this.activeIndex,select:i=>{let o=this.groups.find(r=>r.items.includes(i));o&&this.commit(o.source,i)},close:()=>this.close()});e.replaceChildren(n)};return{el:e,render:t,setActiveIndex:t,destroy:()=>e.remove()}}isOpen(){return this.isOpenState}openFromButton(e){let t=e&&this.channels.find(r=>r.trigger===e)||this.channels[0],n=this.input.getSelection().start,i=_(this.input.getLogicalText(),n,[t]);if(i){this.pickerMode=!1,this.triggerMatch=i.match,this.isOpenState?(this.switchChannel(t),this.setQuery(i.match.query)):this.open(i.match.query,t),this.input.focus();return}let o=this.pickerTrigger;this.pickerMode=!0,this.pickerTrigger=t.trigger,this.triggerMatch=null,this.isOpenState?(o&&o!==t.trigger&&this.opts.onPickerOpenChange?.(!1,o,this.listboxId),this.switchChannel(t),this.setQuery("")):this.open("",t),this.menu.showSearch?this.menu.showSearch("",t.searchPlaceholder):this.input.focus(),this.opts.onPickerOpenChange?.(!0,t.trigger,this.listboxId)}onInput(){let e=this.input.getSelection().start,t=_(this.input.getLogicalText(),e,this.channels);if(!t){this.isOpenState&&this.close();return}if(this.isInlineArgTail(t.channel,t.match.query)){this.triggerMatch=null,this.isOpenState&&this.close(!1);return}this.triggerMatch=t.match,this.isOpenState?(this.switchChannel(t.channel),this.measuredTriggerIndex!==t.match.triggerIndex&&this.updateTriggerAnchor(),this.setQuery(t.match.query)):this.open(t.match.query,t.channel)}switchChannel(e){e!==this.activeChannel&&(this.activeChannel=e,this.groups=[],this.activeIndex=0)}open(e,t){if(this.isOpenState=!0,this.activeChannel=t,this.groups=[],this.activeIndex=0,this.lastAnnouncedCount=-1,!this.popover){let n=this.canAnchorMenu();if(this.popover=Z({anchor:this.opts.anchor,content:this.menu.el,placement:"top-start",matchAnchorWidth:!n,offset:6,container:this.opts.popoverContainer,horizontalOffset:n?()=>this.triggerAnchorOffset?.x??null:void 0,verticalOffset:n?()=>this.triggerAnchorOffset?.y??null:void 0,onDismiss:()=>this.close(!1)}),n){let i=this.opts.anchor.getBoundingClientRect().width;this.menu.el.style.minWidth=`${Math.min(220,i)}px`}}this.updateTriggerAnchor(),this.popover.open(),J(this.menu.el,"persona-mention-menu",oe),this.observeComposerResize(),this.opts.emit?.("opened",{trigger:t.trigger}),this.setQuery(e)}observeComposerResize(){typeof ResizeObserver>"u"||this.resizeObserver||(this.resizeObserver=new ResizeObserver(()=>{this.isOpenState&&(this.updateTriggerAnchor(),this.popover?.reposition())}),this.resizeObserver.observe(this.opts.anchor))}disconnectComposerResize(){this.resizeObserver?.disconnect(),this.resizeObserver=null}canAnchorMenu(){return this.isInlineDisplay()&&!!this.input.getLogicalRangeRect}updateTriggerAnchor(){let e=this.triggerMatch,t=this.input.getLogicalRangeRect;if(this.measuredTriggerIndex=e?.triggerIndex??null,this.triggerAnchorOffset=null,!e||!t)return;let n=t(e.triggerIndex,e.triggerIndex+1);if(!n)return;let i=this.opts.anchor.getBoundingClientRect(),o=n.top-i.top,r=this.input.element,d=typeof getComputedStyle=="function"&&getComputedStyle(r).direction==="rtl";this.triggerAnchorOffset={x:d?null:n.left-i.left,y:o}}close(e=!0){this.isOpenState&&(this.isOpenState=!1,this.disconnectComposerResize(),this.debounceTimer&&clearTimeout(this.debounceTimer),this.searchAbort?.abort(),this.searchToken++,this.popover?.close(),this.input.element.removeAttribute("aria-activedescendant"),this.pickerMode&&(this.pickerMode=!1,this.menu.hideSearch?.(),this.opts.onPickerOpenChange?.(!1,this.pickerTrigger??this.activeChannel.trigger,this.listboxId),this.pickerTrigger=null,e&&this.input.focus()))}setQuery(e){this.query=e,this.activeIndex=0,this.activeKey=null;let t=++this.searchToken;this.invokedForToken.clear(),this.searchAbort?.abort(),this.searchAbort=new AbortController;for(let n of this.activeChannel.sources)this.knownAsync.has(n.id)?this.setGroupStatus(n.id,"loading"):(this.invokedForToken.add(n.id),this.invokeSource(n,t));this.render(),this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout(()=>{if(t===this.searchToken)for(let n of this.activeChannel.sources)this.knownAsync.has(n.id)&&!this.invokedForToken.has(n.id)&&this.invokeSource(n,t)},this.debounceMs)}invokeSource(e,t){let n={messages:this.opts.getMessages(),config:this.opts.getConfig(),signal:this.searchAbort.signal},i;try{i=e.search(this.query,n)}catch{this.setGroupStatus(e.id,"error"),this.render();return}ue(i)?(this.knownAsync.add(e.id),this.setGroupStatus(e.id,"loading"),i.then(o=>{t===this.searchToken&&(this.setGroupItems(e.id,o),this.render())}).catch(()=>{t===this.searchToken&&(this.setGroupStatus(e.id,"error"),this.render())})):this.setGroupItems(e.id,i)}getOrCreateGroup(e){let t=this.groups.find(n=>n.source.id===e.id);if(!t){t={source:e,items:[],status:"loading",truncated:!1};let n=this.activeChannel.sources;this.groups.push(t),this.groups.sort((i,o)=>n.findIndex(r=>r.id===i.source.id)-n.findIndex(r=>r.id===o.source.id))}return t}setGroupStatus(e,t){let n=this.activeChannel.sources.find(i=>i.id===e);n&&(this.getOrCreateGroup(n).status=t)}setGroupItems(e,t){let n=this.activeChannel.sources.find(o=>o.id===e);if(!n)return;let i=this.getOrCreateGroup(n);i.truncated=t.length>this.maxPerGroup,i.items=t.slice(0,this.maxPerGroup),i.status=i.items.length===0?"empty":"ready"}keyOf(e){return JSON.stringify([e.source.id,e.item.id])}rebuildFlat(){this.flat=[];for(let e of this.groups)if(e.status==="ready")for(let t of e.items)this.flat.push({source:e.source,item:t});if(this.activeKey){let e=this.flat.findIndex(t=>this.keyOf(t)===this.activeKey);this.activeIndex=e>=0?e:Math.min(this.activeIndex,Math.max(0,this.flat.length-1))}else this.activeIndex>=this.flat.length&&(this.activeIndex=Math.max(0,this.flat.length-1))}viewModel(){return{query:this.query,groups:this.groups,activeIndex:this.activeIndex}}render(){this.rebuildFlat(),this.menu.render(this.viewModel()),this.syncActiveDescendant(),this.popover?.reposition();let e=this.groups.some(t=>t.status==="loading");this.flat.length===0&&e||this.flat.length!==this.lastAnnouncedCount&&(this.lastAnnouncedCount=this.flat.length,this.opts.announce(this.flat.length===0?"No matches":this.flat.length===1?"1 result":`${this.flat.length} results`),this.opts.emit?.("searched",{query:this.query,results:this.flat.length}))}setActiveIndex(e,t=!0){e<0||e>=this.flat.length||(this.activeIndex=e,this.activeKey=this.keyOf(this.flat[e]),this.menu.setActiveIndex(e,t),this.syncActiveDescendant())}syncActiveDescendant(){this.isOpenState&&!this.pickerMode&&this.activeIndex>=0&&this.activeIndex<this.flat.length?this.input.element.setAttribute("aria-activedescendant",`${this.listboxId}-opt-${this.activeIndex}`):this.input.element.removeAttribute("aria-activedescendant")}retrySource(e){let t=this.activeChannel.sources.find(n=>n.id===e);!t||!this.searchAbort||(this.setGroupStatus(e,"loading"),this.render(),this.invokeSource(t,this.searchToken),this.render())}handleKeydown(e){if(!this.isOpenState)return!1;switch(e.key){case"ArrowDown":return this.flat.length===0||(e.preventDefault(),this.setActiveIndex((this.activeIndex+1)%this.flat.length)),!0;case"ArrowUp":return this.flat.length===0||(e.preventDefault(),this.setActiveIndex((this.activeIndex-1+this.flat.length)%this.flat.length)),!0;case"Home":return this.flat.length===0||(e.preventDefault(),this.setActiveIndex(0)),!0;case"End":return this.flat.length===0||(e.preventDefault(),this.setActiveIndex(this.flat.length-1)),!0;case"Enter":case"Tab":return this.flat.length===0?(this.close(),!1):(e.preventDefault(),this.selectIndex(this.activeIndex),!0);case"Escape":return e.preventDefault(),this.close(),!0;case"Backspace":return this.query.length===0&&this.close(),!1;default:return!1}}selectIndex(e){let t=this.flat[e];t&&this.commit(t.source,t.item)}deriveArgs(e){return q(e).args}isInlineCommand(e){return e.command==="server"||e.commandArgsPlaceholder!=null}commit(e,t){let n=t.command;if(this.isInlineCommand(t)){this.completeCommandInline(e,t);return}if(n==="action"){let o=this.deriveArgs(this.query);this.stripQuery(),this.close(),this.runAction(t,o),this.opts.emit?.("command",{sourceId:e.id,itemId:t.id,kind:"action",args:o}),this.input.focus();return}if(n==="prompt"){let o=this.deriveArgs(this.query),r=this.captureStripTarget();this.close(),this.runPromptMacro(e,t,o,r),this.opts.emit?.("command",{sourceId:e.id,itemId:t.id,kind:"prompt",args:o});return}if(this.isInlineDisplay()){this.commitInlineMention(e,t);return}this.opts.onSelect(e,t,"")&&(this.stripQuery(),this.opts.emit?.("selected",{sourceId:e.id,itemId:t.id,label:t.label})),this.close(),this.input.focus()}isInlineDisplay(){return this.opts.mentionConfig.display==="inline"&&!!this.opts.onInsertMention&&!!this.input.insertMentionAtTrigger}commitInlineMention(e,t){if(this.opts.admitMention&&!this.opts.admitMention(e,t)){this.close(),this.input.focus();return}let n=G(e,t),i=this.triggerMatch?this.input.insertMentionAtTrigger(n,this.triggerMatch):this.input.insertMentionAtSelection?.(n)??null;i?(this.opts.onInsertMention(i,e,t,""),this.opts.emit?.("selected",{sourceId:e.id,itemId:t.id,label:t.label})):(this.opts.mentionConfig.onMentionRejected?.(t,"stale"),this.opts.emit?.("rejected",{sourceId:e.id,itemId:t.id,reason:"stale"})),this.triggerMatch=null,this.close(),this.input.focus()}completeCommandInline(e,t){let n=`${this.activeChannel.trigger}${t.label} `,i=this.input.getSelection().start,o=this.triggerMatch?this.triggerMatch.triggerIndex:i;if(this.input.replaceLogicalRange)this.input.replaceLogicalRange(o,i,n);else{let r=this.input.getValue();this.input.setValueWithCaret(r.slice(0,o)+n+r.slice(i),o+n.length)}this.triggerMatch=null,this.close(),this.opts.emit?.("command",{sourceId:e.id,itemId:t.id,kind:t.command??"prompt",phase:"armed"}),this.input.dispatchInput(),this.input.focus()}isInlineArgTail(e,t){let{name:n}=q(t);return!n||t.length<=n.length?!1:e.sources.some(i=>{let o=i.matchCommand?.(n);return!!o&&this.isInlineCommand(o)})}matchInlineCommand(e){for(let t of this.channels){if(!t.trigger)continue;let n=t.position==="anywhere"?[e]:t.position==="line-start"?e.split(`
`):[e.split(`
`)[0]];for(let i of n){if(!i.startsWith(t.trigger))continue;let{name:o,args:r}=q(i.slice(t.trigger.length));if(o)for(let d of t.sources){let a=d.matchCommand?.(o);if(a&&this.isInlineCommand(a))return{source:d,item:a,args:r}}}}return null}async dispatchInlineCommand(e){let t=this.matchInlineCommand(e);if(!t)return null;let{source:n,item:i,args:o}=t,r=i.command??"prompt";if(this.opts.emit?.("command",{sourceId:n.id,itemId:i.id,kind:r,args:o}),r==="action")return this.runAction(i,o),{kind:"action"};if(r==="prompt"){let a;try{a=await n.resolve(i,this.resolveContext(o,e))}catch(l){return typeof console<"u"&&console.warn("[Persona] inline prompt command resolve failed",l),null}return{kind:"prompt",sendText:a.insertText??a.llmAppend??e}}return{kind:"server",mentions:{refs:[],finalize:async()=>{let a=await n.resolve(i,this.resolveContext(o,e)),l={};return a.context&&(l[n.id]={[i.id]:a.context}),{blocks:[],contentParts:a.contentParts??[],context:l}}}}}resolveContext(e,t){return{messages:this.opts.getMessages(),config:this.opts.getConfig(),composerText:t,args:e,signal:new AbortController().signal}}runAction(e,t){if(e.action)try{Promise.resolve(e.action({args:t,config:this.opts.getConfig(),messages:this.opts.getMessages(),composer:this.input})).catch(n=>{typeof console<"u"&&console.warn("[Persona] context-mention command action failed",n)})}catch(n){typeof console<"u"&&console.warn("[Persona] context-mention command action failed",n)}}captureStripTarget(){return this.triggerMatch?{value:this.input.getValue(),start:this.triggerMatch.triggerIndex,end:this.input.getSelection().start}:null}async runPromptMacro(e,t,n,i){let o=this.input,r;try{r=await e.resolve(t,{messages:this.opts.getMessages(),config:this.opts.getConfig(),composerText:o.getValue(),args:n,signal:new AbortController().signal})}catch(a){typeof console<"u"&&console.warn("[Persona] context-mention prompt resolve failed",a);return}let d=r.insertText??r.llmAppend??"";t.insertMode==="insert-at-caret"&&i?o.replaceLogicalRange?(o.replaceLogicalRange(i.start,i.end,d),o.dispatchInput()):o.setValue(i.value.slice(0,i.start)+d+i.value.slice(i.end)):o.setValue(d),t.submitOnSelect&&o.submit()}stripQuery(){if(!this.triggerMatch)return;let e=this.input.getSelection().start;if(this.input.replaceLogicalRange)this.input.replaceLogicalRange(this.triggerMatch.triggerIndex,e,"");else{let t=Y(this.input.getValue(),this.triggerMatch,e);this.input.setValueWithCaret(t.value,t.caret)}this.input.dispatchInput(),this.triggerMatch=null}destroy(){this.disconnectComposerResize(),this.debounceTimer&&clearTimeout(this.debounceTimer),this.searchAbort?.abort(),this.popover?.destroy(),this.menu.destroy();let e=this.input.element;e.removeAttribute("aria-haspopup"),e.removeAttribute("aria-controls"),e.removeAttribute("aria-activedescendant")}};var ge={position:"absolute",width:"1px",height:"1px",margin:"-1px",padding:"0",overflow:"hidden",clip:"rect(0 0 0 0)",clipPath:"inset(50%)",whiteSpace:"nowrap",border:"0"};function j(s,e){let t=document.createElement("div");t.className="persona-sr-only",t.setAttribute("aria-live",s),t.setAttribute("aria-atomic","true"),t.setAttribute("role",s==="assertive"?"alert":"status"),t.setAttribute("data-persona-mention-live-region","");let n=e.getRootNode();typeof ShadowRoot<"u"&&n instanceof ShadowRoot?(Object.assign(t.style,ge),document.body.appendChild(t)):e.appendChild(t);let o;return{announce:r=>{o!==void 0&&clearTimeout(o),t.textContent="",o=setTimeout(()=>{o=void 0,t.textContent=r},0)},destroy:()=>{o!==void 0&&clearTimeout(o),t.remove()}}}function me(s){let e=s.composerInput??ee(s.textarea),t=j("polite",s.liveRegionHost),n=j("assertive",s.liveRegionHost),i=l=>t.announce(l),o=l=>n.announce(l),r=new D({mentionConfig:s.mentionConfig,contextRow:s.contextRow,getMessages:s.getMessages,getConfig:s.getConfig,getComposerText:()=>e.getValue(),announce:i,announceError:o,emit:s.emit}),d=()=>new F({mentionConfig:s.mentionConfig,composerInput:e,anchor:s.anchor,getMessages:s.getMessages,getConfig:s.getConfig,onSelect:(l,x,p)=>r.add(l,x,p),onInsertMention:(l,x,p,M)=>r.track(l,x,p,M,u=>e.setMentionStatus?.(l,u)),admitMention:(l,x)=>r.admit(l,x),announce:i,popoverContainer:s.popoverContainer,onPickerOpenChange:s.onPickerOpenChange,emit:s.emit}),a=d();return{openMenu:l=>a.openFromButton(l),isMenuOpen:()=>a.isOpen(),handleInput:()=>a.onInput(),handleKeydown:l=>a.handleKeydown(l),hasMentions:()=>r.hasMentions(),removeLastChip:()=>r.removeLast(),dispatchInlineCommand:l=>a.dispatchInlineCommand(l),collectForSubmit:()=>r.hasMentions()?r.collectForSubmit():null,untrackMention:l=>r.remove(l),rebindComposer:l=>{l!==e&&(a.destroy(),e=l,a=d())},clear:()=>r.clear(),destroy:()=>{a.destroy(),r.clear(),t.destroy(),n.destroy()}}}export{me as mountContextMentions};
