var S=`
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
    this.port.onmessage = (e) => {
      const msg = e.data
      if (msg.type === 'push') {
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
    if (!out || this.waiting) return true // outputs are pre-zeroed: silence
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
`;function b(n){let e=n.length>>1,t=new Float32Array(e),r=new DataView(n.buffer,n.byteOffset,n.byteLength);for(let s=0;s<e;s++)t[s]=r.getInt16(s*2,!0)/32768;return t}async function g(n={}){let e=n.prebufferMs??150,t=Math.max(1,Math.round(24e3*e/1e3)),r=window.AudioContext||window.webkitAudioContext,s=new r({sampleRate:24e3});s.state==="suspended"&&await s.resume().catch(()=>{});let a=URL.createObjectURL(new Blob([S],{type:"application/javascript"}));try{await s.audioWorklet.addModule(a)}catch(h){throw s.close().catch(()=>{}),h}finally{URL.revokeObjectURL(a)}let i=new AudioWorkletNode(s,"persona-pcm-player",{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[1],processorOptions:{waterlineSamples:t}});i.connect(s.destination);let u=[],d=[],l=null;return i.port.onmessage=h=>{let o=h.data?.type;if(o==="started"){let p=d.slice();d=[],p.forEach(c=>c())}else if(o==="drained"){let p=u.slice();u=[],p.forEach(c=>c())}},{enqueue(h){let o=h;if(l){let c=new Uint8Array(l.length+h.length);c.set(l),c.set(h,l.length),o=c,l=null}if(o.length%2!==0&&(l=new Uint8Array([o[o.length-1]]),o=o.subarray(0,o.length-1)),o.length===0)return;let p=b(o);p.length!==0&&i.port.postMessage({type:"push",samples:p},[p.buffer])},markStreamEnd(){i.port.postMessage({type:"eos"})},flush(){l=null,u=[],d=[],i.port.postMessage({type:"clear"})},onFinished(h){u.push(h)},onStarted(h){d.push(h)},pause(){s.state==="running"&&s.suspend()},resume(){s.state==="suspended"&&s.resume()},destroy(){i.port.onmessage=null;try{i.disconnect()}catch{}return s.close().catch(()=>{})}}}function v(){return g()}var f=class{constructor(e=24e3,t={}){this.ctx=null;this.nextStartTime=0;this.activeSources=[];this.finishedCallbacks=[];this.startedCallbacks=[];this.playing=!1;this.streamEnded=!1;this.pendingCount=0;this.started=!1;this.userPaused=!1;this.pendingBuffers=[];this.pendingSamples=0;this.remainder=null;this.sampleRate=e;let r=Math.max(0,t.prebufferMs??0);this.waterlineSamples=Math.round(e*r/1e3),this.buffering=this.waterlineSamples>0}ensureContext(){if(!this.ctx){let t=typeof window<"u"?window:void 0;if(!t)throw new Error("AudioPlaybackManager requires a browser environment");let r=t.AudioContext||t.webkitAudioContext;this.ctx=new r({sampleRate:this.sampleRate})}let e=this.ctx;return e.state==="suspended"&&!this.userPaused&&e.resume(),e}enqueue(e){if(e.length===0)return;let t=e;if(this.remainder){let s=new Uint8Array(this.remainder.length+e.length);s.set(this.remainder),s.set(e,this.remainder.length),t=s,this.remainder=null}if(t.length%2!==0&&(this.remainder=new Uint8Array([t[t.length-1]]),t=t.subarray(0,t.length-1)),t.length===0)return;let r=this.pcmToFloat32(t);r.length!==0&&(this.buffering?(this.pendingBuffers.push(r),this.pendingSamples+=r.length,this.pendingSamples>=this.waterlineSamples&&this.releaseBuffer()):this.scheduleSamples(r))}markStreamEnd(){this.pendingBuffers.length>0&&this.releaseBuffer(),this.streamEnded=!0,this.checkFinished()}flush(){for(let e of this.activeSources)try{e.stop(),e.disconnect()}catch{}this.activeSources=[],this.pendingCount=0,this.nextStartTime=0,this.playing=!1,this.streamEnded=!1,this.finishedCallbacks=[],this.startedCallbacks=[],this.remainder=null,this.pendingBuffers=[],this.pendingSamples=0,this.buffering=this.waterlineSamples>0,this.started=!1}isPlaying(){return this.playing}onFinished(e){this.finishedCallbacks.push(e)}onStarted(e){this.startedCallbacks.push(e)}pause(){this.userPaused=!0,this.ctx&&this.ctx.state==="running"&&this.ctx.suspend()}resume(){this.userPaused=!1,this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}async destroy(){this.flush(),this.ctx&&(await this.ctx.close(),this.ctx=null)}releaseBuffer(){this.buffering=!1;let e=this.pendingBuffers;this.pendingBuffers=[],this.pendingSamples=0;for(let t of e)this.scheduleSamples(t)}scheduleSamples(e){if(e.length===0)return;let t=this.ensureContext(),r=t.createBuffer(1,e.length,this.sampleRate);r.getChannelData(0).set(e);let s=t.createBufferSource();s.buffer=r,s.connect(t.destination);let a=t.currentTime;if(this.nextStartTime===0?this.nextStartTime=a:this.nextStartTime<a&&(this.nextStartTime=a,this.waterlineSamples>0&&(this.buffering=!0)),s.start(this.nextStartTime),this.nextStartTime+=r.duration,this.activeSources.push(s),this.pendingCount++,this.playing=!0,!this.started){this.started=!0;let i=this.startedCallbacks.slice();this.startedCallbacks=[];for(let u of i)u()}s.onended=()=>{let i=this.activeSources.indexOf(s);i!==-1&&this.activeSources.splice(i,1),this.pendingCount--,this.checkFinished()}}checkFinished(){if(this.streamEnded&&this.pendingCount<=0&&this.pendingBuffers.length===0){this.playing=!1,this.streamEnded=!1;let e=this.finishedCallbacks.slice();this.finishedCallbacks=[];for(let t of e)t()}}pcmToFloat32(e){let t=Math.floor(e.length/2),r=new Float32Array(t),s=new DataView(e.buffer,e.byteOffset,e.byteLength);for(let a=0;a<t;a++){let i=s.getInt16(a*2,!0);r[a]=i/32768}return r}};function P(n){return n.replace(/\/+$/,"")}var m=class{constructor(e){this.opts=e;this.id="runtype-tts";this.supportsPause=!0;this.player=null;this.playerPromise=null;this.generation=0}ensurePlayer(){return this.playerPromise??(this.playerPromise=Promise.resolve(this.opts.createPlaybackEngine?this.opts.createPlaybackEngine():new f(24e3,{prebufferMs:this.opts.prebufferMs??200})).then(e=>this.player=e))}speak(e,t){let r=++this.generation;this.run(r,e,t)}async run(e,t,r){try{let s=await this.ensurePlayer();if(e!==this.generation)return;s.flush(),s.resume(),s.onStarted(()=>{e===this.generation&&r.onStart?.()}),s.onFinished(()=>{e===this.generation&&r.onEnd?.()});let a=`${P(this.opts.host)}/v1/agents/${encodeURIComponent(this.opts.agentId)}/speak`,i=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.opts.clientToken}`},body:JSON.stringify({text:t.text,voice:t.voice??this.opts.voice,format:"pcm"})});if(e!==this.generation)return;if(!i.ok||!i.body)throw new Error(await w(i));let u=i.body.getReader();for(;;){let{done:d,value:l}=await u.read();if(e!==this.generation){await u.cancel().catch(()=>{});return}if(d)break;l&&l.byteLength>0&&s.enqueue(l)}s.markStreamEnd()}catch(s){if(e!==this.generation)return;let a=s instanceof Error?s:new Error(String(s));this.opts.onError?.(a),r.onError?.(a)}}pause(){this.player?.pause()}resume(){this.player?.resume()}stop(){this.generation++,this.player?.flush()}destroy(){this.generation++,this.player?.destroy(),this.player=null,this.playerPromise=null}};async function w(n){try{let e=await n.json();return e.detail?`${e.error??`Runtype TTS ${n.status}`}: ${e.detail}`:e.error??`Runtype TTS request failed (${n.status})`}catch{return`Runtype TTS request failed (${n.status})`}}var y=class{constructor(e,t,r={}){this.primary=e;this.fallback=t;this.options=r;this.id="fallback";this.active=e}get supportsPause(){return this.active.supportsPause}speak(e,t){this.active=this.primary;let r=!1;this.primary.speak(e,{onStart:()=>{r=!0,t.onStart?.()},onEnd:()=>t.onEnd?.(),onError:s=>{if(r){t.onError?.(s);return}this.options.onFallback?.(s),this.active=this.fallback,this.fallback.speak(e,t)}})}pause(){this.active.pause()}resume(){this.active.resume()}stop(){this.active.stop()}destroy(){this.primary.destroy?.(),this.fallback.destroy?.()}};export{y as FallbackSpeechEngine,m as RuntypeSpeechEngine,g as createPcmStreamPlayer,v as createWorkletPlaybackEngine};
