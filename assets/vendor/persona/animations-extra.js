var x=[{name:"typewriter",containerClass:"persona-stream-typewriter",wrap:"char",useCaret:!0},{name:"pop-bubble",bubbleClass:"persona-stream-pop",wrap:"none"},{name:"letter-rise",containerClass:"persona-stream-letter-rise",wrap:"char"},{name:"word-fade",containerClass:"persona-stream-word-fade",wrap:"word"}],g=new Map;for(let e of x)g.set(e.name,e);var m=e=>{g.set(e.name,e)};var v=`
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
`.trim(),f={name:"wipe",containerClass:"persona-stream-wipe",wrap:"word",styles:v};m(f);var L=f;var P=`
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
`.trim(),s="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@",H=10,W=120,p=120,N=.4,R=50,_=e=>{if(!e)return p;let r=(e.style.getPropertyValue("--persona-stream-step")?.trim()).match(/([\d.]+)\s*ms/);return r?parseFloat(r[1]):p},C=e=>{let t=e.closest(".persona-stream-glyph-cycle"),r=_(t);return W*r/p},d=e=>{let t=s[Math.floor(Math.random()*s.length)];return e&&t===e&&(t=s[(s.indexOf(t)+1)%s.length]),t},I=e=>{let t=e.closest(".persona-stream-glyph-cycle");if(!t)return;let r=t.querySelectorAll(".persona-stream-char[data-glyph-cycle-final]"),n=!1;for(let a of Array.from(r)){if(a===e){n=!0;continue}n&&Math.random()<N&&(a.textContent=d())}},y=new WeakMap,h=25,A=.5,D=6,S=.25,w=new WeakMap,T=new WeakMap,F=(e,t)=>{if(!e)return h*A;let r=w.get(e);w.set(e,t);let n=T.get(e)??h;if(r!==void 0){let a=t-r;a>1&&(n=n*(1-S)+a*S,T.set(e,n))}return Math.max(D,n*A)},o=new Map,B=e=>e.closest("[data-message-id]")?.dataset.messageId??null,O=e=>{e&&o.set(e,(o.get(e)??0)+1)},G=e=>{if(!e)return;let t=o.get(e)??0;t<=1?o.delete(e):o.set(e,t-1)},M=e=>{if(e.dataset.glyphCycleScheduled==="true")return;let t=e.textContent??"";if(!t||/\s/.test(t))return;e.dataset.glyphCycleScheduled="true",e.dataset.glyphCycleFinal=t,e.setAttribute("data-preserve-runtime","stream-glyph-cycle"),e.textContent=d();let r=B(e);r&&(e.dataset.glyphCycleMessageId=r),O(r);let n=e.closest(".persona-stream-glyph-cycle"),a=Date.now(),i=F(n,a),l=C(e),k=H*l,c=a+k;if(n){let u=y.get(n);u!==void 0&&(c=Math.max(c,u)),y.set(n,c+i)}U(e,t,c)},U=(e,t,r)=>{if(e.dataset.glyphCycleStarted==="true")return;e.dataset.glyphCycleStarted="true";let n=C(e),a=e.textContent??void 0,i=()=>{if(!e.isConnected)return;if(Date.now()>=r){e.textContent=t,e.removeAttribute("data-preserve-runtime"),delete e.dataset.glyphCycleStarted,delete e.dataset.glyphCycleFinal,G(e.dataset.glyphCycleMessageId??null),delete e.dataset.glyphCycleMessageId;return}let l=d(a);e.textContent=l,a=l,I(e),setTimeout(i,n)};setTimeout(i,n)},b=e=>{let t=e.querySelectorAll?.(".persona-stream-glyph-cycle .persona-stream-char:not([data-glyph-cycle-scheduled])");if(t)for(let r of Array.from(t))M(r)},$=e=>e.nodeType===1,E={name:"glyph-cycle",containerClass:"persona-stream-glyph-cycle",wrap:"char",skipTags:["a","script","style"],styles:P,bufferContent(e){if(e.length<R)return"";let t=0,r=-1,n=0;for(;n<e.length;){if(e[n]==="*"&&e[n+1]==="*"){t+=1,n+=2;continue}/\s/.test(e[n])&&t%2===0&&(r=n),n+=1}return r<0?"":e.slice(0,r)},isAnimating(e){return(o.get(e.id)??0)>0},onAttach(e){b(e);let t=new MutationObserver(r=>{for(let n of r)for(let a of Array.from(n.addedNodes))$(a)&&(a.classList.contains("persona-stream-char")&&a.closest(".persona-stream-glyph-cycle")?M(a):b(a))});return t.observe(e,{childList:!0,subtree:!0}),()=>t.disconnect()}};m(E);var Y=E;export{Y as glyphCycle,L as wipe};
