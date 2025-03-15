
export class Icandidate {
    Data: Data;
    Status: boolean;
    HttpStatusCode: any;
    Message: string;
    TotalRecord: number;
    PageNumber: number;
    PageSize: number;
    TotalPages: number;
}

export class Data {
    CandidateId: string;
    Name: string;
    CurrentLocation: string;
    CandidateImage: string;
    ImageUrl: string;
    Tags?: any;
    GeneralInformation: GeneralInformation;
    Addresses?: any;
    Dependents?: any;
    EmergencyContacts?: any;
    Folders?: any;
    Skills?: any;
    AdditionalInformation?: any;
    Experiences?: any;
    Educations?: any;
    Jobs?: any;
}

export class GeneralInformation {
    CandidateId: string;
    Name: string;
    FirstName: string;
    LastName: string;
    Image: string;
    Email: string;
    EmailTypeId: number;
    PhoneNumber: string;
    PhoneTypeId: number;
    CurrentCompany: string;
    JobTitle: string;
    TotalExperience: number;
    CurrentLocation: string;
    CurrentSalary: string;
    NoticePeriod: number;
}

export class ClientSummaryModel {
    HttpStatusCode: any;
    Data:{
      Industry: [];
      SubIndustry: [];
      ClientName:string;
      LocationDetails: {
        LocationId: string;
        LocationName: string;
        LocationType: string;
        AddressLinkToMap: string;
        AddressLine1: string;
        District: string;
        TownCity: string;
        CountryName: string;
        StateName: string;
        ZipCode: string;
        Longitude: string;
        Latitude: string;
        ClientId: string;
      };

      ClientDetails: {
      };
      ClientStatus: {
      };
      };
    Status: any;
    max: number;
    Message: string;
    TotalRecord: number;
    
  }
