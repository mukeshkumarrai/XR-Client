/* 
 @Type: File, <ts>
 @Name: modal class
 @Who: Nitin Bhati
 @When: 11-Aug-2021
 @Why: EWM-2426
*/

export class GeneralInformationMaster {
    Message:string;
    HttpStatusCode:any;
    Data:{
        CandidateId: number;
        FirstName: string;
        LastName: string;
        Email: string;
        EmailTypeId:string;
        EmailType:number;
        PhoneNumber: string;
        PhoneType:string;
        PhoneCode:string;
        PhoneTypeId:number;
        CurrentCompany: string;
        JobTitle: string;
        TotalExperience: number;
        CurrentLocation: string;
        Salary: string;
        NoticePeriod: number;
        Currency:string;
        SalaryUnit:string;
        CountryId:number;
        Phones:any;
        IsImmediateAvailable: number;
        StatusName:any;
        Reasonname: any;
        Status: any;
        ReasonId: number;
        AddressLinkToMap:string;/*@Who: Suika,@When: 28-March-2023,@Why: EWM-13293, @What: For current location */
        Emails:any;  /*@Who: Nitin Bhati,@When: 01-March-2022,@Why: EWM-10722,@What: For showing multiple emailId's*/
        RecruiterDetails: any; //who:Ankit Rawat,what:EWM-16075 mapped Recruiter with candidate,When:21 Feb 2024
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