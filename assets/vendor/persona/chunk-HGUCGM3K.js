import{c as i}from"./chunk-76IELU7F.js";var c="[data-persona-composer-chip-row]";function p(n){n.style.display=n.childElementCount>0?"flex":"none"}function u(n){let e=n.querySelector(c);if(e)return e;let t=i("div",{className:"persona-composer-chip-row",attrs:{"data-persona-composer-chip-row":""}});t.style.display="none";let o=n.querySelector("[data-persona-composer-quote], [data-persona-composer-pending]");return o?.parentElement===n?n.insertBefore(t,o):n.appendChild(t),t}function s(n){let e=0;for(let t of n.split(`
`)){let o=/^ {0,3}(`+)/.exec(t);o&&o[1].length>e&&(e=o[1].length)}return e}function r(n,e){let t="`".repeat(Math.max(3,s(e)+1));return`${t}${n}
${e}
${t}`}function l(n,e,t){return e.includes("</document_content>")?r(n,e):`<document index="${t+1}">
<source>${n}</source>
<document_content>
${e}
</document_content>
</document>`}function f(n,e,t="fenced"){if(typeof t=="function")try{return t(n,e)}catch(o){return console.warn("[persona] contextMentions.llmFormat threw; falling back to the fenced format for this mention",o),r(n.label,n.text)}return t==="document"?l(n.label,n.text,e):r(n.label,n.text)}export{c as a,p as b,u as c,r as d,f as e};
