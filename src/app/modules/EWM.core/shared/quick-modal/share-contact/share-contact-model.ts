  export interface shareContactJSON {
    ContactId: string;
    FirstName: string;
    LastName: string;
    Gender: string;
    EmailAddress: string;
    CountryId: number;
    CountryCode: string;
    CountryName: string;
    Clients?: (ClientsEntity)[] | null;
    ProfessionalLevelId: string;
    ProfessionalLevelName: string;
    EOHId: string;
    Status: string;
    StatusName: string;
    ShareContactURL: string;
  }
  export interface ClientsEntity {
    ClientId: string;
    ClientName: string;
    ClientEOHId: string;
  }
  