if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,t)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let c={};const o=e=>i(e,n),f={module:{uri:n},exports:c,require:o};s[n]=Promise.all(r.map((e=>f[e]||o(e)))).then((e=>(t(...e),c)))}}define(["./workbox-5ce674c6"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"css/relax.css",revision:"45b01e881481399b14b766f80853039e"},{url:"css/styles_v0.3.0.css",revision:"12d1fc485cb1d98b71cdb9ae289c5185"},{url:"index.html",revision:"f4636fe001a0d4600f485504679123fb"},{url:"scripts/confetti.min.js",revision:"79fee218b891df26f940db41627d0977"},{url:"scripts/scripts_v0.3.0.js",revision:"40e69bd97a86b851eb5e0b5a17f78f0b"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]})}));
//# sourceMappingURL=sw.js.map
