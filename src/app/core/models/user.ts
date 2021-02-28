export interface Login {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  lastLoginTime: string;
  authType: string;
}

export interface User {
  createdTime: string;
  createdBy: string;
  lastModifiedTime: string;
  lastModifiedBy: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  primary: boolean;
  partner: Partner;
  roles: Role[];
  migratedToCsp: boolean;
}

export interface Role {
  createdTime: string;
  createdBy: string;
  lastModifiedTime: string;
  lastModifiedBy: string;
  id: string;
  name: string;
  category: string;
  admin: boolean;
  system: boolean;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  category: string;
}

export interface Partner {
  createdTime: string;
  createdBy: string;
  lastModifiedTime: string;
  lastModifiedBy: string;
  id: string;
  name: string;
  prmId: string;
  partnerType: string;
  status: string;
  site: Site;
  cspOrgIsMsp: boolean;
  migratedToCsp: boolean;
  umsEligible: boolean;
  flexReportStartTime: string;
  aggregatedId: string;
  umReportMode: string;
}

export interface Site {
  id: string;
  addressLine1: string;
  city: string;
  county: string;
  state: string;
  country: string;
  postalCode: string;
  hq: boolean;
}
