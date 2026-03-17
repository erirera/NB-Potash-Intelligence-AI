# 🪨 NB Potash Intelligence — Interactive Geospatial Dashboard

An interactive web-based geospatial dashboard mapping the potash mining history, active exploration, geological extents, and **live bedrock geology** of the **Windsor Group evaporite belt** in south-eastern New Brunswick, Canada.

---

## 📁 Project Files

```
binary-eclipse/
├── index.html     ← Main HTML entry point
├── styles.css     ← Glassmorphism dark-mode UI styles
├── app.js         ← Map logic, data, WMS integration & interactivity
└── README.md      ← This file
```

---

## 🗺️ Map Layers

### Mine Sites (4 deposits)
| Site | Status | Operator | Production |
|------|--------|----------|------------|
| **Penobsquis Mine** | Closed | Nutrien (fmr. PotashCorp) | 1983–2015 |
| **Cassidy Lake Mine** | Closed | Potacan Mining Company | 1985–1997 |
| **Picadilly Mine** | Care & Maintenance | Nutrien | 2014–2016 |
| **Millstream Deposit** | Exploration | Atlantic Potash | Not in production |

### Deposit Extents (Approximate Ellipses)
Dashed ellipses scaled to documented geological dimensions:
- **Penobsquis**: ~36 km² — 24 km NE-trending salt-cored anticline
- **Cassidy Lake**: ~8 km² — Clover Hill evaporite extent
- **Picadilly**: ~45 km² — 3-D seismic survey area
- **Millstream**: ~20 km² — gravimetric / evaporite extent

### Cities / Towns
Moncton · Saint John · Fredericton · Sussex · Hampton · Petitcodiac

### Potash District Boundary
An amber polygon representing the **Windsor Group evaporite belt** (~140 × 100 km). The eastern and south-eastern boundary is **clipped to the provincial outline** using **Turf.js** polygon intersection — conforming to the coastline of the Bay of Fundy and Northumberland Strait.

### NB Provincial Boundary
Fetched at runtime from a public GeoJSON source and rendered as a reference layer.

### 🆕 NB Bedrock Geology WMS
A live **Web Map Service** from the Government of New Brunswick:

| Property | Value |
|----------|-------|
| **Source** | GNB Dept. of Natural Resources & Energy Development |
| **Service** | `OpenData_NBGS_Bedrock_Geology` |
| **Layer** | `0` — "NB Bedrock Geology" |
| **Coverage** | All of New Brunswick |
| **Scale** | 1:20,000 (50+ years of continuous bedrock mapping) |
| **WMS URL** | `https://gis-erd-der.gnb.ca/server/services/OpenData/NBGS_Bedrock_Geology/MapServer/WMSServer` |
| **WFS URL** | `https://gis-erd-der.gnb.ca/server/services/OpenData/NBGS_Bedrock_Geology/MapServer/WFSServer` |

---

## ✨ Features

### Visual Design
- **Dark glassmorphism UI** — blurred glass panels over the dark CARTO basemap
- **Animated pulsing rings** on each mine site marker (CSS keyframe animation)
- **Hover scale effect** on all markers

### Interactivity — Full Reference Table
| Action | Result |
|--------|--------|
| Click a mine marker | Fly-zoom to site + open slide-in sidebar |
| Click a city marker | Fly-zoom to city + open sidebar with details |
| Click a deposit ellipse | Fly-zoom to that mine |
| Hover any marker/polygon | Tooltip with name & area info |
| Toggle checkboxes (Layers panel) | Show/hide any layer group |
| **Geology ON → click map** | `GetFeatureInfo` popup: Formation, Group, Rock Type, Age, Legend |
| **Geology opacity slider** | Blend WMS from 10%–100% transparency |
| Reset View button | Fly back to full district view |
| Hover the map | Live coordinate tracker (bottom-left, decimal degrees) |

### Slide-in Sidebar
Clicking any mine opens a rich details panel with:
- Status badge, operator, production dates, capacity, areal extent, and notes
- **Chart.js bar chart** comparing production capacity across all four deposits

---

## 🧰 Technology Stack

| Library | Version | Purpose |
|---------|---------|---------|
| [Leaflet.js](https://leafletjs.com) | 1.9.4 | Interactive map rendering & WMS tiles |
| [Turf.js](https://turfjs.org) | 6.5.0 | Polygon intersection for district boundary clipping |
| [Chart.js](https://www.chartjs.org) | Latest | Capacity comparison bar chart in sidebar |
| CARTO Dark Basemap | — | Dark tile basemap |
| GNB Bedrock Geology WMS | — | Live provincial geological map |
| Google Fonts (Inter) | — | UI typography |

---

## 🚀 How to Run

This is a **static web application** — no build step required.

1. Open `index.html` in any modern web browser (Chrome, Firefox, Edge).
2. Requires **internet access** for: map tiles, CDN scripts, NB boundary GeoJSON, and WMS tiles.

> ⚠️ If opened offline, the NB boundary, WMS geology layer, and tile basemap will not load, but mine markers and extent polygons will still render from local data.

---

## 📐 Geological Context

All potash deposits occur within the **Windsor Group** (Early Carboniferous, ~330 Ma), a sequence of marine evaporites deposited in the Maritimes Basin:
- **Halite** (rock salt) · **Potash** (sylvite, KCl) · **Sulphates** · **Carbonates**

The Penobsquis deposit lies in a **NE-trending overturned salt-cored anticline** (~24 km strike). Millstream occupies the separate **Cocagne Subbasin** to the west.

---

## 📚 Data Sources

| Source | Used For |
|--------|---------|
| [GNB Mineral Occurrences](https://gnb.ca) | Deposit locations, extents, production history |
| [GNB Bedrock Geology WMS](https://gis-erd-der.gnb.ca/server/services/OpenData/NBGS_Bedrock_Geology/MapServer/WMSServer?) | Live bedrock geology tiles + click-to-identify |
| [Atlantic Potash (APMC)](https://apmcpotash.ca) | Millstream resource estimates |
| [Mindat.org](https://mindat.org) | Coordinates, geological descriptions |
| [Click That Hood / Code for America](https://github.com/codeforamerica/click_that_hood) | Canada provinces GeoJSON |
| [OpenStreetMap](https://www.openstreetmap.org) / [CARTO](https://carto.com) | Basemap tiles |

---

## 🗂️ Layer Reference

| Layer | Toggle ID | Default | Description |
|-------|-----------|---------|-------------|
| Mine Sites | `btn-deposits` | ✅ On | Animated pulsing markers |
| Deposit Extents | `btn-extents` | ✅ On | Dashed geological ellipses |
| Cities | `btn-cities` | ✅ On | Purple town/city markers |
| Potash District | `btn-district` | ✅ On | Amber boundary clipped to NB outline |
| NB Boundary | `btn-nb` | ✅ On | Provincial outline (fetched) |
| **Bedrock Geology WMS** | `btn-geology` | ❌ Off | Live WMS tiles + click-to-identify |

---

*NB Potash Intelligence Dashboard — March 2026*
