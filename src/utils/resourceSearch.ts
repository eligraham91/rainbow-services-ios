import resourcesData from '@data/resources.json';

export type ResourceType = 'hotline' | 'shelter' | 'legal' | 'counseling' | 'housing';

export interface Resource {
  id: string;
  name: string;
  phone: string;
  phoneDisplay: string;
  website?: string;
  address: string | null;
  city: string;
  state: string;
  zip: string | null;
  type: ResourceType;
  national: boolean;
  languages: string[];
  description: string;
}

const ALL_RESOURCES: Resource[] = resourcesData as Resource[];

export interface ResourceFilters {
  type?: ResourceType | 'all';
  state?: string;
  query?: string;
}

// API-swappable interface: swap this implementation for a network call later
// without changing any screen code.
export async function fetchResources(filters: ResourceFilters = {}): Promise<Resource[]> {
  let results = [...ALL_RESOURCES];

  if (filters.type && filters.type !== 'all') {
    results = results.filter(r => r.type === filters.type);
  }

  if (filters.state && filters.state !== 'all') {
    results = results.filter(
      r => r.national || r.state.toLowerCase() === filters.state!.toLowerCase()
    );
  }

  if (filters.query && filters.query.trim().length > 0) {
    const q = filters.query.trim().toLowerCase();
    results = results.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q)
    );
  }

  // National resources always appear first
  results.sort((a, b) => {
    if (a.national && !b.national) return -1;
    if (!a.national && b.national) return 1;
    return 0;
  });

  return results;
}

export function getResourcesByType(type: ResourceType): Resource[] {
  return ALL_RESOURCES.filter(r => r.type === type);
}

export function getAllResources(): Resource[] {
  return [...ALL_RESOURCES];
}
