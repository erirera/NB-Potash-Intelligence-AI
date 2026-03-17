// --- DATA ---
const SITES = [
  {
    name: "Penobsquis Mine", lat: 45.7431, lng: -65.4500, status: "Closed", badge: "badge-closed", color: "#f85149",
    operator: "PotashCorp (now Nutrien)", discovery: "1971", production: "1983 - 2015", capacity: 1.0, capacityStr: "~1 Mt KCl/yr (peak)",
    extent: "~36 km\u00b2 (24 km NE anticline)", notes: "Once considered 2nd largest potash deposit in the world."
  },
  {
    name: "Cassidy Lake Mine", lat: 45.5647, lng: -65.5717, status: "Closed", badge: "badge-closed", color: "#f85149",
    operator: "Potacan Mining Company", discovery: "~1975", production: "1985 - 1997", capacity: 1.0, capacityStr: "~1 Mt KCl/yr",
    extent: "~8 km\u00b2 (Clover Hill evaporite)", notes: "Closed due to water inflow. Now used for brine disposal."
  },
  {
    name: "Picadilly Mine", lat: 45.7558, lng: -65.4017, status: "Care & Maintenance", badge: "badge-caremaint", color: "#d29922",
    operator: "Nutrien", discovery: "-", production: "2014 - 2016", capacity: 2.0, capacityStr: "~2 Mt KCl/yr (design)",
    extent: "~45 km\u00b2 (3-D seismic survey area)", notes: "Placed on care and maintenance due to weak fertilizer market."
  },
  {
    name: "Millstream Deposit", lat: 45.7028, lng: -65.6311, status: "Exploration", badge: "badge-exploration", color: "#3fb950",
    operator: "Atlantic Potash", discovery: "-", production: "Not in production", capacity: 1.5, capacityStr: "52.1 Mt measured resource",
    extent: "~20 km\u00b2 (gravimetric area)", notes: "Best untapped potash deposit in region. EA ongoing."
  }
];

const CITIES = [
  { name: "Moncton", lat: 46.0878, lng: -64.7782, pop: "80,000", region: "Greater Moncton", role: "Largest city in SE NB" },
  { name: "Saint John", lat: 45.2733, lng: -66.0633, pop: "69,000", region: "Bay of Fundy", role: "Major port city" },
  { name: "Fredericton", lat: 45.9636, lng: -66.6431, pop: "63,000", region: "St. John River", role: "Provincial capital" },
  { name: "Sussex", lat: 45.7278, lng: -65.5198, pop: "4,300", region: "Kings County", role: "Nearest town to Penobsquis/Picadilly" },
  { name: "Hampton", lat: 45.5248, lng: -65.8463, pop: "4,500", region: "Kings County", role: "Near Cassidy Lake" },
  { name: "Petitcodiac", lat: 45.9378, lng: -65.1801, pop: "1,500", region: "Westmorland", role: "Shepody River valley" }
];

const EXTENTS = [
  { name: "Penobsquis Mine", color: "#f85149", cx: 45.7431, cy: -65.4500, aMaj: 12.0, aMin: 0.9, rot: 45, lbl: "~36 km\u00b2 \u2022 NE salt anticline" },
  { name: "Cassidy Lake Mine", color: "#f85149", cx: 45.5647, cy: -65.5717, aMaj: 2.0, aMin: 1.3, rot: 30, lbl: "~8 km\u00b2 \u2022 Clover Hill evaporite" },
  { name: "Picadilly Mine", color: "#d29922", cx: 45.7558, cy: -65.4017, aMaj: 4.5, aMin: 3.2, rot: 55, lbl: "~45 km\u00b2 \u2022 Seismic survey area" },
  { name: "Millstream Deposit", color: "#3fb950", cx: 45.7028, cy: -65.6311, aMaj: 3.6, aMin: 1.8, rot: 40, lbl: "~20 km\u00b2 \u2022 Evaporite extent" }
];

const RECT_BOUNDS = [[45.15, -66.30], [46.20, -64.30]];
const INITIAL_BOUNDS = L.latLngBounds(RECT_BOUNDS).pad(0.05);

// --- INIT MAP ---
const map = L.map('map', { zoomControl: false }).fitBounds(INITIAL_BOUNDS);
L.control.zoom({ position: 'bottomright' }).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap, © CARTO', subdomains: 'abcd', maxZoom: 19
}).addTo(map);

// Coordinate Tracker
map.on('mousemove', e => {
  document.getElementById('coord-display').textContent = `${e.latlng.lat.toFixed(4)}\u00b0N, ${Math.abs(e.latlng.lng).toFixed(4)}\u00b0W`;
});

// Layer Groups
const layers = {
  nb: L.layerGroup().addTo(map),
  district: L.layerGroup().addTo(map),
  extents: L.layerGroup().addTo(map),
  cities: L.layerGroup().addTo(map),
  deposits: L.layerGroup().addTo(map)
};

// --- RENDER DATA ---

// 1. Potash District Rect (Placeholder & Label)
// We will draw the actual intersected polygon after the NB GeoJSON is loaded.
L.marker([45.16, -66.28], {
  icon: L.divIcon({ className: '', html: '<div style="color:#e8b84b;font-size:10px;font-weight:700;letter-spacing:1px;white-space:nowrap;">POTASH DISTRICT</div>' })
}).addTo(layers.district);

// 2. Extent Polygons (Ellipses)
function getEllipse(cx, cy, aMajKm, aMinKm, rotDeg, pts=50) {
  const rot = rotDeg * Math.PI / 180, dLat = aMajKm / 111.32, dLng = aMinKm / (111.32 * Math.cos(cx * Math.PI/180)), arr = [];
  for(let i=0; i<=pts; i++) {
    const t = 2 * Math.PI * i / pts, ex = dLng * Math.cos(t), ey = dLat * Math.sin(t);
    arr.push([cx + ey*Math.cos(rot) - ex*Math.sin(rot), cy + ex*Math.cos(rot) + ey*Math.sin(rot)]);
  }
  return arr;
}
EXTENTS.forEach(ext => {
  const poly = L.polygon(getEllipse(ext.cx, ext.cy, ext.aMaj, ext.aMin, ext.rot), {
    color: ext.color, weight: 1.5, opacity: 0.9, fillColor: ext.color, fillOpacity: 0.15, dashArray: '4 4'
  }).addTo(layers.extents);
  poly.bindTooltip(`<b>${ext.name}</b><br><span style="color:#8b949e">${ext.lbl}</span>`, { className: 'premium-tip', sticky: true });
  poly.on('click', () => showSidebar(SITES.find(s => s.name === ext.name), 'mine'));
});

// 3. City Markers
CITIES.forEach(c => {
  const isCap = (c.name === 'Fredericton');
  const m = L.marker([c.lat, c.lng], {
    icon: L.divIcon({
      className: 'animated-marker', iconSize: [12,12], iconAnchor: [6,6],
      html: `<div style="width:100%;height:100%;border-radius:50%;background:var(--city);"></div>`
    })
  }).addTo(layers.cities);
  m.bindTooltip(c.name, { className: 'premium-tip', direction: 'top', offset: [0,-10] });
  m.on('click', () => showSidebar(c, 'city'));
  
  // Label
  L.marker([c.lat, c.lng], {
    icon: L.divIcon({ className: '', html: `<div style="color:var(--city);font-size:11px;font-weight:600;margin-left:10px;margin-top:-6px;text-shadow:0 1px 3px #000;">${c.name}</div>`})
  }).addTo(layers.cities);
});

// 4. Mine Markers
SITES.forEach(s => {
  const m = L.marker([s.lat, s.lng], {
    icon: L.divIcon({
      className: 'animated-marker', iconSize: [18,18], iconAnchor: [9,9],
      html: `<div style="width:100%;height:100%;border-radius:50%;background:${s.color};"><div class="pulse-ring"></div></div>`
    })
  }).addTo(layers.deposits);
  m.bindTooltip(`<b>${s.name}</b>`, { className: 'premium-tip', direction: 'top', offset: [0,-12] });
  m.on('click', () => showSidebar(s, 'mine'));
  
  L.marker([s.lat, s.lng], {
    icon: L.divIcon({ className: '', html: `<div style="color:#e6edf3;font-size:12px;font-weight:700;margin-left:14px;margin-top:-8px;text-shadow:0 1px 4px #000;">${s.name}</div>`})
  }).addTo(layers.deposits);
});

// 5. Fetch NB Boundary & Intersect Potash District Polygon
fetch('https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson')
  .then(r => r.json())
  .then(d => {
    const nb = d.features.find(f => (f.properties.name||'').toLowerCase().includes('brunswick'));
    if(nb) {
      // Draw NB Boundary
      L.geoJSON(nb, { style: { color: '#7eb8d4', weight: 2, fillOpacity: 0.03 } }).addTo(layers.nb);
      document.getElementById('nb-loading').remove();

      // Intersect District Box with NB Boundary using Turf.js
      // RECT_BOUNDS = [[45.15, -66.30], [46.20, -64.30]] -> [minX, minY, maxX, maxY]
      const minLng = -66.30, minLat = 45.15, maxLng = -64.30, maxLat = 46.20;
      const box = turf.bboxPolygon([minLng, minLat, maxLng, maxLat]);
      let districtPoly = box;

      try {
        const intersection = turf.intersect(turf.featureCollection([nb, box]));
        if (intersection) {
          districtPoly = intersection;
        }
      } catch (err) {
        console.warn("Turf intersection failed, falling back to rectangle.", err);
      }

      // Draw intersected district polygon
      const rectLayer = L.geoJSON(districtPoly, {
        style: { color: '#e8b84b', weight: 2, opacity: 0.8, fillColor: '#e8b84b', fillOpacity: 0.04, dashArray: '8 6' }
      }).addTo(layers.district);
      rectLayer.bindTooltip('<b>Potash District</b><br><span style="color:#8b949e">~175x117km clipped to NB boundary</span>', { className: 'premium-tip', sticky: true });
    }
  }).catch((e) => {
    console.warn("Error fetching Canada GeoJSON:", e);
    document.getElementById('nb-loading').innerHTML = '⚠ Boundary load failed';
    
    // Draw raw rectangle fallback if fetch fails so we still have a district boundary
    const fallback = L.rectangle(RECT_BOUNDS, {
      color: '#e8b84b', weight: 2, opacity: 0.8, fillColor: '#e8b84b', fillOpacity: 0.04, dashArray: '8 6'
    }).addTo(layers.district);
    fallback.bindTooltip('<b>Potash District</b><br><span style="color:#8b949e">~175x117km fallback boundary</span>', { className: 'premium-tip', sticky: true });
  });


// --- UI INTERACTIONS ---

// Toggles
['deposits', 'extents', 'cities', 'district', 'nb'].forEach(key => {
  const chk = document.getElementById(`btn-${key}`);
  chk.addEventListener('change', e => {
    if (e.target.checked) {
      map.addLayer(layers[key]);
      if (key === 'nb' || key === 'district') {
         // Bring to back so they stay under markers + extents
         layers[key].eachLayer(l => {
           if (l.bringToBack) l.bringToBack();
         });
      }
    } else {
      map.removeLayer(layers[key]);
    }
  });
});

// Reset
document.getElementById('btn-reset').addEventListener('click', () => {
  map.flyToBounds(INITIAL_BOUNDS, { duration: 1 });
  closeSidebar();
});

// Sidebar Logic
const sidebar = document.getElementById('sidebar');
const sbContent = document.getElementById('sb-content');
const sbTitle = document.getElementById('sb-title');
const chartWrap = document.getElementById('chart-wrapper');
let myChart = null;

document.getElementById('close-sidebar').addEventListener('click', closeSidebar);

function closeSidebar() {
  sidebar.classList.remove('active');
  if(myChart) { myChart.destroy(); myChart = null; }
}

function showSidebar(data, type) {
  map.flyTo([data.lat, data.lng], 12, { duration: 0.8 });
  sidebar.classList.add('active');
  sbTitle.textContent = data.name;
  
  let html = '';
  if (type === 'mine') {
    html = `
      <div class="detail-badge ${data.badge}">${data.status}</div>
      <div style="margin-top:20px;">
        <div class="detail-group"><div class="detail-label">Operator</div><div class="detail-value">${data.operator}</div></div>
        <div class="detail-group"><div class="detail-label">Production</div><div class="detail-value">${data.production}</div></div>
        <div class="detail-group"><div class="detail-label">Capacity</div><div class="detail-value">${data.capacityStr}</div></div>
        <div class="detail-group"><div class="detail-label">Areal Extent</div><div class="detail-value">${data.extent}</div></div>
        <div class="detail-group"><div class="detail-label">Notes</div><div class="detail-value" style="font-size:0.8rem;color:#8b949e;">${data.notes}</div></div>
      </div>
    `;
    chartWrap.style.display = 'block';
    renderChart(data);
  } else {
    html = `
      <div class="detail-badge badge-city">Town / City</div>
      <div style="margin-top:20px;">
        <div class="detail-group"><div class="detail-label">Region</div><div class="detail-value">${data.region}</div></div>
        <div class="detail-group"><div class="detail-label">Population</div><div class="detail-value">${data.pop}</div></div>
        <div class="detail-group"><div class="detail-label">Role</div><div class="detail-value">${data.role}</div></div>
      </div>
    `;
    chartWrap.style.display = 'none';
    if(myChart) { myChart.destroy(); }
  }
  sbContent.innerHTML = html;
}

// Chart.js Setup
function renderChart(mineData) {
  if(myChart) myChart.destroy();
  const ctx = document.getElementById('capacityChart').getContext('2d');
  
  // Create dummy comparative data
  const labels = ['Millstream (Est.)', 'Picadilly', 'Penobsquis', 'Cassidy Lake'];
  const data = [1.5, 2.0, 1.0, 1.0]; 
  const bgColors = labels.map(l => l.includes(mineData.name.split(' ')[0]) ? '#58a6ff' : 'rgba(88, 166, 255, 0.2)');

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Capacity (Mt KCl/yr)',
        data: data,
        backgroundColor: bgColors,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Comparative Capacity', color: '#8b949e', font: {family: 'Inter'} }
      },
      scales: {
        y: { ticks: { color: '#8b949e', font: {size: 10} }, grid: { color: '#30363d' } },
        x: { ticks: { color: '#8b949e', font: {size: 10} }, grid: { display: false } }
      }
    }
  });
}
