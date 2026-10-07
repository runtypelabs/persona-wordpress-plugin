import{c as m}from"./chunk-CPVD5P5B.js";var T=`
@keyframes persona-stream-wipe {
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
}
`.trim(),y={name:"wipe",containerClass:"persona-stream-wipe",wrap:"word",styles:T};m(y);var L=y;var v=`
[data-persona-root] .persona-stream-glyph-cycle .persona-stream-char {
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
}
`.trim(),o="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@",H=10,x=120,p=120,R=.4,_=50,P=e=>{if(!e)return p;let r=(e.style.getPropertyValue("--persona-stream-step")?.trim()).match(/([\d.]+)\s*ms/);return r?parseFloat(r[1]):p},A=e=>{let t=e.closest(".persona-stream-glyph-cycle"),r=P(t);return x*r/p},u=e=>{let t=o[Math.floor(Math.random()*o.length)];return e&&t===e&&(t=o[(o.indexOf(t)+1)%o.length]),t},F=e=>{let t=e.closest(".persona-stream-glyph-cycle");if(!t)return;let r=t.querySelectorAll(".persona-stream-char[data-glyph-cycle-final]"),n=!1;for(let s of Array.from(r)){if(s===e){n=!0;continue}n&&Math.random()<R&&(s.textContent=u())}},g=new WeakMap,f=25,h=.5,D=6,M=.25,S=new WeakMap,b=new WeakMap,I=(e,t)=>{if(!e)return f*h;let r=S.get(e);S.set(e,t);let n=b.get(e)??f;if(r!==void 0){let s=t-r;s>1&&(n=n*(1-M)+s*M,b.set(e,n))}return Math.max(D,n*h)},a=new Map,G=e=>e.closest("[data-message-id]")?.dataset.messageId??null,O=e=>{e&&a.set(e,(a.get(e)??0)+1)},N=e=>{if(!e)return;let t=a.get(e)??0;t<=1?a.delete(e):a.set(e,t-1)},C=e=>{if(e.dataset.glyphCycleScheduled==="true")return;let t=e.textContent??"";if(!t||/\s/.test(t))return;e.dataset.glyphCycleScheduled="true",e.dataset.glyphCycleFinal=t,e.setAttribute("data-preserve-runtime","stream-glyph-cycle"),e.textContent=u();let r=G(e);r&&(e.dataset.glyphCycleMessageId=r),O(r);let n=e.closest(".persona-stream-glyph-cycle"),s=Date.now(),l=I(n,s),i=A(e),E=H*i,c=s+E;if(n){let d=g.get(n);d!==void 0&&(c=Math.max(c,d)),g.set(n,c+l)}B(e,t,c)},B=(e,t,r)=>{if(e.dataset.glyphCycleStarted==="true")return;e.dataset.glyphCycleStarted="true";let n=A(e),s=e.textContent??void 0,l=()=>{if(!e.isConnected)return;if(Date.now()>=r){e.textContent=t,e.removeAttribute("data-preserve-runtime"),delete e.dataset.glyphCycleStarted,delete e.dataset.glyphCycleFinal,N(e.dataset.glyphCycleMessageId??null),delete e.dataset.glyphCycleMessageId;return}let i=u(s);e.textContent=i,s=i,F(e),setTimeout(l,n)};setTimeout(l,n)},k=e=>{let t=e.querySelectorAll?.(".persona-stream-glyph-cycle .persona-stream-char:not([data-glyph-cycle-scheduled])");if(t)for(let r of Array.from(t))C(r)},U=e=>e.nodeType===1,w={name:"glyph-cycle",containerClass:"persona-stream-glyph-cycle",wrap:"char",skipTags:["a","script","style"],styles:v,bufferContent(e){if(e.length<_)return"";let t=0,r=-1,n=0;for(;n<e.length;){if(e[n]==="*"&&e[n+1]==="*"){t+=1,n+=2;continue}/\s/.test(e[n])&&t%2===0&&(r=n),n+=1}return r<0?"":e.slice(0,r)},isAnimating(e){return(a.get(e.id)??0)>0},onAttach(e){k(e);let t=new MutationObserver(r=>{for(let n of r)for(let s of Array.from(n.addedNodes))U(s)&&(s.classList.contains("persona-stream-char")&&s.closest(".persona-stream-glyph-cycle")?C(s):k(s))});return t.observe(e,{childList:!0,subtree:!0}),()=>t.disconnect()}};m(w);var Y=w;export{Y as glyphCycle,L as wipe};
