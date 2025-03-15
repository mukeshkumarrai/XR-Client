
  export interface ValidateEOH {
    ClientId: string;
    SecretId: string;
    OrganizationName: string;
    Token: string;
    IsClientValid: boolean;
  }


  
  export interface eohRegDetails {
    Id: number;
    RegistrationCode: string;
    ClientID: string;
    SecretKey: string;
    OrganizationName: string;
  }

  export interface eohRegisteration {
    RegistrationCode: string;
    RegionId: number;
    TypeId: number;
    CategoryId: number;
    CountryId: number;
    Name: string;
    Logo: string;
    LogoUrl: string;
    Description: string;
    Video: string;
    VideoUrl: string;
    BillingTypeId: number;
    IntegrationImages?: IntegrationImagesEntity;
    IntegratorTagId: number;
    IntegrationLocations: IntegrationLocations;
    Status: number;
    StatusName: string;
    RegionName: string;
    TypeName: string;
    CategoryName: string;
    CountryName: string;
    TagCode: string;
    BillingType: string;
    IsUser: number;
  }
  export interface IntegrationImagesEntity {
    Image: string;
    ImageUrl: string;
  }
  export interface IntegrationLocations {
    LocationName: string;
    LocationTypeId: number;
    LocationType: string;
    LocationCountryId: number;
    AddrssLinkToMap: string;
    AddressLine1: string;
    AddressLine2: string;
    District: string;
    TownCity: string;
    StateId: string;
    PostalCode: string;
    Longitude: string;
    Latitude: string;
    LocationStatus: number;
    LocationCountryName: string;
  }

  
  