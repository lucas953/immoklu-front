export type PropertyType =
  | "RESIDENTIAL_LONG_TERM"
  | "SHORT_TERM_RENTAL"
  | "MULTI_UNIT"
  | "COMMERCIAL";

export type PropertyStatus = "ACTIVE" | "ARCHIVED";

export interface PropertyRecord {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  postalCode: string | null;
  city: string;
  stateRegion: string | null;
  countryCode: string;
  type: PropertyType;
  purchasePrice: string | null;
  acquisitionDate: string | null;
  currentValue: string | null;
  currency: string;
  status: PropertyStatus;
  archivedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
