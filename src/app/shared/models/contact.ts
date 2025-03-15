export class ContactHeaderData {
    Name: string;
    ShortName: string;
    ProfileImagePath: string;
    Address: string;
    ProfileImageURL: string;
    Id:string;
    PhoneCode: string;
    PhoneNo: string;
    EOHId: string;
    SyncedOn: string;

}

export class PersonalData {
  ClientId: string;
  Id: number;
  FirstName: string;
  LastName: string;
  FullName: string;
  FullAddress: string;
  GenderId: number;
  Gender: string;
  EmailId: string;
  PhoneCode: string;
  PhoneNo: string;
  Status: number;
  StatusName: string;
  LastUpdated: number;
  ShortName: string;
  ShortNameColor: string;
  Modified: number;
  Created: number;
  StatusId: string;
  StatusColor: string;
  Email?: (EmailEntity)[] | null;
  Phone?: (PhoneEntity)[] | null;
  PhoneType: string;
  EmailType: string;
  Position:string;
  Owners:[];
   

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
    CountryId: string;
  }

  export interface AddressData {
    ContactId:string
    CountryId: number;
    CountryName: string;
    AddressLinkToMap: string;
    AddressLine1: string;
    AddressLine2: string;
    District_Suburb: string;
    TownCity: string;
    StateId: number;
    StateName: string;
    PostalCode: string;
    Longitude: string;
    Latitude: string;
    LocationId: string;
  }

 
  export interface ContactData {
    ContactDetails: ContactDetails;
    Phones?: (PhonesEntity)[] | null;
    Emails?: (EmailsEntity)[] | null;
    ContactAddress: ContactAddress;
    ContactRelatedTo?: (ContactRelatedToEntity)[] | null;
    Organizations?: OrganizationsEntity[] | null;
    ContactOwner:[];
  }
  export interface ContactDetails {
    Id: number;
    FirstName: string;
    LastName: string;
    FullName: string;
    GenderId: number;
    GenderName: string;
    Status: number;
    StatusName: string;
    StatusId: string;
    Position:string;
  }
  export interface PhonesEntity {
    Type: number;
    TypeName: string;
    PhoneNumber: string;
    PhoneCode: string;
    IsDefault: boolean;
    CountryId: string;
  }
  export interface EmailsEntity {
    Type: number;
    TypeName: string;
    EmailId: string;
    IsDefault: boolean;
  }
  export interface ContactAddress {
    CountryId: number;
    CountryName: string;
    AddressLinkToMap: string;
    AddressLine1: string;
    AddressLine2: string;
    District_Suburb: string;
    TownCity: string;
    StateId: number;
    StateName: string;
    PostalCode: string;
    Longitude: string;
    Latitude: string;
    LocationId: string;
    ContactId: number;
  }
  export interface ContactRelatedToEntity {
    ClientId: string;
    ClientName: string;
  }
  export interface OrganizationsEntity {
    OrganizationId: string;
    OrganizationName: string;
    Id: string;
    IsCurrentOrganization: number;
  }
  export interface ErrorFieldsEntity {
    FieldName: string;
  }

  export interface sharedContactData {
    ContactId: string;
    FirstName: string;
    LastName: string;
    GenderId: string;
    Gender: string;
    SyncedClients?: (SyncedClientsEntity)[] | null;
  }
  export interface SyncedClientsEntity {
    ClientId: string;
    ClientName: string;
    EOHId: string;
  }
  
  

  