import type { PropertyRecord, PropertyStatus, PropertyType } from "../domain/property";

export interface CreatePropertyInput {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
  city: string;
  stateRegion?: string;
  countryCode: string;
  type: PropertyType;
  purchasePrice: string;
  acquisitionDate: string;
  currentValue?: string;
  currency: string;
  status: PropertyStatus;
  notes?: string;
}

export type UpdatePropertyInput = Partial<CreatePropertyInput>;

export type PropertyResponse = PropertyRecord;
