const e=[{name:`typewriter`,containerClass:`persona-stream-typewriter`,wrap:`char`,useCaret:!0},{name:`pop-bubble`,bubbleClass:`persona-stream-pop`,wrap:`none`},{name:`letter-rise`,containerClass:`persona-stream-letter-rise`,wrap:`char`},{name:`word-fade`,containerClass:`persona-stream-word-fade`,wrap:`word`}],t=/* @__PURE__ */ new Map;for(let n of e)t.set(n.name,n);const n=e=>{t.set(e.name,e)},r={name:`wipe`,containerClass:`persona-stream-wipe`,wrap:`word`,styles:`@keyframes persona-stream-wipe {
  from { -webkit-mask-position: 100% 0; mask-position: 100% 0; }
  to   { -webkit-mask-position: 0% 0;   mask-position: 0% 0;   }
}
[data-persona-root] .persona-stream-wipe .persona-stream-word {
  -webkit-mask-image: linear-gradient(
    90deg,
    black 0%,
    black 45%,
    transparent 55%,
    transparent 100%
  );
          mask-image: linear-gradient(
    90deg,
    black 0%,
    black 45%,
    transparent 55%,
    transparent 100%
  );
  -webkit-mask-size: 200% 100%;
          mask-size: 200% 100%;
  -webkit-mask-position: 100% 0;
          mask-position: 100% 0;
  -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
  animation: persona-stream-wipe calc(var(--persona-stream-step, 120ms) * 3)
    ease-out forwards;
}
@media (prefers-reduced-motion: reduce) {
  [data-persona-root] .persona-stream-wipe .persona-stream-word {
    animation: none !important;
    -webkit-mask-image: none !important;
            mask-image: none !important;
  }
}`};n(r);const i=`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@`,a=e=>{if(!e)return 120;let t=(e.style.getPropertyValue(`--persona-stream-step`)?.trim()).match(/([\d.]+)\s*ms/);return t?parseFloat(t[1]):120},o=e=>{let t=e.closest(`.persona-stream-glyph-cycle`);return 120*a(t)/120},s=e=>{let t=i[Math.floor(Math.random()*41)];return e&&t===e&&(t=i[(i.indexOf(t)+1)%41]),t},c=e=>{let t=e.closest(`.persona-stream-glyph-cycle`);if(!t)return;let n=t.querySelectorAll(`.persona-stream-char[data-glyph-cycle-final]`),r=!1;for(let t of Array.from(n))t===e?r=!0:r&&Math.random()<.4&&(t.textContent=s())},l=/* @__PURE__ */ new WeakMap,u=.5,d=/* @__PURE__ */ new WeakMap,f=/* @__PURE__ */ new WeakMap,p=(e,t)=>{if(!e)return 25*u;let n=d.get(e);d.set(e,t);let r=f.get(e)??25;if(n!==void 0){let i=t-n;i>1&&(r=r*.75+i*.25,f.set(e,r))}return Math.max(6,r*u)},m=/* @__PURE__ */ new Map,h=e=>e.closest(`[data-message-id]`)?.dataset.messageId??null,g=e=>{e&&m.set(e,(m.get(e)??0)+1)},_=e=>{if(!e)return;let t=m.get(e)??0;t<=1?m.delete(e):m.set(e,t-1)},v=e=>{if(e.dataset.glyphCycleScheduled===`true`)return;let t=e.textContent??``;if(!t||/\s/.test(t))return;e.dataset.glyphCycleScheduled=`true`,e.dataset.glyphCycleFinal=t,e.setAttribute(`data-preserve-runtime`,`stream-glyph-cycle`),e.textContent=s();let n=h(e);n&&(e.dataset.glyphCycleMessageId=n),g(n);let r=e.closest(`.persona-stream-glyph-cycle`),i=Date.now(),a=p(r,i),c=i+10*o(e);if(r){let e=l.get(r);e!==void 0&&(c=Math.max(c,e)),l.set(r,c+a)}y(e,t,c)},y=(e,t,n)=>{if(e.dataset.glyphCycleStarted===`true`)return;e.dataset.glyphCycleStarted=`true`;let r=o(e),i=e.textContent??void 0,a=()=>{if(!e.isConnected)return;if(Date.now()>=n){e.textContent=t,e.removeAttribute(`data-preserve-runtime`),delete e.dataset.glyphCycleStarted,delete e.dataset.glyphCycleFinal,_(e.dataset.glyphCycleMessageId??null),delete e.dataset.glyphCycleMessageId;return}let o=s(i);e.textContent=o,i=o,c(e),setTimeout(a,r)};setTimeout(a,r)},b=e=>{let t=e.querySelectorAll?.(`.persona-stream-glyph-cycle .persona-stream-char:not([data-glyph-cycle-scheduled])`);if(t)for(let e of Array.from(t))v(e)},x=e=>e.nodeType===1,S={name:`glyph-cycle`,containerClass:`persona-stream-glyph-cycle`,wrap:`char`,skipTags:[`a`,`script`,`style`],styles:`[data-persona-root] .persona-stream-glyph-cycle .persona-stream-char {
  animation: persona-stream-glyph-cycle-fade
    calc(var(--persona-stream-step, 120ms) * 1.5) ease-out both;
}
[data-persona-root] .persona-stream-glyph-cycle .persona-stream-char[data-glyph-cycle-final] {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
@keyframes persona-stream-glyph-cycle-fade {
  from { opacity: 0.35; }
  to   { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  [data-persona-root] .persona-stream-glyph-cycle .persona-stream-char {
    animation: none !important;
    opacity: 1 !important;
  }
}`,bufferContent(e){if(e.length<50)return``;let t=0,n=-1,r=0;for(;r<e.length;)e[r]===`*`&&e[r+1]===`*`?(t+=1,r+=2):(/\s/.test(e[r])&&t%2==0&&(n=r),r+=1);return n<0?``:e.slice(0,n)},isAnimating(e){return(m.get(e.id)??0)>0},onAttach(e){b(e);let t=new MutationObserver(e=>{for(let t of e)for(let e of Array.from(t.addedNodes))x(e)&&(e.classList.contains(`persona-stream-char`)&&e.closest(`.persona-stream-glyph-cycle`)?v(e):b(e))});return t.observe(e,{childList:!0,subtree:!0}),()=>t.disconnect()}};n(S);export{S as glyphCycle,r as wipe};