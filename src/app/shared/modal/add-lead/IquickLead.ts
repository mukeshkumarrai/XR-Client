export interface IquickLead {
    OrganizationIdList?: (string)[] | null;
    LeadName: string;
    ClientWorkflow: string;
    ClientWorkflowName: string;
    LeadSourceId: string;
    LeadSourceName: string;
    LeadGeneratedbyId: string;
    LeadGeneratedbyName: string;
    LeadGeneratedOn: string;
    LeadLocations?: (LeadLocationsEntity)[] | null;
    Address: string;
    IndustryInternalCodeList?: (string)[] | null;
    Phone?: (PhoneEntity)[] | null;
    Email?: (EmailEntity)[] | null;
    StatusId: string;
    StatusName: string;
    AccessId: number;
    AccessName: string;
    GrantAccessList?: (GrantAccessListEntity)[] | null;
    PageUrl:string;
  }
  export interface LeadLocationsEntity {
    ClientId: string;
    Id: string;
    LocationTypeId: number;
    LocationType: string;
    CountryId: string;
    Country: string;
    AddressLinkToMap: string;
    AddressLine1: string;
    AddressLine2: string;
    District: string;
    TownCity: string;
    StateId: number;
    StateName: string;
    ZipCode: string;
    Longitude: string;
    Latitude: string;
    IsDefault: number;
    Phone?: (PhoneEntity1)[] | null;
    Email?: (EmailEntity)[] | null;
    CountryCode: string;
  }
  export interface PhoneEntity1 {
    Type: number;
    TypeName: string;
    PhoneNumber: string;
    PhoneCode: string;
    IsDefault: boolean;
    CountryId: string;
    CountryCode: string;
  }
  export interface EmailEntity {
    Type: number;
    TypeName: string;
    EmailId: string;
    IsDefault: boolean;
  }
  export interface PhoneEntity {
    Type: number;
    TypeName: string;
    PhoneNumber: string;
    PhoneCode: string;
    IsDefault: boolean;
    CountryId: number;
    CountryCode: string;
  }
  export interface GrantAccessListEntity {
    UserId: string;
    EmailId: string;
    UserName: string;
    MappingId: number;
    Mode: number;
  }
  