var e=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(e){throw n=[e],e}},t=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),n=/* @__PURE__ */ t((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Allow=e.ALL=e.COLLECTION=e.ATOM=e.SPECIAL=e.INF=e._INFINITY=e.INFINITY=e.NAN=e.BOOL=e.NULL=e.OBJ=e.ARR=e.NUM=e.STR=void 0,e.STR=1,e.NUM=2,e.ARR=4,e.OBJ=8,e.NULL=16,e.BOOL=32,e.NAN=64,e.INFINITY=128,e._INFINITY=256,e.INF=e.INFINITY|e._INFINITY,e.SPECIAL=e.NULL|e.BOOL|e.INF|e.NAN,e.ATOM=e.STR|e.NUM|e.SPECIAL,e.COLLECTION=e.ARR|e.OBJ,e.ALL=e.ATOM|e.COLLECTION,e.Allow={STR:e.STR,NUM:e.NUM,ARR:e.ARR,OBJ:e.OBJ,NULL:e.NULL,BOOL:e.BOOL,NAN:e.NAN,INFINITY:e.INFINITY,_INFINITY:e._INFINITY,INF:e.INF,SPECIAL:e.SPECIAL,ATOM:e.ATOM,COLLECTION:e.COLLECTION,ALL:e.ALL},e.default=e.Allow})),r=/* @__PURE__ */ t((e=>{var t=e&&e.__createBinding||(Object.create?(function(e,t,n,r){r===void 0&&(r=n);var i=Object.getOwnPropertyDescriptor(t,n);(!i||(`get`in i?!t.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,i)}):(function(e,t,n,r){r===void 0&&(r=n),e[r]=t[n]})),r=e&&e.__exportStar||function(e,n){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(n,r)&&t(n,e,r)};Object.defineProperty(e,"__esModule",{value:!0}),e.Allow=e.MalformedJSON=e.PartialJSON=e.parseJSON=e.parse=void 0;let i=n();Object.defineProperty(e,"Allow",{enumerable:!0,get:function(){return i.Allow}}),r(n(),e);var a=class extends Error{};e.PartialJSON=a;var o=class extends Error{};e.MalformedJSON=o;function s(e,t=i.Allow.ALL){if(typeof e!=`string`)throw TypeError(`expecting str, got ${typeof e}`);if(!e.trim())throw Error(`${e} is empty`);return c(e.trim(),t)}e.parseJSON=s;let c=(e,t)=>{let n=e.length,r=0,s=e=>{throw new a(`${e} at position ${r}`)},c=e=>{throw new o(`${e} at position ${r}`)},l=()=>(m(),r>=n&&s(`Unexpected end of input`),e[r]===`"`?u():e[r]===`{`?d():e[r]===`[`?f():e.substring(r,r+4)===`null`||i.Allow.NULL&t&&n-r<4&&`null`.startsWith(e.substring(r))?(r+=4,null):e.substring(r,r+4)===`true`||i.Allow.BOOL&t&&n-r<4&&`true`.startsWith(e.substring(r))?(r+=4,!0):e.substring(r,r+5)===`false`||i.Allow.BOOL&t&&n-r<5&&`false`.startsWith(e.substring(r))?(r+=5,!1):e.substring(r,r+8)===`Infinity`||i.Allow.INFINITY&t&&n-r<8&&`Infinity`.startsWith(e.substring(r))?(r+=8,1/0):e.substring(r,r+9)===`-Infinity`||i.Allow._INFINITY&t&&1<n-r&&n-r<9&&`-Infinity`.startsWith(e.substring(r))?(r+=9,-1/0):e.substring(r,r+3)===`NaN`||i.Allow.NAN&t&&n-r<3&&`NaN`.startsWith(e.substring(r))?(r+=3,NaN):p()),u=()=>{let a=r,o=!1;for(r++;r<n&&(e[r]!==`"`||o&&e[r-1]===`\\`);)o=e[r]===`\\`&&!o,r++;if(e.charAt(r)==`"`)try{return JSON.parse(e.substring(a,++r-Number(o)))}catch(e){c(String(e))}else if(i.Allow.STR&t)try{return JSON.parse(e.substring(a,r-Number(o))+`"`)}catch{return JSON.parse(e.substring(a,e.lastIndexOf(`\\`))+`"`)}s(`Unterminated string literal`)},d=()=>{r++,m();let a={};try{for(;e[r]!==`}`;){if(m(),r>=n&&i.Allow.OBJ&t)return a;let o=u();m(),r++;try{a[o]=l()}catch(e){if(i.Allow.OBJ&t)return a;throw e}m(),e[r]===`,`&&r++}}catch{if(i.Allow.OBJ&t)return a;s(`Expected '}' at end of object`)}return r++,a},f=()=>{r++;let n=[];try{for(;e[r]!==`]`;)n.push(l()),m(),e[r]===`,`&&r++}catch{if(i.Allow.ARR&t)return n;s(`Expected ']' at end of array`)}return r++,n},p=()=>{if(r===0){e===`-`&&c(`Not sure what '-' is`);try{return JSON.parse(e)}catch(n){if(i.Allow.NUM&t)try{return JSON.parse(e.substring(0,e.lastIndexOf(`e`)))}catch{}c(String(n))}}let a=r;for(e[r]===`-`&&r++;e[r]&&`,]}`.indexOf(e[r])===-1;)r++;r==n&&!(i.Allow.NUM&t)&&s(`Unterminated number literal`);try{return JSON.parse(e.substring(a,r))}catch{e.substring(a,r)===`-`&&s(`Not sure what '-' is`);try{return JSON.parse(e.substring(a,e.lastIndexOf(`e`)))}catch(e){c(String(e))}}},m=()=>{for(;r<n&&` 
\r	`.includes(e[r]);)r++};return l()};e.parse=s}));function i(e,t){if(!e)return t;if(!t)return e;let n={...e};for(let[e,r]of Object.entries(t)){let t=n[e];n[e]=a(t)&&a(r)?i(t,r):r}return n}var a,o=e((()=>{a=e=>typeof e==`object`&&!!e&&!Array.isArray(e)})),s,c,l,u=e((()=>{s=(e,t)=>{let n=document.createElement(e);return t&&(n.className=t),n},c=(e,t={},...n)=>{let r=document.createElement(e);if(t.className&&(r.className=t.className),t.text!==void 0&&(r.textContent=t.text),t.attrs)for(let[e,n]of Object.entries(t.attrs))r.setAttribute(e,n);if(t.style){let e=r.style,n=t.style;for(let t of Object.keys(n)){let r=n[t];r!=null&&(e[t]=r)}}let i=n.filter(e=>e!=null);return i.length>0&&r.append(...i),r},l=(...e)=>e.filter(Boolean).join(` `)})),d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,ee,te,ne,re,ie,F,ae,I,oe,L,R,z,B,V,se,H,U,W,G;e((()=>{d=r(),u(),f=`data-persona-ask-sheet-for`,p=`Other`,m=`Other…`,h=`Type your own answer here`,g=`Send`,_=`Next`,v=`Back`,y=`Submit all`,b=`Skip`,x=3,S=`data-ask-current-index`,C=`data-ask-answers`,w=`data-ask-grouped`,T=e=>e.getAttribute(`data-ask-layout`)===`pills`?`pills`:`rows`,E=!1,D=e=>e.replace(/["\\]/g,`\\$&`),O=e=>e?.features?.askUserQuestion??{},k=e=>{let t=e.toolCall;if(!t)return{payload:null,complete:!1};let n=t.status===`complete`;if(t.args&&typeof t.args==`object`)return{payload:t.args,complete:n};let r=t.chunks;if(!r||r.length===0)return{payload:null,complete:n};try{let e=r.join(``),t=(0,d.parse)(e,d.STR|d.OBJ|d.ARR);if(t&&typeof t==`object`)return{payload:t,complete:n}}catch{}return{payload:null,complete:n}},A=e=>{let t=Array.isArray(e?.questions)?e.questions:[];return t.length>8&&!E&&(E=!0,typeof console<`u`&&console.warn(`[AgentWidget] ask_user_question received ${t.length} questions; truncating to 8.`)),t.slice(0,8)},j=e=>A(e)[0]??null,M=(e,t)=>A(e)[t]??null,N=(e,t,n)=>{if(e!==`rows`)return null;let r=s(`span`,`persona-ask-row-affordance`);if(r.setAttribute(`aria-hidden`,`true`),t){let e=s(`span`,`persona-ask-row-check`);r.appendChild(e)}else{let e=s(`span`,`persona-ask-row-badge`);e.textContent=String(n+1),r.appendChild(e)}return r},P=(e,t,n,r)=>{let i=s(`button`,n===`rows`?`persona-ask-pill persona-ask-row persona-pointer-events-auto`:`persona-ask-pill persona-pointer-events-auto`);if(i.type=`button`,i.setAttribute(`role`,r?`checkbox`:`button`),i.setAttribute(`aria-pressed`,`false`),i.setAttribute(`data-ask-user-action`,`pick`),i.setAttribute(`data-option-index`,String(t)),i.setAttribute(`data-option-label`,e.label),n===`rows`){let a=s(`span`,`persona-ask-row-content`),o=s(`span`,`persona-ask-row-label`);if(o.textContent=e.label,a.appendChild(o),e.description){let t=s(`span`,`persona-ask-row-description`);t.textContent=e.description,a.appendChild(t)}i.appendChild(a);let c=N(n,r,t);c&&i.appendChild(c)}else i.textContent=e.label,e.description&&(i.title=e.description);return i},ee=e=>{let t=s(`span`,e===`rows`?`persona-ask-pill persona-ask-row persona-ask-pill-skeleton persona-pointer-events-none`:`persona-ask-pill persona-ask-pill-skeleton persona-pointer-events-none`);return t.setAttribute(`aria-hidden`,`true`),t},te=(e,t,n,r)=>{let i=s(`div`,r===`rows`?`persona-ask-pills persona-ask-pills--rows persona-flex persona-flex-col persona-gap-2`:`persona-ask-pills persona-flex persona-flex-wrap persona-gap-2`);i.setAttribute(`role`,`group`),i.setAttribute(`data-ask-pill-list`,`true`);let a=!!e?.multiSelect,o=(Array.isArray(e?.options)?e.options:[]).filter(e=>e&&typeof e.label==`string`&&e.label.length>0);if(o.length===0&&!n){for(let e=0;e<x;e++)i.appendChild(ee(r));return i}if(o.forEach((e,t)=>{i.appendChild(P(e,t,r,a))}),e?.allowFreeText!==!1){let e=r===`rows`?p:m;if(r===`rows`){let n=s(`div`,`persona-ask-pill persona-ask-row persona-ask-row--other persona-ask-pill-custom persona-pointer-events-auto`);n.setAttribute(`data-ask-user-action`,`focus-free-text`),n.setAttribute(`data-option-index`,String(o.length)),n.setAttribute(`data-ask-other-row`,`true`);let c=s(`span`,`persona-ask-row-content`),l=document.createElement(`input`);l.type=`text`,l.className=`persona-ask-row-input persona-flex-1 persona-pointer-events-auto`,l.placeholder=t.freeTextPlaceholder??h,l.setAttribute(`data-ask-free-text-input`,`true`),l.setAttribute(`aria-label`,t.freeTextLabel??e),c.appendChild(l),n.appendChild(c);let u=N(r,a,o.length);u&&n.appendChild(u),i.appendChild(n)}else{let n=s(`button`,`persona-ask-pill persona-ask-pill-custom persona-pointer-events-auto`);n.type=`button`,n.setAttribute(`data-ask-user-action`,`open-free-text`),n.textContent=t.freeTextLabel??e,i.appendChild(n)}}return i},ne=(e,t)=>{let n=s(`div`,t===`rows`?`persona-ask-free-text persona-ask-free-text--rows persona-flex persona-gap-2 persona-mt-2`:`persona-ask-free-text persona-hidden persona-flex persona-gap-2 persona-mt-2`);n.setAttribute(`data-ask-free-text-row`,`true`);let r=document.createElement(`input`);if(r.type=`text`,r.className=`persona-ask-free-text-input persona-flex-1 persona-pointer-events-auto`,r.placeholder=e.freeTextPlaceholder??h,r.setAttribute(`data-ask-free-text-input`,`true`),n.appendChild(r),t!==`rows`){let t=s(`button`,`persona-ask-free-text-submit persona-pointer-events-auto`);t.type=`button`,t.textContent=e.submitLabel??g,t.setAttribute(`data-ask-user-action`,`submit-free-text`),n.appendChild(t)}return n},re=e=>{let t=s(`div`,`persona-ask-multi-actions persona-flex persona-justify-end persona-mt-2`);t.setAttribute(`data-ask-multi-actions`,`true`);let n=s(`button`,`persona-ask-multi-submit persona-pointer-events-auto`);return n.type=`button`,n.textContent=e.submitLabel??g,n.setAttribute(`data-ask-user-action`,`submit-multi`),n.disabled=!0,t.appendChild(n),t},ie=(e,t,n)=>{let r=s(`div`,`persona-ask-nav persona-flex persona-justify-between persona-items-center persona-gap-2 persona-mt-2`);r.setAttribute(`data-ask-nav-row`,`true`);let i=s(`button`,`persona-ask-nav-back persona-pointer-events-auto`);i.type=`button`,i.textContent=n.backLabel??v,i.setAttribute(`data-ask-user-action`,`back`),i.disabled=e===0,r.appendChild(i);let a=s(`div`,`persona-ask-nav-right persona-flex persona-items-center persona-gap-2`),o=s(`button`,`persona-ask-nav-skip persona-pointer-events-auto`);o.type=`button`,o.textContent=n.skipLabel??b,o.setAttribute(`data-ask-user-action`,`skip`),a.appendChild(o);let c=s(`button`,`persona-ask-nav-next persona-pointer-events-auto`);c.type=`button`;let l=e===t-1;return c.textContent=l?n.submitAllLabel??y:n.nextLabel??_,c.setAttribute(`data-ask-user-action`,l?`submit-all`:`next`),c.disabled=!0,a.appendChild(c),r.appendChild(a),r},F=e=>{let t=e.getAttribute(C);if(!t)return{};try{let e=JSON.parse(t);return e&&typeof e==`object`?e:{}}catch{return{}}},ae=(e,t)=>{e.setAttribute(C,JSON.stringify(t))},I=e=>{let t=Number(e.getAttribute(`data-ask-current-index`)??`0`);return Number.isFinite(t)?Math.max(0,Math.floor(t)):0},oe=(e,t)=>{e.setAttribute(S,String(Math.max(0,Math.floor(t))))},L=e=>{let t=Number(e.getAttribute(`data-ask-question-count`)??`1`);return Number.isFinite(t)?Math.max(1,Math.floor(t)):1},R=e=>e.getAttribute(w)===`true`,z=(e,t)=>{let{payload:n}=k(t),r=A(n),i=F(e),a={},o=/* @__PURE__ */ new Set;return r.forEach((e,t)=>{let n=typeof e?.question==`string`?e.question:``;n&&(o.has(n)&&typeof console<`u`&&console.warn(`[AgentWidget] ask_user_question has duplicate question text "${n}"; later answer wins.`),o.add(n),Object.prototype.hasOwnProperty.call(i,t)&&(a[n]=i[t]))}),a},B=e=>{let t=F(e)[I(e)],n=/* @__PURE__ */ new Set;typeof t==`string`?n.add(t):Array.isArray(t)&&t.forEach(e=>n.add(e));let r=e.querySelectorAll(`[data-ask-user-action="pick"][data-option-label]`);r.forEach(e=>{let t=e.getAttribute(`data-option-label`)??``,r=n.has(t);e.setAttribute(`aria-pressed`,r?`true`:`false`),e.classList.toggle(`persona-ask-pill-selected`,r)});let i=new Set(Array.from(r).map(e=>e.getAttribute(`data-option-label`)??``)),a=e.querySelector(`[data-ask-free-text-input="true"]`);a&&(typeof t==`string`&&t.length>0&&!i.has(t)?(a.value=t,a.closest(`[data-ask-free-text-row="true"]`)?.classList.remove(`persona-hidden`)):a.value=``)},V=e=>{if(!R(e))return;let t=F(e)[I(e)],n=typeof t==`string`&&t.length>0||Array.isArray(t)&&t.length>0,r=e.querySelector(`[data-ask-user-action="next"], [data-ask-user-action="submit-all"]`);r&&(r.disabled=!n);let i=e.querySelector(`[data-ask-user-action="submit-multi"]`);i&&(i.disabled=Array.from(e.querySelectorAll(`[aria-pressed="true"][data-option-label]`)).length===0)},se=(e,t,n)=>{let r=O(n),i=T(e),{payload:a,complete:o}=k(t),s=R(e),c=I(e),l=L(e),u=s?M(a,c):j(a),d=!!u?.multiSelect,f=e.querySelector(`[data-ask-step-inline="true"]`);f&&(f.textContent=s?`${c+1}/${l}`:``);let p=e.querySelector(`[data-ask-stepper="true"]`);p&&p.remove();let m=e.querySelector(`[data-ask-question="true"]`);if(m){let e=typeof u?.question==`string`?u.question:``;m.textContent=e,m.classList.toggle(`persona-ask-question-skeleton`,!e&&!o)}let h=e.querySelector(`[data-ask-pill-list="true"]`);if(h){let e=te(u,r,o,i);h.replaceWith(e)}if(i!==`rows`){let t=e.querySelector(`[data-ask-free-text-row="true"]`);t&&t.replaceWith(ne(r,i))}let g=e.querySelector(`[data-ask-multi-actions="true"]`);!s&&d&&!g?e.appendChild(re(r)):(!d||s)&&g&&g.remove(),e.setAttribute(`data-multi-select`,d?`true`:`false`);let _=e.querySelector(`[data-ask-nav-row="true"]`);if(s){let t=ie(c,l,r);_?_.replaceWith(t):e.appendChild(t)}else _&&_.remove();B(e),V(e)},H=(e,t)=>{if(!e)return;let n=t?`[${f}="${D(t)}"]`:`[${f}]`;e.querySelectorAll(n).forEach(e=>{e.classList.add(`persona-ask-sheet-leave`);let t=Number.parseInt(getComputedStyle(e).getPropertyValue(`--persona-ask-sheet-duration`)||`180`,10);setTimeout(()=>e.remove(),Number.isFinite(t)?t:180)})},U=e=>Array.from(e.querySelectorAll(`[aria-pressed="true"][data-option-label]`)).map(e=>e.getAttribute(`data-option-label`)).filter(e=>typeof e==`string`&&e.length>0),W=(e,t)=>{let n=F(e),r=I(e);typeof t==`string`&&t.length===0||Array.isArray(t)&&t.length===0?delete n[r]:n[r]=t,ae(e,n),B(e),V(e)},G=(e,t,n,r)=>{let i=L(e),a=Math.max(0,Math.min(i-1,r));oe(e,a),se(e,t,n)}}))();const ce=e=>{let{mount:t,overlay:n,sessionRef:r}=e,i=(i,a,o)=>{let s=a.trim();if(!s||!r.current)return;let c=i.getAttribute(`data-tool-call-id`)??``,l=o.source===`free-text`;t.dispatchEvent(new CustomEvent(`persona:askUserQuestion:answered`,{detail:{instanceId:e.instanceId,toolUseId:c,answer:s,answers:o.structured,values:o.values??(o.source===`multi`?s.split(`, `):[s]),isFreeText:l,source:o.source},bubbles:!0,composed:!0})),H(n,c);let u=r.current.getMessages().find(e=>e.toolCall?.id===c);u?.agentMetadata?.awaitingLocalTool?r.current.resolveAskUserQuestion(u,o.structured??s):r.current.sendMessage(s)},a=e=>{let t=r.current;if(!t)return;let n=e.getAttribute(`data-tool-call-id`)??``,i=t.getMessages().find(e=>e.toolCall?.id===n);i&&t.persistAskUserQuestionProgress(i,{answers:z(e,i),currentIndex:I(e)})},o=e=>Object.entries(e).map(([e,t])=>`${e}: ${Array.isArray(t)?t.join(`, `):t}`).join(` | `),s=t=>{if(e.config().features?.askUserQuestion?.groupedAutoAdvance===!1)return;let n=I(t);if(n>=L(t)-1)return;let i=r.current?.getMessages().find(e=>e.toolCall?.id===t.getAttribute(`data-tool-call-id`));i&&(G(t,i,e.config(),n+1),a(t))};return{click:c=>{let l=c.target.closest(`[data-ask-user-action]`);if(!l)return;let u=l.closest(`[data-persona-ask-sheet-for]`);if(!u)return;let d=l.getAttribute(`data-ask-user-action`);if(c.preventDefault(),c.stopPropagation(),d===`dismiss`){let i=u.getAttribute(`data-tool-call-id`)??``;t.dispatchEvent(new CustomEvent(`persona:askUserQuestion:dismissed`,{detail:{instanceId:e.instanceId,toolUseId:i},bubbles:!0,composed:!0})),H(n,i);let a=r.current?.getMessages().find(e=>e.toolCall?.id===i);a?.agentMetadata?.awaitingLocalTool&&(r.current?.markAskUserQuestionResolved(a),r.current?.resolveAskUserQuestion(a,`(dismissed)`))}else if(d===`pick`){let e=l.getAttribute(`data-option-label`);if(!e)return;let t=u.getAttribute(`data-multi-select`)===`true`,n=R(u);if(n&&t){let t=F(u)[I(u)],n=new Set(Array.isArray(t)?t:[]);n.has(e)?n.delete(e):n.add(e),W(u,Array.from(n)),a(u);return}if(n){W(u,e),a(u),s(u);return}if(t){let e=l.getAttribute(`aria-pressed`)===`true`;l.setAttribute(`aria-pressed`,e?`false`:`true`),l.classList.toggle(`persona-ask-pill-selected`,!e);let t=u.querySelector(`[data-ask-user-action="submit-multi"]`);t&&(t.disabled=U(u).length===0);return}i(u,e,{source:`pick`,values:[e]})}else if(d===`submit-multi`){let e=U(u);if(e.length===0)return;i(u,e.join(`, `),{source:`multi`,values:e})}else if(d===`open-free-text`){let e=u.querySelector(`[data-ask-free-text-row="true"]`);e&&(e.classList.remove(`persona-hidden`),e.querySelector(`[data-ask-free-text-input="true"]`)?.focus())}else if(d===`focus-free-text`)u.querySelector(`[data-ask-free-text-input="true"]`)?.focus();else if(d===`submit-free-text`){let e=u.querySelector(`[data-ask-free-text-input="true"]`)?.value??``;if(!e.trim())return;if(R(u)){W(u,e.trim()),a(u),s(u);return}i(u,e,{source:`free-text`})}else if(d===`next`||d===`back`){if(!r.current)return;let t=u.getAttribute(`data-tool-call-id`)??``,n=r.current.getMessages().find(e=>e.toolCall?.id===t);if(!n)return;let i=u.querySelector(`[data-ask-free-text-input="true"]`)?.value?.trim()??``;if(i){let e=F(u)[I(u)];(typeof e!=`string`||e!==i)&&W(u,i)}let o=d===`next`?1:-1,s=I(u)+o;G(u,n,e.config(),s),a(u)}else if(d===`submit-all`){if(!r.current)return;let e=u.getAttribute(`data-tool-call-id`)??``,t=r.current.getMessages().find(t=>t.toolCall?.id===e);if(!t)return;let n=u.querySelector(`[data-ask-free-text-input="true"]`)?.value?.trim()??``;n&&W(u,n);let a=z(u,t);r.current.persistAskUserQuestionProgress(t,{answers:a,currentIndex:I(u)});let s=o(a);i(u,s||`(submitted)`,{source:`submit-all`,structured:a})}else if(d===`skip`){if(!r.current)return;let s=u.getAttribute(`data-tool-call-id`)??``,c=r.current.getMessages().find(e=>e.toolCall?.id===s);if(!c)return;let l=R(u),d=I(u),f=d>=L(u)-1;if(!l){t.dispatchEvent(new CustomEvent(`persona:askUserQuestion:dismissed`,{detail:{instanceId:e.instanceId,toolUseId:s},bubbles:!0,composed:!0})),H(n,s),c.agentMetadata?.awaitingLocalTool&&(r.current.markAskUserQuestionResolved(c),r.current.resolveAskUserQuestion(c,`(dismissed)`));return}W(u,``);let p=u.querySelector(`[data-ask-free-text-input="true"]`);if(p&&(p.value=``),f){let e=z(u,c),t=o(e);i(u,t||`(skipped)`,{source:`submit-all`,structured:e});return}G(u,c,e.config(),d+1),a(u)}},keydown:e=>{if(e.key!==`Enter`)return;let t=e.target;if(!t.matches?.(`[data-ask-free-text-input="true"]`))return;let n=t.closest(`[data-persona-ask-sheet-for]`);if(!n)return;e.preventDefault();let r=t.value;r.trim()&&(R(n)?(W(n,r.trim()),a(n),s(n)):i(n,r,{source:`free-text`}))}}},le=/\s/;function ue(e,t,n){if(n===`input-start`)return t===0;let r=t>0?e[t-1]:``;return n===`line-start`?r===``||r===`
`:r===``||le.test(r)}function de(e,t,n=`@`,r=`anywhere`,i=!1){if(!n||t<=0||t>e.length)return null;let a=t-1;for(;a>=0;){let o=e[a];if(o===n)return ue(e,a,r)?{triggerIndex:a,query:e.slice(a+1,t)}:null;if(o===`
`||o===`￼`||!i&&le.test(o))return null;a--}return null}function fe(e,t,n){for(let r of n){let n=de(e,t,r.trigger,r.position??`anywhere`,r.allowSpaces??!1);if(n)return{channel:r,match:n}}return null}function pe(e){return!e||e!==`insertFromPaste`&&e!==`insertFromDrop`}function me(e){return[{trigger:e.trigger??`@`,position:e.triggerPosition??`anywhere`,allowSpaces:!1,sources:Array.isArray(e.sources)?e.sources:[],searchPlaceholder:e.searchPlaceholder,showButton:e.showButton!==!1,buttonIconName:e.buttonIconName,buttonTooltipText:e.buttonTooltipText},...(e.triggers??[]).map(e=>({trigger:e.trigger,position:e.triggerPosition??`anywhere`,allowSpaces:e.allowSpaces??!1,sources:Array.isArray(e.sources)?e.sources:[],searchPlaceholder:e.searchPlaceholder,showButton:e.showButton===!0,buttonIconName:e.buttonIconName,buttonTooltipText:e.buttonTooltipText}))]}const K=(e,t=24,n=`currentColor`,r=2)=>{if(!Array.isArray(e))return null;let i=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);for(let[e,a]of Object.entries({width:String(t),height:String(t),viewBox:`0 0 24 24`,fill:`none`,stroke:n,"stroke-width":String(r),"stroke-linecap":`round`,"stroke-linejoin":`round`,"aria-hidden":`true`}))i.setAttribute(e,a);for(let t of e){if(!Array.isArray(t)||t.length<2)continue;let e=t[0],n=t[1];if(!n)continue;let r=document.createElementNS(`http://www.w3.org/2000/svg`,e);for(let[e,t]of Object.entries(n))e!==`stroke`&&r.setAttribute(e,String(t));i.appendChild(r)}return i},q=e=>{let{fallbackImport:t,resetOnSetLoader:n=!1}=e,r=null,i=null,a=null;return{setLoader:e=>{r=e,n&&(i=null,a=null)},load:()=>{if(i)return Promise.resolve(i);if(a)return a;let e=r??t;try{return a=e().then(e=>(i=e,e)).catch(e=>{throw a=null,e}),a}catch(e){return Promise.reject(e)}},provide:e=>{i=e},getSync:()=>i}},{setLoader:he,load:ge}=q({fallbackImport:()=>import(`@runtypelabs/persona/icons-extra`)}),_e=ge,ve={activity:[[`path`,{d:`M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2`}]],"arrow-down":[[`path`,{d:`M12 5v14`}],[`path`,{d:`m19 12-7 7-7-7`}]],"arrow-up":[[`path`,{d:`m5 12 7-7 7 7`}],[`path`,{d:`M12 19V5`}]],"arrow-up-right":[[`path`,{d:`M7 7h10v10`}],[`path`,{d:`M7 17 17 7`}]],bot:[[`path`,{d:`M12 8V4H8`}],[`rect`,{width:`16`,height:`12`,x:`4`,y:`8`,rx:`2`}],[`path`,{d:`M2 14h2`}],[`path`,{d:`M20 14h2`}],[`path`,{d:`M15 13v2`}],[`path`,{d:`M9 13v2`}]],"chevron-down":[[`path`,{d:`m6 9 6 6 6-6`}]],"chevron-up":[[`path`,{d:`m18 15-6-6-6 6`}]],"chevron-right":[[`path`,{d:`m9 18 6-6-6-6`}]],"chevron-left":[[`path`,{d:`m15 18-6-6 6-6`}]],check:[[`path`,{d:`M20 6 9 17l-5-5`}]],clipboard:[[`rect`,{width:`8`,height:`4`,x:`8`,y:`2`,rx:`1`,ry:`1`}],[`path`,{d:`M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`}]],"clipboard-copy":[[`rect`,{width:`8`,height:`4`,x:`8`,y:`2`,rx:`1`,ry:`1`}],[`path`,{d:`M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2`}],[`path`,{d:`M16 4h2a2 2 0 0 1 2 2v4`}],[`path`,{d:`M21 14H11`}],[`path`,{d:`m15 10-4 4 4 4`}]],"code-xml":[[`path`,{d:`m18 16 4-4-4-4`}],[`path`,{d:`m6 8-4 4 4 4`}],[`path`,{d:`m14.5 4-5 16`}]],copy:[[`rect`,{width:`14`,height:`14`,x:`8`,y:`8`,rx:`2`,ry:`2`}],[`path`,{d:`M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`}]],file:[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`}]],"file-code":[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`}],[`path`,{d:`M10 12.5 8 15l2 2.5`}],[`path`,{d:`m14 12.5 2 2.5-2 2.5`}]],"file-spreadsheet":[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`}],[`path`,{d:`M8 13h2`}],[`path`,{d:`M14 13h2`}],[`path`,{d:`M8 17h2`}],[`path`,{d:`M14 17h2`}]],"file-text":[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`}],[`path`,{d:`M10 9H8`}],[`path`,{d:`M16 13H8`}],[`path`,{d:`M16 17H8`}]],"image-plus":[[`path`,{d:`M16 5h6`}],[`path`,{d:`M19 2v6`}],[`path`,{d:`M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5`}],[`path`,{d:`m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21`}],[`circle`,{cx:`9`,cy:`9`,r:`2`}]],loader:[[`path`,{d:`M12 2v4`}],[`path`,{d:`m16.2 7.8 2.9-2.9`}],[`path`,{d:`M18 12h4`}],[`path`,{d:`m16.2 16.2 2.9 2.9`}],[`path`,{d:`M12 18v4`}],[`path`,{d:`m4.9 19.1 2.9-2.9`}],[`path`,{d:`M2 12h4`}],[`path`,{d:`m4.9 4.9 2.9 2.9`}]],"loader-circle":[[`path`,{d:`M21 12a9 9 0 1 1-6.219-8.56`}]],mic:[[`path`,{d:`M12 19v3`}],[`path`,{d:`M19 10v2a7 7 0 0 1-14 0v-2`}],[`rect`,{x:`9`,y:`2`,width:`6`,height:`13`,rx:`3`}]],paperclip:[[`path`,{d:`m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551`}]],quote:[[`path`,{d:`M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z`}],[`path`,{d:`M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z`}]],"refresh-cw":[[`path`,{d:`M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8`}],[`path`,{d:`M21 3v5h-5`}],[`path`,{d:`M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16`}],[`path`,{d:`M8 16H3v5`}]],search:[[`path`,{d:`m21 21-4.34-4.34`}],[`circle`,{cx:`11`,cy:`11`,r:`8`}]],send:[[`path`,{d:`M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z`}],[`path`,{d:`m21.854 2.147-10.94 10.939`}]],"shield-alert":[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`}],[`path`,{d:`M12 8v4`}],[`path`,{d:`M12 16h.01`}]],"shield-check":[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`}],[`path`,{d:`m9 12 2 2 4-4`}]],"shield-x":[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`}],[`path`,{d:`m14.5 9.5-5 5`}],[`path`,{d:`m9.5 9.5 5 5`}]],square:[[`rect`,{width:`18`,height:`18`,x:`3`,y:`3`,rx:`2`}]],"square-text":[[`rect`,{width:`18`,height:`18`,x:`3`,y:`3`,rx:`2`}],[`path`,{d:`M7 8h10M7 12h10M7 16h6`}]],"thumbs-down":[[`path`,{d:`M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z`}],[`path`,{d:`M17 14V2`}]],"thumbs-up":[[`path`,{d:`M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z`}],[`path`,{d:`M7 10v12`}]],upload:[[`path`,{d:`M12 3v12`}],[`path`,{d:`m17 8-5-5-5 5`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`}]],"volume-2":[[`path`,{d:`M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z`}],[`path`,{d:`M16 9a5 5 0 0 1 0 6`}],[`path`,{d:`M19.364 18.364a9 9 0 0 0 0-12.728`}]],"voice-bars":[[`path`,{d:`M4 10v4`}],[`path`,{d:`M8 6v12`}],[`path`,{d:`M12 3v18`}],[`path`,{d:`M16 7v10`}],[`path`,{d:`M20 10v4`}]],x:[[`path`,{d:`M18 6 6 18`}],[`path`,{d:`m6 6 12 12`}]],"at-sign":[[`circle`,{cx:`12`,cy:`12`,r:`4`}],[`path`,{d:`M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8`}]],"arrow-left":[[`path`,{d:`m12 19-7-7 7-7`}],[`path`,{d:`M19 12H5`}]],"arrow-right":[[`path`,{d:`M5 12h14`}],[`path`,{d:`m12 5 7 7-7 7`}]],"external-link":[[`path`,{d:`M15 3h6v6`}],[`path`,{d:`M10 14 21 3`}],[`path`,{d:`M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6`}]],ellipsis:[[`circle`,{cx:`12`,cy:`12`,r:`1`}],[`circle`,{cx:`19`,cy:`12`,r:`1`}],[`circle`,{cx:`5`,cy:`12`,r:`1`}]],menu:[[`path`,{d:`M4 5h16`}],[`path`,{d:`M4 12h16`}],[`path`,{d:`M4 19h16`}]],"panel-left":[[`rect`,{width:`18`,height:`18`,x:`3`,y:`3`,rx:`2`}],[`path`,{d:`M9 3v18`}]],plus:[[`path`,{d:`M5 12h14`}],[`path`,{d:`M12 5v14`}]],minus:[[`path`,{d:`M5 12h14`}]],pencil:[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`}],[`path`,{d:`m15 5 4 4`}]],trash:[[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`}],[`path`,{d:`M3 6h18`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`}]],"trash-2":[[`path`,{d:`M10 11v6`}],[`path`,{d:`M14 11v6`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`}],[`path`,{d:`M3 6h18`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`}]],download:[[`path`,{d:`M12 15V3`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`}],[`path`,{d:`m7 10 5 5 5-5`}]],maximize:[[`path`,{d:`M8 3H5a2 2 0 0 0-2 2v3`}],[`path`,{d:`M21 8V5a2 2 0 0 0-2-2h-3`}],[`path`,{d:`M3 16v3a2 2 0 0 0 2 2h3`}],[`path`,{d:`M16 21h3a2 2 0 0 0 2-2v-3`}]],minimize:[[`path`,{d:`M8 3v3a2 2 0 0 1-2 2H3`}],[`path`,{d:`M21 8h-3a2 2 0 0 1-2-2V3`}],[`path`,{d:`M3 16h3a2 2 0 0 1 2 2v3`}],[`path`,{d:`M16 21v-3a2 2 0 0 1 2-2h3`}]],"message-square":[[`path`,{d:`M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`}]],star:[[`path`,{d:`M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z`}]],eye:[[`path`,{d:`M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0`}],[`circle`,{cx:`12`,cy:`12`,r:`3`}]],history:[[`path`,{d:`M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`}],[`path`,{d:`M3 3v5h5`}],[`path`,{d:`M12 7v5l4 2`}]]},ye=/* @__PURE__ */ `brain.toolbox.wrench.circle.database.terminal.user.mail.phone.calendar.clock.building.map-pin.lock.key.credit-card.hash.globe.link.circle-check.circle-x.triangle-alert.info.ban.shield.ellipsis-vertical.house.pen-line.save.share.funnel.settings.rotate-cw.shopping-cart.shopping-bag.package.truck.tag.gift.receipt.wallet.store.dollar-sign.percent.play.pause.volume-x.camera.image.film.headphones.message-circle.bell.heart.eye-off.bookmark.calendar-days.timer.folder.folder-open.files.chart-column.sparkles.zap.sun.moon.flag.lightbulb.monitor.smartphone`.split(`.`),J=new Map(Object.entries(ve)),Y=/* @__PURE__ */ new Map
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* @license lucide v1.18.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
;let X=!1;const be=/* @__PURE__ */ new Set,xe=e=>{let t=[...be];e&&be.clear();for(let e of t)try{e()}catch{}},Se=()=>{let e=0;for(let[t,n]of Y){let r=J.get(n);if(!r)continue;Y.delete(t),e++;let i=K(r);if(i)for(t.removeAttribute(`data-persona-icon-pending`);i.firstChild;)t.appendChild(i.firstChild)}return e},Ce=e=>{if(!X){for(let[t,n]of Object.entries(e))J.has(t)||J.set(t,n);X=!0,Se(),xe(!0)}},we=()=>X?null:_e().then(e=>Ce(e.EXTRA_LUCIDE_ICONS)),Te=()=>{we()?.catch(e=>{console.warn(`[Persona] Failed to load the icons-extra chunk`,e)})},Ee=(e,t,n)=>{let r=K([],e,t,n);return r.setAttribute(`data-persona-icon-pending`,`true`),r},Z=(e,t=24,n=`currentColor`,r=2)=>{let i=J.get(e);if(i)return K(i,t,n,r);if(ye.includes(e)){let i=Ee(t,n,r);return Y.size>=500&&Y.delete(Y.keys().next().value),Y.set(i,e),Te(),i}return console.warn(`Unknown Persona icon "${e}". Use registerIcons().`),null};var De;e((()=>{De=100001}))();let Oe=0;const ke=e=>Math.max(0,e),Ae=()=>Date.now()<Oe,je=e=>{Oe=e>0?Date.now()+e:0},Q=/* @__PURE__ */ new WeakMap,Me=e=>typeof e.closest==`function`&&e.closest(`[data-persona-tooltip-suppressed]`)!==null,Ne=e=>e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&`host`in e,Pe=e=>{let t=e.getRootNode?.();return Ne(t)?t:e.closest(`dialog[open]`)??e.ownerDocument.body},$=(e,t,n)=>Math.min(Math.max(e,t),Math.max(t,n)),Fe=[...[`background`,`foreground`,`hint-fg`,`radius`,`font-size`,`padding`,`max-width`,`shadow`,`arrow-display`].map(e=>`--persona-tooltip-${e}`),`--persona-font-family`,`--persona-radius-sm`];function Ie(e){Q.get(e.anchor)?.destroy();let{anchor:t,trigger:n=t,text:r,hint:i,enabled:a=!0,gap:o=8,viewportPadding:s=8}=e,c=()=>t.ownerDocument,l=()=>c().defaultView??window,u=null,d=null,f=null,p=null,m,h=!1,g=!1,_=!1,v=()=>(typeof r==`function`?r():r).trim(),y=()=>(typeof i==`function`?i():i??``).trim(),b=()=>ke(e.delayMs??400),x=()=>ke(e.skipDelayMs??300),S=()=>{m!==void 0&&(l().clearTimeout(m),m=void 0)},C=()=>{S();let e=u!==null;p?.(),p=null,u?.remove(),u=null,d=null,f=null,e&&je(x())},w=()=>{if(!u)return;let e=c(),n=l(),r=t.getBoundingClientRect(),i=u.getBoundingClientRect(),a=e.documentElement.clientWidth||n.innerWidth,d=e.documentElement.clientHeight||n.innerHeight,f=a-s-i.width,p=r.left+r.width/2-i.width/2,m=$(p,s,f),h=r.top-s,g=d-s-r.bottom,_=h>=i.height+o||h>=g?`top`:`bottom`,v=_===`top`?r.top-o-i.height:r.bottom+o,y=d-s-i.height,b=$(v,s,y),x=r.left+r.width/2,S=Math.max(10,i.width-10),C=$(x-m,10,S);u.dataset.placement=_,u.style.left=`${m}px`,u.style.top=`${b}px`,u.style.setProperty(`--persona-tooltip-arrow-x`,`${C}px`)},T=()=>{if(_||!a||u||!t.isConnected||Me(t))return;let e=v(),n=Pe(t);if(!e||!n)return;let r=c(),i=l();u=r.createElement(`div`),u.className=`persona-control-tooltip`,u.setAttribute(`role`,`tooltip`),u.dataset.state=`measuring`,u.style.zIndex=String(De);let o=i.getComputedStyle?.(t);if(o){for(let e of Fe){let t=o.getPropertyValue(e).trim();t&&u.style.setProperty(e,t)}o.fontFamily&&(u.style.fontFamily=o.fontFamily)}d=r.createElement(`span`),d.className=`persona-control-tooltip__label`,d.textContent=e,u.appendChild(d);let s=y();s&&(f=r.createElement(`span`),f.className=`persona-control-tooltip__hint`,f.textContent=s,u.appendChild(f));let m=r.createElement(`span`);m.className=`persona-control-tooltip__arrow`,u.appendChild(m),n.appendChild(u),w(),u.dataset.state=`open`;let h=()=>{if(!t.isConnected){C();return}d&&(d.textContent=v()),f&&(f.textContent=y());let e=Pe(t);u&&e&&u.parentNode!==e&&e.appendChild(u),w()};i.addEventListener(`scroll`,h,!0),i.addEventListener(`resize`,h);let g=t.closest(`[data-persona-root]`);g?.addEventListener(`persona:internal:host-moved`,h);let b=t.getRootNode(),x=Ne(b)?b:r.documentElement,S=typeof MutationObserver>`u`?null:new MutationObserver(()=>{t.isConnected||C()});S?.observe(x,{childList:!0,subtree:!0}),p=()=>{i.removeEventListener(`scroll`,h,!0),i.removeEventListener(`resize`,h),g?.removeEventListener(`persona:internal:host-moved`,h),S?.disconnect()}},E=e=>{_||u||(S(),e||b()<=0||Ae()?T():m=l().setTimeout(()=>{m=void 0,T()},b()))},D=()=>{h||g?E(g):C()},O=()=>{let e=l();e.matchMedia&&e.matchMedia(`(hover: none)`).matches||(h=!0,D())},k=()=>{h=!1,D()},A=()=>{try{g=t.matches(`:focus-visible`)}catch{g=!0}D()},j=()=>{g=!1,D()},M=()=>{h=!1,g=!1,C()},N=e=>{e.key===`Escape`&&M()};n.addEventListener(`mouseenter`,O),n.addEventListener(`mouseleave`,k),t.addEventListener(`focus`,A),t.addEventListener(`blur`,j),t.addEventListener(`keydown`,N),t.addEventListener(`click`,M);let P={get isOpen(){return u!==null},show:T,hide:C,reposition:w,destroy:()=>{_||(_=!0,C(),n.removeEventListener(`mouseenter`,O),n.removeEventListener(`mouseleave`,k),t.removeEventListener(`focus`,A),t.removeEventListener(`blur`,j),t.removeEventListener(`keydown`,N),t.removeEventListener(`click`,M),Q.delete(t))}};return Q.set(t,P),P}const Le={collapsedMode:`tool-call`,activePreview:!1,grouped:!1,groupedMode:`stack`,groupBoundary:`adjacent`,previewMaxLines:3,expandable:!0,loadingAnimation:`none`},Re={activePreview:!1,previewMaxLines:3,expandable:!0,loadingAnimation:`none`},ze={layout:`row`,variant:`row`,iconVisibility:`active`,autoExpand:!1,grouped:!0,groupedMode:`collapsible`,groupAppearance:`inset`,loadingAnimation:`shimmer`},Be={appearance:`inset`,layout:`row`,variant:`row`,iconVisibility:`active`,autoExpand:!1,loadingAnimation:`shimmer`};o();const Ve={resolvedDisplay:`row`,primaryAction:`allow-once`,keyboardShortcuts:`focused`},He={apiUrl:`https://api.runtype.com/api/chat/dispatch`,clientToken:void 0,agentId:void 0,target:void 0,theme:void 0,darkTheme:void 0,colorScheme:`light`,tooltip:{delayMs:400,skipDelayMs:300},launcher:{enabled:!0,mountMode:`floating`,dock:{side:`right`,width:`420px`},title:`Chat Assistant`,subtitle:`Here to help you get answers fast`,agentIconText:`💬`,agentIconName:`bot`,headerIconName:`bot`,position:`bottom-right`,width:`min(440px, calc(100vw - 24px))`,heightOffset:0,autoExpand:!1,callToActionIconHidden:!1,agentIconSize:`40px`,headerIconSize:`40px`,closeButtonPaddingX:`0px`,closeButtonPaddingY:`0px`,callToActionIconName:`arrow-up-right`,callToActionIconText:``,callToActionIconSize:`32px`,callToActionIconPadding:`5px`,callToActionIconColor:void 0,callToActionIconBackgroundColor:void 0,closeButtonBackgroundColor:`transparent`,clearChat:{backgroundColor:`transparent`,borderColor:`transparent`,enabled:!0,placement:`inline`,iconName:`refresh-cw`,showTooltip:!0,tooltipText:`Clear chat`,paddingX:`0px`,paddingY:`0px`},headerIconHidden:!1,border:void 0,shadow:`0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`},copy:{inputPlaceholder:`How can I help...`,sendButtonLabel:`Send`},sendButton:{borderWidth:`0px`,paddingX:`12px`,paddingY:`10px`,borderColor:void 0,useIcon:!0,iconText:`↑`,showTooltip:!0,tooltipText:`Send message`,iconName:`send`},statusIndicator:{visible:!0,idleText:`Online`,connectingText:`Connecting…`,connectedText:`Streaming…`,errorText:`Offline`},voiceRecognition:{enabled:!0,pauseDuration:2e3,iconName:`mic`,borderWidth:`0px`,iconColor:void 0,backgroundColor:`transparent`,borderColor:`transparent`,recordingIconColor:void 0,recordingBackgroundColor:void 0,recordingBorderColor:`transparent`,showTooltip:!0,tooltipText:`Start voice recognition`},features:{showReasoning:!0,showToolCalls:!0,scrollToBottom:{enabled:!0,iconName:`arrow-down`,label:``,streamingIndicator:`arrow`,scrollBehavior:`instant`,scrollDurationMs:220,transition:`none`},scrollBehavior:{mode:`anchor-top`,anchorTopOffset:16,showActivityWhilePinned:!0},toolCallDisplay:Le,reasoningDisplay:Re,streamAnimation:{type:`none`,placeholder:`none`,speed:120,duration:1800},askUserQuestion:{enabled:!0,slideInMs:180,freeTextLabel:`Other…`,freeTextPlaceholder:`Type your answer…`,submitLabel:`Send`},history:{enabled:!1,presentation:`panel`,showScopeStatus:!0,showDelete:!0,showDeleteAll:!0}},suggestionChips:[`Show me what you can help with`,`Walk me through getting started`,`Answer a question about this page`],suggestionChipsConfig:{fontFamily:`sans-serif`,fontWeight:`500`,paddingX:`12px`,paddingY:`6px`},layout:{header:{layout:`default`,showIcon:!0,showTitle:!0,showSubtitle:!0,showCloseButton:!0,showClearChat:!0},messages:{layout:`bubble`,avatar:{show:!1,position:`left`},timestamp:{show:!1,position:`below`},groupConsecutive:!1},slots:{}},markdown:{options:{gfm:!0,breaks:!0},disableDefaultStyles:!1},messageActions:{enabled:!0,showCopy:!0,showUpvote:!1,showDownvote:!1,visibility:`hover`,align:`right`,layout:`pill-inside`},debug:!1},Ue={},We={colorScheme:`light`,errorDisplay:`block`,messageActions:{visibility:void 0},suggestionChipsConfig:{fontWeight:void 0},approval:Ve,loadingIndicator:{variant:`label`},launcher:{variant:`circle`,width:`min(400px, calc(100vw - 24px))`,headerIconSize:`20px`},features:{artifacts:{enabled:!0},scrollToBottom:{streamingIndicator:`dots`,transition:`fade`,scrollBehavior:`smooth`},toolCallDisplay:ze,reasoningDisplay:Be},composer:{layout:`single-row`,placement:`overlay`},sendButton:{iconName:`arrow-up`},statusIndicator:{mode:`transient`},layout:{contentMaxWidth:`768px`,topFade:!0,header:{showSubtitle:!1},messages:{assistant:{width:`full`}}}};function Ge(e){return e?.future?.v5Defaults===!0?`v5`:`v4`}function Ke(e){let t=Ge(e)===`v5`?We:Ue;return i(He,t)}Ke();var qe,Je;e((()=>{qe=[`image/png`,`image/jpeg`,`image/gif`,`image/webp`,`image/svg+xml`,`image/bmp`],Je=[`application/pdf`,`text/plain`,`text/markdown`,`text/csv`,`application/msword`,`application/vnd.openxmlformats-officedocument.wordprocessingml.document`,`application/vnd.ms-excel`,`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,`application/json`],[...qe,...Je]}))(),u();function Ye(e){let{config:t,onOpen:n}=e,r=t.buttonIconName??`plus`,i=t.buttonTooltipText??`Add context`,a=s(`div`,`persona-send-button-wrapper`),o=c(`button`,{className:`persona-rounded-button persona-flex persona-items-center persona-justify-center disabled:persona-opacity-50 persona-cursor-pointer persona-mention-button persona-composer-control persona-composer-control--glyph`,attrs:{type:`button`,"data-persona-composer-mention-button":``,"aria-label":i,"aria-haspopup":`listbox`,"aria-expanded":`false`},style:{fontSize:`18px`,lineHeight:`1`}}),l=Z(r,24,`currentColor`,1.5);return l?o.appendChild(l):o.textContent=`+`,o.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),n()}),a.appendChild(o),Ie({anchor:o,trigger:a,text:()=>o.getAttribute(`aria-label`)??i}),{button:o,wrapper:a}}const{setLoader:Xe,load:Ze}=q({fallbackImport:()=>import(`@runtypelabs/persona/context-mentions`)}),Qe=Ze,{setLoader:$e,load:et}=q({fallbackImport:()=>import(`@runtypelabs/persona/context-mentions-inline`),resetOnSetLoader:!0}),tt=et;u();function nt(e,t={}){if(t.render)return t.render({ref:e,readonly:!!t.readonly});let n=c(`span`,{className:l(`persona-mention-token`,t.readonly&&`persona-mention-token-readonly`),attrs:{"data-mention-source":e.sourceId,title:e.label,role:`img`,"aria-label":`${e.label} mention`}});e.color&&n.style.setProperty(`--persona-mention-token-accent`,e.color);let r=Z(e.iconName??`at-sign`,13,`currentColor`,2);if(r){let e=s(`span`,`persona-mention-token-icon`);e.appendChild(r),n.appendChild(e)}return n.appendChild(c(`span`,{className:`persona-mention-token-label`,text:`@${e.label}`})),n}u();const rt={loadContextMentions:()=>Qe(),loadContextMentionsInline:()=>tt(),renderLucideIcon:(...e)=>Z(...e),createMentionButton:(...e)=>Ye(...e)};function it(e){let{loadContextMentions:t,loadContextMentionsInline:n,renderLucideIcon:r,createMentionButton:i}=e.deps??rt,a=e.config.contextMentions;if(!a?.enabled)return null;let o=me(a).filter(e=>e.sources.length>0);if(o.length===0)return typeof console<`u`&&console.warn(`[Persona] contextMentions.enabled is true but no sources were provided; mentions are disabled.`),null;let s=o.filter(e=>e.sources.some(e=>typeof e.matchCommand==`function`)),l=e=>s.some(t=>t.trigger?t.position===`line-start`?e.split(`
`).some(e=>e.startsWith(t.trigger)):(t.position===`anywhere`?e:e.split(`
`)[0]).startsWith(t.trigger):!1),u=(t,n)=>{if(typeof window<`u`)try{window.dispatchEvent(new CustomEvent(`persona:mention:${t}`,{detail:{...n,instanceId:e.textarea.closest(`[data-persona-instance]`)?.dataset.personaInstance}}))}catch{}},d=!e.chipRow,f=e.chipRow??c(`div`,{className:`persona-mention-context-row`,attrs:{"data-persona-mention-context-row":``}}),p=null,m=null,h=e.textarea,g=null,_=null,v=null,y=null,b=()=>{if(p)return Promise.resolve(p);if(m)return m;let n=t().then(t=>(t.setMentionIconRenderer(r),p=t.mountContextMentions({mentionConfig:a,textarea:e.textarea,composerInput:g??void 0,anchor:e.anchor,contextRow:f,getMessages:e.getMessages,getConfig:()=>e.config,liveRegionHost:e.liveRegionHost,popoverContainer:e.popoverContainer,onPickerOpenChange:C,emit:u}),p)).catch(e=>(typeof console<`u`&&console.warn(`[Persona] Failed to load context mentions runtime`,e),m===n&&(m=null),null));return m=n,n};a.display===`inline`&&n().then(t=>{let n=t.mountInlineComposer({textarea:e.textarea,renderToken:e=>nt(e,{render:a.renderMentionToken}),onMentionRemoved:e=>p?.untrackMention(e)});g=n.input,_=n.destroy;let r=h;r.replaceWith(n.element),h=n.element,y={next:n.element,prev:r},v?.(n.element,r),p?p.rebindComposer(n.input):m&&m.then(e=>e?.rebindComposer(n.input))}).catch(e=>{typeof console<`u`&&console.warn(`[Persona] Failed to load inline mention composer`,e)});let x=[],S=/* @__PURE__ */ new Map;for(let e of o){if(!e.showButton)continue;let t=i({config:{...a,buttonIconName:e.buttonIconName,buttonTooltipText:e.buttonTooltipText},onOpen:()=>{b().then(t=>t?.openMenu(e.trigger))}});x.push(t),S.set(e.trigger,t.button)}let C=(e,t,n)=>{let r=S.get(t);r&&(r.setAttribute(`aria-expanded`,e?`true`:`false`),e?r.setAttribute(`aria-controls`,n):r.removeAttribute(`aria-controls`))};return{affordanceButtons:x.map(e=>e.wrapper),contextRow:f,handleInput:e=>{if(p){p.handleInput();return}if(!pe(e))return;let t=h,n=t.selectionStart??0;fe(t.value,n,o)&&b().then(e=>e?.handleInput())},handleKeydown:e=>{if(p?.isMenuOpen())return p.handleKeydown(e);if(e.key===`Backspace`&&p?.hasMentions()&&!y){let t=h,n=t.selectionStart===0&&t.selectionEnd===0;if((t.value.length===0||n)&&p.removeLastChip())return e.preventDefault(),!0}return!1},isMenuOpen:()=>p?.isMenuOpen()??!1,hasMentions:()=>p?.hasMentions()??!1,getMentionRefs:()=>p?.getMentionRefs()??[],captureDraft:()=>p?.captureDraft()??[],restoreDraft:e=>p?.restoreDraft(e),getInlineInput:()=>g,collectForSubmit:()=>p?.collectForSubmit()??null,takeInlineCommand:async e=>l(e)?(p??await b())?.dispatchInlineCommand(e)??null:null,clear:()=>p?.clear(),prefetch:()=>{t().catch(()=>{})},onComposerSwap:e=>{v=e,y&&e(y.next,y.prev)},destroy:()=>{p?.destroy(),_?.();for(let e of x)e.wrapper.remove();d&&f.remove()}}}export{ce as createAskUserSheetHandlers,it as createContextMentionOrchestrator};