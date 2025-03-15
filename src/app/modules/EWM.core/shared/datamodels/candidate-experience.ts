/* 
 @Type: File, <ts>
 @Name: modal class
 @Who: Nitin Bhati
 @When: 17-Aug-2021
 @Why: EWM-2529
*/

export class CandidateExperienceMaster {
    Message:string;
    HttpStatusCode:any;
    Data:{
        CandidateId: string;
        PositionName: string;
        Employer: string;
        Salary: number;
        CurrencyId:number;
        Currency:string;
        SalaryUnitId:number;
        SalaryUnit: string;
        DateStart:string;
        DateEnd:string;
        Description:string;
        IsCurrent:any;
        Location:{
          Id:any;
          Name:any;
          TypeId:any;
          Type:any;
          AddressLinkToMap:any;
          AddressLine1:any;
          AddressLine2:any;
          District_Suburb:any;
          TownCity:any;
          StateId:any;
          StateName:any;
          PostalCode:any;
          CountryId:any;
          CountryName:any;
          Latitude:any;
          Longitude:any;
          CandidateId:any;
      };
        };
    PageNumber: number;
    PageSize: number;
    Status: any;
    TotalRecord: number; 
}


export class GeneralInforLocationMaster {
  Message:string;
  HttpStatusCode:any;
  Data:{
      CandidateId: number;
      LocationName: string;
      LocationType: string;
      AddressLinkToMap: string;
      Address1: string;
      Address2: string;
      District: string;
      City: number;
      StateId: string;
      StateName:string;
      PostalCode: string;
      CountryId: number;
      CountryName:string;
      Longitude:string;
      Latitude:string;
      };
  PageNumber: number;
  PageSize: number;
  Status: any;
  TotalRecord: number;
}


export class ResponceData {
    HttpStatusCode: number;
    Data: any;
    Status: number;
    max: number;
    Message: string;
    TotalRecord:number;
  
  }
  export class ValidationError {
    field_name: string;
    error_message: string;
  }