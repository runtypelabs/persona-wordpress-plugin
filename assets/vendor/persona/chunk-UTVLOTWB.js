import{c as i}from"./chunk-76IELU7F.js";function s(e){let t=0;for(let o of e.split(`
`)){let n=/^ {0,3}(`+)/.exec(o);n&&n[1].length>t&&(t=n[1].length)}return t}function r(e,t){let o="`".repeat(Math.max(3,s(t)+1));return`${o}${e}
${t}
${o}`}function a(e,t,o){return t.includes("</document_content>")?r(e,t):`<document index="${o+1}">
<source>${e}</source>
<document_content>
${t}
</document_content>
</document>`}function c(e,t,o="fenced"){if(typeof o=="function")try{return o(e,t)}catch(n){return console.warn("[persona] contextMentions.llmFormat threw; falling back to the fenced format for this mention",n),r(e.label,e.text)}return o==="document"?a(e.label,e.text,t):r(e.label,e.text)}var l="[data-persona-composer-chip-row]";function m(e){e.style.display=e.childElementCount>0?"flex":"none"}function g(e){let t=e.querySelector(l);if(t)return t;let o=i("div",{className:"persona-composer-chip-row",attrs:{"data-persona-composer-chip-row":""}});o.style.display="none";let n=e.querySelector("[data-persona-composer-quote], [data-persona-composer-pending]");return n?.parentElement===e?e.insertBefore(o,n):e.appendChild(o),o}function f(e){let t={trigger:e.trigger??"@",position:e.triggerPosition??"anywhere",allowSpaces:!1,sources:Array.isArray(e.sources)?e.sources:[],searchPlaceholder:e.searchPlaceholder,showButton:e.showButton!==!1,buttonIconName:e.buttonIconName,buttonTooltipText:e.buttonTooltipText},o=(e.triggers??[]).map(n=>({trigger:n.trigger,position:n.triggerPosition??"anywhere",allowSpaces:n.allowSpaces??!1,sources:Array.isArray(n.sources)?n.sources:[],searchPlaceholder:n.searchPlaceholder,showButton:n.showButton===!0,buttonIconName:n.buttonIconName,buttonTooltipText:n.buttonTooltipText}));return[t,...o]}export{r as a,c as b,l as c,m as d,g as e,f};
