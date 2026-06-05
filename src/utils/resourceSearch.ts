import shelterData from '@data/shelter-data.json';
import {
  classifySearchIntent,
  geoSearchByZip,
  geoSearchByCityState,
  geoSearchByState,
  geoSearchByText,
  type GeoSearchResult,
  type GeoResultTier,
} from '@utils/geoSearch';
import type { ShelterMapProgram } from '@utils/shelterTypes';

export type { ShelterMapProgram, GeoSearchResult, GeoResultTier };
export { classifySearchIntent };

const ALL_SHELTERS: ShelterMapProgram[] = shelterData as ShelterMapProgram[];

export interface ShelterSearchFilters {
  query?: string;
  services?: string[];
}

export interface ShelterSearchResponse {
  records: ShelterMapProgram[];
  geoResult: GeoSearchResult | null;
  intent: ReturnType<typeof classifySearchIntent>;
  statusLabel: string;
}

function buildStatusLabel(r: Omit<ShelterSearchResponse, 'statusLabel'>): string {
  const count = r.records.length;
  if (count === 0) return 'No results. Try a different search.';
  const n = `${count} ${count === 1 ? 'program' : 'programs'}`;
  if (!r.geoResult || r.intent === 'empty') return `${n} available`;

  switch (r.geoResult.tier) {
    case 'exact-zip':    return `${n} in or near ${r.geoResult.searchedZip}`;
    case 'nearby-25':   return `${n} within 25 miles of ${r.geoResult.searchedZip}`;
    case 'nearby-50':   return `${n} within 50 miles of ${r.geoResult.searchedZip}`;
    case 'nearby-100':  return `${n} within 100 miles of ${r.geoResult.searchedZip}`;
    case 'state-fallback': return `Showing statewide programs near ${r.geoResult.searchedZip}`;
    default: return `${n} found`;
  }
}

// Default empty-query view: first 50 records (geo search handles real queries)
export async function fetchShelters(filters: ShelterSearchFilters = {}): Promise<ShelterSearchResponse> {
  const query = filters.query?.trim() ?? '';
  const services = filters.services ?? [];
  const intent = classifySearchIntent(query);
  let records: ShelterMapProgram[] = [];
  let geoResult: GeoSearchResult | null = null;

  switch (intent) {
    case 'empty':
      records = services.length > 0
        ? ALL_SHELTERS.filter(s => services.every(f => s.services.includes(f))).slice(0, 50)
        : ALL_SHELTERS.slice(0, 50);
      break;
    case 'zip': {
      geoResult = geoSearchByZip(query, ALL_SHELTERS, services);
      records = geoResult.records;
      break;
    }
    case 'city-state': {
      const r = geoSearchByCityState(query, ALL_SHELTERS, services);
      records = r.records;
      geoResult = { records, tier: 'none' };
      break;
    }
    case 'state': {
      const r = geoSearchByState(query, ALL_SHELTERS, services);
      records = r.records;
      geoResult = { records, tier: 'none', searchedState: r.stateAbbr };
      break;
    }
    case 'text':
      records = geoSearchByText(query, ALL_SHELTERS, services);
      break;
  }

  const partial = { records, geoResult, intent };
  return { ...partial, statusLabel: buildStatusLabel(partial) };
}
