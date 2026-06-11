# Quai Antique — Front-end statique (SPA)

Projet — application une page avec routeur JavaScript.

## Structure du projet

```
Quai-Antique/
├── index.html          # Coque SPA (header, main, footer)
├── menu.json           # Données des plats
├── pages/
│   ├── accueil.html    # Fragment page d'accueil
│   ├── carte.html      # Fragment la carte
│   └── contact.html    # Fragment contact
├── css/
│   └── styles.css
├── js/
│   ├── router.js       # Routeur hash (#/, #/carte, #/contact)
│   └── menu.js         # Chargement dynamique du menu (fetch)
└── images/
```

## Routes

| URL hash | Page |
|----------|------|
| `#/` ou sans hash | Accueil |
| `#/carte` | La Carte |
| `#/contact` | Contact |

## Charte graphique

| Élément | Couleur |
|---------|---------|
| Principal | Bordeaux `#6B3A3A` |
| Fond | Crème `#FAF7F2` |
| Accent | Or `#B8956B` |
| Texte | Brun foncé `#2D2419` |

Police : **Inter** — Framework : **Bootstrap 5.3** (navbar + offcanvas)

## Lancer le projet en local

```bash
cd /Users/nosheenemohammad/Studi/Quai-Antique
python3 -m http.server 8080
```

→ http://127.0.0.1:8080/index.html

## Maquette Figma

[Quai Antique - Maquettes](https://www.figma.com/design/A818Jrbkk2GHbJWGdtbk1k)
