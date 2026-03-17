# 🪨 NB Potash Intelligence — Interactive Geospatial Dashboard

An interactive web-based geospatial dashboard mapping the potash mining history, active exploration, and geological extent of the **Windsor Group evaporite belt** in south-eastern New Brunswick, Canada.

---

## 📁 Project Files

```
binary-eclipse/
├── nb-potash-map.html   ← Main HTML entry point
├── styles.css           ← Glassmorphism dark-mode UI styles
├── app.js               ← Map logic, data, and interactivity
└── README.md            ← This file
```

---

## 🗺️ What's on the Map

### Potash Deposit Sites
| Site | Status | Operator | Production |
|------|--------|----------|------------|
| **Penobsquis Mine** | Closed | Nutrien (fmr. PotashCorp) | 1983–2015 |
| **Cassidy Lake Mine** | Closed | Potacan Mining Company | 1985–1997 |
| **Picadilly Mine** | Care & Maintenance | Nutrien | 2014–2016 |
| **Millstream Deposit** | Exploration | Atlantic Potash | Not in production |

### Deposit Extents (Approximate)
Dashed ellipses drawn to scale, oriented along geological strike:
- **Penobsquis**: ~36 km² — 24 km NE-trending salt-cored anticline
- **Cassidy Lake**: ~8 km² — Clover Hill evaporite extent
- **Picadilly**: ~45 km² — 3-D seismic survey area
- **Millstream**: ~20 km² — gravimetric/evaporite extent

### Cities
| City | Population | Role |
|------|-----------|------|
| Moncton | ~80,000 | Largest city in SE NB |
| Saint John | ~69,000 | Major port city |
| Fredericton | ~63,000 | Provincial capital |
| Sussex | ~4,300 | Nearest town to Penobsquis & Picadilly |
| Hampton | ~4,500 | Near Cassidy Lake |
| Petitcodiac | ~1,500 | Shepody River valley |

### Potash District Boundary
A custom polygon representing the **Windsor Group evaporite belt** (~175 × 117 km), from the Sussex–Apohaqui area northeast toward the Moncton corridor. The eastern and south-eastern boundary is **clipped to the provincial boundary of New Brunswick** using **Turf.js** polygon intersection — it conforms to the coastline of the Bay of Fundy and Northumberland Strait.

### New Brunswick Provincial Boundary
Fetched at runtime from a public GeoJSON source and rendered as a reference layer.

---

## ✨ Features

### Visual Design
- **Dark glassmorphism UI** — blurred glass panels over the dark CARTO basemap
- **Animated pulsing rings** on each mine site marker (CSS keyframe animation)
- **Hover grow effect** on all markers (`transform: scale(1.3)`)
- **Custom colour coding**: Red = Closed, Amber = Care & Maintenance, Green = Exploration, Purple = Cities

### Interactivity
| Action | Result |
|--------|--------|
| Click a mine marker | Fly-zoom to site + open slide-in sidebar |
| Click a city marker | Fly-zoom to city + open sidebar with details |
| Click a deposit ellipse | Fly-zoom to that mine site |
| Hover a marker | Tooltip with site name |
| Hover a polygon/boundary | Rich tooltip with area/name info |
| Toggle checkboxes (Layers panel) | Show/hide any layer group |
| Reset View button | Fly back to full district view |
| Hover the map | Live coordinate tracker (bottom-left) |

### Slide-in Sidebar
Clicking any mine site opens a details panel with:
- Status badge, operator, production dates, capacity, and areal extent
- A **Chart.js bar chart** comparing production capacity across all four deposits (selected deposit highlighted in blue)

---

## 🧰 Technology Stack

| Library | Version | Purpose |
|---------|---------|---------|
| [Leaflet.js](https://leafletjs.com) | 1.9.4 | Interactive map rendering |
| [Turf.js](https://turfjs.org) | 6.5.0 | Geospatial polygon intersection (district clip) |
| [Chart.js](https://www.chartjs.org) | Latest | Capacity comparison bar chart in sidebar |
| CARTO Dark Basemap | — | Dark tile basemap |
| Google Fonts (Inter) | — | Typography |

---

## 🚀 How to Run

This is a **static web application** with no build step required.

1. Open `nb-potash-map.html` directly in any modern web browser (Chrome, Firefox, Edge).
2. Ensure you have an **internet connection** for:
   - Map tile loading (CARTO)
   - NB boundary GeoJSON fetch (GitHub CDN)
   - Script CDNs (Leaflet, Turf, Chart.js, Google Fonts)

> ⚠️ If opened via `file:///` without internet access, the NB boundary and map tiles will not load, but the deposit markers and extent polygons will still render.

---

## 📐 Geological Context

The potash deposits all occur within the **Windsor Group** (Early Carboniferous, ~330 Ma), a sequence of marine evaporites deposited in the Maritimes Basin. The sequence includes:

- **Halite** (rock salt)
- **Potash** (primarily sylvite, KCl)
- **Sulphates** (anhydrite/gypsum)
- **Carbonates**

The Penobsquis deposit lies within a **NE-trending, overturned salt-cored anticline** traceable for ~24 km. The Millstream deposit occupies the **Cocagne Subbasin**, a separate structural depression to the west.

---

## 📚 Data Sources

| Source | Used For |
|--------|---------|
| [Government of New Brunswick (GNB)](https://gnb.ca) | Deposit locations, extents, production history |
| [Atlantic Potash (APMC)](https://apmcpotash.ca) | Millstream resource estimates |
| [Mindat.org](https://mindat.org) | Coordinates, geological descriptions |
| [Code for America / Click That Hood](https://github.com/codeforamerica/click_that_hood) | Canada provinces GeoJSON |
| [OpenStreetMap](https://www.openstreetmap.org) / [CARTO](https://carto.com) | Basemap tiles |

---

## 🗂️ Layer Reference

| Layer Key | Toggle Label | Default | Description |
|-----------|-------------|---------|-------------|
| `deposits` | Mine Sites | ✅ On | Animated markers for 4 potash sites |
| `extents` | Deposit Extents | ✅ On | Dashed geological ellipses |
| `cities` | Cities | ✅ On | Purple city/town markers |
| `district` | Potash District | ✅ On | Amber clipped district polygon |
| `nb` | NB Boundary | ✅ On | Provincial outline (fetched) |

---

*Generated as part of the NB Potash Geoscience AI Dashboard project, March 2026.*
