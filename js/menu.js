let allPlats = [];
let activeCategory = "entrees";
let menuLoadPromise = null;
let menuInitId = 0;

function getMenuUrl() {
  const base = window.location.href.split("#")[0];
  return new URL("menu.json", base).href;
}

function renderPlats(plats, menuList) {
  menuList.innerHTML = "";
  if (plats.length === 0) {
    menuList.innerHTML = '<p class="menu-status">Aucun plat dans cette catégorie.</p>';
    return;
  }
  plats.forEach((plat) => {
    const article = document.createElement("article");
    article.className = "menu-item";
    article.innerHTML = `
      <div>
        <h3>${plat.nom}</h3>
        <p>${plat.description}</p>
      </div>
      <span class="price">${plat.prix}</span>
    `;
    menuList.appendChild(article);
  });
}

function filterCategory(category, tabs, menuList) {
  activeCategory = category;
  tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.category === category);
    tab.setAttribute("aria-selected", tab.dataset.category === category ? "true" : "false");
  });
  renderPlats(allPlats.filter((p) => p.categorie === category), menuList);
}

function preloadMenu() {
  if (allPlats.length > 0) {
    return Promise.resolve(allPlats);
  }
  if (menuLoadPromise) {
    return menuLoadPromise;
  }
  if (window.location.protocol === "file:") {
    return Promise.reject(new Error("file-protocol"));
  }

  menuLoadPromise = fetch(getMenuUrl())
    .then((response) => {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then((data) => {
      allPlats = data;
      return data;
    })
    .catch((err) => {
      menuLoadPromise = null;
      throw err;
    });

  return menuLoadPromise;
}

function bindTabs(tabsRoot, menuList) {
  if (tabsRoot.dataset.menuBound === "true") return;
  tabsRoot.dataset.menuBound = "true";
  tabsRoot.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (!tab || !tabsRoot.contains(tab)) return;
    filterCategory(tab.dataset.category, tabsRoot.querySelectorAll(".tab"), menuList);
  });
}

window.initMenu = function initMenu() {
  const initId = ++menuInitId;
  const menuList = document.getElementById("menu-list");
  const menuStatus = document.getElementById("menu-status");
  const tabsRoot = document.querySelector("#contenu .tabs");

  if (!menuList || !menuStatus || !tabsRoot) return;

  bindTabs(tabsRoot, menuList);

  menuStatus.hidden = false;
  menuStatus.className = "menu-status";
  menuStatus.textContent = "Chargement du menu…";

  function renderMenu() {
    if (initId !== menuInitId) return;
    const list = document.getElementById("menu-list");
    const tabs = document.querySelector("#contenu .tabs");
    const status = document.getElementById("menu-status");
    if (!list || !tabs) return;
    if (status) status.remove();
    filterCategory(activeCategory, tabs.querySelectorAll(".tab"), list);
  }

  function showError() {
    if (initId !== menuInitId) return;
    if (!document.body.contains(menuStatus)) return;
    menuStatus.hidden = false;
    menuStatus.className = "menu-error";
    menuStatus.textContent =
      window.location.protocol === "file:"
        ? "Ouvrez le site via un serveur : python3 -m http.server 8080 puis http://127.0.0.1:8080/index.html"
        : "Impossible de charger le menu. Lancez : python3 -m http.server 8080";
    menuList.innerHTML = "";
  }

  preloadMenu().then(renderMenu).catch(showError);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", preloadMenu);
} else {
  preloadMenu();
}
