var b=`
class PersonaPcmPlayerProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super()
    const opts = (options && options.processorOptions) || {}
    this.waterline = opts.waterlineSamples > 0 ? opts.waterlineSamples : 3600
    this.chunks = []
    this.readOffset = 0
    this.buffered = 0
    this.waiting = true
    // 'drained' must mean "the reply finished playing", not "momentary
    // underrun": a jitter gap empties the buffer mid-reply too, and firing
    // there would flap the UI status and race the audio_end handler. Only
    // report drained once eos has been signalled.
    this.eosSeen = false
    // Fire 'started' once, when the prebuffer first releases into playback, so a
    // consumer can flip UI from loading\u2192playing only when audio is truly audible.
    // A mid-reply underrun re-buffers (waiting=true) but must NOT re-signal.
    this.startedSignaled = false
    // Continuous (speech-to-speech) streams never send eos, so a tail held below
    // the waterline is released once input has been quiet for one waterline.
    this.continuous = false
    this.idle = 0
    this.port.onmessage = (e) => {
      const msg = e.data
      if (msg.type === 'continuous') {
        this.continuous = msg.enabled
      } else if (msg.type === 'push') {
        this.idle = 0
        this.eosSeen = false
        this.chunks.push(msg.samples)
        this.buffered += msg.samples.length
        if (this.waiting && this.buffered >= this.waterline) {
          this.waiting = false
          this.signalStarted()
        }
      } else if (msg.type === 'eos') {
        this.eosSeen = true
        if (this.waiting && this.buffered > 0) {
          this.waiting = false
          this.signalStarted()
        }
        if (this.buffered === 0) {
          this.eosSeen = false
          this.port.postMessage({ type: 'drained' })
        }
      } else if (msg.type === 'clear') {
        this.chunks = []
        this.readOffset = 0
        this.buffered = 0
        this.waiting = true
        this.eosSeen = false
        this.startedSignaled = false
      }
    }
  }
  signalStarted() {
    if (!this.startedSignaled) {
      this.startedSignaled = true
      this.port.postMessage({ type: 'started' })
    }
  }
  process(inputs, outputs) {
    const out = outputs[0][0]
    if (!out) return true
    if (this.waiting) {
      // outputs are pre-zeroed: silence while (re)buffering
      if (!this.continuous || this.buffered === 0) return true
      this.idle += out.length
      if (this.idle < this.waterline) return true
      this.waiting = false
      this.signalStarted()
    }
    let i = 0
    while (i < out.length && this.buffered > 0) {
      const chunk = this.chunks[0]
      out[i++] = chunk[this.readOffset++]
      this.buffered--
      if (this.readOffset >= chunk.length) {
        this.chunks.shift()
        this.readOffset = 0
      }
    }
    if (this.buffered === 0) {
      this.waiting = true // mid-reply underrun: re-buffer silently
      if (this.eosSeen) {
        this.eosSeen = false
        this.port.postMessage({ type: 'drained' })
      }
    }
    return true
  }
}
registerProcessor('persona-pcm-player', PersonaPcmPlayerProcessor)
`;function S(r){let e=r.length>>1,t=new Float32Array(e),i=new DataView(r.buffer,r.byteOffset,r.byteLength);for(let s=0;s<e;s++)t[s]=i.getInt16(s*2,!0)/32768;return t}async function g(r={}){let e=r.prebufferMs??150,t=Math.max(1,Math.round(24e3*e/1e3)),i=window.AudioContext||window.webkitAudioContext,s=new i({sampleRate:24e3});s.state==="suspended"&&await s.resume().catch(()=>{});let o=URL.createObjectURL(new Blob([b],{type:"application/javascript"}));try{await s.audioWorklet.addModule(o)}catch(a){throw s.close().catch(()=>{}),a}finally{URL.revokeObjectURL(o)}let n=new AudioWorkletNode(s,"persona-pcm-player",{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[1],processorOptions:{waterlineSamples:t}});n.connect(s.destination);let u=[],f=[],l=null;return n.port.onmessage=a=>{let h=a.data?.type;if(h==="started"){let c=f.slice();f=[],c.forEach(d=>d())}else if(h==="drained"){let c=u.slice();u=[],c.forEach(d=>d())}},{enqueue(a){let h=a;if(l){let d=new Uint8Array(l.length+a.length);d.set(l),d.set(a,l.length),h=d,l=null}if(h.length%2!==0&&(l=new Uint8Array([h[h.length-1]]),h=h.subarray(0,h.length-1)),h.length===0)return;let c=S(h);c.length!==0&&n.port.postMessage({type:"push",samples:c},[c.buffer])},setContinuousMode(a){n.port.postMessage({type:"continuous",enabled:a})},markStreamEnd(){n.port.postMessage({type:"eos"})},flush(){l=null,u=[],f=[],n.port.postMessage({type:"clear"})},onFinished(a){u.push(a)},onStarted(a){f.push(a)},pause(){s.state==="running"&&s.suspend()},resume(){s.state==="suspended"&&s.resume()},destroy(){n.port.onmessage=null;try{n.disconnect()}catch{}return s.close().catch(()=>{})}}}function P(){return g()}var p=class{#e=null;#i=0;#t=[];#s=[];#r=[];#o=!1;#u=!1;#c=0;#p=!1;#y=!1;#l;#a=[];#d=0;#b=!1;#m;#f;#h;#n=null;constructor(e=24e3,t={}){this.#f=e;let i=Math.max(0,t.prebufferMs??0);this.#h=Math.round(e*i/1e3),this.#l=this.#h>0}#w(){if(!this.#e){let t=typeof window<"u"?window:void 0;if(!t)throw new Error("AudioPlaybackManager requires a browser environment");let i=t.AudioContext||t.webkitAudioContext;this.#e=new i({sampleRate:this.#f})}let e=this.#e;return e.state==="suspended"&&!this.#y&&e.resume(),e}enqueue(e){if(e.length===0)return;let t=e;if(this.#n){let s=new Uint8Array(this.#n.length+e.length);s.set(this.#n),s.set(e,this.#n.length),t=s,this.#n=null}if(t.length%2!==0&&(this.#n=new Uint8Array([t[t.length-1]]),t=t.subarray(0,t.length-1)),t.length===0)return;let i=this.#E(t);i.length!==0&&(this.#l?(this.#a.push(i),this.#d+=i.length,clearTimeout(this.#m),this.#d>=this.#h?this.#g():this.#b&&(this.#m=setTimeout(()=>this.#g(),this.#h/this.#f*1e3))):this.#S(i))}markStreamEnd(){this.#a.length>0&&this.#g(),this.#u=!0,this.#P()}flush(){for(let e of this.#t){e.onended=null;try{e.stop(),e.disconnect()}catch{}}this.#t=[],this.#c=0,this.#i=0,this.#o=!1,this.#u=!1,this.#s=[],this.#r=[],this.#n=null,this.#a=[],this.#d=0,this.#l=this.#h>0,this.#p=!1,clearTimeout(this.#m)}setContinuousMode(e){this.#b=e}isPlaying(){return this.#o}onFinished(e){this.#s.push(e)}onStarted(e){this.#r.push(e)}pause(){this.#y=!0,this.#e&&this.#e.state==="running"&&this.#e.suspend()}resume(){this.#y=!1,this.#e&&this.#e.state==="suspended"&&this.#e.resume()}async destroy(){this.flush(),this.#e&&(await this.#e.close(),this.#e=null)}#g(){this.#l=!1;let e=this.#a;this.#a=[],this.#d=0;for(let t of e)this.#S(t)}#S(e){if(e.length===0)return;let t=this.#w(),i=t.createBuffer(1,e.length,this.#f);i.getChannelData(0).set(e);let s=t.createBufferSource();s.buffer=i,s.connect(t.destination);let o=t.currentTime;if(this.#i===0?this.#i=o:this.#i<o&&(this.#i=o,this.#h>0&&(this.#l=!0)),s.start(this.#i),this.#i+=i.duration,this.#t.push(s),this.#c++,this.#o=!0,!this.#p){this.#p=!0;let n=this.#r.slice();this.#r=[];for(let u of n)u()}s.onended=()=>{let n=this.#t.indexOf(s);n!==-1&&(this.#t.splice(n,1),this.#c--,this.#P())}}#P(){if(this.#u&&this.#c<=0&&this.#a.length===0){this.#o=!1,this.#u=!1;let e=this.#s.slice();this.#s=[];for(let t of e)t()}}#E(e){let t=Math.floor(e.length/2),i=new Float32Array(t),s=new DataView(e.buffer,e.byteOffset,e.byteLength);for(let o=0;o<t;o++){let n=s.getInt16(o*2,!0);i[o]=n/32768}return i}};function w(r){return r.replace(/\/+$/,"")}var y=class{constructor(e){this.id="runtype-tts";this.supportsPause=!0;this.#e=null;this.#i=null;this.#t=0;this.#s=e}#e;#i;#t;#s;#r(){return this.#i??=Promise.resolve(this.#s.createPlaybackEngine?this.#s.createPlaybackEngine():new p(24e3,{prebufferMs:this.#s.prebufferMs??200})).then(e=>this.#e=e)}speak(e,t){let i=++this.#t;this.#o(i,e,t)}async#o(e,t,i){try{let s=await this.#r();if(e!==this.#t)return;s.flush(),s.resume(),s.onStarted(()=>{e===this.#t&&i.onStart?.()}),s.onFinished(()=>{e===this.#t&&i.onEnd?.()});let o=`${w(this.#s.host)}/v1/agents/${encodeURIComponent(this.#s.agentId)}/speak`,n=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.#s.clientToken}`},body:JSON.stringify({text:t.text,voice:t.voice??this.#s.voice,format:"pcm"})});if(e!==this.#t)return;if(!n.ok||!n.body)throw new Error(await E(n));let u=n.body.getReader();for(;;){let{done:f,value:l}=await u.read();if(e!==this.#t){await u.cancel().catch(()=>{});return}if(f)break;l&&l.byteLength>0&&s.enqueue(l)}s.markStreamEnd()}catch(s){if(e!==this.#t)return;let o=s instanceof Error?s:new Error(String(s));this.#s.onError?.(o),i.onError?.(o)}}pause(){this.#e?.pause()}resume(){this.#e?.resume()}stop(){this.#t++,this.#e?.flush()}destroy(){this.#t++,this.#e?.destroy(),this.#e=null,this.#i=null}};async function E(r){try{let e=await r.json();return e.detail?`${e.error??`Runtype TTS ${r.status}`}: ${e.detail}`:e.error??`Runtype TTS request failed (${r.status})`}catch{return`Runtype TTS request failed (${r.status})`}}var m=class{constructor(e,t,i={}){this.id="fallback";this.#i=e,this.#t=t,this.#s=i,this.#e=e}#e;#i;#t;#s;get supportsPause(){return this.#e.supportsPause}speak(e,t){this.#e=this.#i;let i=!1;this.#i.speak(e,{onStart:()=>{i=!0,t.onStart?.()},onEnd:()=>t.onEnd?.(),onError:s=>{if(i){t.onError?.(s);return}this.#s.onFallback?.(s),this.#e=this.#t,this.#t.speak(e,t)}})}pause(){this.#e.pause()}resume(){this.#e.resume()}stop(){this.#e.stop()}destroy(){this.#i.destroy?.(),this.#t.destroy?.()}};export{m as FallbackSpeechEngine,y as RuntypeSpeechEngine,g as createPcmStreamPlayer,P as createWorkletPlaybackEngine};
