/**
 * Geo-aware search for the shelter locator.
 * No device geolocation. No network calls. All data is bundled.
 * Ported from the Rainbow Services website's geoSearch.ts.
 */

import zipCentroidsData from '@data/zip-centroids.json';
import type { ShelterMapProgram } from '@utils/shelterTypes';

// ── Types ─────────────────────────────────────────────────────────────────────

export type SearchIntent = 'empty' | 'zip' | 'city-state' | 'state' | 'text';

export type GeoResultTier =
  | 'exact-zip'
  | 'nearby-25'
  | 'nearby-50'
  | 'nearby-100'
  | 'state-fallback'
  | 'none';

export interface GeoSearchResult {
  records: ShelterMapProgram[];
  tier: GeoResultTier;
  searchedZip?: string;
  searchedState?: string;
  radiusMiles?: number;
  centroidApproximate?: boolean;
}

interface ZipCentroid {
  zip: string;
  city?: string;
  state: string;
  lat: number;
  lng: number;
}

const ZIP_CENTROIDS = zipCentroidsData as Record<string, ZipCentroid>;

// ── State centroids ───────────────────────────────────────────────────────────

export const STATE_CENTROIDS: Record<string, { lat: number; lng: number; name: string }> = {
  AL: { lat: 32.7794, lng: -86.8287, name: 'Alabama' },
  AK: { lat: 64.0685, lng: -153.3694, name: 'Alaska' },
  AZ: { lat: 34.2744, lng: -111.6602, name: 'Arizona' },
  AR: { lat: 34.8938, lng: -92.4426, name: 'Arkansas' },
  CA: { lat: 37.1841, lng: -119.4696, name: 'California' },
  CO: { lat: 38.9972, lng: -105.5478, name: 'Colorado' },
  CT: { lat: 41.6219, lng: -72.7273, name: 'Connecticut' },
  DE: { lat: 38.9896, lng: -75.505, name: 'Delaware' },
  FL: { lat: 28.6305, lng: -82.4497, name: 'Florida' },
  GA: { lat: 32.6415, lng: -83.4426, name: 'Georgia' },
  HI: { lat: 20.2927, lng: -156.3737, name: 'Hawaii' },
  ID: { lat: 44.3509, lng: -114.613, name: 'Idaho' },
  IL: { lat: 40.0417, lng: -89.1965, name: 'Illinois' },
  IN: { lat: 39.8942, lng: -86.2816, name: 'Indiana' },
  IA: { lat: 42.0751, lng: -93.496, name: 'Iowa' },
  KS: { lat: 38.4937, lng: -98.3804, name: 'Kansas' },
  KY: { lat: 37.5347, lng: -85.3021, name: 'Kentucky' },
  LA: { lat: 31.0689, lng: -91.9968, name: 'Louisiana' },
  ME: { lat: 45.3695, lng: -69.2428, name: 'Maine' },
  MD: { lat: 39.055, lng: -76.7909, name: 'Maryland' },
  MA: { lat: 42.2596, lng: -71.8083, name: 'Massachusetts' },
  MI: { lat: 44.3467, lng: -85.4102, name: 'Michigan' },
  MN: { lat: 46.2807, lng: -94.3053, name: 'Minnesota' },
  MS: { lat: 32.7364, lng: -89.6678, name: 'Mississippi' },
  MO: { lat: 38.3566, lng: -92.458, name: 'Missouri' },
  MT: { lat: 47.0527, lng: -109.6333, name: 'Montana' },
  NE: { lat: 41.5378, lng: -99.7951, name: 'Nebraska' },
  NV: { lat: 39.3289, lng: -116.6312, name: 'Nevada' },
  NH: { lat: 43.6805, lng: -71.5811, name: 'New Hampshire' },
  NJ: { lat: 40.1907, lng: -74.6728, name: 'New Jersey' },
  NM: { lat: 34.4071, lng: -106.1126, name: 'New Mexico' },
  NY: { lat: 42.9538, lng: -75.5268, name: 'New York' },
  NC: { lat: 35.5557, lng: -79.3877, name: 'North Carolina' },
  ND: { lat: 47.4501, lng: -100.4659, name: 'North Dakota' },
  OH: { lat: 40.2862, lng: -82.7937, name: 'Ohio' },
  OK: { lat: 35.5889, lng: -97.4943, name: 'Oklahoma' },
  OR: { lat: 43.9336, lng: -120.5583, name: 'Oregon' },
  PA: { lat: 40.8781, lng: -77.7996, name: 'Pennsylvania' },
  RI: { lat: 41.6762, lng: -71.5562, name: 'Rhode Island' },
  SC: { lat: 33.9169, lng: -80.8964, name: 'South Carolina' },
  SD: { lat: 44.4443, lng: -100.2263, name: 'South Dakota' },
  TN: { lat: 35.858, lng: -86.3505, name: 'Tennessee' },
  TX: { lat: 31.4757, lng: -99.3312, name: 'Texas' },
  UT: { lat: 39.3055, lng: -111.0937, name: 'Utah' },
  VT: { lat: 44.0687, lng: -72.6658, name: 'Vermont' },
  VA: { lat: 37.5215, lng: -78.8537, name: 'Virginia' },
  WA: { lat: 47.3826, lng: -120.4472, name: 'Washington' },
  WV: { lat: 38.6409, lng: -80.6227, name: 'West Virginia' },
  WI: { lat: 44.6243, lng: -89.9941, name: 'Wisconsin' },
  WY: { lat: 42.9957, lng: -107.5512, name: 'Wyoming' },
  DC: { lat: 38.9072, lng: -77.0369, name: 'District of Columbia' },
  PR: { lat: 18.2208, lng: -66.5901, name: 'Puerto Rico' },
  GU: { lat: 13.4443, lng: 144.7937, name: 'Guam' },
  VI: { lat: 17.737, lng: -64.7505, name: 'US Virgin Islands' },
  MP: { lat: 14.8901, lng: 145.243, name: 'Northern Mariana Islands' },
  AS: { lat: -14.271, lng: -170.1322, name: 'American Samoa' },
};

const STATE_NAMES_TO_ABBR: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
  'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
  'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
  'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
  'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
  'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
  'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
  'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
  'wisconsin': 'WI', 'wyoming': 'WY', 'district of columbia': 'DC',
  'puerto rico': 'PR', 'guam': 'GU', 'virgin islands': 'VI',
};

// ── ZIP prefix index (built once at module load) ───────────────────────────────

const ZIP_PREFIX_3: Record<string, ZipCentroid[]> = {};
const ZIP_PREFIX_2: Record<string, ZipCentroid[]> = {};

for (const c of Object.values(ZIP_CENTROIDS)) {
  const p3 = c.zip.slice(0, 3);
  const p2 = c.zip.slice(0, 2);
  if (!ZIP_PREFIX_3[p3]) ZIP_PREFIX_3[p3] = [];
  if (!ZIP_PREFIX_2[p2]) ZIP_PREFIX_2[p2] = [];
  ZIP_PREFIX_3[p3].push(c);
  ZIP_PREFIX_2[p2].push(c);
}

function avgCentroid(cs: ZipCentroid[]): { lat: number; lng: number; state: string } {
  const lat = cs.reduce((s, c) => s + c.lat, 0) / cs.length;
  const lng = cs.reduce((s, c) => s + c.lng, 0) / cs.length;
  const stateCounts: Record<string, number> = {};
  for (const c of cs) stateCounts[c.state] = (stateCounts[c.state] ?? 0) + 1;
  const state = Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0][0];
  return { lat, lng, state };
}

function findZipCentroid(zip: string): { lat: number; lng: number; state: string; approximate: boolean } | null {
  const exact = ZIP_CENTROIDS[zip];
  if (exact) return { lat: exact.lat, lng: exact.lng, state: exact.state, approximate: false };

  const p3 = ZIP_PREFIX_3[zip.slice(0, 3)];
  if (p3 && p3.length > 0) return { ...avgCentroid(p3), approximate: true };

  const p2 = ZIP_PREFIX_2[zip.slice(0, 2)];
  if (p2 && p2.length > 0) return { ...avgCentroid(p2), approximate: true };

  return null;
}

// ── Intent classifier ─────────────────────────────────────────────────────────

export function classifySearchIntent(query: string): SearchIntent {
  const q = query.trim();
  if (!q) return 'empty';
  if (/^\d{5}(-\d{4})?$/.test(q)) return 'zip';
  const ql = q.toLowerCase();
  if (ql in STATE_NAMES_TO_ABBR) return 'state';
  if (/^[A-Za-z]{2}$/.test(q) && q.toUpperCase() in STATE_CENTROIDS) return 'state';
  if (/,/.test(q)) return 'city-state';
  return 'text';
}

// ── Haversine distance ────────────────────────────────────────────────────────

export function haversineDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Resolve state abbreviation ────────────────────────────────────────────────

export function resolveStateAbbr(query: string): string | null {
  const q = query.trim();
  const upper = q.toUpperCase();
  if (upper in STATE_CENTROIDS) return upper;
  return STATE_NAMES_TO_ABBR[q.toLowerCase()] ?? null;
}

// ── ZIP geo search ────────────────────────────────────────────────────────────

const RADIUS_STEPS = [25, 50, 100];
const MIN_RESULTS = 5;

export function geoSearchByZip(zip: string, pool: ShelterMapProgram[], activeFilters: string[]): GeoSearchResult {
  const normalizedZip = zip.replace(/-\d{4}$/, '');

  const localPool = pool.filter(s => s.isMappable && !s.isBroadAreaRecord && s.lat != null && s.lng != null);
  const broadPool = pool.filter(s => s.isBroadAreaRecord);

  const applyFilters = (records: ShelterMapProgram[]) =>
    activeFilters.length === 0
      ? records
      : records.filter(s => activeFilters.every(f => s.services.includes(f)));

  const filteredLocal = applyFilters(localPool);
  const filteredBroad = applyFilters(broadPool);

  const centroid = findZipCentroid(normalizedZip);

  if (!centroid) {
    const exactZipMatch = filteredLocal.filter(s => s.zip === normalizedZip);
    if (exactZipMatch.length > 0) {
      const matchState = exactZipMatch[0].state;
      return {
        records: [...exactZipMatch, ...filteredBroad.filter(s => s.state === matchState)],
        tier: 'exact-zip',
        searchedZip: normalizedZip,
      };
    }
    return { records: [], tier: 'none', searchedZip: normalizedZip };
  }

  const { lat, lng, state, approximate } = centroid;
  const sameStateBroad = filteredBroad.filter(s => s.state === state);

  const withDistance = filteredLocal.map(s => ({
    s,
    dist: haversineDistanceMiles(lat, lng, s.lat!, s.lng!),
  }));

  for (const radius of RADIUS_STEPS) {
    const nearby = withDistance.filter(x => x.dist <= radius);
    if (nearby.length >= MIN_RESULTS || radius === RADIUS_STEPS[RADIUS_STEPS.length - 1]) {
      if (nearby.length > 0) {
        const tier: GeoResultTier =
          radius === 25 ? 'nearby-25' : radius === 50 ? 'nearby-50' : 'nearby-100';
        const sorted = nearby
          .sort((a, b) => {
            const prec: Record<string, number> = { 'listed-address': 0, 'local-approximate': 1 };
            const pa = prec[a.s.locationPrecision] ?? 2;
            const pb = prec[b.s.locationPrecision] ?? 2;
            return pa !== pb ? pa - pb : a.dist - b.dist;
          })
          .map(x => x.s);
        return { records: [...sorted, ...sameStateBroad], tier, radiusMiles: radius, searchedZip: normalizedZip, centroidApproximate: approximate };
      }
      break;
    }
  }

  if (sameStateBroad.length > 0) {
    return { records: sameStateBroad, tier: 'state-fallback', searchedZip: normalizedZip, centroidApproximate: approximate };
  }

  return { records: [], tier: 'none', searchedZip: normalizedZip };
}

// ── City/state search ─────────────────────────────────────────────────────────

export function geoSearchByCityState(
  query: string,
  pool: ShelterMapProgram[],
  activeFilters: string[]
): { records: ShelterMapProgram[]; cityPart: string; statePart: string } {
  const applyFilters = (records: ShelterMapProgram[]) =>
    activeFilters.length === 0
      ? records
      : records.filter(s => activeFilters.every(f => s.services.includes(f)));

  const parts = query.split(',').map(p => p.trim());
  const cityPart = parts[0]?.toLowerCase() ?? '';
  const statePart = parts[1]?.trim().toUpperCase() ?? '';

  let matches = applyFilters(
    pool.filter(s => {
      const cityMatch = s.city.toLowerCase().includes(cityPart);
      const stateMatch = !statePart || s.state.toUpperCase() === statePart;
      return cityMatch && stateMatch;
    })
  );

  if (matches.length === 0 && statePart) {
    matches = applyFilters(pool.filter(s => s.state.toUpperCase() === statePart));
  }

  return { records: matches, cityPart: parts[0] ?? '', statePart };
}

// ── State-level search ────────────────────────────────────────────────────────

export function geoSearchByState(
  query: string,
  pool: ShelterMapProgram[],
  activeFilters: string[]
): { records: ShelterMapProgram[]; stateAbbr: string; stateName: string } {
  const abbr = resolveStateAbbr(query) ?? '';
  const applyFilters = (records: ShelterMapProgram[]) =>
    activeFilters.length === 0
      ? records
      : records.filter(s => activeFilters.every(f => s.services.includes(f)));

  const records = abbr
    ? applyFilters(pool.filter(s => s.state.toUpperCase() === abbr))
    : [];

  const stateName = abbr ? (STATE_CENTROIDS[abbr]?.name ?? abbr) : query;
  return { records, stateAbbr: abbr, stateName };
}

// ── Text search ───────────────────────────────────────────────────────────────

export function geoSearchByText(
  query: string,
  pool: ShelterMapProgram[],
  activeFilters: string[]
): ShelterMapProgram[] {
  const q = query.trim().toLowerCase();
  const applyFilters = (records: ShelterMapProgram[]) =>
    activeFilters.length === 0
      ? records
      : records.filter(s => activeFilters.every(f => s.services.includes(f)));

  return applyFilters(
    pool.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q) ||
      (s.zip ?? '').includes(q) ||
      (s.county ?? '').toLowerCase().includes(q) ||
      (s.address ?? '').toLowerCase().includes(q)
    )
  );
}
