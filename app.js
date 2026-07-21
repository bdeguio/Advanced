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
const sequence = ["KICT","KICT","KICT","KICT","KICT","KICT","KICT","KICT","KICT","KICT","KICT","KICT","KICT","KICT","KICT","KICT","KPHX","KTUS","KTEB","KTEB","KHHR","KSTS","KSTS","KLAX","KVNY","KHHR","KPHX","KGUP","KGUP","KPHX","KPHX","KCNM","KCNM","KABQ","KABQ","KCNM","KCNM","KPHX","KHHR","KTRM","KTRM","KRNO","KRNO","KTRM","KTRM","KHHR","KHHR","KMCE","KMCE","KLAS","KLAS","KMCE","KMCE","KLGB","KPHX","KGUP","KGUP","KPHX","KPHX","KCNM","KCNM","KCNM","KCNM","KABQ","KABQ","KLRU","KLRU","KABQ","KABQ","KSVC","KSVC","KABQ","KABQ","KSVC","KSVC","KPHX","KHHR","KMRY","KMRY","KHHR","KPHX","KHHR","KPHX","KPHX","KPHX","KGUP","KPHX","KPHX","KABQ","KABQ","KPHX","KPHX","KPHX","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KGUP","KPHX","KPHX","KCNM","KABQ","KLRU","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KPHX","KPHX","KPGA","KHHR","KLAX","KSBA","KSAN","KSBA","KLAX","KHHR","KPHX","KPHX","KHHR","KSMX","KSJC","KPHX","KSVC","KSVC","KPHX","KPHX","KSVC","KABQ","KSVC","KSVC","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KCNM","KCNM","KABQ","KAXX","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KCNM","KABQ","KCNM","KCNM","KABQ","KLRU","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KCFT","KSAD","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KCNM","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KLRU","KABQ","KSVC","KSVC","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KGUP","KLAS","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KHHR","KHHR","KHHR","KHHR","KHHR","KPHX","KPHX","KGUP","KPHX","KPHX","KABQ","KAXX","KABQ","KSVC","KSVC","KABQ","KSVC","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KLGB","KHHR","KHHR","KPHX","KPHX","KSVC","KSVC","KSVC","KPHX","KPHX","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KSVC","KABQ","KAXX","KABQ","KSVC","KSVC","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KCNM","KABQ","KCNM","KPHX","KGUP","KPHX","KCNM","KABQ","KCNM","KPHX","KPHX","KCFT","KPHX","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KSVC","KCNM","KCNM","KCNM","KABQ","KCNM","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KAXX","KABQ","KSVC","KSVC","KSVC","KABQ","KSVC","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KDVT","KPHX","KPHX","KSVC","KABQ","KSKX","KABQ","KSVC","KSVC","KABQ","KSVC","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KCNM","KABQ","KLRU","KABQ","KCNM","KCNM","KCNM","KABQ","KSKX","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KLRU","KABQ","KSVC","KSVC","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KSVC","KSVC","KABQ","KSVC","KPHX","KSTS","KGOO","KGOO","KVNY","KHHR","KPHX","KSVC","KABQ","KSVC","KSVC","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KABQ","KLRU","KSVC","KPHX","KGUP","KPHX","KPHX","KGUP","KLAS","KGUP","KPHX","KPHX","KHHR","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KCNM","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KSVC","KSVC","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KCNM","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KCNM","KCNM","KABQ","KPHX","KPHX","KGUP","KPHX","KPHX","KCNM","KABQ","KLRU","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KSVC","KSVC","KABQ","KSVC","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KLAS","KGUP","KPHX","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KGUP","KPHX","KPHX","KCNM","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KCNM","KABQ","KLRU","KABQ","KCNM","KCNM","KABQ","KAXX","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KCNM","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KSVC","KABQ","KAXX","KABQ","KSVC","KSVC","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KCNM","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KCNM","KCNM","KABQ","KAXX","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KCNM","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KSVC","KABQ","KAXX","KABQ","KSVC","KSVC","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KCNM","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KCNM","KABQ","KPHX","KSVC","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KCNM","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KSVC","KABQ","KHHR","KMCE","KLAS","KMCE","KHHR","KMEM","KMEM","KMEM","KMEM","KMEM","KMEM","KMEM","KMEM","KMEM","KMEM","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KSVC","KSVC","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KCNM","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KLAS","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KCFT","KPHX","KPHX","KTUS","KPHX","KSVC","KABQ","KSVC","KSVC","KABQ","KSVC","KPHX","KHHR","KBFL","KPHX","KGUP","KPHX","KPHX","KGUP","KLAS","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KCNM","KABQ","KLRU","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KSVC","KPHX","KCNM","KABQ","KABQ","KCNM","KPHX","KSVC","KPHX","KPHX","KHHR","KPHX","KSVC","KABQ","KSVC","KSVC","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KSVC","KABQ","KCNM","KABQ","KABQ","KSVC","KPHX","KGUP","KPHX","KPHX","KSVC","KSVC","KABQ","KPHX","KPHX","KGUP","KPHX","KCNM","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KSVC","KABQ","KSVC","KSVC","KABQ","KSVC","KABQ","KSVC","KPHX","KPHX","KGUP","KHND","KGUP","KPHX","KPHX","KGUP","KLAS","KGUP","KPHX","KPHX","KCFT","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KSVC","KABQ","KSVC","KSVC","KABQ","KSVC","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KCNM","KABQ","KCNM","KCNM","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KPHX","KABQ","KCNM","KABQ","KABQ","KSVC","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KPGA","KPHX","KPHX","KSVC","KAXX","KABQ","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KSVC","KABQ","KCNM","KABQ","KABQ","KSVC","KPHX","KGUP","KPHX","KPHX","KGUP","KLAS","KGUP","KPHX","KPHX","KSVC","KABQ","KAXX","KABQ","KSVC","KSVC","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KSVC","KABQ","KELP","KABQ","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KSVC","KABQ","KSVC","KSVC","KABQ","KSVC","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KHOB","KABQ","KAXX","KABQ","KHHR","KMCE","KLAS","KMCE","KHHR","KHHR","KSTS","KMCE","KHHR","KMCE","KHHR","KPHX","KCNM","KABQ","KLRU","KABQ","KCNM","KCNM","KABQ","KAXX","KABQ","KCNM","KPHX","KPHX","KSVC","KSVC","KABQ","KSVC","KPHX","KPHX","KGUP","KLAS","KGUP","KPHX","KPHX","KSVC","KABQ","KSVC","KABQ","KSVC","KSVC","KABQ","KSVC","KABQ","KSVC","KPHX","KPHX","KCNM","KABQ","KLRU","KABQ","KCNM","KCNM","KABQ","KAXX","KABQ","KCNM","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KAXX","KABQ","KSVC","KSVC","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KSVC","KABQ","KCNM","KABQ","KABQ","KSVC","KABQ","KAXX","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KAXX","KABQ","KLRU","KABQ","KSVC","KSVC","KABQ","KAXX","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KAXX","KABQ","KLRU","KABQ","KSVC","KSVC","KABQ","KAXX","KABQ","KSVC","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KSVC","KABQ","KABQ","KSVC","KABQ","KAXX","KABQ","KSVC","KPHX","KICT","KICT","KICT","KICT","KPHX","KGUP","KPHX","KCFT","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KSVC","KSVC","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KSVC","KABQ","KABQ","KSVC","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KLRU","KABQ","KSVC","KSVC","KSVC","KABQ","KSVC","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KDVT","KONM","KDVT","KPHX","KPHX","KGUP","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KLRU","KABQ","KSVC","KSVC","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KGUP","KPHX","KDVT","KPHX","KPHX","KHHR","KHHR","KSTS","KHHR","KSJC","KSJC","KSBA","KHHR","KHHR","KPGA","KMRY","KHHR","KPHX","KGUP","KPHX","KPHX","KCFT","KPHX","KSVC","KABQ","KSVC","KSVC","KABQ","KLRU","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KAXX","KABQ","KSVC","KSVC","KSVC","KGUP","KHHR","KEEO","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KSVC","KABQ","KAXX","KABQ","KSVC","KSVC","KABQ","KSVC","KPHX","KSVC","KABQ","KABQ","KSVC","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KSVC","KABQ","KAXX","KABQ","KSVC","KSVC","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KAXX","KABQ","KSVC","KSVC","KSVC","KABQ","KSVC","KPHX","KGUP","KPHX","KPHX","KGUP","KPHX","KPHX","KSVC","KABQ","KAXX","KABQ","KPHX","KPHX","KABQ","KAXX","KABQ","KSVC","KPHX","KPHX","KGUP","KPHX","KHHR","KGUP","KPHX"];

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

const legs = buildLegs(sequence);
console.log('Row 45 airport codes read:', sequence.length);
console.log('Valid flight legs created:', legs.length);

// ---- SVG / projection setup ----
const width = 975;
const height = 610;
const LEG_DURATION = 260; // ms per leg

const svg = d3.select('#map')
  .attr('viewBox', '0 0 ' + width + ' ' + height);

const projection = d3.geoAlbersUsa();
const geoPath = d3.geoPath(projection);

const gMap = svg.append('g').attr('class', 'map-layer');
const gLegs = svg.append('g').attr('class', 'legs-layer');
const gAirports = svg.append('g').attr('class', 'airports-layer');
const marker = svg.append('circle')
  .attr('class', 'marker')
  .attr('r', 4.5)
  .style('display', 'none');

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
  legStartTime = null;

  const startPt = currentPathEl.getPointAtLength(0);
  marker.style('display', null).attr('cx', startPt.x).attr('cy', startPt.y);

  updateLegLabel(leg, index);
}

function animate(ts) {
  if (!playing || !currentPathEl) return;
  if (!legStartTime) legStartTime = ts;
  const elapsed = ts - legStartTime;
  const t = Math.min(elapsed / LEG_DURATION, 1);
  const pt = currentPathEl.getPointAtLength(t * currentLength);
  marker.attr('cx', pt.x).attr('cy', pt.y);

  if (t >= 1) {
    d3.select(currentPathEl).attr('class', 'leg-path-dim');
    const nextIndex = currentLegIndex + 1;
    if (nextIndex < legs.length) {
      setupLeg(nextIndex);
      animFrame = requestAnimationFrame(animate);
    } else {
      playing = false;
      updateButtons();
      legLabel.textContent = 'Route complete (' + legs.length + ' legs)';
    }
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
  if (legs.length) {
    setupLeg(0);
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
    if (legs.length) {
      setupLeg(0);
    } else {
      legLabel.textContent = 'No valid legs to play';
    }
    updateButtons();
  })
  .catch(function (err) {
    console.error('Failed to load US map data:', err);
    legLabel.textContent = 'Map failed to load';
  });
