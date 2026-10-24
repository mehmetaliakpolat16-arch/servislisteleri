document.getElementById("yil").textContent = new Date().getFullYear();

// Telefon tıklaması → dataLayer "arama_tiklama" (GTM eklendiğinde dönüşüm olarak kullanılır).
// AntiClick yüklüyse ve ziyaretçiyi temiz onaylarsa gönderilir; kodla tetiklenen,
// sayfa açılır açılmaz ya da hiç etkileşim olmadan yapılan tıklamalar sayılmaz.
(function () {
  var loadedAt = Date.now();
  var engaged = false;
  ["mousemove", "touchstart", "scroll", "keydown"].forEach(function (t) {
    window.addEventListener(t, function () { engaged = true; }, { passive: true, once: true });
  });

  function pushClean(ev, domEvent) {
    if (domEvent && (!domEvent.isTrusted || !engaged || Date.now() - loadedAt < 3000)) return;
    window.dataLayer = window.dataLayer || [];
    var ac = window.AntiClick;
    if (ac && typeof ac.isClean === "function") {
      ac.isClean().then(function (ok) { if (ok) window.dataLayer.push(ev); });
    } else {
      window.dataLayer.push(ev);
    }
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.getAttribute("data-cf-trap") === "1") return;
    if (a.getAttribute("href").toLowerCase().indexOf("tel:") === 0) pushClean({ event: "arama_tiklama" }, e);
  }, true);
})();
