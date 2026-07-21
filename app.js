// Flight path animation
// Data source: row 45 of the "Logbook 7.17.2026" Google Sheet (K Airports tab),
// read left-to-right in chronological order. Repeated/consecutive airport codes
// are preserved intentionally because they represent the real flight sequence
// (e.g. touch-and-goes at the same field).

// Airport coordinates as [latitude, longitude]
const airports = {
  KABQ: [35.0389, -106.6083],
  KAXX: [36.4220, -105.2900],
  KBFL: [35.4336, -119.0570],
  KCFT: [32.9569, -109.2110],
  KCNM: [32.3375, -104.2630],
  KDVT: [33.6883, -112.0830],
  KEEO: [40.0486, -107.8860],
  KELP: [31.8073, -106.3780],
  KGOO: [39.2240, -121.0030],
  KGUP: [35.5111, -108.7890],
  KHHR: [33.9228, -118.3350],
  KHND: [35.9728, -115.1340],
  KHOB: [32.6875, -103.2170],
  KICT: [37.6500, -97.4330],
  KLAS: [36.0801, -115.1520],
  KLAX: [33.9425, -118.4080],
  KLGB: [33.8177, -118.1510],
  KLRU: [32.2894, -106.9220],
  KMCE: [37.2847, -120.5140],
  KMEM: [35.0424, -89.9779],
  KMRY: [36.5870, -121.8430],
  KONM: [34.0225, -106.9030],
  KPGA: [36.9261, -111.4480],
  KPHX: [33.4342, -112.0120],
  KRNO: [39.4991, -119.7680],
  KSAD: [32.8548, -109.6350],
  KSAN: [32.7338, -117.1930],
  KSBA: [34.4262, -119.8400],
  KSJC: [37.3626, -121.9290],
  KSKX: [36.4582, -105.6720],
  KSMX: [34.8989, -120.4570],
  KSTS: [38.5090, -122.8130],
  KSVC: [32.6365, -108.1560],
  KTEB: [40.8501, -74.0608],
  KTRM: [33.6267, -116.1600],
  KTUS: [32.1161, -110.9410],
  KVNY: [34.2098, -118.4900]
};

// Chronological sequence of airport codes from row 45 (left to right)
let sequence = [];
const sequenceLoaded = fetch('sequence.txt')
  .then(function (r) { return r.text(); })
  .then(function (text) {
    sequence = text.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
  })
  .catch(function (err) {
    console.error('Failed to load sequence.txt:', err);
    sequence = [];
  });

// ---- Build flight legs from the sequence, skipping unknown airport codes ----
function buildLegs(seq) {
  const legs = [];
  let skipped = new Set();
  for (let i = 0; i < seq.length - 1; i++) {
    const from = seq[i];
    const to = seq[i + 1];
    if (!airports[from]) { console.warn('Unknown airport code, skipping leg:', from); skipped.add(from); continue; }
    if (!airports[to]) { console.warn('Unknown airport code, skipping leg:', to); skipped.add(to); continue; }
    legs.push({ from, to });
  }
  if (skipped.size) {
    console.warn('Airport codes skipped (missing coordinates):', Array.from(skipped).join(', '));
  } else {
    console.log('No airport codes were skipped. All codes in row 45 have coordinates.');
  }
  return legs;
}

let legs = [];

// ---- SVG / projection setup ----
const width = 975;
const height = 610;
const SPEED_PX_PER_MS = 0.16; // constant on-screen speed (slow, relaxing screensaver pacing)
const MIN_LEG_MS = 550;       // shortest allowed leg duration (keeps same-airport hops visible)
const MAX_LEG_MS = 5000;      // longest allowed leg duration (keeps very long legs from dragging)
let currentLegDuration = MIN_LEG_MS;

const svg = d3.select('#map')
  .attr('viewBox', '0 0 ' + width + ' ' + height);

const projection = d3.geoAlbersUsa();
const geoPath = d3.geoPath(projection);

const gMap = svg.append('g').attr('class', 'map-layer');
const gLegs = svg.append('g').attr('class', 'legs-layer');
const gAirports = svg.append('g').attr('class', 'airports-layer');
const gTrail = svg.append('g').attr('class', 'trail-layer');
const marker = svg.append('circle')
  .attr('class', 'marker')
  .attr('r', 4.5)
  .style('display', 'none');

// Comet-style tail: a single continuous stroked line sampled by distance behind
// the marker (not by frame), so it reads as one smooth fading bar, not dots.
const MARKER_DIAMETER = 9; // matches marker r * 2
const TRAIL_LENGTH_PX = MARKER_DIAMETER * 20; // ~20 marker-diameters long
const TRAIL_SAMPLES = 24; // points sampled along the bar for a smooth curve
let trailHeadDistance = 0;

const trailGradient = svg.append('defs')
  .append('linearGradient')
  .attr('id', 'trail-gradient')
  .attr('gradientUnits', 'userSpaceOnUse');
trailGradient.append('stop').attr('offset', '0%').attr('stop-color', '#ffffff').attr('stop-opacity', 0);
trailGradient.append('stop').attr('offset', '100%').attr('stop-color', '#ffffff').attr('stop-opacity', 0.9);

const trailRibbon = gTrail.append('path')
  .attr('class', 'trail-ribbon')
  .style('fill', 'none')
  .style('stroke', 'url(#trail-gradient)')
  .style('stroke-width', MARKER_DIAMETER)
  .style('stroke-linecap', 'round')
  .style('stroke-linejoin', 'round');

function drawTrail() {
  if (!currentPathEl) return;
  const headDist = trailHeadDistance;
  const tailDist = Math.max(0, headDist - TRAIL_LENGTH_PX);
  if (headDist - tailDist < 1) { trailRibbon.attr('d', null); return; }

  const pts = [];
  for (let i = 0; i <= TRAIL_SAMPLES; i++) {
    const t = i / TRAIL_SAMPLES; // 0 at tail, 1 at the marker
    const dist = tailDist + t * (headDist - tailDist);
    pts.push(currentPathEl.getPointAtLength(dist));
  }
  const d = 'M' + pts.map(function (p) { return p.x + ',' + p.y; }).join('L');
  trailRibbon.attr('d', d);

  const tailPt = pts[0];
  const headPt = pts[pts.length - 1];
  trailGradient.attr('x1', tailPt.x).attr('y1', tailPt.y).attr('x2', headPt.x).attr('y2', headPt.y);
}

function clearTrail() {
  trailHeadDistance = 0;
  trailRibbon.attr('d', null);
}

const legLabel = document.getElementById('leg-label');
const progressLabel = document.getElementById('progress-label');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const restartBtn = document.getElementById('restart-btn');

let currentLegIndex = -1;
let currentPathEl = null;
let currentLength = 0;
let legStartTime = null;
let playing = false;
let animFrame = null;

function projectLL(lat, lon) {
  return projection([lon, lat]);
}

function drawAirports() {
  const pts = Object.keys(airports).map(function (code) {
    const c = airports[code];
    const p = projectLL(c[0], c[1]);
    return { code: code, x: p ? p[0] : null, y: p ? p[1] : null };
  }).filter(function (d) { return d.x !== null; });

  gAirports.selectAll('circle')
    .data(pts)
    .enter()
    .append('circle')
    .attr('class', 'airport-dot')
    .attr('cx', function (d) { return d.x; })
    .attr('cy', function (d) { return d.y; })
    .attr('r', 1.6);
}

function legPathData(from, to) {
  const a = airports[from];
  const b = airports[to];
  const p1 = projectLL(a[0], a[1]);
  const p2 = projectLL(b[0], b[1]);
  if (!p1 || !p2) return null;
  const mx = (p1[0] + p2[0]) / 2;
  const my = (p1[1] + p2[1]) / 2 - 18;
  return 'M' + p1[0] + ',' + p1[1] + ' Q' + mx + ',' + my + ' ' + p2[0] + ',' + p2[1];
}

function updateLegLabel(leg, index) {
  legLabel.textContent = leg.from + ' \u2192 ' + leg.to;
  progressLabel.textContent = 'Leg ' + (index + 1) + ' / ' + legs.length;
}

function setupLeg(index) {
  if (index >= legs.length) {
    playing = false;
    updateButtons();
    legLabel.textContent = 'Route complete (' + legs.length + ' legs)';
    return;
  }
  currentLegIndex = index;
  const leg = legs[index];
  const d = legPathData(leg.from, leg.to);
  if (!d) { setupLeg(index + 1); return; }

  if (currentPathEl) currentPathEl.remove();
  currentPathEl = gLegs.append('path')
    .attr('class', 'leg-path-hidden')
    .attr('d', d)
    .node();
  currentLength = currentPathEl.getTotalLength();
  currentLegDuration = Math.min(MAX_LEG_MS, Math.max(MIN_LEG_MS, currentLength / SPEED_PX_PER_MS));
  legStartTime = null;
  clearTrail();

  const startPt = currentPathEl.getPointAtLength(0);
  marker.style('display', null).attr('cx', startPt.x).attr('cy', startPt.y);

  updateLegLabel(leg, index);
}

function animate(ts) {
  if (!playing || !currentPathEl) return;
  if (!legStartTime) legStartTime = ts;
  const elapsed = ts - legStartTime;
  const rawT = Math.min(elapsed / currentLegDuration, 1);
  const easedT = d3.easeCubicInOut(rawT); // smooth accel/decel, like a screensaver
  const dist = easedT * currentLength;
  const pt = currentPathEl.getPointAtLength(dist);
  marker.attr('cx', pt.x).attr('cy', pt.y);
  trailHeadDistance = dist;
  drawTrail();

  if (rawT >= 1) {
    d3.select(currentPathEl).attr('class', 'leg-path-dim');
    const nextIndex = currentLegIndex + 1;
    if (nextIndex < legs.length) {
      setupLeg(nextIndex);
    } else {
      setupLeg(0); // loop back to the start and keep flying
    }
    animFrame = requestAnimationFrame(animate);
  } else {
    animFrame = requestAnimationFrame(animate);
  }
}

function play() {
  if (!legs.length) return;
  if (currentLegIndex === -1) setupLeg(0);
  if (currentLegIndex >= legs.length) return;
  playing = true;
  updateButtons();
  animFrame = requestAnimationFrame(animate);
}

function pause() {
  playing = false;
  if (animFrame) cancelAnimationFrame(animFrame);
  updateButtons();
}

function restart() {
  pause();
  gLegs.selectAll('*').remove();
  currentPathEl = null;
  currentLegIndex = -1;
  legStartTime = null;
  marker.style('display', 'none');
  clearTrail();
  if (legs.length) {
    play();
  } else {
    legLabel.textContent = 'No valid legs to play';
  }
}

function updateButtons() {
  playBtn.disabled = playing;
  pauseBtn.disabled = !playing;
}

playBtn.addEventListener('click', play);
pauseBtn.addEventListener('click', pause);
restartBtn.addEventListener('click', restart);

// ---- Load a lightweight US TopoJSON map and draw the continental US outline ----
fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
  .then(function (r) { return r.json(); })
  .then(function (us) {
    const stateGeoms = us.objects.states.geometries.filter(function (g) {
      return g.id !== '02' && g.id !== '15'; // exclude Alaska and Hawaii for a continental US outline
    });
    const conus = topojson.merge(us, stateGeoms);

    projection.fitSize([width, height], conus);

    gMap.append('path')
      .datum(conus)
      .attr('class', 'us-outline')
      .attr('d', geoPath);

    drawAirports();
    return sequenceLoaded.then(function () {
      legs = buildLegs(sequence);
      console.log('Row 45 airport codes read:', sequence.length);
      console.log('Valid flight legs created:', legs.length);
      if (legs.length) {
        play(); // autoplay on load
      } else {
        legLabel.textContent = 'No valid legs to play';
      }
      updateButtons();
    });
  })
  .catch(function (err) {
    console.error('Failed to load map or sequence data:', err);
    legLabel.textContent = 'Map failed to load';
  });
