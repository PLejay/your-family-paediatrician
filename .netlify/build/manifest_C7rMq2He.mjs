import '@astrojs/internal-helpers/path';
import 'kleur/colors';
import { v as NOOP_MIDDLEWARE_HEADER, w as decodeKey } from './chunks/astro/server_JdinIIij.mjs';
import 'clsx';
import 'cookie';
import 'es-module-lexer';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/pierrelejay/projects/your-family-paediatrician/","cacheDir":"file:///Users/pierrelejay/projects/your-family-paediatrician/node_modules/.astro/","outDir":"file:///Users/pierrelejay/projects/your-family-paediatrician/dist/","srcDir":"file:///Users/pierrelejay/projects/your-family-paediatrician/src/","publicDir":"file:///Users/pierrelejay/projects/your-family-paediatrician/public/","buildClientDir":"file:///Users/pierrelejay/projects/your-family-paediatrician/dist/","buildServerDir":"file:///Users/pierrelejay/projects/your-family-paediatrician/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"testimonials/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/testimonials","isIndex":false,"type":"page","pattern":"^\\/testimonials\\/?$","segments":[[{"content":"testimonials","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/testimonials.astro","pathname":"/testimonials","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/pierrelejay/projects/your-family-paediatrician/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/Users/pierrelejay/projects/your-family-paediatrician/src/pages/testimonials.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/testimonials@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/pierrelejay/projects/your-family-paediatrician/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/Users/pierrelejay/projects/your-family-paediatrician/src/pages/about.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/testimonials@_@astro":"pages/testimonials.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_C7rMq2He.mjs","/Users/pierrelejay/projects/your-family-paediatrician/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BL-xVjY6.mjs","/Users/pierrelejay/projects/your-family-paediatrician/.astro/content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","/Users/pierrelejay/projects/your-family-paediatrician/.astro/content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_B_BYlYCz.mjs","/Users/pierrelejay/projects/your-family-paediatrician/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_0_lang.Cf-elt_A.js","/Users/pierrelejay/projects/your-family-paediatrician/src/components/Nav.astro?astro&type=script&index=0&lang.ts":"_astro/Nav.astro_astro_type_script_index_0_lang.zgMnvzNw.js","/Users/pierrelejay/projects/your-family-paediatrician/src/components/Modal.astro?astro&type=script&index=0&lang.ts":"_astro/Modal.astro_astro_type_script_index_0_lang.BcQgaZTx.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/pierrelejay/projects/your-family-paediatrician/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts","addEventListener(\"load\",()=>document.documentElement.classList.add(\"loaded\"));"],["/Users/pierrelejay/projects/your-family-paediatrician/src/components/Nav.astro?astro&type=script&index=0&lang.ts","class i extends HTMLElement{constructor(){super(),this.appendChild(this.querySelector(\"template\").content.cloneNode(!0));const n=this.querySelector(\"button\"),t=document.getElementById(\"menu-content\");t.hidden=!0,t.classList.add(\"menu-content\");const d=e=>{n.setAttribute(\"aria-expanded\",e?\"true\":\"false\"),t.hidden=!e};n.addEventListener(\"click\",()=>d(t.hidden));const s=e=>{d(e.matches),n.hidden=e.matches},c=window.matchMedia(\"(min-width: 60em)\");s(c),c.addEventListener(\"change\",s)}}customElements.define(\"menu-button\",i);"],["/Users/pierrelejay/projects/your-family-paediatrician/src/components/Modal.astro?astro&type=script&index=0&lang.ts","const c=()=>{const t=document.querySelectorAll(\"dialog.modal\");document.querySelectorAll(\"[data-modal-open]\").forEach(e=>{e.addEventListener(\"click\",()=>{const n=e.getAttribute(\"data-modal-open\");if(n){const o=document.getElementById(n);o&&o instanceof HTMLDialogElement&&o.showModal()}})}),t.forEach(e=>{const n=e.querySelector(\".modal-close\");n&&n.addEventListener(\"click\",()=>{e instanceof HTMLDialogElement&&l(e)}),e.addEventListener(\"click\",o=>{const i=e.getBoundingClientRect();(o.clientX<i.left||o.clientX>i.right||o.clientY<i.top||o.clientY>i.bottom)&&e instanceof HTMLDialogElement&&l(e)})})},d=t=>{const e=document.getElementById(t);e&&e instanceof HTMLDialogElement&&e.showModal()},l=t=>{t.classList.add(\"closing\"),setTimeout(()=>{t.classList.remove(\"closing\"),t.close()},300)};typeof window<\"u\"&&(window.openModal=d,window.closeModal=t=>{const e=document.getElementById(t);e&&e instanceof HTMLDialogElement&&l(e)});document.addEventListener(\"DOMContentLoaded\",c);document.addEventListener(\"astro:page-load\",c);"]],"assets":["/_astro/new-logo-dark-cropped.DZGks16O.svg","/_astro/about.oHZAbBPH.css","/favicon.svg","/robots.txt","/assets/infant-basic-life-support-check-breathing.jpg","/assets/new-logo-dark-cropped.svg","/assets/new-logo-light.svg","/assets/photo-speaking-with-microphone.jpg","/assets/portrait-bricks-cropped.jpg","/assets/portrait-bricks-red.jpg","/assets/portrait-red-shirt-bookcase-cropped.jpg","/assets/portrait-red-shirt-bookcase.jpg","/404.html","/about/index.html","/testimonials/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"GriUuzEmSC7hjK5UYBH6O2pK+DR85vGSzNyKlO/O0bM="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
