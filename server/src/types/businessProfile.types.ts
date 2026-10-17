export interface ContactInfo {
  email: string;
  phone?: string;
  website?: string;
}

export interface BusinessLocation {
  address?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface BusinessProfile {
  id: string;
  businessId: string;
  businessName: string;
  tagline?: string;
  description: string;
  contact: ContactInfo;
  location: BusinessLocation;
  categories: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface UpdateBusinessProfileDTO {
  businessName?: string;
  tagline?: string;
  description?: string;
  contact?: Partial<ContactInfo>;
  location?: Partial<BusinessLocation>;
  categories?: string[];
}
