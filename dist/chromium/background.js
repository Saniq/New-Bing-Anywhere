"use strict";(()=>{var p="1.6.2";var d={type:"git",url:"https://github.com/haozi/new-bing-anywhere"};var c="https://www.bing.com/";var v=["zh-CN","ru","ru-ru"];var R=()=>{let e=chrome.i18n.getUILanguage().toLowerCase();return e==="zh-cn"||e==="zh-tw"||e==="zh-hk"||e==="zh"};var Q=chrome.runtime.getURL("app/index.html"),w=R();var m=(e="",t)=>{try{return new URL(e,t)}catch{return{searchParams:{get:()=>null}}}},b=e=>{try{return new URLSearchParams(e)}catch{return{get:()=>null}}},T=e=>{chrome.runtime.onMessage.addListener((t,r,n)=>((async()=>{try{let{method:i,args:s}=t,a=await e[i](...s);n({code:200,msg:"ok",data:a})}catch(i){let s=i??{};n({code:500,msg:s.stack??s.message??i})}})(),!0))},o=async e=>{let t=await chrome.tabs.query({currentWindow:!0}),r=m(e),n=t.find(i=>i.url?.startsWith(r.origin));return n==null?n=await chrome.tabs.create({url:e}):await Promise.all([chrome.tabs.move(n.id,{index:t.length-1}),n.url!==e&&chrome.tabs.update(n.id,{url:e}),chrome.tabs.update(n.id,{active:!0,url:n.url!==e?e:void 0})].filter(Boolean)),n},C=async()=>{let r=`${d.url}/issues/new?title=&body=`,n="Please write your comment ABOVE this line, provide as much detailed information and screenshots as possible.The UA may not necessarily reflect your actual browser and platform, so please make sure to indicate them clearly.";w&&(n="\u8BF7\u5728\u6B64\u884C\u4E0A\u65B9\u53D1\u8868\u60A8\u7684\u8BA8\u8BBA\u3002\u8BE6\u5C3D\u7684\u63CF\u8FF0\u548C\u622A\u56FE\u6709\u52A9\u4E8E\u6211\u4EEC\u5B9A\u4F4D\u95EE\u9898\uFF0CUA \u4E0D\u4E00\u5B9A\u771F\u5B9E\u53CD\u6620\u60A8\u7684\u6D4F\u89C8\u5668\u548C\u5E73\u53F0\uFF0C\u8BF7\u5907\u6CE8\u6E05\u695A");let i=` 



<!--  ${n} -->
Version: ${p}
UA: ${navigator.userAgent}
Lang: ${chrome.i18n.getUILanguage()}
AcceptLangs: ${(await chrome.i18n.getAcceptLanguages()).join(", ")}`;return r+=encodeURIComponent(i.slice(0,2e3)),r},g=async(e,t={})=>await chrome.cookies.set({domain:t.domain,storeId:t.storeId,path:t.path,httpOnly:t.httpOnly,secure:t.secure,sameSite:t.sameSite,expirationDate:t.expirationDate,...e});var I={openChat:{title:"\u{1F4AC} New Bing",contexts:["action"],onclick:e=>{o("https://www.bing.com/search?q=Bing+AI&showconv=1")}},openImageCreate:{title:"\u{1F5BC}\uFE0F New Bing Image Create",contexts:["action"],onclick:e=>{o("https://www.bing.com/create")}},likeIt:{title:"\u2764\uFE0F Like it",contexts:["action"],onclick:()=>{o("https://chrome.google.com/webstore/detail/new-bing-anywhere/hceobhjokpdbogjkplmfjeomkeckkngi/reviews")}},reportIssues:{title:w?"\u{1F41B} \u53CD\u9988\u5EFA\u8BAE":"\u{1F41B} Report issues",contexts:["action"],onclick:async e=>{let t=await C();o(t)}}},E=()=>{chrome.contextMenus.removeAll(()=>{for(let[e,t]of Object.entries(I))chrome.contextMenus.create({id:e,title:t.title,contexts:t.contexts})}),chrome.contextMenus.onClicked.addListener((e,t)=>{let{menuItemId:r}=e,n=I[r];n?.onclick&&n.onclick(e,t)})};var N=()=>{E(),T({openUrlInSameTab:async({url:e}={})=>{let t=await chrome.tabs.query({currentWindow:!0}),r=m(e),n=t.find(D=>D.url?.startsWith(r.origin));n==null?n=await chrome.tabs.create({url:e}):n.id!=null&&await Promise.all([chrome.tabs.move(n.id,{index:t.length-1}),chrome.tabs.update(n.id,{active:!0})]);let i=e,s="",a="",y=r.hostname==="www.google.com",f=r.hostname==="www.bing.com";y?(s=r.searchParams.get("q")??"",a=m(n.url).searchParams.get("q")??"",m(n.url).searchParams.get("q")):f&&(s=r.searchParams.get("q")??"",a=m(n.url).searchParams.get("q")??""),s=s.trim(),a=a.trim(),!(s&&s===a)&&(y?i=`${r.origin}${r.pathname}?q=${encodeURIComponent(s)}`:f&&(i=`${r.origin}${r.pathname}?q=${encodeURIComponent(s)}`),await chrome.tabs.update(n.id,{url:i}))}}),chrome.runtime.onInstalled.addListener(e=>{let t=d.url;e.reason==="install"?o(t):e.reason==="update"&&o(`${t}/releases/tag/v${p}`)}),chrome.webRequest.onBeforeRequest.addListener(()=>{chrome.cookies.get({name:"_EDGE_S",url:c},e=>{let t=e?.value;if(!t)return;let r=b(t),n=r.get("mkt")?.toLowerCase()??"";v.map(i=>i.toLowerCase()).includes(n)&&(r.delete("mkt"),g({url:c,name:e.name,value:r.toString()},e))}),chrome.cookies.get({name:"_RwBf",url:c},e=>{let t=e?.value;if(!t){g({url:c,name:"_RwBf",value:"wls=2",domain:".bing.com",httpOnly:!0});return}let r=b(t);r.get("wls")!=="2"&&r.set("wls","2"),g({url:c,name:"_RwBf",domain:".bing.com",httpOnly:!0,value:r.toString()},e)})},{urls:[c+"*"],types:["main_frame"]})};var q="https://www.bing.com/",l=["csp_report","font","image","main_frame","media","object","other","ping","script","stylesheet","sub_frame","webbundle","websocket","webtransport","xmlhttprequest"],S="modifyHeaders",h="redirect",U="append",A="set",ie=[{id:1,action:{type:S,requestHeaders:[{operation:A,header:"Sec-Ch-Ua",value:'"Chromium";v="112", "Microsoft Edge";v="112", "Not:A-Brand";v="99"'},{operation:A,header:"User-Agent",value:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.34"}]},condition:{requestDomains:["bing.com","www.bing.com","cn.bing.com"],resourceTypes:l}},{id:2,action:{type:h,redirect:{regexSubstitution:"\\1setlang=zh-Hans&mkt=zh-HK\\2"}},condition:{regexFilter:"(^https:\\/\\/www\\.bing\\.com\\/(?:search|\\?|account/action).*?)(?:mkt=zh-CN|cc=cn|cc=zh-cn|cc=zh)(.*)",isUrlFilterCaseSensitive:!1,requestDomains:["www.bing.com"],resourceTypes:l}},{id:3,action:{type:h,redirect:{regexSubstitution:"\\1setlang=ru&cc=clean&mkt=en-us\\2"}},condition:{regexFilter:"(^https:\\/\\/www\\.bing\\.com\\/(?:search|\\?|account/action).*?)(?:mkt=ru-ru|mkt=ru|cc=ru)(.*)",isUrlFilterCaseSensitive:!1,requestDomains:["www.bing.com"],resourceTypes:l}},{id:4,action:{type:h,redirect:{url:`${q}?setlang=zh-Hans&mkt=zh-HK`}},condition:{regexFilter:"\\/\\?(?:new-bing-anywhere|nba|run)",isUrlFilterCaseSensitive:!1,requestDomains:["www.bing.com"],resourceTypes:l}},{id:5,priority:99,action:{type:h,redirect:{regexSubstitution:`${q}\\1`}},condition:{requestDomains:["cn.bing.com","bing.com"],regexFilter:"^http(?:s)?:\\/\\/(?:cn\\.)?bing\\.com\\/(.*)",resourceTypes:l}},{id:6,action:{type:S,responseHeaders:[{header:"Set-Cookie",operation:U,value:"SNRHOP=I=9; domain=.bing.com; path=/; secure; SameSite=None; HttpOnly;"}]},condition:{requestDomains:["bing.com","www.bing.com"]}}];var u=navigator.userAgent.trim(),L=u.includes("Macintosh"),B=u.includes("Edg"),_=u.includes("Firefox");B||(L?u+=" Edg/112.0.1722.39":u+=" Edg/112.0.1722.34");_&&(u="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.34");var M={"User-Agent":u},O="modifyHeaders",H="set",k=[{id:2001,priority:2001,action:{type:O,requestHeaders:Object.entries(M).map(([e,t])=>({operation:H,header:e,value:t}))},condition:{requestDomains:["bing.com","www.bing.com","cn.bing.com"],resourceTypes:l}}],P=()=>{chrome.declarativeNetRequest.getDynamicRules(e=>{chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds:[...new Set([...k.map(t=>t.id),...e.map(t=>t.id)])],addRules:k})})};N();chrome.runtime.onInstalled.addListener(e=>{P()});})();