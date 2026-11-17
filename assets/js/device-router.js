/* R190 — device routing for the static Jekyll site.
   Phone => /m/... ; tablet and desktop => existing desktop pages.
   Override with ?mobile=1 or ?desktop=1 (stored for the session). */
(function () {
  "use strict";

  var SITE_ROOT = "/";
  var MOBILE_ROOT = "/m/";
  var KEY = "sanda_view";

  var D2M = {
    "index.html": "index.html",
    "index-es.html": "es.html",
    "index-fr.html": "fr.html",
    "index-ru.html": "ru.html",
    "index-ja.html": "ja.html",
    "index-malay.html": "ms.html",
    "index-arabic.html": "ar.html",
    "privacy-policy.html": "privacy.html",
    "terms-of-service.html": "terms.html",
    "backpack-oem.html": "backpack-oem.html",
    "duffel-tote-sling-bags.html": "duffel-tote-sling.html",
    "backpack-oem-es.html": "backpack-oem-es.html",
    "duffel-tote-sling-bags-es.html": "duffel-tote-sling-es.html",
    "backpack-oem-fr.html": "backpack-oem-fr.html",
    "duffel-tote-sling-bags-fr.html": "duffel-tote-sling-fr.html",
    "backpack-oem-ru.html": "backpack-oem-ru.html",
    "duffel-tote-sling-bags-ru.html": "duffel-tote-sling-ru.html",
    "backpack-oem-ja.html": "backpack-oem-ja.html",
    "duffel-tote-sling-bags-ja.html": "duffel-tote-sling-ja.html",
    "backpack-oem-ms.html": "backpack-oem-ms.html",
    "duffel-tote-sling-bags-ms.html": "duffel-tote-sling-ms.html",
    "backpack-oem-ar.html": "backpack-oem-ar.html",
    "duffel-tote-sling-bags-ar.html": "duffel-tote-sling-ar.html"
  };
  var M2D = {};
  Object.keys(D2M).forEach(function (k) { M2D[D2M[k]] = k; });

  var params = new URLSearchParams(location.search);
  var forced = "";
  if (params.get("mobile") === "1") forced = "mobile";
  if (params.get("desktop") === "1") forced = "desktop";
  if (forced) {
    try { sessionStorage.setItem(KEY, forced); } catch (e) {}
  }

  var remembered = "";
  try { remembered = sessionStorage.getItem(KEY) || ""; } catch (e) {}

  var ua = navigator.userAgent || "";
  if (/bot|crawler|spider|slurp/i.test(ua)) return;

  var uaData = navigator.userAgentData || {};
  var tabletUA = /iPad|Tablet|Nexus (7|10)|SM-T|PlayBook|Silk/i.test(ua);
  var phoneUA = /iPhone|iPod|Windows Phone|IEMobile|BlackBerry|Opera Mini/i.test(ua) ||
    (/Android.*Mobile/i.test(ua) && !tabletUA);
  var mobileToken = uaData.mobile === true || phoneUA;
  var coarse = window.matchMedia && matchMedia("(pointer: coarse)").matches;
  var narrow = window.matchMedia && matchMedia("(max-width: 767px)").matches;
  var landscapePhone = phoneUA && coarse && window.matchMedia &&
    matchMedia("(max-width: 932px)").matches;
  var detected = (!tabletUA && (mobileToken || coarse)) &&
    (narrow || landscapePhone || (mobileToken && !tabletUA)) ? "mobile" : "desktop";

  var wanted = forced || remembered || detected;
  window.SANDA_DEVICE = wanted;

  var path = location.pathname || "/";
  var onMobile = /(^|\/)m\//.test(path);
  var file = path.split("/").pop() || "index.html";
  if (!file || file.indexOf(".") === -1) file = "index.html";

  var targetFile = onMobile ? M2D[file] : D2M[file];
  if (!targetFile) return;

  var expected = onMobile ? "mobile" : "desktop";
  if (wanted === expected) return;

  params.delete("mobile");
  params.delete("desktop");
  var suffix = params.toString() ? "?" + params.toString() : "";
  var target = onMobile
    ? new URL(SITE_ROOT + targetFile + suffix + location.hash, location.origin)
    : new URL(MOBILE_ROOT + targetFile + suffix + location.hash, location.origin);

  if (target.pathname !== location.pathname) location.replace(target.href);
})();
