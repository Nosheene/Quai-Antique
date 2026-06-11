window.__SPA_ROUTER__ = true;

const routes = {
  "/": {
    page: "pages/accueil.html",
    title: "Quai Antique — Accueil",
    description: "Quai Antique — Restaurant gastronomique au bord de l'eau. Cuisine raffinée et produits de saison.",
    footer: `
      <p><strong>Quai Antique</strong> — 12 Quai des Antiques, 75000 Paris</p>
      <p class="muted">Ouvert du mardi au dimanche · 12h–14h30 · 19h–22h30</p>
    `,
  },
  "/carte": {
    page: "pages/carte.html",
    title: "Quai Antique — La Carte",
    description: "Découvrez la carte du restaurant Quai Antique : entrées, plats et desserts de saison.",
    footer: `
      <p class="muted">Allergènes : demandez à votre serveur</p>
      <p><strong>Quai Antique</strong> — 12 Quai des Antiques, 75000 Paris</p>
    `,
    onLoad: () => window.initMenu?.(),
  },
  "/contact": {
    page: "pages/contact.html",
    title: "Quai Antique — Contact",
    description: "Contactez le restaurant Quai Antique pour réserver une table ou poser vos questions.",
    footer: `<p><strong>Quai Antique</strong> © 2026</p>`,
  },
};

let routeLoadId = 0;
let routeController = null;

function getPath() {
  const hash = window.location.hash.slice(1) || "/";
  const path = hash.startsWith("/") ? hash : `/${hash}`;
  return routes[path] ? path : "/";
}

function updateMeta(description) {
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", description);
}

function updateNavActive(path) {
  document.querySelectorAll("[data-route]").forEach((link) => {
    const route = link.getAttribute("data-route");
    const isActive = route === path;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function closeOffcanvas() {
  const panel = document.getElementById("menuLateral");
  if (!panel || !window.bootstrap) return;
  const instance = window.bootstrap.Offcanvas.getInstance(panel);
  if (instance) instance.hide();
}

function showFileProtocolWarning() {
  const main = document.getElementById("contenu");
  if (!main || window.location.protocol !== "file:") return false;
  main.innerHTML = `
    <p class="menu-error">
      Ce site ne fonctionne pas en ouvrant le fichier directement.<br>
      Lancez dans le terminal : <code>python3 -m http.server 8080</code><br>
      Puis ouvrez <strong>http://127.0.0.1:8080/index.html</strong>
    </p>`;
  return true;
}

async function loadRoute() {
  if (showFileProtocolWarning()) return;

  const loadId = ++routeLoadId;
  const path = getPath();
  const route = routes[path];
  const main = document.getElementById("contenu");
  const footer = document.getElementById("footer-content");

  if (!main || !route) return;

  if (routeController) routeController.abort();
  routeController = new AbortController();
  const { signal } = routeController;

  try {
    main.innerHTML = '<p class="menu-status">Chargement de la page…</p>';
    const response = await fetch(route.page, { signal });
    if (loadId !== routeLoadId) return;
    if (!response.ok) throw new Error("HTTP " + response.status);

    main.innerHTML = await response.text();
    if (loadId !== routeLoadId) return;

    document.title = route.title;
    updateMeta(route.description);
    if (footer) footer.innerHTML = route.footer;
    updateNavActive(path);
    if (typeof route.onLoad === "function") route.onLoad();
    main.focus({ preventScroll: true });
  } catch (err) {
    if (err.name === "AbortError" || loadId !== routeLoadId) return;
    main.innerHTML =
      '<p class="menu-error">Impossible de charger la page. Lancez un serveur local : <code>python3 -m http.server 8080</code></p>';
  }
}

function handleNavClick(event) {
  const link = event.target.closest("a[data-route]");
  if (!link) return;
  event.preventDefault();
  const path = link.getAttribute("data-route");
  closeOffcanvas();
  if (path && path !== getPath()) {
    window.location.hash = path;
  } else if (path === getPath()) {
    loadRoute();
  }
}

document.addEventListener("click", handleNavClick);
window.addEventListener("hashchange", loadRoute);
window.addEventListener("DOMContentLoaded", loadRoute);
