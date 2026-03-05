(function () {
  function isMobile() {
    return window.matchMedia("(max-width: 920px)").matches;
  }

  function getCurrentPath() {
    var path = window.location.pathname.split("/").pop();
    return path || "index.html";
  }

  function createFallbackIcon() {
    var span = document.createElement("span");
    span.className = "nav-icon";
    span.textContent = "•";
    return span;
  }

  function syncToggleState(btn) {
    if (!btn) return;
    var expanded = document.body.classList.contains("sidebar-open") || !document.body.classList.contains("sidebar-collapsed");
    btn.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  function initSidebar() {
    var headerMenu = document.querySelector(".header-menu");
    if (!headerMenu || document.querySelector(".site-sidebar")) return;

    var body = document.body;
    var currentPath = getCurrentPath();
    body.classList.add("has-sidebar");

    if (isMobile()) {
      body.classList.add("sidebar-collapsed");
      body.classList.remove("sidebar-open");
    } else {
      body.classList.remove("sidebar-collapsed");
    }

    var toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "sidebar-toggle-btn";
    toggleBtn.setAttribute("aria-label", "Seitenleiste ein- oder ausklappen");
    toggleBtn.innerHTML = "☰";
    headerMenu.insertBefore(toggleBtn, headerMenu.firstChild);

    var sidebar = document.createElement("aside");
    sidebar.className = "site-sidebar";
    sidebar.innerHTML = [
      '<div class="site-sidebar-inner">',
      '  <div class="site-sidebar-brand">',
      '    <img class="site-sidebar-logo" src="assets/PokeMMOIndexLogo.png" alt="PokeMMOIndex Logo" />',
      '    <span class="site-sidebar-brand-text">PokeMMOIndex</span>',
      "  </div>",
      '  <div class="site-sidebar-section-title">Navigation</div>',
      '  <div class="site-sidebar-dropdown"></div>',
      '  <nav class="site-sidebar-nav" aria-label="Hauptnavigation"></nav>',
      '  <div class="site-sidebar-spacer"></div>',
      "</div>",
    ].join("");

    var overlay = document.createElement("div");
    overlay.className = "site-sidebar-overlay";
    body.appendChild(overlay);
    body.appendChild(sidebar);

    var nav = sidebar.querySelector(".site-sidebar-nav");
    var dropdownHost = sidebar.querySelector(".site-sidebar-dropdown");
    var links = Array.prototype.slice.call(headerMenu.querySelectorAll("a[href]"));

    links.forEach(function (link) {
      var item = document.createElement("a");
      item.className = "site-sidebar-link";
      item.href = link.getAttribute("href") || "#";

      if (link.target) item.target = link.target;
      if (link.rel) item.rel = link.rel;

      var iconSource = link.querySelector(".nav-icon");
      var icon = iconSource ? iconSource.cloneNode(true) : createFallbackIcon();
      var labelNode = link.querySelector("span:last-child");
      var label = labelNode ? labelNode.textContent.trim() : link.textContent.trim();

      var text = document.createElement("span");
      text.className = "site-sidebar-label";
      text.textContent = label || "Link";

      item.appendChild(icon);
      item.appendChild(text);

      var href = item.getAttribute("href");
      var linkIsActive = link.classList.contains("active") || href === currentPath;
      if (linkIsActive) item.classList.add("active");

      nav.appendChild(item);
    });

    var selectWrap = headerMenu.querySelector(".header-nav-select-wrap");
    if (selectWrap) {
      dropdownHost.appendChild(selectWrap);
    }

    function closeMobileSidebar() {
      if (!isMobile()) return;
      body.classList.remove("sidebar-open");
      body.classList.add("sidebar-collapsed");
      syncToggleState(toggleBtn);
    }

    function toggleSidebar() {
      if (isMobile()) {
        var nowOpen = !body.classList.contains("sidebar-open");
        body.classList.toggle("sidebar-open", nowOpen);
        body.classList.toggle("sidebar-collapsed", !nowOpen);
      } else {
        body.classList.toggle("sidebar-collapsed");
      }
      syncToggleState(toggleBtn);
    }

    toggleBtn.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", closeMobileSidebar);
    nav.addEventListener("click", function () {
      if (isMobile()) closeMobileSidebar();
    });

    window.addEventListener("resize", function () {
      if (isMobile()) {
        if (!body.classList.contains("sidebar-open")) {
          body.classList.add("sidebar-collapsed");
        }
      } else {
        body.classList.remove("sidebar-open");
        body.classList.remove("sidebar-collapsed");
      }
      syncToggleState(toggleBtn);
    });

    syncToggleState(toggleBtn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebar);
  } else {
    initSidebar();
  }
})();
