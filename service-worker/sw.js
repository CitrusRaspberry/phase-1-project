if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,c)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const n=e=>i(e,t),f={module:{uri:t},exports:o,require:n};s[t]=Promise.all(r.map((e=>f[e]||n(e)))).then((e=>(c(...e),o)))}}define(["./workbox-5ce674c6"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"css/relax.css",revision:"45b01e881481399b14b766f80853039e"},{url:"css/styles_v0.2.1.css",revision:"54b5033c47c3be46530624930d787f73"},{url:"index.html",revision:"9ee035fe7c32aafc36fc7159018fb9d7"},{url:"scripts/confetti.min.js",revision:"79fee218b891df26f940db41627d0977"},{url:"scripts/scripts_v0.2.1.js",revision:"65d04bdf066c77bdc25a3b8c4cdf4a1c"},{url:"workbox-config.js",revision:"26d3400cdf8b6adcc00233562de81abe"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]})}));
//# sourceMappingURL=sw.js.map