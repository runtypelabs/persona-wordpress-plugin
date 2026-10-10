import{a as X}from"./chunk-PDPVORUF.js";import{b as J,e as Z}from"./chunk-HGUCGM3K.js";import{a as ee,b as te}from"./chunk-Q735PSZL.js";import{a as $}from"./chunk-7NQ4ZTHF.js";import{a as S,c as M}from"./chunk-76IELU7F.js";import{a as j,c as Y}from"./chunk-IO5VVUKP.js";import{b as ne}from"./chunk-UPO4GUFC.js";import{X as pe}from"lucide";var ie=null,oe=s=>{ie=s},D=(s,e,t,n)=>ie?.(s,e,t,n)??null;function re(s){let{ref:e,config:t,onRemove:n}=s;if(t.renderMentionChip){let C="resolving",A,L=t.renderMentionChip({ref:e,status:C,payload:A,remove:n});return{get el(){return L},setStatus:(O,k)=>{if(O===C&&k===A)return;C=O,A=k;let z=t.renderMentionChip({ref:e,status:C,payload:A,remove:n});L.replaceWith(z),L=z}}}let i=e.iconName??t.chipIconName??"at-sign",o=M("div",{className:"persona-mention-chip",attrs:{"data-persona-mention-chip":"","data-status":"resolving",title:e.label}}),r=S("span","persona-mention-chip-icon"),d=C=>{r.replaceChildren();let A=D(C,13,"currentColor",2);A&&r.appendChild(A)};d(i);let a=S("span","persona-mention-chip-spinner"),l=M("span",{className:"persona-mention-chip-label",text:e.label}),u=M("button",{className:"persona-mention-chip-remove",attrs:{type:"button","aria-label":`Remove ${e.label} context`}}),f=$(pe,11,"currentColor",2.5);return f?u.appendChild(f):u.textContent="\xD7",u.addEventListener("click",C=>{C.preventDefault(),C.stopPropagation(),n()}),o.appendChild(a),o.appendChild(l),o.appendChild(u),{el:o,setStatus:C=>{o.setAttribute("data-status",C),C==="resolving"?(a.parentNode!==o&&o.insertBefore(a,l),r.parentNode===o&&r.remove(),o.setAttribute("title",e.label)):(a.parentNode===o&&a.remove(),r.parentNode!==o&&o.insertBefore(r,l),C==="error"?(d("triangle-alert"),o.setAttribute("title",`Couldn't add ${e.label} to context`)):(d(i),o.setAttribute("title",e.label)))}}}function F(s,e){return{sourceId:s.id,itemId:e.id,label:e.label,iconName:e.iconName,color:e.color}}var se=(s,e)=>`${s}\0${e}`,V=class{constructor(e){this.mentions=[];this.#e=e,this.#r()}#e;get#c(){return this.#e.mentionConfig.maxMentions??8}hasMentions(){return this.mentions.length>0}add(e,t,n=""){let i=se(e.id,t.id);if(this.mentions.some(d=>d.key===i))return this.#i(e,t,"duplicate");if(this.atLimit())return this.#i(e,t,"limit");let o=F(e,t),r={key:i,source:e,item:t,ref:o,status:"resolving",args:n};return r.chip=re({ref:o,config:this.#e.mentionConfig,onRemove:()=>this.remove(i)}),r.chip.el.setAttribute("data-persona-chip-enter",""),r.chip.el.addEventListener("animationend",()=>r.chip?.el.removeAttribute("data-persona-chip-enter"),{once:!0}),this.#e.contextRow.appendChild(r.chip.el),this.#h(r),this.#r(),!0}atLimit(){return this.mentions.length>=this.#c}admit(e,t){return this.atLimit()?this.#i(e,t,"limit"):!0}track(e,t,n,i="",o){let r={key:e,source:t,item:n,ref:F(t,n),status:"resolving",args:i,reportStatus:o};this.#h(r)}#i(e,t,n){return this.#e.mentionConfig.onMentionRejected?.(t,n),this.#e.emit?.("rejected",{sourceId:e.id,itemId:t.id,reason:n}),!1}#h(e){this.mentions.push(e),e.source.resolveOn==="submit"?(e.status="ready",e.chip?.setStatus("ready"),e.reportStatus?.("resolved")):e.resolvePromise=this.#s(e),this.#e.announce(`Added ${e.ref.label} to context`)}#C(e,t,n=this.#e.getComposerText()){return{messages:this.#e.getMessages(),config:this.#e.getConfig(),composerText:n,args:t,signal:e}}async#s(e){let t=new AbortController;e.abort=t;try{let n=await e.source.resolve(e.item,this.#C(t.signal,e.args));if(t.signal.aborted)return;e.payload=n,e.status="ready",e.chip?.setStatus("ready",n),e.reportStatus?.("resolved")}catch(n){if(t.signal.aborted)return;e.status="error",e.chip?.setStatus("error"),e.reportStatus?.("error"),(this.#e.announceError??this.#e.announce)(`Couldn't attach ${e.ref.label} to context`),this.#e.mentionConfig.onMentionResolveError?.(e.item,n),this.#e.emit?.("resolve-error",{sourceId:e.source.id,itemId:e.item.id})}}remove(e){let t=this.mentions.findIndex(i=>i.key===e);if(t===-1)return;let[n]=this.mentions.splice(t,1);n.abort?.abort(),n.chip?.el.remove(),this.#r(),this.#e.announce(`Removed ${n.ref.label} from context`)}getRefs(){return this.mentions.map(e=>e.ref)}removeLast(){let e=this.mentions[this.mentions.length-1];return e?(this.remove(e.key),!0):!1}clear(){for(let e of this.mentions)e.abort?.abort(),e.chip?.el.remove();this.mentions.length=0,this.#r()}collectForSubmit(){let e=[...this.mentions],t=e.map(o=>o.ref),n=this.#e.getComposerText();for(let o of e)o.chip?.el.remove();return this.mentions.length=0,this.#r(),{refs:t,finalize:async()=>{let o=await Promise.all(e.map(async u=>{try{return u.source.resolveOn==="submit"?await u.source.resolve(u.item,this.#C(new AbortController().signal,u.args,n)):(u.resolvePromise&&await u.resolvePromise,u.payload??null)}catch(f){try{this.#e.mentionConfig.onMentionResolveError?.(u.item,f)}catch(x){typeof console<"u"&&console.warn("[Persona] onMentionResolveError callback threw",x)}return this.#e.emit?.("resolve-error",{sourceId:u.source.id,itemId:u.item.id}),null}})),r=[],d=[],a={},l=new Set;for(let u=0;u<e.length;u++){let f=e[u],x=o[u];if(!x)continue;let C=se(f.source.id,f.item.id);if(!l.has(C)){if(l.add(C),x.llmAppend&&x.llmAppend.trim())try{r.push(Z({label:f.ref.label,text:x.llmAppend,ref:f.ref,item:f.item},r.length,this.#e.mentionConfig.llmFormat))}catch(A){typeof console<"u"&&console.warn("[Persona] context-mention llmFormat threw",A)}x.contentParts?.length&&d.push(...x.contentParts),x.context&&((a[f.source.id]??={})[f.item.id]=x.context)}}return{blocks:r,contentParts:d,context:a}}}}#r(){J(this.#e.contextRow)}};var ae=`
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
`;function _(s){let e=s.replace(/^\s+/,""),t=e.search(/\s/);return t===-1?{name:e,args:""}:{name:e.slice(0,t),args:e.slice(t+1).trim()}}import{Search as he}from"lucide";var le=new Map,me=(s,e,t)=>{let n=`${s}|${e}|${t}`,i=le.get(n);return i===void 0&&(i=D(s,e,"currentColor",t),le.set(n,i)),i?i.cloneNode(!0):null};function ce(s){let{config:e,listboxId:t}=s,n=M("div",{className:"persona-mention-menu",attrs:{"data-persona-mention-menu":""}}),i=M("div",{className:"persona-mention-search",style:{display:"none"}}),o=S("span","persona-mention-search-icon"),r=$(he,15,"currentColor",2);r&&o.appendChild(r);let d=M("input",{className:"persona-mention-search-input",attrs:{type:"text",role:"combobox","aria-autocomplete":"list","aria-expanded":"false","aria-controls":t,"aria-label":e.searchPlaceholder??"Search context",placeholder:e.searchPlaceholder??"Search context\u2026",autocomplete:"off",autocapitalize:"off",spellcheck:"false"}});i.append(o,d),d.addEventListener("input",()=>s.onSearchInput?.(d.value)),d.addEventListener("keydown",c=>s.onSearchKeydown?.(c));let a=M("div",{className:"persona-mention-list",attrs:{role:"listbox",id:t,"aria-label":"Context mentions"}});n.append(i,a);let l=[],u=[],f=-1,x=new Map,C=(c,p)=>`${c}\0${p}`,A=c=>`${t}-opt-${c}`,L=c=>`${t}-grp-${c}`,G=(c,p)=>{let m=l[c];m&&(p?m.setAttribute("data-active","true"):m.removeAttribute("data-active"),m.setAttribute("aria-selected",p?"true":"false"),u[c]?.(p))},O=(c,p=!0)=>{f>=0&&f!==c&&G(f,!1),f=c;let m=l[c];m?(G(c,!0),p&&m.scrollIntoView?.({block:"nearest"}),a.setAttribute("aria-activedescendant",m.id),d.setAttribute("aria-activedescendant",m.id)):(a.removeAttribute("aria-activedescendant"),d.removeAttribute("aria-activedescendant"))},k=(c,p)=>{let m=L(p),v=M("div",{className:"persona-mention-group",attrs:{role:"group","aria-labelledby":m}});return v.appendChild(M("div",{className:"persona-mention-group-header",attrs:{id:m},text:c})),v},z=()=>{let c=M("div",{className:"persona-mention-option",attrs:{role:"option","aria-selected":"false"}}),p=S("span","persona-mention-option-icon");c.appendChild(p);let m="",v=S("span","persona-mention-option-text"),w=S("span","persona-mention-option-labelline"),I=S("span","persona-mention-option-label");w.appendChild(I),v.appendChild(w),c.appendChild(v);let y=null,b=null,g={el:c,index:0,update:(h,T,P)=>{g.index=T,c.id=A(T),c.setAttribute("aria-setsize",String(P)),c.setAttribute("aria-posinset",String(T+1)),c.removeAttribute("data-active"),c.setAttribute("aria-selected","false");let R=h.iconName??e.chipIconName??"at-sign";if(R!==m){m=R;let N=me(R,15,2);p.replaceChildren(...N?[N]:[])}I.textContent!==h.label&&(I.textContent=h.label);let W=h.commandArgsPlaceholder?`\u2039${h.commandArgsPlaceholder}\u203A`:null;W?(y||(y=S("span","persona-mention-option-arghint"),w.appendChild(y)),y.textContent!==W&&(y.textContent=W)):y&&(y.remove(),y=null),h.description?(b||(b=S("span","persona-mention-option-desc"),v.appendChild(b)),b.textContent!==h.description&&(b.textContent=h.description)):b&&(b.remove(),b=null)}};return c.addEventListener("mousedown",h=>{h.button===0&&(h.preventDefault(),s.onSelectIndex(g.index))}),c.addEventListener("mouseenter",()=>s.onHoverIndex(g.index)),g},de=(c,p,m,v,w)=>{let I=M("div",{className:"persona-mention-option",attrs:{role:"option",id:A(v),"aria-selected":"false","aria-setsize":String(w),"aria-posinset":String(v+1)}}),y=b=>{I.replaceChildren(e.renderMentionItem({item:c,source:p,query:m,active:b,index:v}))};return y(!1),I.addEventListener("mousedown",b=>{b.button===0&&(b.preventDefault(),s.onSelectIndex(v))}),I.addEventListener("mouseenter",()=>s.onHoverIndex(v)),{el:I,paint:y}},ue=c=>{let p=M("div",{className:"persona-mention-status persona-mention-error"});if(p.appendChild(M("span",{className:"persona-mention-error-text",text:`Couldn't load ${c.label}`})),s.onRetry){let m=M("button",{className:"persona-mention-retry",attrs:{type:"button"},text:"Retry"});m.addEventListener("mousedown",v=>v.preventDefault()),m.addEventListener("click",v=>{v.preventDefault(),s.onRetry(c.id)}),p.appendChild(m)}return p};return{el:n,render:c=>{a.replaceChildren(),l=[],u=[],f=-1;let p=new Set,m=0,v=0,w=0,I=0,y=0,b=c.groups.reduce((g,h)=>h.status==="ready"?g+h.items.length:g,0);for(let g of c.groups)if(g.status==="loading"){w++;let h=k(g.source.label,y++);h.appendChild(M("div",{className:"persona-mention-status persona-mention-loading",attrs:{role:"presentation"},text:"Loading\u2026"})),a.appendChild(h)}else if(g.status==="error"){I++;let h=k(g.source.label,y++);h.appendChild(ue(g.source)),a.appendChild(h)}else if(g.status==="ready"&&g.items.length>0){let h=new Map;for(let P of g.items){let R=P.group??g.source.label,W=h.get(R);W?W.push(P):h.set(R,[P])}let T=Array.from(h.entries());T.forEach(([P,R],W)=>{let N=k(P,y++);for(let K of R){let Q=m++,B;if(e.renderMentionItem){let E=de(K,g.source,c.query,Q,b);B=E.el,u.push(E.paint)}else{let E=C(g.source.id,K.id),H=p.has(E)?void 0:x.get(E);H||(H=z(),p.has(E)||x.set(E,H)),p.add(E),H.update(K,Q,b),B=H.el,u.push(null)}l.push(B),N.appendChild(B),v++}g.truncated&&W===T.length-1&&N.appendChild(M("div",{className:"persona-mention-hint",attrs:{role:"presentation"},text:"Keep typing to narrow\u2026"})),a.appendChild(N)})}for(let g of x.keys())p.has(g)||x.delete(g);v===0&&w===0&&I===0&&a.appendChild(M("div",{className:"persona-mention-empty",attrs:{role:"presentation"},text:"No matches"})),l.length>0?O(Math.min(Math.max(0,c.activeIndex),l.length-1)):(a.removeAttribute("aria-activedescendant"),d.removeAttribute("aria-activedescendant"))},setActiveIndex:O,destroy:()=>{a.replaceChildren(),l=[],x.clear(),n.remove()},showSearch:(c,p)=>{d.value=c,p&&(d.placeholder=p),i.style.display="",d.setAttribute("aria-expanded","true"),d.focus(),typeof requestAnimationFrame=="function"&&requestAnimationFrame(()=>{i.style.display!=="none"&&d.focus()})},hideSearch:()=>{i.style.display="none",d.value="",d.setAttribute("aria-expanded","false"),d.removeAttribute("aria-activedescendant")}}}var ge=s=>!!s&&(typeof s=="object"||typeof s=="function")&&typeof s.then=="function",fe=0,q=class{#e;#c;#i;#h;#C;#s;#r;#u=null;#x=null;#a=!1;#d="";#n=null;#o=0;#A=null;#v=!1;#I=null;#l=[];#t=[];#m=0;#g=null;#p=null;#w=new Set;#R=new Set;#W=-1;#S=null;#L=null;constructor(e){this.#e=e;let t=e.mentionConfig,n=X(t),i=n.filter(r=>r.sources.length>0);this.#c=i.length>0?i:[n[0]],this.#i=this.#c[0],this.#h=t.maxItemsPerGroup??6,this.#C=t.searchDebounceMs??150,this.#r=`persona-mention-listbox-${++fe}`,this.#s=e.mentionConfig.renderMentionMenu?this.#j():ce({config:e.mentionConfig,listboxId:this.#r,onSelectIndex:r=>this.#D(r),onHoverIndex:r=>this.#y(r,!1),onRetry:r=>this.#J(r),onSearchInput:r=>this.#M(r),onSearchKeydown:r=>{this.handleKeydown(r)}});let o=e.composerInput.element;o.setAttribute("aria-haspopup","listbox"),o.setAttribute("aria-controls",this.#r)}get input(){return this.#e.composerInput}#j(){let e=document.createElement("div");e.setAttribute("data-persona-mention-menu",""),e.setAttribute("role","listbox"),e.id=this.#r;let t=()=>{let n=this.#e.mentionConfig.renderMentionMenu({query:this.#d,groups:this.#l.map(i=>({source:i.source,items:i.items})),status:Object.fromEntries(this.#l.map(i=>[i.source.id,i.status])),activeIndex:this.#o,select:i=>{let o=this.#l.find(r=>r.items.includes(i));o&&this.#V(o.source,i)},close:()=>this.close()});e.replaceChildren(n)};return{el:e,render:t,setActiveIndex:t,destroy:()=>e.remove()}}isOpen(){return this.#a}openFromButton(e){let t=e&&this.#c.find(r=>r.trigger===e)||this.#c[0],n=this.input.getSelection().start,i=j(this.input.getLogicalText(),n,[t]);if(i){this.#v=!1,this.#n=i.match,this.#a?(this.#E(t),this.#M(i.match.query)):this.#P(i.match.query,t),this.input.focus();return}let o=this.#I;this.#v=!0,this.#I=t.trigger,this.#n=null,this.#a?(o&&o!==t.trigger&&this.#e.onPickerOpenChange?.(!1,o,this.#r),this.#E(t),this.#M("")):this.#P("",t),this.#s.showSearch?this.#s.showSearch("",t.searchPlaceholder):this.input.focus(),this.#e.onPickerOpenChange?.(!0,t.trigger,this.#r)}onInput(){let e=this.input.getSelection().start,t=j(this.input.getLogicalText(),e,this.#c);if(!t){this.#a&&this.close();return}if(this.#te(t.channel,t.match.query)){this.#n=null,this.#a&&this.close(!1);return}this.#n=t.match,this.#a?(this.#E(t.channel),this.#L!==t.match.triggerIndex&&this.#k(),this.#M(t.match.query)):this.#P(t.match.query,t.channel)}#E(e){e!==this.#i&&(this.#i=e,this.#l=[],this.#o=0)}#P(e,t){if(this.#a=!0,this.#i=t,this.#l=[],this.#o=0,this.#W=-1,!this.#u){let n=this.#Q();if(this.#u=te({anchor:this.#e.anchor,content:this.#s.el,placement:"top-start",matchAnchorWidth:!n,offset:6,container:this.#e.popoverContainer,horizontalOffset:n?()=>this.#S?.x??null:void 0,verticalOffset:n?()=>this.#S?.y??null:void 0,onDismiss:()=>this.close(!1)}),n){let i=this.#e.anchor.getBoundingClientRect().width;this.#s.el.style.minWidth=`${Math.min(220,i)}px`}}this.#k(),this.#u.open(),ee(this.#s.el,"persona-mention-menu",ae),this.#U(),this.#e.emit?.("opened",{trigger:t.trigger}),this.#M(e)}#U(){typeof ResizeObserver>"u"||this.#x||(this.#x=new ResizeObserver(()=>{this.#a&&(this.#k(),this.#u?.reposition())}),this.#x.observe(this.#e.anchor))}#O(){this.#x?.disconnect(),this.#x=null}#Q(){return this.#_()&&!!this.input.getLogicalRangeRect}#k(){let e=this.#n,t=this.input.getLogicalRangeRect;if(this.#L=e?.triggerIndex??null,this.#S=null,!e||!t)return;let n=t(e.triggerIndex,e.triggerIndex+1);if(!n)return;let i=this.#e.anchor.getBoundingClientRect(),o=n.top-i.top,r=this.input.element,d=typeof getComputedStyle=="function"&&getComputedStyle(r).direction==="rtl";this.#S={x:d?null:n.left-i.left,y:o}}close(e=!0){this.#a&&(this.#a=!1,this.#O(),this.#p&&clearTimeout(this.#p),this.#g?.abort(),this.#m++,this.#u?.close(),this.input.element.removeAttribute("aria-activedescendant"),this.#v&&(this.#v=!1,this.#s.hideSearch?.(),this.#e.onPickerOpenChange?.(!1,this.#I??this.#i.trigger,this.#r),this.#I=null,e&&this.input.focus()))}#M(e){this.#d=e,this.#o=0,this.#A=null;let t=++this.#m;this.#R.clear(),this.#g?.abort(),this.#g=new AbortController;for(let n of this.#i.sources)this.#w.has(n.id)?this.#b(n.id,"loading"):(this.#R.add(n.id),this.#T(n,t));this.#f(),this.#p&&clearTimeout(this.#p),this.#p=setTimeout(()=>{if(t===this.#m)for(let n of this.#i.sources)this.#w.has(n.id)&&!this.#R.has(n.id)&&this.#T(n,t)},this.#C)}#T(e,t){let n={messages:this.#e.getMessages(),config:this.#e.getConfig(),signal:this.#g.signal},i;try{i=e.search(this.#d,n)}catch{this.#b(e.id,"error"),this.#f();return}ge(i)?(this.#w.add(e.id),this.#b(e.id,"loading"),i.then(o=>{t===this.#m&&(this.#z(e.id,o),this.#f())}).catch(()=>{t===this.#m&&(this.#b(e.id,"error"),this.#f())})):this.#z(e.id,i)}#H(e){let t=this.#l.find(n=>n.source.id===e.id);if(!t){t={source:e,items:[],status:"loading",truncated:!1};let n=this.#i.sources;this.#l.push(t),this.#l.sort((i,o)=>n.findIndex(r=>r.id===i.source.id)-n.findIndex(r=>r.id===o.source.id))}return t}#b(e,t){let n=this.#i.sources.find(i=>i.id===e);n&&(this.#H(n).status=t)}#z(e,t){let n=this.#i.sources.find(o=>o.id===e);if(!n)return;let i=this.#H(n);i.truncated=t.length>this.#h,i.items=t.slice(0,this.#h),i.status=i.items.length===0?"empty":"ready"}#B(e){return JSON.stringify([e.source.id,e.item.id])}#Y(){this.#t=[];for(let e of this.#l)if(e.status==="ready")for(let t of e.items)this.#t.push({source:e.source,item:t});if(this.#A){let e=this.#t.findIndex(t=>this.#B(t)===this.#A);this.#o=e>=0?e:Math.min(this.#o,Math.max(0,this.#t.length-1))}else this.#o>=this.#t.length&&(this.#o=Math.max(0,this.#t.length-1))}#X(){return{query:this.#d,groups:this.#l,activeIndex:this.#o}}#f(){this.#Y(),this.#s.render(this.#X()),this.#$(),this.#u?.reposition();let e=this.#l.some(t=>t.status==="loading");this.#t.length===0&&e||this.#t.length!==this.#W&&(this.#W=this.#t.length,this.#e.announce(this.#t.length===0?"No matches":this.#t.length===1?"1 result":`${this.#t.length} results`),this.#e.emit?.("searched",{query:this.#d,results:this.#t.length}))}#y(e,t=!0){e<0||e>=this.#t.length||(this.#o=e,this.#A=this.#B(this.#t[e]),this.#s.setActiveIndex(e,t),this.#$())}#$(){this.#a&&!this.#v&&this.#o>=0&&this.#o<this.#t.length?this.input.element.setAttribute("aria-activedescendant",`${this.#r}-opt-${this.#o}`):this.input.element.removeAttribute("aria-activedescendant")}#J(e){let t=this.#i.sources.find(n=>n.id===e);!t||!this.#g||(this.#b(e,"loading"),this.#f(),this.#T(t,this.#m),this.#f())}handleKeydown(e){if(!this.#a)return!1;switch(e.key){case"ArrowDown":return this.#t.length===0||(e.preventDefault(),this.#y((this.#o+1)%this.#t.length)),!0;case"ArrowUp":return this.#t.length===0||(e.preventDefault(),this.#y((this.#o-1+this.#t.length)%this.#t.length)),!0;case"Home":return this.#t.length===0||(e.preventDefault(),this.#y(0)),!0;case"End":return this.#t.length===0||(e.preventDefault(),this.#y(this.#t.length-1)),!0;case"Enter":case"Tab":return this.#t.length===0?(this.close(),!1):(e.preventDefault(),this.#D(this.#o),!0);case"Escape":return e.preventDefault(),this.close(),!0;case"Backspace":return this.#d.length===0&&this.close(),!1;default:return!1}}#D(e){let t=this.#t[e];t&&this.#V(t.source,t.item)}#F(e){return _(e).args}#N(e){return e.command==="server"||e.commandArgsPlaceholder!=null}#V(e,t){let n=t.command;if(this.#N(t)){this.#ee(e,t);return}if(n==="action"){let o=this.#F(this.#d);this.#K(),this.close(),this.#G(t,o),this.#e.emit?.("command",{sourceId:e.id,itemId:t.id,kind:"action",args:o}),this.input.focus();return}if(n==="prompt"){let o=this.#F(this.#d),r=this.#ie();this.close(),this.#oe(e,t,o,r),this.#e.emit?.("command",{sourceId:e.id,itemId:t.id,kind:"prompt",args:o});return}if(this.#_()){this.#Z(e,t);return}this.#e.onSelect(e,t,"")&&(this.#K(),this.#e.emit?.("selected",{sourceId:e.id,itemId:t.id,label:t.label})),this.close(),this.input.focus()}#_(){return this.#e.mentionConfig.display==="inline"&&!!this.#e.onInsertMention&&!!this.input.insertMentionAtTrigger}#Z(e,t){if(this.#e.admitMention&&!this.#e.admitMention(e,t)){this.close(),this.input.focus();return}let n=F(e,t),i=this.#n?this.input.insertMentionAtTrigger(n,this.#n):this.input.insertMentionAtSelection?.(n)??null;i?(this.#e.onInsertMention(i,e,t,""),this.#e.emit?.("selected",{sourceId:e.id,itemId:t.id,label:t.label})):(this.#e.mentionConfig.onMentionRejected?.(t,"stale"),this.#e.emit?.("rejected",{sourceId:e.id,itemId:t.id,reason:"stale"})),this.#n=null,this.close(),this.input.focus()}#ee(e,t){let n=`${this.#i.trigger}${t.label} `,i=this.input.getSelection().start,o=this.#n?this.#n.triggerIndex:i;if(this.input.replaceLogicalRange)this.input.replaceLogicalRange(o,i,n);else{let r=this.input.getValue();this.input.setValueWithCaret(r.slice(0,o)+n+r.slice(i),o+n.length)}this.#n=null,this.close(),this.#e.emit?.("command",{sourceId:e.id,itemId:t.id,kind:t.command??"prompt",phase:"armed"}),this.input.dispatchInput(),this.input.focus()}#te(e,t){let{name:n}=_(t);return!n||t.length<=n.length?!1:e.sources.some(i=>{let o=i.matchCommand?.(n);return!!o&&this.#N(o)})}#ne(e){for(let t of this.#c){if(!t.trigger)continue;let n=t.position==="anywhere"?[e]:t.position==="line-start"?e.split(`
`):[e.split(`
`)[0]];for(let i of n){if(!i.startsWith(t.trigger))continue;let{name:o,args:r}=_(i.slice(t.trigger.length));if(o)for(let d of t.sources){let a=d.matchCommand?.(o);if(a&&this.#N(a))return{source:d,item:a,args:r}}}}return null}async dispatchInlineCommand(e){let t=this.#ne(e);if(!t)return null;let{source:n,item:i,args:o}=t,r=i.command??"prompt";if(this.#e.emit?.("command",{sourceId:n.id,itemId:i.id,kind:r,args:o}),r==="action")return this.#G(i,o),{kind:"action"};if(r==="prompt"){let a;try{a=await n.resolve(i,this.#q(o,e))}catch(l){return typeof console<"u"&&console.warn("[Persona] inline prompt command resolve failed",l),null}return{kind:"prompt",sendText:a.insertText??a.llmAppend??e}}return{kind:"server",mentions:{refs:[],finalize:async()=>{let a=await n.resolve(i,this.#q(o,e)),l={};return a.context&&(l[n.id]={[i.id]:a.context}),{blocks:[],contentParts:a.contentParts??[],context:l}}}}}#q(e,t){return{messages:this.#e.getMessages(),config:this.#e.getConfig(),composerText:t,args:e,signal:new AbortController().signal}}#G(e,t){if(e.action)try{Promise.resolve(e.action({args:t,config:this.#e.getConfig(),messages:this.#e.getMessages(),composer:this.input})).catch(n=>{typeof console<"u"&&console.warn("[Persona] context-mention command action failed",n)})}catch(n){typeof console<"u"&&console.warn("[Persona] context-mention command action failed",n)}}#ie(){return this.#n?{value:this.input.getValue(),start:this.#n.triggerIndex,end:this.input.getSelection().start}:null}async#oe(e,t,n,i){let o=this.input,r;try{r=await e.resolve(t,{messages:this.#e.getMessages(),config:this.#e.getConfig(),composerText:o.getValue(),args:n,signal:new AbortController().signal})}catch(a){typeof console<"u"&&console.warn("[Persona] context-mention prompt resolve failed",a);return}let d=r.insertText??r.llmAppend??"";t.insertMode==="insert-at-caret"&&i?o.replaceLogicalRange?(o.replaceLogicalRange(i.start,i.end,d),o.dispatchInput()):o.setValue(i.value.slice(0,i.start)+d+i.value.slice(i.end)):o.setValue(d),t.submitOnSelect&&o.submit()}#K(){if(!this.#n)return;let e=this.input.getSelection().start;if(this.input.replaceLogicalRange)this.input.replaceLogicalRange(this.#n.triggerIndex,e,"");else{let t=Y(this.input.getValue(),this.#n,e);this.input.setValueWithCaret(t.value,t.caret)}this.input.dispatchInput(),this.#n=null}destroy(){this.#O(),this.#p&&clearTimeout(this.#p),this.#g?.abort(),this.#u?.destroy(),this.#s.destroy();let e=this.input.element;e.removeAttribute("aria-haspopup"),e.removeAttribute("aria-controls"),e.removeAttribute("aria-activedescendant")}};var Ce={position:"absolute",width:"1px",height:"1px",margin:"-1px",padding:"0",overflow:"hidden",clip:"rect(0 0 0 0)",clipPath:"inset(50%)",whiteSpace:"nowrap",border:"0"};function U(s,e){let t=document.createElement("div");t.className="persona-sr-only",t.setAttribute("aria-live",s),t.setAttribute("aria-atomic","true"),t.setAttribute("role",s==="assertive"?"alert":"status"),t.setAttribute("data-persona-mention-live-region","");let n=e.getRootNode();typeof ShadowRoot<"u"&&n instanceof ShadowRoot?(Object.assign(t.style,Ce),document.body.appendChild(t)):e.appendChild(t);let o;return{announce:r=>{o!==void 0&&clearTimeout(o),t.textContent="",o=setTimeout(()=>{o=void 0,t.textContent=r},0)},destroy:()=>{o!==void 0&&clearTimeout(o),t.remove()}}}function xe(s){let e=s.composerInput??ne(s.textarea),t=U("polite",s.liveRegionHost),n=U("assertive",s.liveRegionHost),i=l=>t.announce(l),o=l=>n.announce(l),r=new V({mentionConfig:s.mentionConfig,contextRow:s.contextRow,getMessages:s.getMessages,getConfig:s.getConfig,getComposerText:()=>e.getValue(),announce:i,announceError:o,emit:s.emit}),d=()=>new q({mentionConfig:s.mentionConfig,composerInput:e,anchor:s.anchor,getMessages:s.getMessages,getConfig:s.getConfig,onSelect:(l,u,f)=>r.add(l,u,f),onInsertMention:(l,u,f,x)=>r.track(l,u,f,x,C=>e.setMentionStatus?.(l,C)),admitMention:(l,u)=>r.admit(l,u),announce:i,popoverContainer:s.popoverContainer,onPickerOpenChange:s.onPickerOpenChange,emit:s.emit}),a=d();return{openMenu:l=>a.openFromButton(l),isMenuOpen:()=>a.isOpen(),handleInput:()=>a.onInput(),handleKeydown:l=>a.handleKeydown(l),hasMentions:()=>r.hasMentions(),getMentionRefs:()=>r.getRefs(),removeLastChip:()=>r.removeLast(),dispatchInlineCommand:l=>a.dispatchInlineCommand(l),collectForSubmit:()=>r.hasMentions()?r.collectForSubmit():null,untrackMention:l=>r.remove(l),rebindComposer:l=>{l!==e&&(a.destroy(),e=l,a=d())},clear:()=>r.clear(),destroy:()=>{a.destroy(),r.clear(),t.destroy(),n.destroy()}}}export{xe as mountContextMentions,oe as setMentionIconRenderer};
