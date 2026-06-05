export type ShelterLocationPrecision =
  | 'listed-address'
  | 'local-approximate'
  | 'broad-area'
  | 'restricted'
  | 'unknown';

export type ShelterCoordinatePrecision =
  | 'precise'
  | 'zip'
  | 'city'
  | 'state'
  | 'none'
  | 'unknown';

export interface ShelterMapProgram {
  id: string;
  name: string;
  address?: string;
  city: string;
  state: string;
  zip?: string;
  county?: string;
  phone?: string;
  hotline?: string;
  website?: string;
  fvpsaFunding?: string;
  lat?: number;
  lng?: number;
  isMappable: boolean;
  locationPrecision: ShelterLocationPrecision;
  coordinatePrecision: ShelterCoordinatePrecision;
  hasListedAddress: boolean;
  isBroadAreaRecord: boolean;
  geocodeMethod?: string;
  category?: string;
  services: string[];
}

export const SERVICE_FILTERS: { id: string; label: string }[] = [
  { id: 'emergency-shelter', label: 'Shelter' },
  { id: 'hotline', label: 'Hotline' },
  { id: 'transitional-housing', label: 'Housing' },
  { id: 'legal-advocacy', label: 'Legal' },
  { id: 'children-family', label: 'Children & Family' },
  { id: 'housing-navigation', label: 'Housing Help' },
  { id: 'spanish-language', label: 'Español' },
  { id: 'lgbtq-affirming', label: 'LGBTQ+' },
  { id: 'pet-inclusive', label: 'Pets OK' },
  { id: 'immigration-support', label: 'Immigration' },
];
