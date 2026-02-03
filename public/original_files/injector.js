const FLOATCARD_CLOSE_TIMESTAMP=1e4,FLOATCARD_OPEN_TIMESTAMP=2e3;let expandifyInitialized=!1;const h=new URL(window.location.href),hasExpandifyParam=h.searchParams.has("expandify"),testing=hasExpandifyParam&&("beta"===h.searchParams.get("expandify")||"alpha"===h.searchParams.get("expandify")),expandifyUserId="expandifyUserId";let expandifyAliveCount=0,expandifyAliveInterval=25e3,expandifyAliveIntervalInstance=void 0,expandifyPublicId="",expandifyPropertyType="",expandifyIsVisible=!1,expandifyApi={},expandifyTheme={background:"#FFFFFF",colorMain:"#642d8f",showFloatCard:!1},expandifyByClickCalled=!1;const vid=expandifyGenerateUUID(),createElement=e=>{var t=document.createElement("template");return t.innerHTML=e.trim(),t.content.firstChild},querySelectorAll=e=>{try{return document.querySelectorAll(e)}catch(e){return expandifyLog("Error on querySelectorAll",e),[]}},querySelector=e=>{try{return document.querySelector(e)}catch(e){return expandifyLog("Error on querySelector",e),null}};function removeWidgetPopup(){var e=document.querySelector("#widget-popup");e&&e.remove()}function redirectToWidget(){clickfyCall("click","floatcard","click"),removeWidgetPopup(),document.getElementById("expandify-widget").scrollIntoView({behavior:"smooth",block:"nearest"})}function openPopup(){clickfyCall("click","floatcard","show"),(popupWindow=document.createElement("div")).id="widget-popup",popupWindow.innerHTML=`
    <div style="background-color: ${expandifyTheme.background||"#FFFFFF"}; padding: 27px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); text-align: center; max-width: 300px; position: fixed; z-index: 999999; top:10px; right: 10px; display: flex; flex-direction: column; justify-content: center; align-items: space-between;">
      <button id="close-btn" style="position: absolute; top: 4px; right: 4px; background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
      <p style="margin-bottom: 10px;">
      <b>Descubra Tudo ao Redor!</b>
      </p>
      <p style="margin-bottom: 10px;">
      Veja Escolas, Mercados, Hospitais, Meios de Transporte e outros lugares próximos do imóvel.
      </p>
      <button onclick="redirectToWidget()" 
      style="background-color: ${expandifyTheme.colorMain||"#642d8f"}; display: flex; justify-content: center; align-items: center; gap: 10px; border: none; border-radius: 4px; padding: 10px 10px; cursor: pointer; transition: background-color 0.3s; color: ${expandifyTheme.background||"#FFFFFF"};">
        Ver Mapa
        <div class="timer" style="--duration: ${FLOATCARD_CLOSE_TIMESTAMP/1e3}; --size: 20;">
            <div class="mask"></div>
        </div>
      </button>
    </div>
    <style>
      .timer {
          background: -webkit-linear-gradient(left, ${expandifyTheme.background} 50%, ${expandifyTheme.colorMain} 50%);
          border-radius: 100%;
          height: calc(var(--size) * 1px);
          width: calc(var(--size) * 1px);
          position: relative;
          -webkit-animation: time calc(var(--duration) * 1s) steps(1000, start);
            -webkit-mask: radial-gradient(transparent 50%,#000 50%);
            mask: radial-gradient(transparent 50%,#000 50%);
      }
      .mask {
          border-radius: 100% 0 0 100% / 50% 0 0 50%;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 50%;
          -webkit-animation: mask calc(var(--duration) * 1s) steps(500, start);
          -webkit-transform-origin: 100% 50%;
      }
      @-webkit-keyframes time {
          100% {
              -webkit-transform: rotate(360deg);
          }
      }
      @-webkit-keyframes mask {
          0% {
              background: ${expandifyTheme.colorMain};
              -webkit-transform: rotate(0deg);
          }
          50% {
              background: ${expandifyTheme.colorMain};
              -webkit-transform: rotate(-180deg);
          }
          50.01% {
              background: ${expandifyTheme.background};
              -webkit-transform: rotate(0deg);
          }
          100% {
              background: ${expandifyTheme.background};
              -webkit-transform: rotate(-180deg);
          }
      }
    </style>`,document.body.appendChild(popupWindow),document.getElementById("close-btn").addEventListener("click",removeWidgetPopup);let e=FLOATCARD_CLOSE_TIMESTAMP/1e3;const t=setInterval(()=>{--e<=0&&(removeWidgetPopup(),clearInterval(t))},1e3)}const expandifyInit=()=>{expandifyLog("expandifyInit"),expandifyInitialized||expandifySetup()},expandifyByClick=()=>{var e,t,n;expandifyByClickCalled=!0,expandifyInitialized||({host:n,pathname:e,search:t}=window.location,n=getDomain(n),expandifyProperty(n,e,t,!0))};function removeWidget(){var e=document.querySelector("#expandify-widget");e&&(e.remove(),expandifyInitialized=!1)}window.expandifyByClick=expandifyByClick,window.removeWidget=removeWidget;const expandifySetup=()=>{expandifyLog(window.location);try{expandifyRun()}catch(e){expandifyLogError(e)}},getDomain=e=>e.replace("www.","").replace("www2.",""),expandifyRun=()=>{const{host:e,pathname:t,search:n}=window.location,i=getDomain(e);setTimeout(()=>{expandifyProperty(i,t,n,!1)},100)},expandifyProperty=(i,a,o,r,e=null)=>{var t={domain:i,pathname:a,testing:testing,search:o},e=(e&&(t.publicId=e),JSON.stringify(t)),t=new XMLHttpRequest;t.addEventListener("readystatechange",function(){if(this.readyState===XMLHttpRequest.DONE){var t=JSON.parse(this.responseText);if(expandifyLog("response",window.expandifyApi=t),!1===t.hasWidget&&null!=t.realEstate&&null!==t.realEstate.jsPublicId){var n=t.realEstate.jsPublicId;let e;try{expandifyLog("Executing jsPublicId"),e=new Function("return "+n)()}catch(e){expandifyLogError("Error executing jsPublicId function",e)}if(expandifyLog("jsPublicId:",e),e)return void expandifyProperty(i,a,o,r,e);expandifyLogError("Error: jsPublicId not founded")}t.hasWidget&&(t.isAllow||isBeta()||isAlpha())?(window.expandifyPublicId=t.property.publicId,window.expandifyPropertyType=t.property.type,!0!==t.realEstate.customEvent||r?expandifyAddWidget(t.realEstate.domain,t,"default"):expandifyLog("Custom event detected"),expandifyTheme.showFloatCard=!1):expandifyLog("it is not a valid property or it is not allowed to widget")}}),t.open("POST","https://widgetapi.expandify.com.br/v2/widget"),t.setRequestHeader("Content-Type","application/json"),t.send(e)},isBeta=()=>{return"beta"===new URLSearchParams(window.location.search).get("expandify")},isAlpha=()=>{return"alpha"===new URLSearchParams(window.location.search).get("expandify")},expandifyAddWidget=(e,t,a)=>{var n=t.property.publicId;if(e&&n){e=`https://${isAlpha()?"alpha":""}widget.expandify.com.br${t.widgetVersion}/${e}/${n}?cacheVersion=${t.cacheVersion}&version=`+(t.realEstate.widgetVersion||1),n=(expandifyLog("run as actions"),(window.expandifyResponse=t).realEstate.customStyle||"");const r=t.realEstate.isBefore||!1;var o="fullscreen"!==a&&t.realEstate.selector||"body";const d=t.realEstate.injectMethod||"after";t.realEstate.theme&&(expandifyTheme=t.realEstate.theme);const p=createElement('<iframe src="'+e+'" style="width: 100%; height: 80%; border: none; max-height: 700px; min-height: 500px; '+n+'" id="expandify-widget"></iframe>');n=`
      width: 90vw;
      max-width: 1600px;
      height: 90vh;
      z-index: 10000;
      background-color: ${expandifyTheme.background||"white"};
      overflow: auto;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 10px;
      border: none;
      margin: 0 auto;
      margin-top: 0px;
      box-shadow: 0px 0px 24px 0px rgba(0,0,0,0.43);
      padding: 1rem;
    `;const l=createElement('<iframe src="'+e+'&fullscreen=true" style="'+n+'" id="expandify-widget-fullscreen"></iframe>');expandifyLog("url: "+e),expandifyLog("selector: "+o);let i=!1;o.split(",").map(e=>e.trim()).forEach(e=>{var t,n=querySelectorAll(e);0<n.length&&!i&&(i=!0,n=n[0],t="fullscreen"===a?l:p,"append"===d?(expandifyLog("isAppend",e),r?(expandifyLog("isBefore",e),n.prepend(t)):(expandifyLog("isNotBefore",e),n.appendChild(t))):(expandifyLog("isNotAppend",e),r?(expandifyLog("isBefore",e),n.parentNode.insertBefore(t,n)):(expandifyLog("isNotBefore",e),n.parentNode.insertBefore(t,n.nextSibling))))}),querySelector("#expandify-widget")&&t.realEstate.customJs&&expandifyLog(new Function(t.realEstate.customJs)()),clickfySetup()}};function onMessageHandler(e){var t;"string"==typeof e.data&&"widgetHeight"===(t=e.data.split(":"))[0]&&(t=parseInt(t[1]),document.getElementById("expandify-widget").style.height=t+"px"),e.data.expandifyMessage&&expandifyPostMessage({expandifyMessage:{userId:getOrCreateId(),vid:vid,purl:getDomain(window.location.host),puri:window.location.pathname}}),"openFullScreen"===e.data&&(clickfyLogEvent("openFullScreen"),t=window.expandifyResponse,expandifyAddWidget(t.realEstate.domain,t,"fullscreen")),"closeFullScreen"===e.data&&(clickfyLogEvent("closeFullScreen"),document.getElementById("expandify-widget-fullscreen").remove())}function expandifyPostMessage(e){document.getElementById("expandify-widget").contentWindow.postMessage(e,"*");var t=document.getElementById("expandify-widget-fullscreen");t&&t.contentWindow&&t.contentWindow.postMessage(e,"*")}function expandifyLog(e,t){testing&&console.log(e,t)}function expandifyLogError(e,t){testing&&console.error(e,t)}function expandifyGenerateUUID(){return Math.random().toString(36).substr(2,11)}function getOrCreateId(){let e=localStorage.getItem(expandifyUserId);return e||(e=expandifyGenerateUUID(),localStorage.setItem(expandifyUserId,e)),e}function clickfySetup(){try{clickfySetUserId(),clickfyStartPeriodicTask(),window.addEventListener("message",onMessageHandler),(expandifyInitialized=!0)===expandifyTheme.showFloatCard&&setTimeout(openPopup,FLOATCARD_OPEN_TIMESTAMP)}catch(e){expandifyLogError(e)}}function headersToString(e){let n="";return e.forEach((e,t)=>{n+=t+`: ${e}
`}),n.trim()}function clickfyCall(e,t,n){var i=new URL(decodeURIComponent(window.location.href)),a=new Headers;localStorage.getItem(expandifyUserId)?a.append("first","false"):a.append("first","true"),a.append("cid",getOrCreateId()),a.append("vid",vid),a.append("publicId",window.expandifyPublicId),a.append("type",window.expandifyPropertyType),a.append("purl",getDomain(window.location.host)),a.append("puri",i.pathname),t&&a.append("eventname",t),n&&("string"==typeof n?a.append("value",n):a.append("value",JSON.stringify(n).replace(/"/g,""))),expandifyLog("headers:",headersToString(a)),fetch("https://clickfy.expandify.com.br/"+e,{method:"GET",headers:a}).then(e=>{if(e.ok)return e.text();throw new Error("Erro ao fazer a solicitação")}).catch(e=>{expandifyLogError("Erro:",e)})}function clickfyStartPeriodicTask(){expandifyAliveIntervalInstance=setInterval(()=>{try{clickfyAlive()}catch(e){expandifyLogError("Erro:",e)}},expandifyAliveInterval)}function clickfyLogEvent(e,t){expandifyLog("Logging event to Clickfy"),clickfyCall("click",e,t)}function clickfyViewportEvent(e){expandifyLog("Logging viewport event to Clickfy"),clickfyCall("viewport",e)}function clickfyAlive(){expandifyLog("alive:"+expandifyAliveInterval),clickfyCall("alive",(expandifyAliveInterval/1e3).toString().padStart(2,"0")),72<++expandifyAliveCount&&(clearInterval(expandifyAliveIntervalInstance),expandifyLog("stop alive",expandifyAliveCount))}function clickfySetUserId(){expandifyLog("Setting user ID in Clickfy"),clickfyCall("start")}function isElementInViewport(e){var t;return!!e&&(t=.2*(e=e.getBoundingClientRect()).height,e.top>=-t)&&0<=e.left&&e.bottom-t<=(window.innerHeight||document.documentElement.clientHeight)&&e.right<=(window.innerWidth||document.documentElement.clientWidth)}expandifyLog("Expandify is here"),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{expandifyLog("run by DOMContentLoaded"),expandifyInit()}):(expandifyLog("DOM already loaded"),expandifyInit()),window.addEventListener("scroll",function(){isElementInViewport(document.getElementById("expandify-widget"))?expandifyIsVisible||(expandifyIsVisible=!0,clickfyViewportEvent("in")):expandifyIsVisible&&(expandifyIsVisible=!1,clickfyViewportEvent("out"))}),window.addEventListener("click",function(e){var t,n=document.getElementById("expandify-widget-fullscreen"),i=document.getElementById("widget-popup");n&&(t=!n.contains(e.target),i=!i||!i.contains(e.target),t)&&i&&n.remove()}),window.addEventListener("click",function(){var e=document.getElementById("expandify-widget")||document.getElementById("expandify-widget-fullscreen");isElementInViewport(e)&&expandifyByClickCalled&&e?.contentWindow?.postMessage({type:"expandify-map-visible"},"*")});