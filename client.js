/* skinx client — generated from src/ by scripts/build-client.mjs. Do not edit. */
(()=>{var Ke={"dock.label":"SkinX","dock.title":"Turn a picture into a theme","dialog.title":"SkinX","dialog.subtitle":"Drop a picture and SkinX derives a light/dark palette for the whole app, with the picture as its wallpaper.","dialog.close":"Close","dialog.dropTitle":"Drop a picture here","dialog.dropHint":"or click to choose a file \xB7 paste from the clipboard","dialog.loading":"Reading the picture\u2026","dialog.preview":"Preview","dialog.name":"Skin name","dialog.strength":"Wallpaper strength","dialog.blur":"Wallpaper blur","dialog.cancelPreview":"Discard preview","dialog.save":"Save and apply","dialog.saving":"Saving\u2026","dialog.saved":"Saved skins","dialog.apply":"Apply","dialog.applySkin":"Apply \u201C{name}\u201D","dialog.active":"Active","dialog.delete":"Delete","dialog.deleteSkin":"Delete \u201C{name}\u201D","dialog.renameSkin":"Rename \u201C{name}\u201D","dialog.restore":"Restore default","dialog.defaultName":"Skin {index}","dialog.palette":"Palette","dialog.brandMark":"Use the picture as a brand mark","dialog.scope":"Wallpaper scope","scope.full":"Whole page","scope.sidebar":"Sidebar","scope.hero":"Empty session","dialog.fit":"Fill mode","fit.contain":"Fit (feathered)","fit.cover":"Fill (cropped)","dialog.deleteConfirm":"Delete \u201C{name}\u201D?","dialog.appearance":"Appearance","dialog.wallpaperShort":"Wallpaper","dialog.brandMarkShort":"Brand mark","dialog.activeSkin":"Current skin","dialog.activeHint":"Changes apply right away and are saved automatically.","dialog.previewSubtitle":"Live preview \u2014 \u201CSave and apply\u201D keeps it; closing or discarding restores the previous look.","dialog.localHint":"Processed on this device only; the picture is never uploaded.","dialog.brandMarkDesc":"Show the picture in the sidebar and the empty-session hero.","dialog.colorCount":"{count} colors","dialog.emptyTitle":"No saved skins yet","dialog.emptyHint":"Drop a picture above to create one.","error.read":"Could not read that picture.","error.save":"Could not save the skin.","error.state":"Could not load saved skins.","error.image":"That file is not a decodable image."},Xe={"dock.label":"SkinX","dock.title":"\u56FE\u7247\u4E00\u952E\u6362\u80A4","dialog.title":"SkinX \u6362\u80A4","dialog.subtitle":"\u62D6\u5165\u4E00\u5F20\u56FE\u7247\uFF0C\u81EA\u52A8\u751F\u6210\u4EAE/\u6697\u4E24\u5957\u914D\u8272\uFF0C\u5E76\u628A\u56FE\u7247\u7528\u4F5C\u58C1\u7EB8\u3002","dialog.close":"\u5173\u95ED","dialog.dropTitle":"\u628A\u56FE\u7247\u62D6\u5230\u8FD9\u91CC","dialog.dropHint":"\u6216\u70B9\u51FB\u9009\u62E9\u6587\u4EF6 \xB7 \u4E5F\u652F\u6301\u76F4\u63A5\u7C98\u8D34","dialog.loading":"\u6B63\u5728\u8BFB\u53D6\u56FE\u7247\u2026","dialog.preview":"\u9884\u89C8","dialog.name":"\u76AE\u80A4\u540D\u79F0","dialog.strength":"\u58C1\u7EB8\u5F3A\u5EA6","dialog.blur":"\u58C1\u7EB8\u6A21\u7CCA","dialog.cancelPreview":"\u53D6\u6D88\u9884\u89C8","dialog.save":"\u4FDD\u5B58\u5E76\u5E94\u7528","dialog.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","dialog.saved":"\u5DF2\u4FDD\u5B58\u7684\u76AE\u80A4","dialog.apply":"\u5E94\u7528","dialog.applySkin":"\u5E94\u7528\u300C{name}\u300D","dialog.active":"\u4F7F\u7528\u4E2D","dialog.delete":"\u5220\u9664","dialog.deleteSkin":"\u5220\u9664\u300C{name}\u300D","dialog.renameSkin":"\u91CD\u547D\u540D\u300C{name}\u300D","dialog.restore":"\u8FD8\u539F\u9ED8\u8BA4","dialog.defaultName":"\u76AE\u80A4 {index}","dialog.palette":"\u8272\u677F","dialog.brandMark":"\u7528\u4F5C\u54C1\u724C\u4F4D\u56FE\u7247","dialog.scope":"\u58C1\u7EB8\u8303\u56F4","scope.full":"\u6574\u9875","scope.sidebar":"\u4FA7\u680F","scope.hero":"\u7A7A\u767D\u9875","dialog.fit":"\u586B\u5145\u65B9\u5F0F","fit.contain":"\u5B8C\u6574\uFF08\u7FBD\u5316\uFF09","fit.cover":"\u94FA\u6EE1\uFF08\u88C1\u526A\uFF09","dialog.deleteConfirm":"\u5220\u9664\u300C{name}\u300D\uFF1F","dialog.appearance":"\u5916\u89C2","dialog.wallpaperShort":"\u58C1\u7EB8","dialog.brandMarkShort":"\u54C1\u724C\u4F4D","dialog.activeSkin":"\u5F53\u524D\u76AE\u80A4","dialog.activeHint":"\u8C03\u6574\u4F1A\u7ACB\u5373\u751F\u6548\uFF0C\u5E76\u81EA\u52A8\u4FDD\u5B58\u3002","dialog.previewSubtitle":"\u5B9E\u65F6\u9884\u89C8\u4E2D\uFF1B\u300C\u4FDD\u5B58\u5E76\u5E94\u7528\u300D\u540E\u4FDD\u7559\uFF0C\u5173\u95ED\u6216\u53D6\u6D88\u4F1A\u8FD8\u539F\u539F\u6709\u5916\u89C2\u3002","dialog.localHint":"\u56FE\u7247\u53EA\u5728\u672C\u673A\u5904\u7406\uFF0C\u4E0D\u4F1A\u4E0A\u4F20\u3002","dialog.brandMarkDesc":"\u5728\u4FA7\u680F\u548C\u7A7A\u767D\u4F1A\u8BDD\u4E2D\u663E\u793A\u8FD9\u5F20\u56FE\u7247\u3002","dialog.colorCount":"{count} \u8272","dialog.emptyTitle":"\u8FD8\u6CA1\u6709\u4FDD\u5B58\u7684\u76AE\u80A4","dialog.emptyHint":"\u4ECE\u4E0A\u65B9\u62D6\u5165\u4E00\u5F20\u56FE\u7247\u5F00\u59CB\u521B\u5EFA\u3002","error.read":"\u8BFB\u53D6\u56FE\u7247\u5931\u8D25\u3002","error.save":"\u4FDD\u5B58\u76AE\u80A4\u5931\u8D25\u3002","error.state":"\u8BFB\u53D6\u5DF2\u4FDD\u5B58\u76AE\u80A4\u5931\u8D25\u3002","error.image":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F\u53EF\u89E3\u7801\u7684\u56FE\u7247\u3002"};var Se;function Ve(e){Se=e}function d(e,r){return typeof Se!="function"?e:Se(e,r)}var Ne;function qe(e){Ne=e}function L(){if(Ne===void 0)throw new Error("[skinx] React was not seeded by the module loader");return Ne}function n(e,r,...t){return L().createElement(e,r,...t)}var Pr="/skinx/api";async function te(e,r={}){let t=await fetch(Pr+e,{credentials:"same-origin",cache:"no-store",...r,headers:{accept:"application/json",...r.body===void 0?{}:{"content-type":"application/json"},...r.headers}}),a=null;try{a=await t.json()}catch{a=null}if(!t.ok||a?.ok!==!0){let i=a?.error?.message||`HTTP ${t.status}`;throw new Error(i)}return a}function Ye(){return te("/state")}function Me(e){return te("/skin",{method:"PUT",body:JSON.stringify(e)})}function Ge(e){return te("/delete",{method:"POST",body:JSON.stringify({id:e})})}function ae(e){return te("/active",{method:"PUT",body:JSON.stringify({id:e})})}async function Qe(e){if(e==null||typeof e.type!="string")throw new Error("not-an-image");if(!e.type.startsWith("image/"))throw new Error("not-an-image");let r;try{r=await createImageBitmap(e)}catch{r=void 0}if(r===void 0)throw new Error("decode-failed");return r}function Ze(e,r=64){let t=Math.min(1,r/Math.max(e.width,e.height)),a=Math.max(1,Math.round(e.width*t)),i=Math.max(1,Math.round(e.height*t)),s=document.createElement("canvas");s.width=a,s.height=i;let o=s.getContext("2d",{willReadFrequently:!0});if(o===null)throw new Error("canvas-unavailable");return o.drawImage(e,0,0,a,i),o.getImageData(0,0,a,i)}function Je(e,r,t){return new Promise(a=>{e.toBlob(a,r,t)})}async function er(e){let r=Math.min(1,1600/Math.max(e.width,e.height)),t;for(let a=0;a<7;a+=1){let i=Math.max(1,Math.round(e.width*r)),s=Math.max(1,Math.round(e.height*r)),o=document.createElement("canvas");o.width=i,o.height=s;let l=o.getContext("2d");if(l===null)throw new Error("canvas-unavailable");l.drawImage(e,0,0,i,s);let c=await Je(o,"image/webp",.82),b="image/webp";if(c===null&&(c=await Je(o,"image/jpeg",.85),b="image/jpeg"),c===null)throw new Error("encode-failed");if(t={blob:c,mime:b,width:i,height:s},c.size<=12e5||a===6)return t;r*=.75}return t}function rr(e){return new Promise((r,t)=>{let a=new FileReader;a.onload=()=>{let i=String(a.result??""),s=i.indexOf(",");r(s>=0?i.slice(s+1):i)},a.onerror=()=>t(a.error??new Error("read-failed")),a.readAsDataURL(e)})}function M(e,r,t){return e<r?r:e>t?t:e}function K(e){let r=String(e).trim().replace(/^#/,"");if(r.length===3&&(r=r.split("").map(t=>t+t).join("")),!/^[0-9a-fA-F]{6}$/.test(r))throw new TypeError(`invalid hex color: ${String(e)}`);return{r:Number.parseInt(r.slice(0,2),16),g:Number.parseInt(r.slice(2,4),16),b:Number.parseInt(r.slice(4,6),16)}}function X(e,r,t){let a=i=>Math.round(M(i,0,255)).toString(16).padStart(2,"0");return`#${a(e)}${a(r)}${a(t)}`}function W(e){let r=e/255;return r<=.04045?r/12.92:((r+.055)/1.055)**2.4}function Ie(e){let r=e<=.0031308?e*12.92:1.055*e**.4166666666666667-.055;return M(r*255,0,255)}function $r(e,r,t){let a=W(e),i=W(r),s=W(t),o=.4122214708*a+.5363325363*i+.0514459929*s,l=.2119034982*a+.6806995451*i+.1073969566*s,c=.0883024619*a+.2817188376*i+.6299787005*s,b=Math.cbrt(o),v=Math.cbrt(l),u=Math.cbrt(c);return{L:.2104542553*b+.793617785*v-.0040720468*u,a:1.9779984951*b-2.428592205*v+.4505937099*u,b:.0259040371*b+.7827717662*v-.808675766*u}}function Br({L:e,a:r,b:t}){let a=e+.3963377774*r+.2158037573*t,i=e-.1055613458*r-.0638541728*t,s=e-.0894841775*r-1.291485548*t,o=a**3,l=i**3,c=s**3;return{r:Ie(4.0767416621*o-3.3077115913*l+.2309699292*c),g:Ie(-1.2684380046*o+2.6097574011*l-.3413193965*c),b:Ie(-.0041960863*o-.7034186147*l+1.707614701*c)}}function V({r:e,g:r,b:t}){let a=$r(e,r,t),i=Math.hypot(a.a,a.b),s=Math.atan2(a.b,a.a)*180/Math.PI;return s<0&&(s+=360),{l:a.L,c:i,h:s}}function _r({l:e,c:r,h:t}){let a=t*Math.PI/180;return Br({L:e,a:r*Math.cos(a),b:r*Math.sin(a)})}function Ce(e){let r=_r(e);return X(r.r,r.g,r.b)}function ne(e){return V(K(e))}function P(e){let{r,g:t,b:a}=K(e);return .2126*W(r)+.7152*W(t)+.0722*W(a)}function R(e,r){let t=P(e),a=P(r),i=Math.max(t,a),s=Math.min(t,a);return(i+.05)/(s+.05)}function Ae(e,r){let{r:t,g:a,b:i}=K(e);return`rgba(${t}, ${a}, ${i}, ${M(r,0,1)})`}function Ee(e,r,t){let a=K(e),i=K(r),s=M(t,0,1);return X(a.r+(i.r-a.r)*s,a.g+(i.g-a.g)*s,a.b+(i.b-a.b)*s)}function j(e,r,t){if(R(e,r)>=t)return e;let a=R("#ffffff",r)>=R("#000000",r),i=a?1:-1,s=ne(e);for(let o=0;o<80;o+=1){s={...s,l:M(s.l+i*.01,0,1)};let l=Ce(s);if(R(l,r)>=t)return l;if(s.l<=0||s.l>=1)break}return a?"#ffffff":"#000000"}var Te="#3b6ef5",Or=24;function Fr(e,r,t){return e>>3<<10|r>>3<<5|t>>3}function De(e,r){return(e.r-r.r)**2+(e.g-r.g)**2+(e.b-r.b)**2}function tr(e,r,t,a={}){let i=Math.max(1,Math.min(8,a.maxColors??5)),s=a.sampleBudget??4096,o=Math.max(1,r*t),l=Math.max(1,Math.floor(Math.sqrt(o/s))),c=new Map,b=0,v=0,u=0,p=0;for(let x=0;x<t;x+=l){let h=x*r;for(let m=0;m<r;m+=l){let w=(h+m)*4;if(e[w+3]<128)continue;let f=e[w],C=e[w+1],A=e[w+2],T=V({r:f,g:C,b:A});if(T.l<.08||T.l>.96)continue;let re=Fr(f,C,A),z=c.get(re);z===void 0&&(z={count:0,r:0,g:0,b:0},c.set(re,z)),z.count+=1,z.r+=f,z.g+=C,z.b+=A,v+=f,u+=C,p+=A,b+=1}}if(b===0)return{palette:[],brand:Te,sampled:0,average:void 0};let y=(()=>{let x=Math.round(v/b),h=Math.round(u/b),m=Math.round(p/b);return{hex:X(x,h,m),rgb:{r:x,g:h,b:m},oklch:V({r:x,g:h,b:m})}})(),I=[...c.values()].sort((x,h)=>h.count-x.count).slice(0,32).map(x=>({r:x.r/x.count,g:x.g/x.count,b:x.b/x.count,w:x.count})),S=Math.min(i,I.length),E=I.slice(0,S).map(x=>({r:x.r,g:x.g,b:x.b}));for(let x=0;x<12;x+=1){let h=E.map(()=>({r:0,g:0,b:0,w:0}));for(let m of I){let w=0,f=Number.POSITIVE_INFINITY;for(let A=0;A<E.length;A+=1){let T=De(m,E[A]);T<f&&(f=T,w=A)}let C=h[w];C.r+=m.r*m.w,C.g+=m.g*m.w,C.b+=m.b*m.w,C.w+=m.w}E=E.map((m,w)=>{let f=h[w];return f.w>0?{r:f.r/f.w,g:f.g/f.w,b:f.b/f.w}:m})}let D=[];for(let x of E){let h=D.find(m=>De(m,x)<Or**2);h===void 0?D.push({...x,weight:1}):(h.weight+=1,h.r=(h.r+x.r)/2,h.g=(h.g+x.g)/2,h.b=(h.b+x.b)/2)}let Z=D.map(()=>0);for(let x of I){let h=0,m=Number.POSITIVE_INFINITY;for(let w=0;w<D.length;w+=1){let f=De(x,D[w]);f<m&&(m=f,h=w)}Z[h]+=x.w}let ee=D.map((x,h)=>{let m=Math.round(x.r),w=Math.round(x.g),f=Math.round(x.b),C=Z[h]/b,A=V({r:m,g:w,b:f}),T=Math.max(A.c,1e-4),re=Math.sqrt(Math.max(C,1e-4))*T**.8;return{hex:X(m,w,f),rgb:{r:m,g:w,b:f},oklch:A,ratio:C,score:re}}).sort((x,h)=>h.score-x.score);return{palette:ee,brand:Wr(ee),sampled:b,average:y}}function Wr(e){if(!Array.isArray(e)||e.length===0)return Te;let r=e.filter(t=>t.oklch.c>=.05&&t.oklch.l>=.18&&t.oklch.l<=.9);return r.length>0?r[0].hex:e[0].hex}function ar(e,r){let t=Array.isArray(e)?e.filter(o=>o!==null&&typeof o=="object"&&typeof o.hex=="string"):[],a=[];if(t.length>0){let o=t.reduce((l,c)=>c.oklch.c>l.oklch.c?c:l,t[0]);a.push({id:"vivid",brand:o.hex,tone:0}),a.push({id:"dominant",brand:t[0].hex,tone:0})}if(r!=null&&r.oklch!==void 0){let o=Math.max(-1,Math.min(1,r.oklch.l*2-1)),l=o>=-.1?Math.max(.25,o):Math.min(-.25,o);a.push({id:"tonal",brand:r.hex,tone:l})}let i=new Set,s=a.filter(o=>{let l=`${o.brand.toLowerCase()}|${o.tone.toFixed(2)}`;return i.has(l)?!1:(i.add(l),!0)});return s.length===0&&s.push({id:"default",brand:Te,tone:0}),s.slice(0,3)}var Ur={open:!1,loading:!0,busy:!1,error:null,skins:[],activeId:null,draft:null,wallpaper:{url:null,opacity:.85,blur:0,scope:"full",fit:"contain",aspect:null}},ie=Ur,ze=new Set;function N(){return ie}function g(e){ie=typeof e=="function"?e(ie):{...ie,...e};for(let r of[...ze])try{r()}catch(t){console.error("[skinx] store listener failed:",t)}}function Le(e){return ze.add(e),()=>{ze.delete(e)}}function se(){let e=L(),[,r]=e.useState(0);return e.useEffect(()=>Le(()=>r(t=>t+1)),[]),N()}var ce=4,nr=["--dsw-alias-bg-base","--dsw-alias-bg-layer-1","--dsw-alias-bg-layer-2","--dsw-alias-bg-overlay","--dsw-alias-border-l1","--dsw-alias-border-l2","--dsw-alias-brand-primary","--dsw-alias-label-primary","--dsw-alias-label-primary-inverted","--dsw-alias-label-dimmed","--dsw-alias-label-primary-bluish","--dsw-alias-label-secondary","--dsw-alias-label-tertiary","--dsw-alias-label-caption","--dsw-alias-link","--dsw-alias-state-error-primary","--dsw-alias-state-idle-primary","--dsw-alias-state-success-primary","--dsw-alias-state-warn-primary","--dsw-specific-sidebar-fill"],ir=["--dsw-alias-bg-base","--dsw-alias-bg-layer-1","--dsw-alias-bg-layer-2","--dsw-alias-bg-overlay","--dsw-specific-sidebar-fill"],oe={error:"#d93036",idle:"#6b7280",success:"#1f9d55",warn:"#b7791f"},le={error:"#ff6369",idle:"#8b8d98",success:"#3dd68c",warn:"#f5a524"};function k(e,r,t){return Ce({l:M(e,0,1),c:Math.max(0,r),h:t})}function de(e,r,t,a,i){let s=ne(e),o=Number.isFinite(s.h)?s.h:250,l=k(M(s.l,r[0],r[1]),M(s.c,t[0],t[1]),o);return j(l,a,i)}function q(e,r={}){let t=ne(e),a=t.c>=.01&&Number.isFinite(t.h)?t.h:250,i=M(Number(r.tone)||0,-1,1),s=i<0?.045*i:.012*i,o=i<0?.035*i:.07*i,l=f=>M(f+s,0,1),c=f=>M(f+o,0,1),b=f=>M(f+s,0,1),v=f=>M(f+o,0,.94),u=k(l(.985),.006,a),p=k(l(.998),.003,a),y=k(l(.955),.01,a),I=k(l(.998),.004,a),S=k(c(.15),.012,a),E=k(c(.185),.012,a),D=k(c(.225),.014,a),Z=k(c(.21),.012,a),ee=M(t.c,0,.2),x=(f,C,A)=>M(ee*f,C,A),h={"--dsw-alias-bg-base":u,"--dsw-alias-bg-layer-1":p,"--dsw-alias-bg-layer-2":y,"--dsw-alias-bg-overlay":I,"--dsw-alias-border-l1":k(l(.9),.008,a),"--dsw-alias-border-l2":k(l(.82),.012,a),"--dsw-alias-brand-primary":de(e,[.44,.6],[.08,.19],u,3),"--dsw-alias-label-primary":j(k(b(.3),x(1.5,.055,.115),a),u,4.5),"--dsw-alias-label-secondary":j(k(b(.46),x(1.3,.05,.1),a),u,3),"--dsw-alias-label-tertiary":k(b(.58),x(1.1,.045,.09),a),"--dsw-alias-label-caption":k(b(.67),x(.95,.04,.08),a),"--dsw-alias-link":de(e,[.44,.6],[.1,.19],u,4.5),"--dsw-alias-state-error-primary":oe.error,"--dsw-alias-state-idle-primary":oe.idle,"--dsw-alias-state-success-primary":oe.success,"--dsw-alias-state-warn-primary":oe.warn,"--dsw-specific-sidebar-fill":k(l(.962),.01,a)},m={"--dsw-alias-bg-base":S,"--dsw-alias-bg-layer-1":E,"--dsw-alias-bg-layer-2":D,"--dsw-alias-bg-overlay":Z,"--dsw-alias-border-l1":k(c(.3),.012,a),"--dsw-alias-border-l2":k(c(.38),.014,a),"--dsw-alias-brand-primary":de(e,[.6,.76],[.1,.2],S,3),"--dsw-alias-label-primary":j(k(v(.91),x(1.2,.045,.075),a),S,4.5),"--dsw-alias-label-secondary":j(k(v(.74),x(1.15,.042,.09),a),S,3),"--dsw-alias-label-tertiary":k(v(.62),x(1,.038,.08),a),"--dsw-alias-label-caption":k(v(.52),x(.9,.034,.07),a),"--dsw-alias-link":de(e,[.62,.78],[.1,.2],S,4.5),"--dsw-alias-state-error-primary":le.error,"--dsw-alias-state-idle-primary":le.idle,"--dsw-alias-state-success-primary":le.success,"--dsw-alias-state-warn-primary":le.warn,"--dsw-specific-sidebar-fill":k(c(.175),.014,a)},w={};for(let f of nr)w[f]={light:h[f],dark:m[f]};return sr(w)}var Re=.8,Hr=nr.filter(e=>e.includes("-label-")&&!e.endsWith("-inverted")||e.includes("-state-")||e==="--dsw-alias-link"||e==="--dsw-alias-brand-primary");function sr(e,r=1){let t=Object.fromEntries(Object.entries(e).map(([a,i])=>[a,{...i}]));for(let a of["light","dark"]){let s=ir.map(l=>Ee(Ee(a==="light"?"#000000":"#ffffff",e[l][a],r),a==="light"?"#000000":"#ffffff",.12)).reduce((l,c)=>(a==="light"?P(l)<P(c):P(l)>P(c))?l:c);for(let l of Hr){let c=e[l]?.[a]??e["--dsw-alias-label-secondary"][a];t[l]??(t[l]={}),t[l][a]=j(c,s,4.5)}let o=t["--dsw-alias-brand-primary"][a];t["--dsw-alias-label-primary-inverted"]??(t["--dsw-alias-label-primary-inverted"]={}),t["--dsw-alias-label-primary-inverted"][a]=R("#ffffff",o)>=R("#000000",o)?"#ffffff":"#000000"}return t}function pe(e){return M(Number.isFinite(e)?e:.85,Re,1)}function xe(e,r){let t=pe(r),a=sr(e,t),i={"--dsw-alias-bg-base":0,"--dsw-alias-bg-layer-1":.06,"--dsw-alias-bg-layer-2":.1,"--dsw-specific-sidebar-fill":.03};for(let s of ir){if(s==="--dsw-alias-bg-overlay")continue;let o=i[s];a[s]={light:Ae(e[s].light,o),dark:Ae(e[s].dark,o)}}return a}function Pe(e){return Math.round((1-pe(e))/(1-Re)*100)}function je(e){return 1-M(Number(e)||0,0,100)/100*(1-Re)}var be="#3b6ef5",Kr={opacity:.85,blur:0,scope:"full",fit:"contain",aspect:null},Xr=["full","sidebar","hero"],Vr=["contain","cover"];function $e(e){return Xr.includes(e)?e:"full"}function Be(e){return Vr.includes(e)?e:"contain"}function _e(e){let r=Number(e);return Number.isFinite(r)&&r>.05&&r<20?r:null}var fe,ue,U,$;function B(e,r){let t=r instanceof Error?r.message:String(r);return`${e} ${t}`}function Y(e){if(ue!==void 0){try{ue()}catch(r){console.error("[skinx] could not dispose the previous token layer:",r)}ue=void 0}!e||fe===void 0||typeof fe.overrideTokens!="function"||(ue=fe.overrideTokens("skinx",e))}function ge(){if(U!==void 0){try{URL.revokeObjectURL(U)}catch(e){console.error("[skinx] could not revoke the preview URL:",e)}U=void 0}}function lr(e){let r=e?.tokens;if(r&&Object.keys(r).length>0){if(e?.tokenVersion===ce)return r;let a=r["--dsw-alias-brand-primary"]?.light??e?.palette?.[0]??be;return q(a)}let t=e?.palette?.[0]??be;return q(t)}var or;function qr(e){let r=e?.background?.url;if(typeof r!="string"||or===r||typeof Image!="function")return;or=r;let t=new Image;t.onload=()=>{let a=t.naturalWidth/t.naturalHeight;if(!(a>.05&&a<20))return;let{activeId:i,skins:s}=N();if(!s.some(c=>c.id===i&&c.background?.url===r))return;let o=s.map(c=>c.id===i?{...c,background:{...c.background,aspect:a}}:c);g({skins:o});let l=o.find(c=>c.id===i);l!==void 0&&(_(l),he(l))},t.src=r}function _(e){let r=e?.background??{},t=typeof r.url=="string"?r.url:null,a={url:t,opacity:Math.min(1,Math.max(.55,r.opacity??.85)),blur:Math.min(24,Math.max(0,r.blur??0)),scope:$e(r.scope),fit:Be(r.fit),aspect:_e(r.aspect)},i=lr(e);Y(t===null?i:xe(i,a.opacity)),g({activeId:e.id,wallpaper:a}),t!==null&&a.aspect===null&&qr(e)}function me(){Y(void 0),g({activeId:null,wallpaper:{url:null,opacity:.85,blur:0,scope:"full",fit:"contain",aspect:null}})}async function Yr(){try{let r=(await Ye()).state;g({loading:!1,skins:r.skins,activeId:r.activeId,error:null});let t=r.skins.find(a=>a.id===r.activeId);t!==void 0?_(t):me()}catch(e){g({loading:!1,error:B(d("error.state"),e)})}}function dr(e){fe=e.get("theme"),Yr()}function cr(){$!==void 0&&(clearTimeout($),$=void 0),Y(void 0),ge()}function Oe(){g({open:!0})}function H(){N().draft!==null&&Fe(),g({open:!1})}function pr(){N().open?H():Oe()}async function G(e){g({busy:!0,error:null});let r;try{r=await Qe(e)}catch{g({busy:!1,error:d("error.image")});return}try{let t=Ze(r,64),{palette:a,brand:i,average:s}=tr(t.data,t.width,t.height,{maxColors:5}),o=ar(a,s).map(u=>({...u,tokens:q(u.brand,{tone:u.tone})})),l=o[0],c=await er(r);typeof r.close=="function"&&r.close(),ge(),U=URL.createObjectURL(c.blob);let b=N().skins.length+1,v={id:`skin-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,name:d("dialog.defaultName",{index:b}),palette:a.map(u=>u.hex),brand:l?.brand??i??be,tokens:l?.tokens??q(i??be),candidates:o,candidateId:l?.id??"default",brandMark:!0,blob:c.blob,mime:c.mime,previewUrl:U,wallpaper:{...Kr,url:U,aspect:c.height>0?c.width/c.height:null}};g({draft:v,busy:!1,error:null,wallpaper:{...v.wallpaper}}),Y(xe(v.tokens,v.wallpaper.opacity))}catch(t){g({busy:!1,error:B(d("error.read"),t)})}}function O(e){let{draft:r}=N();if(r===null)return;let t={...r.wallpaper,...e.wallpaper??{}},a={...r,...e,wallpaper:t};if(e.candidateId!==void 0){let i=r.candidates.find(s=>s.id===e.candidateId);i!==void 0&&(a={...a,candidateId:i.id,brand:i.brand,tokens:i.tokens})}g({draft:a,wallpaper:{...t}}),Y(xe(a.tokens,t.opacity))}function Fe(){let{draft:e,skins:r,activeId:t}=N();if(e===null)return;ge(),g({draft:null});let a=r.find(i=>i.id===t);a!==void 0?_(a):me()}async function xr(){let{draft:e,busy:r}=N();if(!(e===null||r)){g({busy:!0,error:null});try{let t=await rr(e.blob),i=(await Me({id:e.id,name:e.name||d("dialog.title"),palette:e.palette,tokens:e.tokens,brandMark:e.brandMark===!0,tokenVersion:ce,createdAt:Date.now(),background:{opacity:e.wallpaper.opacity,blur:e.wallpaper.blur,scope:$e(e.wallpaper.scope),fit:Be(e.wallpaper.fit),aspect:_e(e.wallpaper.aspect)},backgroundBase64:t,backgroundMime:e.mime})).state,s=i.skins.find(o=>o.id===e.id);ge(),g({skins:i.skins,activeId:i.activeId,draft:null,busy:!1,error:null}),s!==void 0&&_(s)}catch(t){g({busy:!1,error:B(d("error.save"),t)})}}}async function ur(e){g({busy:!0,error:null});try{let t=(await ae(e)).state,a=t.skins.find(i=>i.id===e);g({skins:t.skins,activeId:t.activeId,busy:!1,error:null}),a!==void 0&&_(a)}catch(r){g({busy:!1,error:B(d("error.save"),r)})}}async function fr(e){try{let t=(await Ge(e)).state;if(g({skins:t.skins,activeId:t.activeId,error:null}),N().activeId===null)me();else if(N().activeId!==null){let a=t.skins.find(i=>i.id===t.activeId);a!==void 0&&_(a)}}catch(r){g({error:B(d("error.save"),r)})}}async function br(){try{let e=await ae(null);g({skins:e.state.skins,activeId:null,error:null}),me()}catch(e){g({error:B(d("error.save"),e)})}}function he(e){$!==void 0&&clearTimeout($),$=setTimeout(()=>{$=void 0,Me({id:e.id,name:e.name,palette:e.palette,tokens:lr(e),brandMark:e.brandMark===!0,tokenVersion:ce,createdAt:e.createdAt,activate:!1,background:{opacity:e.background?.opacity??.85,blur:e.background?.blur??0,scope:$e(e.background?.scope),fit:Be(e.background?.fit),aspect:_e(e.background?.aspect)}}).then(r=>{let t=N().activeId;g({skins:r.state.skins}),t!==null&&r.state.activeId!==t&&ae(t).then(a=>{g({skins:a.state.skins,activeId:a.state.activeId})}).catch(()=>{})}).catch(r=>{g({error:B(d("error.save"),r)})})},400)}function J(e){let{activeId:r,skins:t}=N(),a=t.find(l=>l.id===r);if(a===void 0)return;let i={...a.background,...e},s={...a,background:i},o=t.map(l=>l.id===r?s:l);g({skins:o}),_(s),he(s)}function gr(e){let{activeId:r,skins:t}=N(),a=t.find(o=>o.id===r);if(a===void 0)return;let i={...a,brandMark:e===!0},s=t.map(o=>o.id===r?i:o);g({skins:s}),he(i)}function ve(){let{draft:e,skins:r,activeId:t}=N();if(e!==null&&e.brandMark===!0&&typeof e.previewUrl=="string")return e.previewUrl;let a=r.find(i=>i.id===t);if(a!==void 0&&a.brandMark===!0){let i=a.background?.url;if(typeof i=="string")return i}return null}function mr(e,r){let{skins:t}=N(),a=t.find(o=>o.id===e);if(a===void 0)return;let i=typeof r=="string"?r.trim().slice(0,60):"";if(i===""||i===a.name)return;let s=t.map(o=>o.id===e?{...a,name:i}:o);g({skins:s}),he({...a,name:i})}function hr(){g({error:null})}function F(e,r){return n("svg",{viewBox:"0 0 24 24",width:e,height:e,fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},...r)}function We({size:e=18}){return n("svg",{viewBox:"0 0 24 24",width:e,height:e,fill:"none","aria-hidden":!0},n("rect",{x:3,y:4.5,width:18,height:13.5,rx:3,stroke:"currentColor",strokeWidth:1.7}),n("circle",{cx:8.2,cy:9,r:1.55,fill:"currentColor"}),n("path",{d:"M4.2 16.2l4.6-4.4 3.4 2.9 3-2.4 4.4 4.2",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"}),n("circle",{cx:6.2,cy:20.2,r:1.15,fill:"currentColor"}),n("circle",{cx:11.2,cy:20.2,r:1.15,fill:"currentColor"}),n("circle",{cx:16.2,cy:20.2,r:1.15,fill:"currentColor"}))}function vr({size:e=26}){return n("svg",{viewBox:"0 0 24 24",width:e,height:e,fill:"none","aria-hidden":!0},n("rect",{x:3,y:4.5,width:18,height:15,rx:3,stroke:"currentColor",strokeWidth:1.6}),n("circle",{cx:8.2,cy:9.2,r:1.5,fill:"currentColor"}),n("path",{d:"M4.4 16.6l4.4-4.2 3.2 2.8 3-2.3 4.6 4.1",stroke:"currentColor",strokeWidth:1.6,strokeLinecap:"round",strokeLinejoin:"round"}))}function Ue({size:e=16}){return F(e,[n("path",{key:"a",d:"M6 6l12 12"}),n("path",{key:"b",d:"M18 6L6 18"})])}function kr({size:e=16}){return F(e,[n("circle",{key:"a",cx:12,cy:12,r:9}),n("path",{key:"b",d:"M12 7.5V13"}),n("circle",{key:"c",cx:12,cy:16.5,r:.9,fill:"currentColor",stroke:"none"})])}function yr({size:e=12}){return F(e,[n("path",{key:"a",d:"M4.5 19.5l.9-3.8L15.8 5.2a2.05 2.05 0 0 1 2.9 2.9L8.3 18.6l-3.8.9z"}),n("path",{key:"b",d:"M14.4 6.6l3 3"})])}function wr({size:e=15}){return F(e,[n("path",{key:"a",d:"M4 7h16"}),n("path",{key:"b",d:"M9.4 7V5.6C9.4 4.7 10.1 4 11 4h2c.9 0 1.6.7 1.6 1.6V7"}),n("path",{key:"c",d:"M6.4 7l.8 11.5c.1 1 .9 1.5 1.9 1.5h5.8c1 0 1.8-.5 1.9-1.5L17.6 7"}),n("path",{key:"d",d:"M10.4 10.8v5.4"}),n("path",{key:"e",d:"M13.6 10.8v5.4"})])}function Sr({size:e=14}){return F(e,[n("path",{key:"a",d:"M4.5 10.5a8 8 0 1 1 2.2 6.4"}),n("path",{key:"b",d:"M4.5 5.5v5h5"})])}function He({size:e=22}){return F(e,[n("path",{key:"a",d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1L5 10.5l5.1-1.9L12 3.5z"}),n("path",{key:"b",d:"M18.5 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z"})])}function Nr({size:e=26}){return F(e,[n("rect",{key:"a",x:3,y:4.5,width:18,height:15,rx:3}),n("path",{key:"b",d:"M7.5 14.5l3-2.6 2.4 2 2.1-1.7 3 2.6"}),n("circle",{key:"c",cx:8.2,cy:8.7,r:1.2,fill:"currentColor",stroke:"none"})])}var Jr={sidebar:"linear-gradient(to right, #000 0, #000 240px, transparent 340px)",hero:"radial-gradient(ellipse 62% 46% at 50% 32%, #000 0, #000 38%, transparent 74%)"},ke=52;function Mr(e){if(e.length===0)return"";let r=e.map(s=>s.image).join(","),t=e.map(s=>s.size).join(","),a=e.map(s=>s.position).join(","),i=e.map(()=>"no-repeat").join(",");return`-webkit-mask-image:${r};-webkit-mask-size:${t};-webkit-mask-position:${a};-webkit-mask-repeat:${i};-webkit-mask-composite:source-in;mask-image:${r};mask-size:${t};mask-position:${a};mask-repeat:${i};mask-composite:${e.length>1?"intersect":"add"};`}function Qr({wallpaper:e}){if(!e||typeof e.url!="string")return null;let r=JSON.stringify(e.url),t=`color-mix(in srgb,var(--dsw-alias-bg-overlay) ${pe(e.opacity)*100}%,transparent)`,a=Math.max(0,Number(e.blur)||0),i=typeof e.scope=="string"?e.scope:"full",s=e.fit==="cover"?"cover":"contain",o=typeof e.aspect=="number"&&e.aspect>.05&&e.aspect<20?e.aspect:null,l=Jr[i],c=l===void 0?[]:[{image:l,size:"100% 100%",position:"center"}],b=[...c];if(s==="contain"&&o!==null){let u=`min(100vw, calc(100vh * ${o.toFixed(4)})) min(100vh, calc(100vw / ${o.toFixed(4)}))`,p=`linear-gradient(to right, transparent 0, #000 ${ke}px, #000 calc(100% - ${ke}px), transparent 100%)`,y=`linear-gradient(to bottom, transparent 0, #000 ${ke}px, #000 calc(100% - ${ke}px), transparent 100%)`;b.push({image:p,size:u,position:"center"}),b.push({image:y,size:u,position:"center"})}let v=`body{--skinx-wallpaper:url(${r});--skinx-blur:${a}px;--skinx-tint:${t}}html,body{background-color:var(--dsw-alias-bg-overlay)}body{isolation:isolate}[data-changes-hover-preview],[data-review-view]{--dsw-alias-bg-base:var(--dsw-alias-bg-overlay);--dsw-alias-bg-layer-1:var(--dsw-alias-bg-overlay);--dsw-alias-bg-layer-2:var(--dsw-alias-bg-overlay);background:var(--dsw-alias-bg-overlay);}body::before{content:"";position:fixed;inset:-40px;z-index:-2;background-image:linear-gradient(var(--skinx-tint),var(--skinx-tint)),var(--skinx-wallpaper);background-position:center;background-size:cover;background-repeat:no-repeat;filter:blur(38px);transform:scale(1.05);pointer-events:none;opacity:.9;`+Mr(c)+`}body::after{content:"";position:fixed;inset:0;z-index:-1;background-image:linear-gradient(var(--skinx-tint),var(--skinx-tint)),var(--skinx-wallpaper);background-position:center;background-size:${s};background-repeat:no-repeat;filter:blur(var(--skinx-blur));pointer-events:none;`+Mr(b)+"}";return n("style",{"data-skinx-wallpaper":""},v)}function Ir(){let e=se(),r="sx-dock"+(e.open?" is-open":"")+(e.activeId!==null?" is-active":""),t=ve();return n("button",{type:"button",className:r,title:d("dock.title"),"aria-label":d("dock.title"),"aria-haspopup":"dialog","aria-expanded":e.open===!0,onClick:pr},t!==null?n("img",{className:"sx-dock-thumb",src:t,alt:"",draggable:!1}):n(We),e.activeId!==null?n("span",{className:"sx-dock-dot"}):null)}function Cr(){let e=L(),r=se();return n(e.Fragment,null,n(Qr,{wallpaper:r.wallpaper}),r.open?n(xt):null)}function Ar({url:e,variant:r,size:t}){let a=typeof t=="number"&&t>0?t:r==="hero"?48:24;return n("img",{className:"sx-brand-mark"+(r==="hero"?" sx-brand-mark-hero":""),src:e,alt:"",draggable:!1,style:{width:`${a}px`,height:`${a}px`}})}function Q({title:e,description:r,extra:t,bodyClass:a,children:i}){return n("section",{className:"sx-section"},n("div",{className:"sx-section-head"},n("div",{className:"sx-section-heading"},n("h3",{className:"sx-section-title"},e),r===void 0?null:n("p",{className:"sx-section-desc"},r)),t===void 0?null:t),n("div",{className:"sx-section-body"+(a===void 0?"":` ${a}`)},i))}function Zr({label:e,value:r,hint:t,children:a}){return n("label",{className:"sx-field"},n("span",{className:"sx-label-row"},n("span",{className:"sx-label"},e),r===void 0?null:n("span",{className:"sx-value"},r)),a,t===void 0?null:n("span",{className:"sx-hint"},t))}function Er({checked:e,onChange:r,label:t}){return n("button",{type:"button",className:"sx-switch"+(e===!0?" is-on":""),role:"switch","aria-checked":e===!0,"aria-label":t,onClick:()=>r(e!==!0)},n("span",{className:"sx-switch-thumb"}))}function et({label:e,description:r,checked:t,onChange:a,preview:i}){return n("div",{className:"sx-switch-row"},i===void 0?null:i,n("div",{className:"sx-switch-text"},n("span",{className:"sx-switch-label"},e),r===void 0?null:n("span",{className:"sx-switch-desc"},r)),n(Er,{checked:t,onChange:a,label:e}))}function ye({label:e,min:r,max:t,step:a,value:i,onChange:s,format:o}){let l=t===r?0:(i-r)/(t-r)*100;return n("label",{className:"sx-slider"},n("span",{className:"sx-slider-head"},n("span",{className:"sx-label"},e),n("span",{className:"sx-slider-value"},o===void 0?String(i):o(i))),n("input",{className:"sx-range",style:{"--sx-range-fill":`${Math.max(0,Math.min(100,l))}%`},type:"range",min:r,max:t,step:a===void 0?1:a,value:i,onChange:c=>s(Number(c.target.value))}))}function Dr({label:e,options:r,value:t,onChange:a}){return n("div",{className:"sx-field"},n("span",{className:"sx-label"},e),n("div",{className:"sx-segmented is-block",role:"radiogroup","aria-label":e},r.map(i=>n("button",{key:i.value,type:"button",role:"radio","aria-checked":t===i.value,className:"sx-segment"+(t===i.value?" is-active":""),onClick:()=>a(i.value)},i.label))))}function Tr({value:e,onChange:r}){return n(Dr,{label:d("dialog.scope"),value:e,onChange:r,options:["full","sidebar","hero"].map(t=>({value:t,label:d(`scope.${t}`)}))})}function zr({value:e,onChange:r}){return n(Dr,{label:d("dialog.fit"),value:e,onChange:r,options:["contain","cover"].map(t=>({value:t,label:d(`fit.${t}`)}))})}function rt({colors:e}){return n("div",{className:"sx-swatches"},(e??[]).map((r,t)=>n("span",{key:t,className:"sx-swatch",style:{background:r},title:r})))}function tt({message:e,onClose:r}){return n("div",{className:"sx-alert",role:"alert"},n("span",{className:"sx-alert-icon"},n(kr,{size:16})),n("span",{className:"sx-alert-body"},e),n("button",{type:"button",className:"sx-alert-close",title:d("dialog.close"),"aria-label":d("dialog.close"),onClick:r},n(Ue,{size:14})))}function at(){return n("div",{className:"sx-empty"},n("span",{className:"sx-empty-icon"},n(Nr,{size:26})),n("p",{className:"sx-empty-title"},d("dialog.emptyTitle")),n("p",{className:"sx-empty-hint"},d("dialog.emptyHint")))}function nt(){return n("div",{className:"sx-skeleton-grid","aria-hidden":!0},[0,1,2].map(e=>n("div",{key:e,className:"sx-skeleton-card"},n("span",{className:"sx-skeleton-cover"}),n("span",{className:"sx-skeleton-lines"},n("span",{className:"sx-skeleton-line"}),n("span",{className:"sx-skeleton-line sx-skeleton-line-short"})))))}function it(e){let r=Array.isArray(e.palette)?e.palette.length:0;return r>0?d("dialog.colorCount",{count:r}):""}function st(e){let r=Array.isArray(e.palette)?e.palette.filter(t=>typeof t=="string"):[];return r.length===0?{}:r.length===1?{background:r[0]}:{background:`linear-gradient(135deg, ${r.slice(0,3).join(", ")})`}}function ot({skin:e}){let r=typeof e.background?.url=="string"?e.background.url:null;return r!==null?n("img",{className:"sx-skin-cover-img",src:r,alt:"",draggable:!1}):n("span",{className:"sx-skin-cover-fallback",style:st(e),"aria-hidden":!0},n(He,{size:22}))}function lt({state:e}){let r=L(),[t,a]=r.useState(null),[i,s]=r.useState(""),o=r.useRef(null),l=r.useRef(""),c=r.useRef(!1),b=r.useCallback(p=>{p!==null&&(p.focus(),p.setSelectionRange(0,p.value.length))},[]),v=p=>{o.current=p.id,l.current=p.name,c.current=!1,a(p.id),s(p.name)},u=(p,y)=>{if(o.current!==p.id)return;o.current=null,c.current=!1;let I=y?"":l.current.trim().slice(0,60);a(null),s(""),I!==""&&I!==p.name&&mr(p.id,I)};return n(Q,{title:d("dialog.saved"),extra:n("span",{className:"sx-count"},String(e.skins.length)),bodyClass:"sx-section-body-list"},e.loading?n(nt):e.skins.length===0?n(at):n("ul",{className:"sx-skins"},e.skins.map(p=>{let y=p.id===e.activeId,I=t===p.id;return n("li",{key:p.id,className:"sx-skin-card"+(y?" is-active":"")},n("div",{className:"sx-skin-cover"},n("button",{type:"button",className:"sx-skin-apply",disabled:y||e.busy,title:y?d("dialog.active"):d("dialog.applySkin"),"aria-label":d("dialog.applySkin",{name:p.name}),onClick:()=>{!y&&!e.busy&&ur(p.id)}},n(ot,{skin:p}),y?null:n("span",{className:"sx-skin-apply-hint","aria-hidden":!0},d("dialog.apply"))),y?n("span",{className:"sx-skin-cover-badge"},d("dialog.active")):null,n("button",{type:"button",className:"sx-skin-delete",title:d("dialog.delete"),"aria-label":d("dialog.deleteSkin",{name:p.name}),onClick:()=>{window.confirm(d("dialog.deleteConfirm",{name:p.name}))&&fr(p.id)}},n(wr,{size:14}))),n("div",{className:"sx-skin-info"},I?n("input",{className:"sx-input sx-skin-name-input",type:"text",maxLength:60,value:i,spellCheck:!1,"aria-label":d("dialog.name"),"data-skinx-editing":"true",ref:b,onChange:S=>{l.current=S.target.value,s(S.target.value)},onCompositionStart:()=>{c.current=!0},onCompositionEnd:()=>{c.current=!1},onKeyDown:S=>{S.nativeEvent?.isComposing===!0||c.current||(S.key==="Enter"?(S.preventDefault(),u(p,!1)):S.key==="Escape"&&(S.preventDefault(),S.stopPropagation(),u(p,!0)))},onBlur:()=>u(p,!1)}):n("button",{type:"button",className:"sx-skin-name",title:d("dialog.renameSkin",{name:p.name}),"aria-label":d("dialog.renameSkin",{name:p.name}),onClick:()=>v(p)},n("span",{className:"sx-skin-name-text"},p.name),n("span",{className:"sx-skin-name-pencil","aria-hidden":!0},n(yr,{size:12}))),n("span",{className:"sx-skin-meta"},it(p))))})))}function dt({state:e}){let r=e.skins.find(i=>i.id===e.activeId);if(r===void 0||typeof r.background?.url!="string")return null;let t=r.background,a=r.brandMark===!0;return n(Q,{title:d("dialog.activeSkin"),description:d("dialog.activeHint"),extra:n("span",{className:"sx-badge"},d("dialog.active"))},[n("div",{key:"wallpaper-fields",className:"sx-wallpaper-fields"},[n(ye,{key:"strength",label:d("dialog.strength"),min:0,max:100,value:Pe(t.opacity),onChange:i=>J({opacity:je(i)}),format:i=>`${i}%`}),n(ye,{key:"blur",label:d("dialog.blur"),min:0,max:24,value:t.blur??0,onChange:i=>J({blur:i}),format:i=>`${i}px`}),n(Tr,{key:"scope",value:t.scope??"full",onChange:i=>J({scope:i})}),n(zr,{key:"fit",value:t.fit??"contain",onChange:i=>J({fit:i})})]),n("div",{key:"divider",className:"sx-divider"}),n(et,{key:"brand",label:d("dialog.brandMark"),description:d("dialog.brandMarkDesc"),checked:a,preview:a?n("span",{className:"sx-switch-preview"},n("img",{className:"sx-brand-preview sx-brand-preview-sm",src:t.url,alt:"",draggable:!1})):void 0,onChange:i=>gr(i)})].filter(i=>i!==null))}function ct({state:e,dragging:r,setDragging:t,choose:a,onFiles:i,fileInput:s}){return n("div",null,[n("button",{key:"drop",type:"button",className:"sx-drop"+(r?" is-dragging":""),"aria-busy":e.busy===!0,onClick:a,onDragEnter:o=>{o.preventDefault(),t(!0)},onDragOver:o=>{o.preventDefault(),t(!0)},onDragLeave:o=>{o.preventDefault(),t(!1)},onDrop:o=>{o.preventDefault(),o.stopPropagation(),t(!1),i(o.dataTransfer?.files)}},n("span",{className:"sx-drop-icon-wrap"},e.busy?n("span",{className:"sx-spinner sx-spinner-lg"}):n(vr,{size:26})),n("span",{className:"sx-drop-title"},e.busy?d("dialog.loading"):d("dialog.dropTitle")),n("span",{className:"sx-drop-hint"},d("dialog.dropHint"))),n("input",{key:"file",ref:s,className:"sx-file",type:"file",accept:"image/*",onChange:o=>{i(o.target.files),o.target.value=""}}),n(lt,{key:"skins",state:e}),n(dt,{key:"active",state:e})])}function pt({draft:e}){let r=e.wallpaper;return n("div",{className:"sx-preview"},[n("div",{key:"media",className:"sx-preview-media-col"},[n("div",{key:"media",className:"sx-preview-media"},n("img",{className:"sx-preview-img",src:e.previewUrl,alt:""}),n("span",{className:"sx-media-badge"},d("dialog.preview"))),n("div",{key:"palette",className:"sx-media-palette"},n("span",{className:"sx-label"},d("dialog.palette")),n(rt,{colors:e.palette})),n("p",{key:"note",className:"sx-muted"},d("dialog.localHint"))]),n("div",{key:"side",className:"sx-preview-side"},[n(Q,{key:"appearance",title:d("dialog.appearance")},[n(Zr,{key:"name",label:d("dialog.name")},n("input",{className:"sx-input",type:"text",maxLength:60,value:e.name,onChange:t=>O({name:t.target.value})}))]),n(Q,{key:"wallpaper",title:d("dialog.wallpaperShort")},[n(ye,{key:"strength",label:d("dialog.strength"),min:0,max:100,value:Pe(r.opacity),onChange:t=>O({wallpaper:{opacity:je(t)}}),format:t=>`${t}%`}),n(ye,{key:"blur",label:d("dialog.blur"),min:0,max:24,value:r.blur,onChange:t=>O({wallpaper:{blur:t}}),format:t=>`${t}px`}),n(Tr,{key:"scope",value:r.scope??"full",onChange:t=>O({wallpaper:{scope:t}})}),n(zr,{key:"fit",value:r.fit??"contain",onChange:t=>O({wallpaper:{fit:t}})})]),n(Q,{key:"brand",title:d("dialog.brandMarkShort"),extra:n(Er,{checked:e.brandMark===!0,label:d("dialog.brandMark"),onChange:t=>O({brandMark:t})})},n("div",{className:"sx-brand-row"},e.brandMark===!0?n("img",{className:"sx-brand-preview",src:e.previewUrl,alt:"",draggable:!1}):n("span",{className:"sx-brand-placeholder"},n(He,{size:22})),n("p",{className:"sx-section-note"},d("dialog.brandMarkDesc"))))])])}function xt(){let e=L(),r=se(),[t,a]=e.useState(!1),i=e.useRef(null),s=r.draft!==null;e.useEffect(()=>{let u=p=>{if(p.key!=="Escape")return;let y=p.target;typeof y?.closest=="function"&&y.closest("[data-skinx-editing]")!==null||(p.stopPropagation(),H())};return document.addEventListener("keydown",u,!0),()=>document.removeEventListener("keydown",u,!0)},[]),e.useEffect(()=>{let u=p=>{let y=p.clipboardData?.files;if(!y||y.length===0)return;let I=[...y].find(S=>S.type.startsWith("image/"));I!==void 0&&(p.preventDefault(),G(I))};return document.addEventListener("paste",u),()=>document.removeEventListener("paste",u)},[]),e.useEffect(()=>{let u=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{document.body.style.overflow=u}},[]);let o=()=>{i.current!==null&&i.current.click()},l=u=>{let p=[...u??[]];p.length>0&&G(p[0])},c=r.activeId!==null,b=n("button",{key:"close",type:"button",className:"sx-btn",onClick:H},d("dialog.close")),v=s?[n("button",{key:"discard",type:"button",className:"sx-btn",disabled:r.busy,onClick:Fe},d("dialog.cancelPreview")),n("button",{key:"save",type:"button",className:"sx-btn sx-btn-primary",disabled:r.busy,onClick:xr},r.busy?n("span",{className:"sx-spinner","aria-hidden":!0}):null,r.busy?d("dialog.saving"):d("dialog.save"))]:[b];return n("div",{className:"sx-overlay",onMouseDown:u=>{u.target===u.currentTarget&&H()}},n("div",{className:"sx-dialog",role:"dialog","aria-modal":"true","aria-labelledby":"sx-dialog-title","aria-describedby":"sx-dialog-desc"},n("header",{className:"sx-header"},n("div",{className:"sx-header-brand"},n("span",{className:"sx-header-icon"},n(We,{size:19})),n("div",{className:"sx-header-main"},n("h2",{id:"sx-dialog-title",className:"sx-title"},d("dialog.title")),n("p",{id:"sx-dialog-desc",className:"sx-subtitle"},s?d("dialog.previewSubtitle"):d("dialog.subtitle")))),n("button",{type:"button",className:"sx-close",autoFocus:!0,title:d("dialog.close"),"aria-label":d("dialog.close"),onClick:H},n(Ue,{size:17}))),n("div",{className:"sx-body"},r.error!==null?n(tt,{message:r.error,onClose:hr}):null,s?n(pt,{draft:r.draft}):n(ct,{state:r,dragging:t,setDragging:a,choose:o,onFiles:l,fileInput:i})),n("footer",{className:"sx-footer"},n("div",{className:"sx-footer-left"},n("button",{type:"button",className:"sx-btn sx-btn-text",disabled:s||!c,onClick:br},n(Sr,{size:14}),d("dialog.restore"))),n("div",{className:"sx-footer-right"},v))))}var Lr=`
/* -------------------------------------------------------------------------- */
/* Dock button                                                                */
/* -------------------------------------------------------------------------- */
.sx-dock {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #5b5f66);
  cursor: pointer;
  transition: background .2s ease, color .2s ease, border-color .2s ease;
}
.sx-dock:hover, .sx-dock.is-open {
  background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, .05));
  color: var(--dsw-alias-label-primary, #1f1f1f);
}
.sx-dock:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary, #1677ff) 22%, transparent);
}
.sx-dock.is-active { color: var(--dsw-alias-brand-primary, #1677ff); }
.sx-dock-dot {
  position: absolute;
  right: 5px;
  bottom: 5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--dsw-alias-brand-primary, #1677ff);
  box-shadow: 0 0 0 2px var(--dsw-specific-sidebar-fill, #fff);
}
.sx-dock-thumb {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  object-fit: cover;
  pointer-events: none;
}

/* -------------------------------------------------------------------------- */
/* Overlay and dialog shell                                                   */
/* -------------------------------------------------------------------------- */
.sx-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, .45);
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  pointer-events: auto;
  animation: sx-fade-in .2s ease both;
}

.sx-dialog {
  --sx-radius-lg: 12px;
  --sx-radius: 10px;
  --sx-radius-sm: 8px;
  --sx-surface: var(--dsw-alias-bg-overlay, #fff);
  --sx-surface-1: var(--dsw-alias-bg-layer-1, #fff);
  --sx-surface-2: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, .04));
  --sx-border: var(--dsw-alias-border-l1, rgba(0, 0, 0, .08));
  --sx-border-strong: var(--dsw-alias-border-l2, rgba(0, 0, 0, .16));
  --sx-text: var(--dsw-alias-label-primary, rgba(0, 0, 0, .88));
  --sx-text-2: var(--dsw-alias-label-secondary, rgba(0, 0, 0, .65));
  --sx-text-3: var(--dsw-alias-label-tertiary, rgba(0, 0, 0, .45));
  --sx-brand: var(--dsw-alias-brand-primary, #1677ff);
  --sx-on-brand: var(--dsw-alias-label-primary-inverted, #fff);
  --sx-danger: var(--dsw-alias-state-error-primary, #ff4d4f);
  --sx-hover: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, .05));
  --sx-motion: .2s cubic-bezier(.645, .045, .355, 1);
  display: flex;
  flex-direction: column;
  width: min(880px, 100%);
  max-height: min(90vh, 860px);
  border: 1px solid var(--sx-border);
  border-radius: var(--sx-radius-lg);
  background: var(--sx-surface);
  color: var(--sx-text);
  box-shadow:
    0 6px 16px 0 rgba(0, 0, 0, .08),
    0 3px 6px -4px rgba(0, 0, 0, .12),
    0 9px 28px 8px rgba(0, 0, 0, .05);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  backdrop-filter: blur(18px) saturate(1.2);
  font-size: 14px;
  line-height: 1.5715;
  overflow: hidden;
  animation: sx-dialog-in .24s cubic-bezier(.2, .8, .2, 1) both;
}
.sx-dialog *, .sx-dialog *::before, .sx-dialog *::after { box-sizing: border-box; }
.sx-dialog :where(button, input) { font: inherit; color: inherit; }

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */
.sx-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex: none;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--sx-border);
}
.sx-header-brand { display: flex; align-items: flex-start; gap: 12px; min-width: 0; }
.sx-header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--sx-brand) 12%, transparent);
  color: var(--sx-brand);
}
.sx-header-main { min-width: 0; }
.sx-title {
  margin: 0;
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
  letter-spacing: -.01em;
}
.sx-subtitle {
  margin: 2px 0 0;
  color: var(--sx-text-2);
  font-size: 13px;
  line-height: 20px;
}
.sx-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--sx-radius-sm);
  background: transparent;
  color: var(--sx-text-2);
  cursor: pointer;
  transition: background var(--sx-motion), color var(--sx-motion);
}
.sx-close:hover { background: var(--sx-hover); color: var(--sx-text); }
.sx-close:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--sx-brand) 20%, transparent);
}

/* -------------------------------------------------------------------------- */
/* Body and footer                                                            */
/* -------------------------------------------------------------------------- */
.sx-body {
  flex: 1;
  min-height: 0;
  padding: 20px 24px 24px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--sx-text) 18%, transparent) transparent;
}
.sx-body::-webkit-scrollbar { width: 8px; }
.sx-body::-webkit-scrollbar-track { background: transparent; }
.sx-body::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  border-radius: 4px;
  background: color-mix(in srgb, var(--sx-text) 18%, transparent);
  background-clip: padding-box;
}
.sx-body::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--sx-text) 30%, transparent);
  background-clip: padding-box;
}

.sx-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex: none;
  padding: 12px 24px;
  border-top: 1px solid var(--sx-border);
  background: var(--sx-surface);
}
.sx-footer-left, .sx-footer-right { display: flex; align-items: center; gap: 8px; }

/* -------------------------------------------------------------------------- */
/* Alert                                                                      */
/* -------------------------------------------------------------------------- */
.sx-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 16px;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--sx-danger) 30%, transparent);
  border-radius: var(--sx-radius-sm);
  background: color-mix(in srgb, var(--sx-danger) 8%, transparent);
}
.sx-alert-icon { display: inline-flex; flex: none; margin-top: 1px; color: var(--sx-danger); }
.sx-alert-body { flex: 1; min-width: 0; font-size: 13px; overflow-wrap: anywhere; }
.sx-alert-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--sx-text-2);
  cursor: pointer;
}
.sx-alert-close:hover { background: color-mix(in srgb, var(--sx-danger) 10%, transparent); color: var(--sx-danger); }

/* -------------------------------------------------------------------------- */
/* Drop zone                                                                  */
/* -------------------------------------------------------------------------- */
.sx-drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 100%;
  min-height: 140px;
  padding: 18px 20px;
  border: 1.5px dashed var(--sx-border-strong);
  border-radius: var(--sx-radius-lg);
  background: var(--sx-surface-1);
  color: var(--sx-text);
  text-align: center;
  cursor: pointer;
  transition: border-color var(--sx-motion), background var(--sx-motion), box-shadow var(--sx-motion);
}
.sx-drop:hover, .sx-drop.is-dragging {
  border-color: var(--sx-brand);
  background: color-mix(in srgb, var(--sx-brand) 5%, var(--sx-surface-1));
}
.sx-drop.is-dragging { box-shadow: inset 0 0 0 1px var(--sx-brand); }
.sx-drop:focus-visible {
  outline: none;
  border-color: var(--sx-brand);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--sx-brand) 18%, transparent);
}
.sx-drop-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  margin-bottom: 4px;
  border-radius: 13px;
  background: color-mix(in srgb, var(--sx-brand) 10%, transparent);
  color: var(--sx-brand);
}
.sx-drop-title { font-size: 15px; font-weight: 600; line-height: 22px; }
.sx-drop-hint { color: var(--sx-text-2); font-size: 12.5px; line-height: 20px; }
.sx-file { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }

/* -------------------------------------------------------------------------- */
/* Section card                                                               */
/* -------------------------------------------------------------------------- */
.sx-section {
  margin-top: 20px;
  border: 1px solid var(--sx-border);
  border-radius: var(--sx-radius);
  background: var(--sx-surface-1);
  overflow: hidden;
}
.sx-section:first-child { margin-top: 0; }
.sx-section-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--sx-border);
}
.sx-section-heading { flex: 1; min-width: 0; }
.sx-section-title { margin: 0; font-size: 14px; line-height: 20px; font-weight: 600; }
.sx-section-desc { margin: 2px 0 0; color: var(--sx-text-2); font-size: 12px; line-height: 18px; }
.sx-section-body { padding: 16px; }
.sx-section-body > * + * { margin-top: 14px; }
.sx-section-body-list { padding: 14px; }
.sx-section-note { margin: 0; color: var(--sx-text-2); font-size: 12.5px; line-height: 19px; }

/* -------------------------------------------------------------------------- */
/* Fields                                                                     */
/* -------------------------------------------------------------------------- */
.sx-field { display: flex; flex-direction: column; gap: 6px; }
.sx-label { color: var(--sx-text); font-size: 13px; font-weight: 500; line-height: 18px; }
.sx-label-row { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.sx-value { color: var(--sx-text-3); font-size: 12px; font-variant-numeric: tabular-nums; }
.sx-hint { color: var(--sx-text-3); font-size: 12px; }
.sx-divider { height: 1px; background: var(--sx-border); }
.sx-muted { margin: 0; color: var(--sx-text-3); font-size: 12px; line-height: 18px; }

.sx-input {
  width: 100%;
  height: 34px;
  padding: 0 11px;
  border: 1px solid var(--sx-border-strong);
  border-radius: var(--sx-radius-sm);
  background: var(--sx-surface);
  color: var(--sx-text);
  font-size: 13px;
  transition: border-color var(--sx-motion), box-shadow var(--sx-motion);
}
.sx-input:hover { border-color: color-mix(in srgb, var(--sx-brand) 45%, var(--sx-border-strong)); }
.sx-input:focus {
  outline: none;
  border-color: var(--sx-brand);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--sx-brand) 18%, transparent);
}

/* -------------------------------------------------------------------------- */
/* Switch                                                                     */
/* -------------------------------------------------------------------------- */
.sx-switch-row { display: flex; align-items: center; gap: 12px; }
.sx-switch-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.sx-switch-label { font-size: 13px; font-weight: 500; line-height: 20px; }
.sx-switch-desc { color: var(--sx-text-2); font-size: 12px; line-height: 18px; }
.sx-switch-preview { display: inline-flex; flex: none; }
.sx-switch {
  position: relative;
  flex: none;
  width: 44px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 11px;
  background: color-mix(in srgb, var(--sx-text) 22%, transparent);
  cursor: pointer;
  transition: background var(--sx-motion);
}
.sx-switch:hover:not(.is-on) { background: color-mix(in srgb, var(--sx-text) 32%, transparent); }
.sx-switch.is-on { background: var(--sx-brand); }
.sx-switch:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--sx-brand) 20%, transparent);
}
.sx-switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--dsw-alias-switch-thumb, #fff);
  box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
  transition: transform var(--sx-motion);
}
.sx-switch.is-on .sx-switch-thumb { transform: translateX(22px); }

/* -------------------------------------------------------------------------- */
/* Slider                                                                     */
/* -------------------------------------------------------------------------- */
.sx-slider { display: flex; flex-direction: column; gap: 4px; }
.sx-slider-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.sx-slider-value {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 7px;
  border: 1px solid var(--sx-border);
  border-radius: 6px;
  background: var(--sx-surface);
  color: var(--sx-text-2);
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
}
.sx-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 20px;
  margin: 0;
  background: transparent;
  cursor: pointer;
}
.sx-range::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(
    to right,
    var(--sx-brand) 0,
    var(--sx-brand) var(--sx-range-fill, 50%),
    color-mix(in srgb, var(--sx-text) 14%, transparent) var(--sx-range-fill, 50%),
    color-mix(in srgb, var(--sx-text) 14%, transparent) 100%
  );
}
.sx-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  margin-top: -6px;
  border: 2px solid var(--sx-brand);
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .18);
  transition: transform .15s ease, box-shadow .15s ease;
}
.sx-range:hover::-webkit-slider-thumb { transform: scale(1.1); }
.sx-range:focus-visible { outline: none; }
.sx-range:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--sx-brand) 22%, transparent);
}
.sx-range::-moz-range-track {
  height: 4px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--sx-text) 14%, transparent);
}
.sx-range::-moz-range-progress { height: 4px; border-radius: 2px; background: var(--sx-brand); }
.sx-range::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: 2px solid var(--sx-brand);
  border-radius: 50%;
  background: #fff;
}

/* -------------------------------------------------------------------------- */
/* Segmented control                                                          */
/* -------------------------------------------------------------------------- */
.sx-segmented {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  border-radius: var(--sx-radius-sm);
  background: color-mix(in srgb, var(--sx-text) 8%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--sx-text) 9%, transparent);
}
.sx-segmented.is-block { display: flex; width: 100%; }
.sx-segmented.is-block .sx-segment { flex: 1; min-width: 0; padding: 0 8px; }
.sx-segment {
  height: 28px;
  padding: 0 12px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--sx-text-2);
  font-size: 12.5px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: background .15s ease, color .15s ease, box-shadow .15s ease;
}
.sx-segment:hover:not(.is-active) {
  background: color-mix(in srgb, var(--sx-text) 7%, transparent);
  color: var(--sx-text);
}
/* The selected segment is a filled brand chip: an unfilled surface on a lightly
   tinted track reads as "nothing selected" at a glance. */
.sx-segment.is-active {
  background: var(--sx-brand);
  color: var(--sx-on-brand);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .18);
}
.sx-segment:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--sx-brand) 60%, transparent);
  outline-offset: 1px;
}

/* -------------------------------------------------------------------------- */
/* Swatches                                                                   */
/* -------------------------------------------------------------------------- */
.sx-swatches { display: flex; flex-wrap: wrap; gap: 6px; }
.sx-swatch {
  display: block;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .12);
}
/* -------------------------------------------------------------------------- */
/* Saved skins                                                                */
/* -------------------------------------------------------------------------- */
.sx-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--sx-surface-2);
  color: var(--sx-text-2);
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.sx-skins {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.sx-skin-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--sx-border);
  border-radius: var(--sx-radius);
  background: var(--sx-surface);
  overflow: hidden;
  transition: border-color var(--sx-motion), box-shadow var(--sx-motion);
}
.sx-skin-card:hover {
  border-color: color-mix(in srgb, var(--sx-brand) 40%, var(--sx-border));
  box-shadow: 0 6px 16px rgba(0, 0, 0, .09);
}
.sx-skin-card.is-active {
  border-color: color-mix(in srgb, var(--sx-brand) 55%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--sx-brand) 32%, transparent);
}
.sx-skin-cover {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--sx-surface-2);
  overflow: hidden;
}
/* The picture itself is the apply affordance; the pill only teaches it. */
.sx-skin-apply {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}
.sx-skin-apply:disabled { cursor: default; }
.sx-skin-apply:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--sx-brand);
}
.sx-skin-apply-hint {
  position: absolute;
  left: 50%;
  top: 50%;
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 11px;
  border-radius: 999px;
  background: rgba(0, 0, 0, .52);
  color: #fff;
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  transform: translate(-50%, -50%) scale(.94);
  pointer-events: none;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  transition: opacity var(--sx-motion), transform var(--sx-motion);
}
.sx-skin-card:hover .sx-skin-apply-hint,
.sx-skin-apply:focus-visible .sx-skin-apply-hint {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.sx-skin-cover-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .3s ease;
}
.sx-skin-card:hover .sx-skin-cover-img { transform: scale(1.04); }
.sx-skin-cover-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, .85);
}
.sx-skin-cover-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 9px;
  border-radius: 999px;
  background: var(--sx-brand);
  color: var(--sx-on-brand);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .25);
}
/* Destructive action lives on the picture, revealed on hover/focus only. */
.sx-skin-delete {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, .24);
  border-radius: 999px;
  background: rgba(0, 0, 0, .42);
  color: #fff;
  cursor: pointer;
  opacity: 0;
  transform: scale(.88);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  transition:
    opacity var(--sx-motion),
    transform var(--sx-motion),
    background var(--sx-motion),
    border-color var(--sx-motion);
}
.sx-skin-card:hover .sx-skin-delete,
.sx-skin-card:focus-within .sx-skin-delete {
  opacity: 1;
  transform: none;
}
.sx-skin-delete:hover {
  background: var(--sx-danger);
  border-color: transparent;
}
.sx-skin-delete:focus-visible {
  outline: none;
  opacity: 1;
  transform: none;
  box-shadow:
    0 0 0 2px var(--sx-surface),
    0 0 0 4px color-mix(in srgb, var(--sx-danger) 55%, transparent);
}
@media (hover: none) {
  .sx-skin-delete,
  .sx-skin-apply-hint {
    opacity: 1;
    transform: none;
  }
}
.sx-skin-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding: 10px 12px;
}
.sx-skin-name {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  padding: 0;
  border: 0;
  background: none;
  color: var(--sx-text);
  font-size: 13.5px;
  font-weight: 600;
  line-height: 20px;
  text-align: left;
  cursor: text;
}
.sx-skin-name-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sx-skin-name-pencil {
  display: inline-flex;
  flex: none;
  color: var(--sx-text-3);
  opacity: .5;
  transition: opacity var(--sx-motion), color var(--sx-motion);
}
.sx-skin-name:hover .sx-skin-name-text { color: var(--sx-brand); }
.sx-skin-name:hover .sx-skin-name-pencil,
.sx-skin-name:focus-visible .sx-skin-name-pencil {
  opacity: 1;
  color: var(--sx-brand);
}
.sx-skin-name:focus-visible {
  outline: none;
  border-radius: 4px;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--sx-brand) 22%, transparent);
}
.sx-skin-name-input {
  width: 100%;
  height: 24px;
  padding: 0 7px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 600;
  line-height: 24px;
}
.sx-skin-meta { color: var(--sx-text-3); font-size: 11.5px; line-height: 16px; }
.sx-badge {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--sx-brand) 12%, transparent);
  color: var(--sx-brand);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

/* -------------------------------------------------------------------------- */
/* Empty and skeleton                                                         */
/* -------------------------------------------------------------------------- */
.sx-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 28px 16px 24px;
  text-align: center;
}
.sx-empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 5px;
  border-radius: 50%;
  background: var(--sx-surface-2);
  color: var(--sx-text-3);
}
.sx-empty-title { margin: 0; font-size: 13.5px; font-weight: 500; }
.sx-empty-hint { margin: 0; color: var(--sx-text-2); font-size: 12.5px; }
.sx-skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
  gap: 12px;
}
.sx-skeleton-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--sx-border);
  border-radius: var(--sx-radius);
  background: var(--sx-surface);
  overflow: hidden;
}
.sx-skeleton-cover {
  display: block;
  aspect-ratio: 16 / 10;
  background: var(--sx-surface-2);
}
.sx-skeleton-lines { display: flex; flex-direction: column; gap: 6px; padding: 12px; }
.sx-skeleton-line {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--sx-surface-2) 25%,
    color-mix(in srgb, var(--sx-surface-2) 40%, var(--sx-surface-1)) 37%,
    var(--sx-surface-2) 63%
  );
  background-size: 400% 100%;
  animation: sx-shimmer 1.4s ease infinite;
}
.sx-skeleton-line-short { width: 42%; }

/* -------------------------------------------------------------------------- */
/* Active skin                                                                */
/* -------------------------------------------------------------------------- */
.sx-wallpaper-fields { display: flex; flex-direction: column; gap: 14px; }
.sx-brand-row { display: flex; align-items: center; gap: 14px; }
.sx-brand-preview {
  flex: none;
  width: 48px;
  height: 48px;
  border: 1px solid var(--sx-border);
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .08);
}
.sx-brand-preview-sm { width: 36px; height: 36px; border-radius: 10px; }
.sx-brand-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--sx-surface-2);
  color: var(--sx-text-3);
}

/* -------------------------------------------------------------------------- */
/* Preview                                                                    */
/* -------------------------------------------------------------------------- */
.sx-preview {
  display: grid;
  grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
  gap: 20px;
  align-items: start;
}
.sx-preview-media-col {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.sx-preview-media {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  max-height: 420px;
  border: 1px solid var(--sx-border);
  border-radius: var(--sx-radius-lg);
  background: var(--sx-surface-2);
  overflow: hidden;
}
.sx-preview-img { display: block; width: 100%; max-height: 380px; object-fit: contain; }
.sx-media-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 9px;
  border-radius: 999px;
  background: rgba(0, 0, 0, .72);
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}
.sx-media-palette { display: flex; align-items: center; gap: 10px; }
.sx-media-palette .sx-label { flex: none; }
.sx-preview-side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.sx-preview-side > .sx-section { margin-top: 0; }

/* -------------------------------------------------------------------------- */
/* Buttons and spinner                                                        */
/* -------------------------------------------------------------------------- */
.sx-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 15px;
  border: 1px solid var(--sx-border-strong);
  border-radius: var(--sx-radius-sm);
  background: var(--sx-surface-1);
  color: var(--sx-text);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: color var(--sx-motion), border-color var(--sx-motion), background var(--sx-motion), box-shadow var(--sx-motion), filter var(--sx-motion);
}
.sx-btn:hover:not(:disabled) { color: var(--sx-brand); border-color: var(--sx-brand); }
.sx-btn:active:not(:disabled) { transform: translateY(.5px); }
.sx-btn:focus-visible {
  outline: none;
  border-color: var(--sx-brand);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--sx-brand) 18%, transparent);
}
.sx-btn:disabled { opacity: .45; cursor: not-allowed; }
.sx-btn-primary {
  border-color: var(--sx-brand);
  background: var(--sx-brand);
  color: var(--sx-on-brand);
}
.sx-btn-primary:hover:not(:disabled) {
  border-color: var(--sx-brand);
  background: var(--sx-brand);
  color: var(--sx-on-brand);
  text-decoration: underline;
}
.sx-btn-text {
  border-color: transparent;
  background: transparent;
  color: var(--sx-text-2);
}
.sx-btn-text:hover:not(:disabled) {
  border-color: transparent;
  background: var(--sx-hover);
  color: var(--sx-text);
}
.sx-btn-sm { height: 26px; padding: 0 10px; font-size: 12px; }

.sx-spinner {
  display: inline-block;
  flex: none;
  width: 14px;
  height: 14px;
  border: 2px solid color-mix(in srgb, currentColor 25%, transparent);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: sx-spin .8s linear infinite;
}
.sx-spinner-lg { width: 22px; height: 22px; }

/* -------------------------------------------------------------------------- */
/* Host brand marks                                                           */
/* -------------------------------------------------------------------------- */
.sx-brand-mark { display: block; flex: none; border-radius: 8px; object-fit: cover; }
.sx-brand-mark-hero { border-radius: 14px; }

/* -------------------------------------------------------------------------- */
/* Motion                                                                     */
/* -------------------------------------------------------------------------- */
@keyframes sx-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes sx-dialog-in {
  from { opacity: 0; transform: translateY(12px) scale(.985); }
  to { opacity: 1; transform: none; }
}
@keyframes sx-spin {
  to { transform: rotate(360deg); }
}
@keyframes sx-shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* -------------------------------------------------------------------------- */
/* Responsive                                                                 */
/* -------------------------------------------------------------------------- */
@media (max-width: 720px) {
  .sx-overlay { padding: 12px; }
  .sx-dialog { max-height: calc(100vh - 24px); border-radius: 10px; }
  .sx-header { padding: 16px; }
  .sx-body { padding: 16px; }
  .sx-footer { padding: 10px 16px; }
  .sx-title { font-size: 16px; }
  .sx-preview { grid-template-columns: 1fr; }
  .sx-preview-media-col { position: static; }
}
@media (max-width: 520px) {
  .sx-header-icon { display: none; }
  .sx-skins, .sx-skeleton-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  .sx-footer { flex-wrap: wrap; }
  .sx-footer-left { order: 2; }
  .sx-footer-right { flex: 1; justify-content: flex-end; }
}

@media (prefers-reduced-motion: reduce) {
  .sx-overlay, .sx-dialog { animation: none; }
  .sx-dialog *, .sx-dialog *::before, .sx-dialog *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
  }
}
`;var we="skinx";function ut(e){let r=[],t=null,a=()=>{for(let s of r.splice(0))try{s()}catch(o){console.error("[skinx] could not dispose a brand mark:",o)}};return{sync:()=>{let s=ve();if(s===t||(t=s,a(),s===null))return;let o=(l,c)=>{let b=e.slots.inject(l,()=>e.slots.register({name:l,locale:we},v=>n(Ar,{url:s,variant:c,size:v?.size})));r.push(b)};try{o("sidebar.brand.mark","sidebar"),o("conversation.hero.brand.mark","hero")}catch(l){console.error("[skinx] could not register brand marks:",l),a(),t=null}},dispose:a}}function ft(e){let r=s=>s==null||typeof s.closest!="function"?!1:s.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""], [role="textbox"]')!==null,t=s=>{if(s){for(let o of s)if(typeof o?.type=="string"&&o.type.startsWith("image/"))return o}},a=s=>{if(N().open||r(s.target))return;let o=s.dataTransfer?.types;!o||![...o].includes("Files")||(s.preventDefault(),s.dataTransfer.dropEffect="copy")},i=s=>{if(N().open||r(s.target))return;let o=t(s.dataTransfer?.files);o!==void 0&&(s.preventDefault(),Oe(),G(o))};return document.addEventListener("dragover",a,!0),document.addEventListener("drop",i,!0),()=>{document.removeEventListener("dragover",a,!0),document.removeEventListener("drop",i,!0)}}function Rr(e){return qe(e),{inject:["slots","locale","theme"],apply(r){r.effect(()=>{let t=document.createElement("style");return t.setAttribute("data-skinx",""),t.textContent=Lr,document.head.appendChild(t),()=>{t.remove()}},"skinx: styles"),r.effect(()=>r.locale.register(we,{en:Ke,zh:Xe}),"skinx: locale"),Ve(r.locale.bind(we)),dr(r),r.effect(()=>()=>{cr()},"skinx: runtime"),r.effect(()=>{let t=ut(r),a=Le(t.sync);return t.sync(),()=>{a(),t.dispose()}},"skinx: brand marks"),r.effect(()=>ft(r),"skinx: global drag intake"),r.slots.inject("sidebar.footer.action",()=>r.slots.register({name:"sidebar.footer.action",id:"skinx",order:40,locale:we,label:()=>d("dock.label")},Ir)),r.slots.inject("shell.overlay",()=>r.slots.register({name:"shell.overlay",id:"skinx",order:100},Cr))}}}window.__ModuleLoader__.load({id:"@cfour-hi/dsh-plugin-skinx",factory(e){return Rr(e("react"))}});})();
