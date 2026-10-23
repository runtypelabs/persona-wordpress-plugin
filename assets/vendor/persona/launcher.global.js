var AgentWidgetLauncher=function(e){let t=e=>e?.launcher?.variant??(!0===e?.future?.v5Defaults?"circle":"pill"),o={background:"semantic.colors.primary",foreground:"semantic.colors.textInverse",border:"transparent",size:"48px",iconSize:"24px",borderRadius:"palette.radius.full",shadow:"0 8px 24px rgba(0,0,0,.16)",offset:"20px"},a=(e,t)=>{let o=document.createElement(e);return t&&(o.className=t),o},r=(e,t={},...o)=>{let a=document.createElement(e);if(t.className&&(a.className=t.className),void 0!==t.text&&(a.textContent=t.text),t.attrs)for(let[e,o]of Object.entries(t.attrs))a.setAttribute(e,o);if(t.style){let e=a.style,o=t.style;for(let t of Object.keys(o)){let a=o[t];null!=a&&(e[t]=a)}}let r=o.filter(e=>null!=e);return r.length>0&&a.append(...r),a},n={"bottom-right":"persona-bottom-6 persona-right-6","bottom-left":"persona-bottom-6 persona-left-6","top-right":"persona-top-6 persona-right-6","top-left":"persona-top-6 persona-left-6"},s=e=>!0===e?.layout?.embedded&&!1===e.launcher?.enabled&&!e.launcher.sidebarMode&&"floating"===(e.launcher.mountMode??"floating"),l=e=>"object"==typeof e&&!!e&&!Array.isArray(e);function i(e,t){if(!e)return t;if(!t)return e;let o={...e};for(let[e,a]of Object.entries(t)){let t=o[e];o[e]=l(t)&&l(a)?i(t,a):a}return o}let c=e=>"object"==typeof e&&!!e&&!Array.isArray(e),d=e=>{if("string"!=typeof e)return;let t=e.trim(),o=/^#([\da-f]{3}|[\da-f]{6})$/i.exec(t)?.[1];if(o){let e=3===o.length?[...o].map(e=>e+e).join(""):o;return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16))}let a=/^rgba?\(\s*([^)]*)\)$/i.exec(t);if(!a)return;let r=a[1].trim().split(/\s*[,/]\s*|\s+/);if(4===r.length&&/^(?:1(?:\.0+)?|100%)$/.test(r[3])&&r.pop(),3!==r.length)return;let n=r.map(e=>/^\d+(?:\.\d+)?%?$/.test(e)?Number.parseFloat(e)*(e.endsWith("%")?2.55:1):NaN);return n.some(e=>!Number.isFinite(e)||e<0||e>255)?void 0:n},p=e=>e.reduce((e,t,o)=>{let a=t/255;return e+(a<=.04045?a/12.92:((a+.055)/1.055)**2.4)*[.2126,.7152,.0722][o]},0),u=e=>"#"+e.map(e=>Math.round(e).toString(16).padStart(2,"0")).join(""),m=(e,t,o)=>u(e.map(e=>e+(t-e)*o)),h=e=>p(e)>.179?"#000000":"#ffffff",g=e=>{let t=d(e?.neutral);return t?p(t)<.18?"dark":"light":void 0},f=["voice.recording.border","voice.processing.icon","voice.processing.background","voice.speaking.icon","approval.requested.text","approval.approve.foreground","approval.deny.foreground","approval.deny.background","reasoningBubble.shadow","toolBubble.shadow"],b=Symbol.for("persona.styleProvenance"),y=(e,t)=>{let o=e?.[b];return o&&Object.prototype.hasOwnProperty.call(o.values,t)&&((e,t)=>{for(let o of t.split(".")){if("object"!=typeof e||!e)return;e=e[o]}return e})(e,t)===o.values[t]?o.explicit.includes(t):"explicit"===function(e,t){let o=t.split(".");for(let t=0;t<o.length;t++){let a=o[t];if(!c(e)||!Object.prototype.hasOwnProperty.call(e,a))return"absent";if(void 0===(e=e[a])||t<o.length-1&&!c(e))return"clear"}return"explicit"}(e,t)},x="min(440px, calc(100vw - 24px))",v={enabled:!0,mountMode:"floating",dock:{side:"right",width:"420px"},title:"Chat Assistant",subtitle:"Here to help you get answers fast",agentIconText:"💬",agentIconName:"bot",headerIconName:"bot",position:"bottom-right",width:x,heightOffset:0,autoExpand:!1,callToActionIconHidden:!1,agentIconSize:"40px",headerIconSize:"40px",closeButtonPaddingX:"0px",closeButtonPaddingY:"0px",callToActionIconName:"arrow-up-right",callToActionIconText:"",callToActionIconSize:"32px",callToActionIconPadding:"5px",callToActionIconColor:void 0,callToActionIconBackgroundColor:void 0,closeButtonBackgroundColor:"transparent",clearChat:{backgroundColor:"transparent",borderColor:"transparent",enabled:!0,placement:"inline",iconName:"refresh-cw",showTooltip:!0,tooltipText:"Clear chat",paddingX:"0px",paddingY:"0px"},headerIconHidden:!1,border:void 0,shadow:"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"},w={apiUrl:"https://api.runtype.com/api/chat/dispatch",clientToken:void 0,agentId:void 0,target:void 0,theme:void 0,darkTheme:void 0,colorScheme:"light",tooltip:{delayMs:400,skipDelayMs:300},launcher:v,copy:{inputPlaceholder:"How can I help...",sendButtonLabel:"Send"},sendButton:{borderWidth:"0px",paddingX:"12px",paddingY:"10px",borderColor:void 0,useIcon:!0,iconText:"↑",showTooltip:!0,tooltipText:"Send message",iconName:"send"},statusIndicator:{visible:!0,idleText:"Online",connectingText:"Connecting…",connectedText:"Streaming…",errorText:"Offline"},voiceRecognition:{enabled:!0,pauseDuration:2e3,iconName:"mic",borderWidth:"0px",iconColor:void 0,backgroundColor:"transparent",borderColor:"transparent",recordingIconColor:void 0,recordingBackgroundColor:void 0,recordingBorderColor:"transparent",showTooltip:!0,tooltipText:"Start voice recognition"},features:{showReasoning:!0,showToolCalls:!0,scrollToBottom:{enabled:!0,iconName:"arrow-down",label:"",streamingIndicator:"arrow",scrollBehavior:"instant",scrollDurationMs:220,transition:"none"},scrollBehavior:{mode:"anchor-top",anchorTopOffset:16,showActivityWhilePinned:!0},toolCallDisplay:{collapsedMode:"tool-call",activePreview:!1,grouped:!1,groupedMode:"stack",groupBoundary:"adjacent",previewMaxLines:3,expandable:!0,loadingAnimation:"none"},reasoningDisplay:{activePreview:!1,previewMaxLines:3,expandable:!0,loadingAnimation:"none"},streamAnimation:{type:"none",placeholder:"none",speed:120,duration:1800},askUserQuestion:{enabled:!0,slideInMs:180,freeTextLabel:"Other…",freeTextPlaceholder:"Type your answer…",submitLabel:"Send"},history:{enabled:!1,presentation:"panel",showScopeStatus:!0,showDelete:!0,showDeleteAll:!0}},suggestionChips:["Show me what you can help with","Walk me through getting started","Answer a question about this page"],suggestionChipsConfig:{fontFamily:"sans-serif",fontWeight:"500",paddingX:"12px",paddingY:"6px"},layout:{header:{layout:"default",showIcon:!0,showTitle:!0,showSubtitle:!0,showCloseButton:!0,showClearChat:!0},messages:{layout:"bubble",avatar:{show:!1,position:"left"},timestamp:{show:!1,position:"below"},groupConsecutive:!1},slots:{}},markdown:{options:{gfm:!0,breaks:!0},disableDefaultStyles:!1},messageActions:{enabled:!0,showCopy:!0,showUpvote:!1,showDownvote:!1,visibility:"hover",align:"right",layout:"pill-inside"},debug:!1},k={},M={variant:"circle",width:"min(400px, calc(100vw - 24px))",headerIconSize:"20px"},S={colorScheme:"light",errorDisplay:"block",messageActions:{visibility:void 0},suggestionChipsConfig:{fontWeight:void 0},approval:{resolvedDisplay:"row",primaryAction:"allow-once",keyboardShortcuts:"focused"},loadingIndicator:{variant:"label"},launcher:M,features:{artifacts:{enabled:!0},scrollToBottom:{streamingIndicator:"dots",transition:"fade",scrollBehavior:"smooth"},toolCallDisplay:{layout:"row",variant:"row",iconVisibility:"active",autoExpand:!1,grouped:!0,groupedMode:"collapsible",groupAppearance:"inset",loadingAnimation:"shimmer"},reasoningDisplay:{appearance:"inset",layout:"row",variant:"row",iconVisibility:"active",autoExpand:!1,loadingAnimation:"shimmer"}},composer:{layout:"single-row",placement:"overlay"},sendButton:{iconName:"arrow-up"},statusIndicator:{mode:"transient"},layout:{contentMaxWidth:"768px",topFade:!0,header:{showSubtitle:!1},messages:{assistant:{width:"full"}}}};function C(e){return!0===e?.future?.v5Defaults?"v5":"v4"}!function(){let e="v5"===C(void 0)?S:k;i(w,e)}();let B={colors:{primary:{50:"#ffffff",100:"#f5f5f5",200:"#d4d4d4",300:"#a3a3a3",400:"#737373",500:"#171717",600:"#0f0f0f",700:"#0a0a0a",800:"#050505",900:"#030303",950:"#000000"},secondary:{50:"#f5f3ff",100:"#ede9fe",200:"#ddd6fe",300:"#c4b5fd",400:"#a78bfa",500:"#8b5cf6",600:"#7c3aed",700:"#6d28d9",800:"#5b21b6",900:"#4c1d95",950:"#2e1065"},accent:{50:"#ecfeff",100:"#cffafe",200:"#a5f3fc",300:"#67e8f9",400:"#22d3ee",500:"#06b6d4",600:"#0891b2",700:"#0e7490",800:"#155e75",900:"#164e63",950:"#083344"},gray:{50:"#f9fafb",100:"#f3f4f6",200:"#e5e7eb",300:"#d1d5db",400:"#9ca3af",500:"#6b7280",600:"#4b5563",700:"#374151",800:"#1f2937",900:"#111827",950:"#030712"},success:{50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d"},warning:{50:"#fefce8",100:"#fef9c3",200:"#fef08a",300:"#fde047",400:"#facc15",500:"#eab308",600:"#ca8a04",700:"#a16207",800:"#854d0e",900:"#713f12"},error:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d"},info:{50:"#eff6ff",100:"#dbeafe",200:"#bfdbfe",300:"#93c5fd",400:"#60a5fa",500:"#3b82f6",600:"#2563eb",700:"#1d4ed8",800:"#1e40af",900:"#1e3a8a",950:"#172554"},purple:{50:"#faf5ff",100:"#f3e8ff",200:"#e9d5ff",300:"#d8b4fe",400:"#c084fc",500:"#a855f7",600:"#9333ea",700:"#7e22ce",800:"#6b21a8",900:"#581c87",950:"#3b0764"},teal:{50:"#f0fdfa",100:"#ccfbf1",200:"#99f6e4",300:"#5eead4",400:"#2dd4bf",500:"#14b8a6",600:"#0d9488",700:"#0f766e",800:"#115e59",900:"#134e4a",950:"#042f2e"}},spacing:(()=>{let e={};for(let t of[0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,56,64])e[t]=0===t?"0px":t/4+"rem";return e})(),typography:{fontFamily:{sans:'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',serif:'Georgia, Cambria, "Times New Roman", Times, serif',mono:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"},fontSize:{xs:"0.75rem",sm:"0.875rem",base:"1rem",lg:"1.125rem",xl:"1.25rem","2xl":"1.5rem","3xl":"1.875rem","4xl":"2.25rem"},fontWeight:{normal:"400",medium:"500",semibold:"600",bold:"700"},lineHeight:{tight:"1.25",normal:"1.5",relaxed:"1.625"}},shadows:{none:"none",sm:"0 1px 2px 0 rgb(0 0 0 / 0.05)",md:"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",lg:"0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",xl:"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)","2xl":"0 25px 50px -12px rgb(0 0 0 / 0.25)"},borders:{none:"none",sm:"1px solid",md:"2px solid",lg:"4px solid"},radius:{none:"0px",sm:"0.125rem",md:"0.375rem",lg:"0.5rem",xl:"0.75rem","2xl":"1rem",full:"9999px"}},A={colors:{primary:"palette.colors.primary.500",secondary:"palette.colors.secondary.500",accent:"palette.colors.primary.600",surface:"palette.colors.gray.50",background:"palette.colors.gray.50",container:"palette.colors.gray.50",text:"palette.colors.gray.900",textMuted:"palette.colors.gray.500",textInverse:"palette.colors.gray.50",border:"palette.colors.gray.200",divider:"palette.colors.gray.200",interactive:{default:"palette.colors.primary.600",hover:"palette.colors.primary.700",focus:"palette.colors.primary.600",active:"palette.colors.primary.600",disabled:"palette.colors.gray.300"},feedback:{success:"palette.colors.success.500",warning:"palette.colors.warning.500",error:"palette.colors.error.500",info:"palette.colors.info.500"}},spacing:{xs:"palette.spacing.1",sm:"palette.spacing.2",md:"palette.spacing.4",lg:"palette.spacing.6",xl:"palette.spacing.8","2xl":"palette.spacing.10"},typography:{fontFamily:"palette.typography.fontFamily.sans",fontSize:"palette.typography.fontSize.base",fontWeight:"palette.typography.fontWeight.normal",lineHeight:"palette.typography.lineHeight.normal"}},I={button:{primary:{background:"palette.colors.primary.500",foreground:"palette.colors.primary.50",borderRadius:"palette.radius.lg",padding:"semantic.spacing.md"},secondary:{background:"semantic.colors.surface",foreground:"semantic.colors.secondary",borderRadius:"palette.radius.lg",padding:"semantic.spacing.md"},ghost:{background:"transparent",foreground:"semantic.colors.text",borderRadius:"palette.radius.md",padding:"semantic.spacing.sm",hoverBackground:"rgba(0, 0, 0, 0.05)"}},input:{background:"semantic.colors.surface",placeholder:"semantic.colors.textMuted",borderRadius:"palette.radius.lg",padding:"semantic.spacing.md",focus:{border:"palette.colors.gray.400",ring:"palette.colors.gray.400"}},launcher:{background:"semantic.colors.surface",foreground:"semantic.colors.primary",border:"semantic.colors.border",size:"60px",iconSize:"28px",borderRadius:"palette.radius.full",shadow:"palette.shadows.lg"},panel:{width:x,maxWidth:"none",height:"min(640px, max(200px, calc(100vh - 64px)))",maxHeight:"none",borderRadius:"palette.radius.xl",shadow:"palette.shadows.xl",inset:"16px",canvasBackground:"transparent",modes:{floating:{border:"1px solid var(--persona-border)",shadow:"palette.shadows.xl",borderRadius:"palette.radius.xl"},inline:{border:"1px solid var(--persona-border)",shadow:"none",borderRadius:"palette.radius.xl"},docked:{border:"none",shadow:"none",borderRadius:"palette.radius.xl"},sidebar:{border:"none",borderRadius:"0"},mobile:{border:"none",shadow:"none",borderRadius:"0"}}},header:{background:"palette.colors.primary.500",foreground:"palette.colors.primary.50",borderRadius:"palette.radius.xl palette.radius.xl 0 0",padding:"20px 24px",minimalPadding:"16px 24px",iconBackground:"palette.colors.primary.600",iconForeground:"palette.colors.primary.50"},message:{gap:"12px",user:{background:"palette.colors.primary.500",text:"palette.colors.primary.50",borderRadius:"palette.radius.lg",shadow:"palette.shadows.sm"},assistant:{background:"semantic.colors.container",text:"semantic.colors.text",borderRadius:"palette.radius.lg",border:"semantic.colors.border",shadow:"palette.shadows.sm"},border:"semantic.colors.border"},introCard:{background:"transparent",borderRadius:"palette.radius.2xl",padding:"semantic.spacing.lg",shadow:"palette.shadows.none"},suggestion:{chip:{background:"semantic.colors.surface",foreground:"semantic.colors.text",border:"semantic.colors.border",borderRadius:"palette.radius.full",padding:"0.5rem 0.875rem",gap:"0.5rem",itemGap:"8px",minHeight:"36px",fontSize:"0.8125rem",lineHeight:"1.25",iconSize:"16px",hoverBackground:"palette.colors.gray.100",hoverBorder:"palette.colors.gray.300",pressedBackground:"palette.colors.gray.200",focusRing:"semantic.colors.interactive.focus",disabledOpacity:"0.5"},card:{background:"semantic.colors.surface",foreground:"semantic.colors.text",border:"semantic.colors.border",borderRadius:"palette.radius.xl",padding:"1rem",shadow:"palette.shadows.sm",gap:"0.625rem",itemGap:"8px",minHeight:"72px",fontSize:"0.875rem",lineHeight:"1.35",iconSize:"18px",hoverBackground:"palette.colors.gray.100",hoverBorder:"palette.colors.gray.300",pressedBackground:"palette.colors.gray.200",focusRing:"semantic.colors.interactive.focus",disabledOpacity:"0.5"},list:{background:"transparent",foreground:"semantic.colors.text",border:"semantic.colors.border",borderRadius:"palette.radius.md",padding:"0.75rem",gap:"0.625rem",itemGap:"8px",minHeight:"44px",fontSize:"0.875rem",lineHeight:"1.35",iconSize:"17px",hoverBackground:"palette.colors.gray.100",hoverBorder:"palette.colors.gray.300",pressedBackground:"palette.colors.gray.200",focusRing:"semantic.colors.interactive.focus",disabledOpacity:"0.5"}},toolBubble:{shadow:"palette.shadows.sm"},reasoningBubble:{shadow:"palette.shadows.sm"},composer:{shadow:"palette.shadows.none"},scrollbar:{thumb:"semantic.colors.border",track:"transparent"},markdown:{inlineCode:{background:"palette.colors.gray.50",foreground:"palette.colors.gray.900"},link:{foreground:"palette.colors.primary.600"},prose:{fontFamily:"inherit"},codeBlock:{background:"semantic.colors.container",borderColor:"semantic.colors.border",textColor:"inherit",borderRadius:"palette.radius.md"},table:{headerBackground:"semantic.colors.container",borderColor:"semantic.colors.border"},hr:{color:"semantic.colors.divider"},blockquote:{borderColor:"palette.colors.gray.900",background:"transparent",textColor:"palette.colors.gray.500"}},collapsibleWidget:{container:"palette.colors.gray.50",surface:"semantic.colors.surface",border:"semantic.colors.border"},voice:{recording:{indicator:"palette.colors.error.500",background:"palette.colors.error.50",border:"palette.colors.error.200"},processing:{icon:"palette.colors.primary.500",background:"palette.colors.primary.50"},speaking:{icon:"palette.colors.success.500"}},approval:{requested:{background:"semantic.colors.surface",border:"semantic.colors.border",text:"palette.colors.gray.900",shadow:"0 1px 2px 0 rgba(11, 11, 11, 0.06), 0 2px 8px 0 rgba(11, 11, 11, 0.04)"},approve:{background:"semantic.colors.primary",foreground:"semantic.colors.textInverse",borderRadius:"palette.radius.md",padding:"semantic.spacing.sm"},deny:{background:"semantic.colors.container",foreground:"semantic.colors.text",borderRadius:"palette.radius.md",padding:"semantic.spacing.sm"}},attachment:{image:{background:"palette.colors.gray.100",border:"palette.colors.gray.200"}},eventStream:{badge:{flow:{background:"palette.colors.success.100",foreground:"palette.colors.success.700"},step:{background:"palette.colors.primary.100",foreground:"palette.colors.primary.700"},reasoning:{background:"palette.colors.warning.100",foreground:"palette.colors.warning.700"},tool:{background:"palette.colors.purple.100",foreground:"palette.colors.purple.800"},agent:{background:"palette.colors.teal.100",foreground:"palette.colors.teal.800"},error:{background:"palette.colors.error.100",foreground:"palette.colors.error.700"},default:{background:"palette.colors.gray.100",foreground:"palette.colors.gray.600"}}},scrollToBottom:{background:"components.button.primary.background",foreground:"components.button.primary.foreground",border:"semantic.colors.primary",size:"40px",borderRadius:"palette.radius.full",shadow:"palette.shadows.sm",padding:"0.5rem 0.875rem",gap:"0.5rem",fontSize:"0.875rem",iconSize:"14px"},artifact:{pane:{background:"semantic.colors.container",toolbarBackground:"semantic.colors.container"}}},z=B.colors.gray,T={...B,colors:{...B.colors,gray:z}},H={...B,colors:{...B.colors,gray:{50:"#fafafa",100:"#f5f5f5",200:"#e5e5e5",300:"#d4d4d4",400:"#a3a3a3",500:"#737373",600:"#525252",700:"#404040",800:"#262626",900:"#171717",950:"#0a0a0a"}},radius:{none:"0px",sm:"4px",md:"8px",lg:"12px",xl:"16px","2xl":"24px",full:"9999px"}},R=A,L={...A,colors:{...A.colors,surface:"#ffffff",background:"#ffffff",container:"semantic.colors.surface",textInverse:"#ffffff"},typography:{...A.typography,fontSize:"14px",lineHeight:"1.5"}},j=I,W={...I,scrollToBottom:{...I.scrollToBottom,background:"semantic.colors.surface",foreground:"semantic.colors.text",border:"semantic.colors.border",size:"32px"},messageActions:{background:"transparent",border:"none",hoverBackground:"components.button.ghost.hoverBackground",hoverForeground:"semantic.colors.text",borderRadius:"palette.radius.md"},launcher:o,activity:{labelSize:"13px",iconSize:"16px",indent:"0px",transcriptGap:"0px",responseGap:"12px",groupIndent:"16px",groupGap:"2px",groupPadding:"2px 0",bodyPadding:"4px 0",bodyFontWeight:"400",sectionGap:"8px",bodySurface:"transparent"},toolBubble:{shadow:"none"},reasoningBubble:{shadow:"none"},input:{...I.input,borderRadius:"palette.radius.full"},introCard:{...I.introCard,title:{fontSize:"22px",fontWeight:"500"}},suggestion:{chip:{...I.suggestion.chip,fontWeight:"400"},card:{...I.suggestion.card,fontWeight:"400"},list:{...I.suggestion.list,fontWeight:"400"}},panel:{...I.panel,width:"min(400px, calc(100vw - 24px))",height:"min(704px, calc(100dvh - 104px))",borderRadius:"palette.radius.xl"},header:{...I.header,background:"semantic.colors.container",foreground:"semantic.colors.text",padding:"8px 8px 8px 16px",minimalPadding:"8px 8px 8px 16px",minHeight:"48px",borderBottom:"none",iconBackground:"transparent",iconForeground:"semantic.colors.text",iconScale:"1",iconPadding:"auto",controlSize:"28px",controlIconSize:"16px",controlStrokeWidth:"1.5",actionIconForeground:"semantic.colors.textMuted",controlBorderRadius:"8px",controlHoverBackground:"color-mix(in srgb, var(--persona-text) 8%, transparent)",controlHoverForeground:"semantic.colors.text",controlFocusOutline:"2px solid color-mix(in srgb, var(--persona-text) 50%, transparent)",title:{fontSize:"14px",fontWeight:"500",lineHeight:"1.5"}},message:{...I.message,gap:"20px",fullscreenGap:"28px",topFadeHeight:"18px",user:{...I.message.user,background:"palette.colors.gray.100",text:"semantic.colors.text",borderRadius:"palette.radius.xl",shadow:"none",padding:"8px 14px",fontSize:"14px",lineHeight:"1.5"},assistant:{...I.message.assistant,background:"transparent",border:"transparent",borderWidth:"0px",borderRadius:"0px",shadow:"none",padding:"0px",fontSize:"14px",lineHeight:"1.55"}},artifact:{...I.artifact,card:{background:"semantic.colors.surface",border:"1px solid var(--persona-border)",borderRadius:"palette.radius.lg",hoverBackground:"components.button.ghost.hoverBackground",hoverBorderColor:"semantic.colors.border"},inline:{background:"semantic.colors.surface",border:"1px solid var(--persona-border)",borderRadius:"palette.radius.lg",chromeBackground:"semantic.colors.surface",chromeBorder:"semantic.colors.border",titleColor:"semantic.colors.text",mutedColor:"semantic.colors.textMuted"}},composer:{...I.composer,padding:"8px",fontSize:"15px",lineHeight:"1.5",controlSize:"32px",controlIconSize:"20px",expandedPadding:"12px 16px",expandedBorderRadius:"24px",sendIconSize:"18px",sendButtonRadius:"9999px",footerBorder:"none",overflowMenu:{borderRadius:"12px"},overlayBand:"linear-gradient(to bottom, transparent, var(--persona-container) 24px)",focusBorderColor:"color-mix(in srgb, var(--persona-text) 28%, var(--persona-border))",focusRing:"1px solid color-mix(in srgb, var(--persona-text) 12%, transparent)"}},P=e=>"v5"===(e=>C({future:e}))(e)?{palette:H,semantic:L,components:W}:{palette:T,semantic:R,components:j};function N(e,t){if(!t.startsWith("palette.")&&!t.startsWith("semantic.")&&!t.startsWith("components."))return t;let o=t.split("."),a=e;for(let e of o){if(null==a)return;a=a[e]}return"string"==typeof a&&(a.startsWith("palette.")||a.startsWith("semantic.")||a.startsWith("components."))?N(e,a):a}function O(e,t){let o={...e};for(let[e,a]of Object.entries(t)){let t=o[e];o[e]=t&&"object"==typeof t&&!Array.isArray(t)&&a&&"object"==typeof a&&!Array.isArray(a)?O(t,a):a}return o}function $(e,t={}){let o=P(t.future),a=e?.components,r={palette:{...o.palette,...e?.palette,colors:{...o.palette.colors,...e?.palette?.colors},spacing:{...o.palette.spacing,...e?.palette?.spacing},typography:{...o.palette.typography,...e?.palette?.typography},shadows:{...o.palette.shadows,...e?.palette?.shadows},borders:{...o.palette.borders,...e?.palette?.borders},radius:{...o.palette.radius,...e?.palette?.radius}},semantic:{...o.semantic,...e?.semantic,colors:{...o.semantic.colors,...e?.semantic?.colors,interactive:{...o.semantic.colors.interactive,...e?.semantic?.colors?.interactive},feedback:{...o.semantic.colors.feedback,...e?.semantic?.colors?.feedback}},spacing:{...o.semantic.spacing,...e?.semantic?.spacing},typography:{...o.semantic.typography,...e?.semantic?.typography}},components:a?O(o.components,a):o.components},n=a?.activity;for(let e of["toolBubble","reasoningBubble"]){let t=r.components[e]={...r.components[e]};for(let o of["rowHeight","labelSize","iconSize","indent","bodySurface"])void 0!==n?.[o]&&("bodySurface"!==o||void 0===a?.[e]?.bodySurface)&&(t[o]=n[o])}let s=a?.collapsibleWidget?.surface;"v4"===C(t)&&void 0!==s&&void 0===n?.bodySurface&&(r.components.activity={...r.components.activity,bodySurface:s});let l=a?.header;void 0!==l?.padding&&void 0===l.minimalPadding&&(r.components.header.minimalPadding=r.components.header.padding);let i=a?.composer;r.components.composer={...r.components.composer},void 0!==i?.padding&&void 0===i.expandedPadding&&(r.components.composer.expandedPadding=i.padding),void 0!==a?.input?.borderRadius&&void 0===i?.expandedBorderRadius&&(r.components.composer.expandedBorderRadius=a.input.borderRadius);let c=a?.message;if(void 0!==c?.gap&&void 0===c.fullscreenGap&&(r.components.message.fullscreenGap=r.components.message.gap),!1!==t.validate){let e=function(e){let t=[],o=[];return e.palette||t.push({path:"palette",message:"Theme must include a palette",severity:"error"}),e.semantic||o.push({path:"semantic",message:"No semantic tokens defined - defaults will be used",severity:"warning"}),e.components||o.push({path:"components",message:"No component tokens defined - defaults will be used",severity:"warning"}),{valid:0===t.length,errors:t,warnings:o}}(r);if(!e.valid)throw Error(`Theme validation failed: ${e.errors.map(e=>e.message).join(", ")}`)}if(t.plugins)for(let e of t.plugins)r=e.transform(r);return r}let F="--persona-",V=(e,t)=>{for(let[o,...a]of t){let t;for(let o of a)if(t=61===o.charCodeAt(0)?o.slice(1):e[F+o],void 0!==t)break;void 0!==t&&(e[F+o]=t)}},E=[["primary","semantic-colors-primary","palette-colors-primary-500"],["secondary","semantic-colors-secondary","palette-colors-secondary-500"],["accent","semantic-colors-accent","palette-colors-accent-500"],["surface","semantic-colors-surface","palette-colors-gray-50"],["background","semantic-colors-background","palette-colors-gray-50"],["container","semantic-colors-container","palette-colors-gray-100"],["text","semantic-colors-text","palette-colors-gray-900"],["text-muted","semantic-colors-textMuted","palette-colors-gray-500"],["text-inverse","semantic-colors-textInverse","palette-colors-gray-50"],["border","semantic-colors-border","palette-colors-gray-200"],["divider","semantic-colors-divider","palette-colors-gray-200"],["muted","text-muted"],["font-family","semantic-typography-fontFamily","palette-typography-fontFamily-sans"],["font-size","semantic-typography-fontSize","palette-typography-fontSize-base"],["font-weight","semantic-typography-fontWeight","palette-typography-fontWeight-normal"],["line-height","semantic-typography-lineHeight","palette-typography-lineHeight-normal"],["input-font-family","font-family"],["input-font-weight","font-weight"],["radius-sm","palette-radius-sm","=0.125rem"],["radius-md","palette-radius-md","=0.375rem"],["radius-lg","palette-radius-lg","=0.5rem"],["radius-xl","palette-radius-xl","=0.75rem"],["radius-full","palette-radius-full","=9999px"],["launcher-radius","components-launcher-borderRadius","palette-radius-full","=9999px"],["launcher-bg","components-launcher-background","surface"],["launcher-fg","components-launcher-foreground","primary"]];function D(e){let t=(e=>{let t=function(e){let t={};function o(a,r){for(let[n,s]of Object.entries(a)){let a=`${r}.${n}`;if("string"==typeof s){let o=N(e,s);void 0!==o&&(t[a]={path:a,value:o,type:r.includes("color")?"color":r.includes("spacing")?"spacing":r.includes("typography")?"typography":r.includes("shadow")?"shadow":r.includes("border")?"border":"color"})}else"object"==typeof s&&s&&o(s,a)}}return o(e.palette,"palette"),o(e.semantic,"semantic"),o(e.components,"components"),t}(e),o={};for(let[e,a]of Object.entries(t))o[`--persona-${e.replace(/\./g,"-")}`]=a.value;return o})(e);return V(t,E),(e=>{let t=e["--persona-components-launcher-foreground"];e["--persona-launcher-fg-muted"]=t&&t!==e["--persona-primary"]?`color-mix(in srgb, ${t} 70%, transparent)`:e["--persona-muted"]})(t),V(t,[["launcher-border","components-launcher-border","border"],["launcher-shadow","components-launcher-shadow","=0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"]]),(e=>{if("auto"===e["--persona-components-header-iconPadding"]){let t=(e["--persona-components-header-iconBackground"]??e["--persona-primary"]).trim().toLowerCase(),o=t.match(/^(?:rgba?|hsla?)\(([^)]+)\)$/)?.[1].split(/[,\s/]+/).filter(Boolean);e["--persona-components-header-iconPadding"]="transparent"===t||/^#(?:[\da-f]{3}0|[\da-f]{6}00)$/.test(t)||4===o?.length&&0===parseFloat(o[3])?"0px":"6px"}})(t),t}let q={components:{button:{ghost:{hoverBackground:"rgba(255, 255, 255, 0.08)"}},markdown:{link:{foreground:"palette.colors.primary.300"}},eventStream:{badge:{flow:{background:"palette.colors.success.900",foreground:"palette.colors.success.300"},step:{background:"palette.colors.primary.800",foreground:"palette.colors.primary.200"},reasoning:{background:"palette.colors.warning.900",foreground:"palette.colors.warning.300"},tool:{background:"palette.colors.purple.900",foreground:"palette.colors.purple.300"},agent:{background:"palette.colors.teal.900",foreground:"palette.colors.teal.300"},error:{background:"palette.colors.error.900",foreground:"palette.colors.error.300"},default:{background:"palette.colors.gray.800",foreground:"palette.colors.gray.300"}}},history:{dangerForeground:"#f87171",confirm:{dangerBackground:"palette.colors.error.600",scrim:"rgba(0, 0, 0, 0.6)"}}}},U={colors:{primary:{50:"#ffffff",100:"#f5f5f5",200:"#d4d4d4",300:"#a3a3a3",400:"#737373",500:"#171717",600:"#0f0f0f",700:"#0a0a0a",800:"#050505",900:"#030303",950:"#000000"},secondary:{50:"#f5f3ff",100:"#ede9fe",200:"#ddd6fe",300:"#c4b5fd",400:"#a78bfa",500:"#8b5cf6",600:"#7c3aed",700:"#6d28d9",800:"#5b21b6",900:"#4c1d95",950:"#2e1065"},accent:{50:"#ecfeff",100:"#cffafe",200:"#a5f3fc",300:"#67e8f9",400:"#22d3ee",500:"#06b6d4",600:"#0891b2",700:"#0e7490",800:"#155e75",900:"#164e63",950:"#083344"},gray:{50:"#f9fafb",100:"#f3f4f6",200:"#e5e7eb",300:"#d1d5db",400:"#9ca3af",500:"#6b7280",600:"#4b5563",700:"#374151",800:"#1f2937",900:"#111827",950:"#030712"},success:{50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d"},warning:{50:"#fefce8",100:"#fef9c3",200:"#fef08a",300:"#fde047",400:"#facc15",500:"#eab308",600:"#ca8a04",700:"#a16207",800:"#854d0e",900:"#713f12"},error:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d"}}},G={...U,colors:{...U.colors,primary:{50:"#0f0f10",100:"#27272a",200:"#3f3f46",300:"#52525b",400:"#71717a",500:"#f4f4f5",600:"#e4e4e7",700:"#d4d4d8",800:"#a1a1aa",900:"#fafafa",950:"#ffffff"},gray:{50:"#1a1a1b",100:"#27272a",200:"#2a2a2d",300:"#52525b",400:"#71717a",500:"#a1a1aa",600:"#b4b4bd",700:"#d4d4d8",800:"#e4e4e7",900:"#f4f4f5",950:"#fafafa"}}},X=q,Y={semantic:{colors:{primary:"palette.colors.primary.500",accent:"palette.colors.primary.600",background:"#0f0f10",surface:"palette.colors.gray.50",container:"#1c1c20",text:"palette.colors.gray.900",textMuted:"palette.colors.gray.500",textInverse:"#0f0f10",border:"palette.colors.gray.200",divider:"palette.colors.gray.200",interactive:{default:"palette.colors.primary.600",hover:"palette.colors.primary.700",focus:"palette.colors.primary.600",active:"palette.colors.primary.600"}}},components:{...q.components,button:{...q.components?.button,primary:{background:"semantic.colors.primary",foreground:"palette.colors.primary.50"}},markdown:{inlineCode:{background:"palette.colors.gray.100",foreground:"semantic.colors.text"},link:{foreground:"semantic.colors.accent"},codeBlock:{background:"semantic.colors.container",borderColor:"semantic.colors.border",textColor:"semantic.colors.text"},table:{headerBackground:"palette.colors.gray.100",borderColor:"semantic.colors.border"},blockquote:{background:"semantic.colors.container",borderColor:"palette.colors.gray.300",textColor:"semantic.colors.textMuted"}},eventStream:{...q.components?.eventStream,badge:{...q.components?.eventStream?.badge,step:{background:"palette.colors.gray.100",foreground:"palette.colors.gray.700"},default:{background:"palette.colors.gray.100",foreground:"palette.colors.gray.700"}}}}},_=e=>{if(e&&"object"==typeof e&&!Array.isArray(e))return e},Z=e=>(e=>{let t=e?.colorScheme??g(e?.brand)??"light";return"light"===t?"light":"dark"===t||typeof document<"u"&&document.documentElement.classList.contains("dark")||typeof window<"u"&&window.matchMedia?.("(prefers-color-scheme: dark)").matches?"dark":"light"})(e),Q=e=>{let a=Z(e),r=i(((e,t="light",o,a=!1)=>{let r={};if(!e)return r;let n=d(e.accent);if(n){let e={};for(let[t,o]of[[50,.96],[100,.9],[200,.75],[300,.55],[400,.25]])e[t]=m(n,255,o);e[500]=u(n);for(let[t,o]of[[600,.15],[700,.3],[800,.45],[900,.6],[950,.75]])e[t]=m(n,0,o);let t=h(n);r.palette={colors:{primary:e,accent:e}},r.semantic={colors:{primary:e[500],accent:e[500],interactive:{default:e[500],hover:e[600],focus:e[500],active:e[700]}}},r.components={button:{primary:{background:e[500],foreground:t}},launcher:{background:e[500],foreground:t},header:a?{background:"semantic.colors.container",foreground:"semantic.colors.text",iconBackground:"transparent",iconForeground:"semantic.colors.text"}:{background:e[500],foreground:t,iconBackground:e[500],iconForeground:t},approval:{approve:{foreground:t}},message:{user:a?{background:"color-mix(in srgb, var(--persona-primary) 12%, var(--persona-container))",text:"semantic.colors.text"}:{background:e[500],text:t}}}}let s=d(e.neutral);if(s){let e="dark"===t,o=e===p(s)<.18?s:d(m(s,e?0:255,.9)),a=u(o),n=m(o,e?255:0,e?.06:.025),l=m(o,e?255:0,e?.2:.16),i=h(o),c={};for(let[e,t]of[[50,0],[100,.06],[200,.16],[300,.28],[400,.45],[500,.65],[600,.72],[700,.8],[800,.9],[900,.97],[950,1]])c[e]=m(o,"#ffffff"===i?255:0,t);r.palette={...r.palette,colors:{...r.palette?.colors,gray:c}},r.semantic={...r.semantic,colors:{...r.semantic?.colors,surface:a,background:a,container:n,border:l,divider:l,text:i,textMuted:m(o,"#ffffff"===i?255:0,.65)}},r.components={...r.components,panel:{background:a},header:{...r.components?.header,background:a,foreground:i},composer:{footerBackground:a}}}if(n){let e=d(r.semantic?.colors?.surface)??("dark"===t?[15,15,16]:[255,255,255]),o=u(n),a="#ffffff"===h(e)?255:0;for(let t=0;t<=1;t+=.1){o=m(n,a,t);let r=p(d(o)),s=p(e);if((Math.max(r,s)+.05)/(Math.min(r,s)+.05)>=4.5)break}r.components={...r.components,markdown:{link:{foreground:o}},input:{focus:{border:o,ring:o}}}}e.font?.trim()&&(r.semantic={...r.semantic,typography:{fontFamily:e.font}});let l={none:"0px",sm:"4px",md:"8px",lg:"16px"}[e.radius??"none"];e.radius&&l&&(r.palette={...r.palette,radius:{none:"0px",sm:l,md:l,lg:l,xl:l,"2xl":l}},r.components={...r.components,input:{...r.components?.input,borderRadius:l},header:{...r.components?.header,controlBorderRadius:l}});let c={compact:[13,44,8],comfortable:[14,48,12],spacious:[15,52,16]}[e.density??"comfortable"];if(e.density&&c){let[e,t,o]=c;r.semantic={...r.semantic,typography:{...r.semantic?.typography,fontSize:`${e}px`}},r.components={...r.components,header:{...r.components?.header,minHeight:`${t}px`,padding:`${o}px 16px`,minimalPadding:`${o}px 16px`},history:{railHeader:{minHeight:`${t}px`}},composer:{...r.components?.composer,fontSize:`${e}px`,padding:`${o}px`,gap:o/2+"px"},message:{...r.components?.message,gap:`${o}px`,user:{...r.components?.message?.user,fontSize:`${e}px`},assistant:{fontSize:`${e}px`}}}}if(e.elevation&&["flat","subtle","raised"].includes(e.elevation)){let t="flat"===e.elevation,n=t?"none":"subtle"===e.elevation?"0 2px 8px rgba(0, 0, 0, 0.08)":"0 12px 32px rgba(0, 0, 0, 0.18)",s=t?"1px solid var(--persona-border)":"1px solid color-mix(in srgb, var(--persona-border) 65%, transparent)";r.palette={...r.palette,shadows:{sm:n,md:n,lg:n,xl:n,"2xl":n}};let l=(e,o="")=>{let r={};if(a&&"message.assistant"===o)return r;for(let[a,i]of Object.entries(e))if(a.toLowerCase().endsWith("shadow")){r[a]=n;let o="shadow"===a?"border":a.replace(/Shadow$/,"Border");o in e&&(r[o]="string"==typeof e[o]&&e[o].includes("solid")?s:t?"semantic.colors.border":"color-mix(in srgb, var(--persona-border) 65%, transparent)")}else if(i&&"object"==typeof i){let e=l(i,o?`${o}.${a}`:a);Object.keys(e).length&&(r[a]=e)}return r},c=o?l(o):{};r.components=i(r.components,c),r.components={...r.components,panel:{...r.components?.panel,shadow:n,modes:{floating:{shadow:n,border:s},inline:{shadow:n,border:s},docked:{shadow:n,border:s},sidebar:{shadow:n,border:s},mobile:{shadow:n,border:s}}},launcher:{...r.components?.launcher,shadow:n,border:"semantic.colors.border"},composer:{...r.components?.composer,shadow:n,borderColor:"semantic.colors.border"},toolBubble:{shadow:n},reasoningBubble:{shadow:n}}}return r})(e?.brand,a,P(e?.future).components,e?.future?.v5Defaults),_(e?.theme)),n=i({components:{launcher:"circle"===t(e)?o:{...j.launcher,...e?.future?.v5Defaults?{offset:"1.5rem"}:{}},...s(e)?{panel:{background:"transparent",modes:{inline:{border:"none",shadow:"none",borderRadius:"0"}}},header:{background:"transparent"},message:{background:"transparent"},composer:{footerBackground:"transparent",footerBorder:"none",overlayBand:"transparent"}}:{}}},r),l=_(e?.darkTheme),c=((e,t)=>{if(!t||!(e=>!!e&&"launcher"in e&&(!0===e.launcher?.sidebarMode||"docked"===e.launcher?.mountMode))(t))return e;let o=t.theme?.components?.panel?.width,a=t.darkTheme?.components?.panel?.width;return null==("dark"===Z(t)?a??o:o)?{...e,components:{...e.components,panel:{...e.components.panel,width:"v5"===C(t)?"400px":"420px"}}}:e})("dark"===a?((e,t={})=>{let o=(e=>"v5"===C({future:e})?{palette:G,components:Y}:{palette:U,components:X})(t.future),a=i(o.components,e??{})??{};return $({...a,palette:{...a.palette,colors:"v5"===C(t)?i(o.palette.colors,a.palette?.colors):{...o.palette.colors,...a.palette?.colors}}},{validate:!1,future:t.future})})(i(n??{},l??{}),{future:e?.future}):((e,t={})=>$(e,t))(n,{future:e?.future}),e);return Object.defineProperty(c,J,{value:[...f,"suggestion.chip.padding","suggestion.chip.fontWeight"].filter(t=>((e,t,o)=>{let a=e,r=o??a?.colorScheme??g(a?.brand)??"light",n="dark"===r||"auto"===r&&(typeof document<"u"&&document.documentElement.classList.contains("dark")||typeof window<"u"&&window.matchMedia?.("(prefers-color-scheme: dark)").matches);return y(e,`theme.components.${t}`)||n&&y(e,`darkTheme.components.${t}`)})(e,t,a))}),c},J=Symbol("persona.themeConsumerPaths"),K=new WeakMap,ee=(e,t)=>{te(e,D(Q(t)),t)},te=(e,t,o)=>{for(let o of K.get(e)??[])o in t||e.style.removeProperty(o);K.set(e,Object.keys(t));for(let[o,a]of Object.entries(t))e.style.setProperty(o,a);e.setAttribute("data-persona-color-scheme",Z(o)),e.setAttribute("data-persona-defaults",C(o))},oe=e=>"docked"===(e?.launcher?.mountMode??"floating"),ae=(e,t=24,o="currentColor",a=2)=>{if(!Array.isArray(e))return null;let r=document.createElementNS("http://www.w3.org/2000/svg","svg");for(let[e,n]of Object.entries({width:String(t),height:String(t),viewBox:"0 0 24 24",fill:"none",stroke:o,"stroke-width":String(a),"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"}))r.setAttribute(e,n);for(let t of e){if(!Array.isArray(t)||t.length<2)continue;let e=t[0],o=t[1];if(!o)continue;let a=document.createElementNS("http://www.w3.org/2000/svg",e);for(let[e,t]of Object.entries(o))"stroke"!==e&&a.setAttribute(e,String(t));r.appendChild(a)}return r},{setLoader:re,load:ne}=(e=>{let{fallbackImport:t,resetOnSetLoader:o=!1}=e,a=null,r=null,n=null;return{setLoader:e=>{a=e,o&&(r=null,n=null)},load:()=>{if(r)return Promise.resolve(r);if(n)return n;let e=a??t;try{return n=e().then(e=>(r=e,e)).catch(e=>{throw n=null,e}),n}catch(e){return Promise.reject(e)}},provide:e=>{r=e},getSync:()=>r}})({fallbackImport:()=>import("@runtypelabs/persona/icons-extra")}),se=re,le=ne,ie="brain.toolbox.wrench.circle.database.terminal.user.mail.phone.calendar.clock.building.map-pin.lock.key.credit-card.hash.globe.link.circle-check.circle-x.triangle-alert.info.ban.shield.ellipsis-vertical.house.pen-line.save.share.funnel.settings.rotate-cw.shopping-cart.shopping-bag.package.truck.tag.gift.receipt.wallet.store.dollar-sign.percent.play.pause.volume-x.camera.image.film.headphones.message-circle.bell.heart.eye-off.bookmark.calendar-days.timer.folder.folder-open.files.chart-column.sparkles.zap.sun.moon.flag.lightbulb.monitor.smartphone".split("."),ce=new Map(Object.entries({activity:[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"}]],"arrow-down":[["path",{d:"M12 5v14"}],["path",{d:"m19 12-7 7-7-7"}]],"arrow-up":[["path",{d:"m5 12 7-7 7 7"}],["path",{d:"M12 19V5"}]],"arrow-up-right":[["path",{d:"M7 7h10v10"}],["path",{d:"M7 17 17 7"}]],bot:[["path",{d:"M12 8V4H8"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2"}],["path",{d:"M2 14h2"}],["path",{d:"M20 14h2"}],["path",{d:"M15 13v2"}],["path",{d:"M9 13v2"}]],"chevron-down":[["path",{d:"m6 9 6 6 6-6"}]],"chevron-up":[["path",{d:"m18 15-6-6-6 6"}]],"chevron-right":[["path",{d:"m9 18 6-6-6-6"}]],"chevron-left":[["path",{d:"m15 18-6-6 6-6"}]],check:[["path",{d:"M20 6 9 17l-5-5"}]],clipboard:[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"}]],"clipboard-copy":[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v4"}],["path",{d:"M21 14H11"}],["path",{d:"m15 10-4 4 4 4"}]],"code-xml":[["path",{d:"m18 16 4-4-4-4"}],["path",{d:"m6 8-4 4 4 4"}],["path",{d:"m14.5 4-5 16"}]],copy:[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]],file:[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5"}]],"file-code":[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{d:"M10 12.5 8 15l2 2.5"}],["path",{d:"m14 12.5 2 2.5-2 2.5"}]],"file-spreadsheet":[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{d:"M8 13h2"}],["path",{d:"M14 13h2"}],["path",{d:"M8 17h2"}],["path",{d:"M14 17h2"}]],"file-text":[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{d:"M10 9H8"}],["path",{d:"M16 13H8"}],["path",{d:"M16 17H8"}]],"image-plus":[["path",{d:"M16 5h6"}],["path",{d:"M19 2v6"}],["path",{d:"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"}],["circle",{cx:"9",cy:"9",r:"2"}]],loader:[["path",{d:"M12 2v4"}],["path",{d:"m16.2 7.8 2.9-2.9"}],["path",{d:"M18 12h4"}],["path",{d:"m16.2 16.2 2.9 2.9"}],["path",{d:"M12 18v4"}],["path",{d:"m4.9 19.1 2.9-2.9"}],["path",{d:"M2 12h4"}],["path",{d:"m4.9 4.9 2.9 2.9"}]],"loader-circle":[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56"}]],mic:[["path",{d:"M12 19v3"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2"}],["rect",{x:"9",y:"2",width:"6",height:"13",rx:"3"}]],paperclip:[["path",{d:"m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"}]],quote:[["path",{d:"M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"}],["path",{d:"M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"}]],"refresh-cw":[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]],search:[["path",{d:"m21 21-4.34-4.34"}],["circle",{cx:"11",cy:"11",r:"8"}]],send:[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"}],["path",{d:"m21.854 2.147-10.94 10.939"}]],"shield-alert":[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}],["path",{d:"M12 8v4"}],["path",{d:"M12 16h.01"}]],"shield-check":[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}],["path",{d:"m9 12 2 2 4-4"}]],"shield-x":[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}],["path",{d:"m14.5 9.5-5 5"}],["path",{d:"m9.5 9.5 5 5"}]],square:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]],"square-text":[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M7 8h10M7 12h10M7 16h6"}]],"thumbs-down":[["path",{d:"M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"}],["path",{d:"M17 14V2"}]],"thumbs-up":[["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"}],["path",{d:"M7 10v12"}]],upload:[["path",{d:"M12 3v12"}],["path",{d:"m17 8-5-5-5 5"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}]],"volume-2":[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"}],["path",{d:"M16 9a5 5 0 0 1 0 6"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728"}]],"voice-bars":[["path",{d:"M4 10v4"}],["path",{d:"M8 6v12"}],["path",{d:"M12 3v18"}],["path",{d:"M16 7v10"}],["path",{d:"M20 10v4"}]],x:[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]],"at-sign":[["circle",{cx:"12",cy:"12",r:"4"}],["path",{d:"M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"}]],"arrow-left":[["path",{d:"m12 19-7-7 7-7"}],["path",{d:"M19 12H5"}]],"arrow-right":[["path",{d:"M5 12h14"}],["path",{d:"m12 5 7 7-7 7"}]],"external-link":[["path",{d:"M15 3h6v6"}],["path",{d:"M10 14 21 3"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]],ellipsis:[["circle",{cx:"12",cy:"12",r:"1"}],["circle",{cx:"19",cy:"12",r:"1"}],["circle",{cx:"5",cy:"12",r:"1"}]],menu:[["path",{d:"M4 5h16"}],["path",{d:"M4 12h16"}],["path",{d:"M4 19h16"}]],"panel-left":[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M9 3v18"}]],plus:[["path",{d:"M5 12h14"}],["path",{d:"M12 5v14"}]],minus:[["path",{d:"M5 12h14"}]],pencil:[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{d:"m15 5 4 4"}]],trash:[["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]],"trash-2":[["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]],download:[["path",{d:"M12 15V3"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["path",{d:"m7 10 5 5 5-5"}]],maximize:[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3"}]],minimize:[["path",{d:"M8 3v3a2 2 0 0 1-2 2H3"}],["path",{d:"M21 8h-3a2 2 0 0 1-2-2V3"}],["path",{d:"M3 16h3a2 2 0 0 1 2 2v3"}],["path",{d:"M16 21v-3a2 2 0 0 1 2-2h3"}]],"message-square":[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"}]],star:[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"}]],eye:[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"}],["circle",{cx:"12",cy:"12",r:"3"}]],history:[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["path",{d:"M3 3v5h5"}],["path",{d:"M12 7v5l4 2"}]]})),de=new Map,pe=!1,ue=new Set,me=()=>{(pe?null:le().then(e=>(e=>{if(!pe){for(let[t,o]of Object.entries(e))ce.has(t)||ce.set(t,o);pe=!0,(()=>{for(let[e,t]of de){let o=ce.get(t);if(!o)continue;de.delete(e);let a=ae(o);if(a)for(e.removeAttribute("data-persona-icon-pending");a.firstChild;)e.appendChild(a.firstChild)}})(),(()=>{
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
let e=[...ue];ue.clear();for(let t of e)try{t()}catch{}})()}})(e.EXTRA_LUCIDE_ICONS)))?.catch(e=>{console.warn("[Persona] Failed to load the icons-extra chunk",e)})},he=(e,t=24,o="currentColor",a=2)=>{let r=ce.get(e);if(r)return ae(r,t,o,a);if(ie.includes(e)){let r=((e,t,o)=>{let a=ae([],e,t,o);return a.setAttribute("data-persona-icon-pending","true"),a})(t,o,a);return de.size>=500&&de.delete(de.keys().next().value),de.set(r,e),me(),r}return console.warn(`Unknown Persona icon "${e}". Use registerIcons().`),null},ge=(e,o)=>{let r=a("button");r.type="button",r.innerHTML='\n    <span class="persona-inline-flex persona-items-center persona-justify-center persona-rounded-full persona-bg-persona-primary persona-text-white" data-role="launcher-icon">💬</span>\n    <img data-role="launcher-image" class="persona-rounded-full persona-object-cover" alt="" style="display:none" />\n    <span class="persona-flex persona-min-w-0 persona-flex-1 persona-flex-col persona-items-start persona-text-left">\n      <span class="persona-block persona-w-full persona-truncate persona-text-sm persona-font-semibold persona-text-persona-launcher" data-role="launcher-title"></span>\n      <span class="persona-block persona-w-full persona-truncate persona-text-xs persona-text-persona-launcher-muted" data-role="launcher-subtitle"></span>\n    </span>\n    <span class="persona-ml-2 persona-grid persona-place-items-center persona-rounded-full persona-bg-persona-primary persona-text-persona-call-to-action" data-role="launcher-call-to-action-icon">↗</span>\n  ',r.addEventListener("click",o);let s=e=>{let o=e.launcher??{},a=oe(e),s="circle"===t(e);s?(r.dataset.personaLauncherVariant="circle",r.setAttribute("aria-label",o.title??"Open chat")):(r.removeAttribute("data-persona-launcher-variant"),r.removeAttribute("aria-label"));let l=r.querySelector("[data-role='launcher-title']");if(l){let e=o.title??"Chat Assistant";l.textContent=e,l.setAttribute("title",e)}let i=r.querySelector("[data-role='launcher-subtitle']");if(i){let e=o.subtitle??"Here to help you get answers fast";i.textContent=e,i.setAttribute("title",e)}let c=r.querySelector(".persona-flex-col");c&&(o.textHidden||a||s?c.style.display="none":c.style.display="");let d=r.querySelector("[data-role='launcher-icon']");if(d)if(o.agentIconHidden)d.style.display="none";else{let e=o.agentIconSize??"40px";if(d.style.height=e,d.style.width=e,o.agentIconBackgroundColor?(d.style.backgroundColor=o.agentIconBackgroundColor,d.classList.remove("persona-bg-persona-primary")):(d.style.backgroundColor="",d.classList.add("persona-bg-persona-primary")),d.innerHTML="",o.agentIconName){let t=parseFloat(e)||24,a=he(o.agentIconName,.6*t,"var(--persona-text-inverse, #ffffff)",1.5);a?(d.appendChild(a),d.style.display=""):(d.textContent=o.agentIconText??"💬",d.style.display="")}else o.iconUrl?d.style.display="none":(d.textContent=o.agentIconText??"💬",d.style.display="")}let p=r.querySelector("[data-role='launcher-image']");if(p){let e=o.agentIconSize??"40px";p.style.height=e,p.style.width=e,!o.iconUrl||o.agentIconName||o.agentIconHidden?p.style.display="none":(p.src=o.iconUrl,p.style.display="block")}let u=r.querySelector("[data-role='launcher-call-to-action-icon']");if(u){let e=o.callToActionIconSize??"32px";u.style.height=e,u.style.width=e,o.callToActionIconBackgroundColor?(u.style.backgroundColor=o.callToActionIconBackgroundColor,u.classList.remove("persona-bg-persona-primary")):(u.style.backgroundColor="",u.classList.add("persona-bg-persona-primary")),o.callToActionIconColor?(u.style.color=o.callToActionIconColor,u.classList.remove("persona-text-persona-call-to-action")):(u.style.color="",u.classList.add("persona-text-persona-call-to-action"));let t=0;if(o.callToActionIconPadding?(u.style.boxSizing="border-box",u.style.padding=o.callToActionIconPadding,t=2*(parseFloat(o.callToActionIconPadding)||0)):(u.style.boxSizing="",u.style.padding=""),o.callToActionIconHidden||s)u.style.display="none";else if(u.style.display=a?"none":"",u.innerHTML="",o.callToActionIconName){let a=Math.max((parseFloat(e)||24)-t,8),r=he(o.callToActionIconName,a,"currentColor",1.5);r?u.appendChild(r):u.textContent=o.callToActionIconText??"↗"}else u.textContent=o.callToActionIconText??"↗"}let m=o.position&&n[o.position]?n[o.position]:n["bottom-right"];r.className=a?"persona-relative persona-mt-4 persona-mb-4 persona-mx-auto persona-flex persona-items-center persona-justify-center persona-rounded-launcher persona-bg-persona-launcher persona-transition hover:persona-translate-y-[-2px] persona-cursor-pointer":`persona-fixed persona-flex persona-items-center persona-gap-3 persona-rounded-launcher persona-bg-persona-launcher persona-py-2.5 persona-pl-3 persona-pr-3 persona-transition hover:persona-translate-y-[-2px] persona-cursor-pointer ${m}`,a||(r.style.zIndex=String(o.zIndex??1e5)),r.style.border=o.border??"1px solid var(--persona-launcher-border, var(--persona-border, #e5e7eb))",r.style.boxShadow=void 0===o.shadow?"var(--persona-launcher-shadow, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1))":""===o.shadow.trim()?"none":o.shadow,a?(r.style.width="0",r.style.minWidth="0",r.style.maxWidth="0",r.style.padding="0",r.style.overflow="hidden",r.style.border="none",r.style.boxShadow="none"):(r.style.width="",r.style.minWidth="",r.style.maxWidth=o.collapsedMaxWidth??"",r.style.justifyContent="",r.style.padding="",r.style.overflow="")};return e&&s(e),{element:r,update:s,destroy:()=>{r.removeEventListener("click",o),r.remove()}}},fe=new Set,be=e=>{let t=e?.persistState;return`${("object"==typeof t?t?.keyPrefix:void 0)??"persona-"}teaser-dismissed`},ye=(e,t)=>{let o=a("div","persona-launcher-surface");o.setAttribute("data-persona-launcher-surface","true");let s=e??{},l=null,i=null,c=null,d=null,p=null,u=!1,m=!1,h=!1,g=!1,f=()=>"once"===(l?.frequency??"once")&&!1!==s.persistState,b=()=>{null!==p&&(clearTimeout(p),p=null)},y=e=>{b(),h=!0,i&&u&&(u=!1,i.hidden=!0),((e,t)=>{if(fe.add(e),t)try{window.localStorage.setItem(e,"1")}catch{}})(be(s),e&&f())},x=e=>{l&&!h&&y("user"===e&&u)},v=()=>{p=null,i&&!h&&!g&&(m=!0,u=!0,i.hidden=!1,!(typeof window<"u"&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches||"function"!=typeof i.animate)&&i.animate([{opacity:"0",transform:"translateY(6px)"},{opacity:"1",transform:"none"}],{duration:220,easing:"ease-out",fill:"backwards"}))},w=()=>{y(f()),t()},k=e=>{e.stopPropagation(),y(f())},M=ge(e,()=>{x("user"),t()}),S=()=>{b(),d?.removeEventListener("click",w),c?.removeEventListener("click",k),i?.remove(),i=null,d=null,c=null,u=!1},C=()=>{let e=s.launcher?.position??"bottom-right",t=n[e]??n["bottom-right"];i?(o.className=((...e)=>e.filter(Boolean).join(" "))("persona-launcher-surface",t),o.setAttribute("data-teaser",e),o.style.zIndex=String(s.launcher?.zIndex??1e5),M.element.style.position="static"):(o.className="persona-launcher-surface",o.removeAttribute("data-teaser"),o.style.zIndex="",M.element.style.position="")},B=e=>{let t=(e=>{let t=e?.launcher?.teaser;return t&&t.text&&!1!==e?.launcher?.enabled&&!oe(e??{})?t:null})(e);l=t,t?(i||(d=r("button",{className:"persona-launcher-teaser-text",attrs:{type:"button"}}),d.addEventListener("click",w),c=r("button",{className:"persona-launcher-teaser-dismiss",attrs:{type:"button"},text:"×"}),c.addEventListener("click",k),i=r("div",{className:"persona-launcher-teaser",attrs:{"data-persona-launcher-teaser":"true",role:"status","aria-live":"polite",hidden:""}},d,c),o.insertBefore(i,M.element)),d.textContent=t.text,c.hidden=!1===t.dismissible,c.setAttribute("aria-label",t.dismissLabel??"Dismiss message"),l&&i&&(h||m||g||((e,t)=>{if(fe.has(e))return!0;if(!t)return!1;try{return"1"===window.localStorage.getItem(e)}catch{return!1}})(be(s),f())||(b(),p=setTimeout(v,Math.max(0,l.delayMs??0))))):S()};return o.appendChild(M.element),e&&(B(e),C()),{element:o,launcher:M,get teaser(){return i?{element:i,show:v,dismiss:y}:null},setPanelOpen:(e,t="user")=>{g=e,e&&x(t)},update:e=>{s=e,M.update(e),B(e),C()},destroy:()=>{S(),M.destroy(),o.remove()}}},xe=typeof document<"u"&&(document.currentScript?.src??"").replace(/^https:\/\/cdn\.runtype\.com\/persona\/latest\//,"https://cdn.runtype.com/persona/4.32.2/")||null;se(()=>{let e=xe?.replace(/launcher\.global\.js($|\?)/,"icons-extra.js$1");return e&&e!==xe?import(e):Promise.reject(Error(`Could not derive the icons-extra.js URL from the launcher script URL (${xe??"unavailable"}). Self-hosted deployments that rename launcher.global.js should host icons-extra.js alongside it.`))});let ve="data-persona-launcher-critical",we=e=>({...e,launcher:{...v,...!0===e?.future?.v5Defaults?M:{},...e?.launcher,dock:{...v.dock,...e?.launcher?.dock}}});return e.CRITICAL_LAUNCHER_ATTR=ve,e.mount=e=>{if(typeof window>"u"||typeof document>"u")throw Error("AgentWidgetLauncher can only be mounted in a browser environment");let{onOpen:t}=e,o=(e=>{if(e instanceof HTMLElement)return e;if("string"==typeof e){let t=document.querySelector(e);if(t)return t}return document.body})(e.target),a=we(e.config),r=document.createElement("div");r.setAttribute("data-persona-root","true"),r.setAttribute(ve,"true"),ee(r,a);let n=ye(a,t);return r.appendChild(n.element),o.appendChild(r),{root:r,element:n.launcher.element,update:e=>{let t=we(e);ee(r,t),n.update(t)},destroy:()=>{n.destroy(),r.remove()}}},e}({});
//# sourceMappingURL=launcher.global.js.map