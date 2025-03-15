/* 
 @Type: File, <ts>
 @Name: modal class
 @Who: Nitin Bhati
 @When: 11-May-2021
 @Why: EWM-2443
*/
export class ScoreTypeMaster {
    Message:string;
    HttpStatusCode:any;
    Data:{
        Id: number;
        ScoreTypeName: string;
        Description: string;
        Status: number;
        };
    PageNumber: number;
    PageSize: number;
    Status: any;
    TotalRecord: number;
}

export class DegreeTypeMaster {
  Message:string;
  HttpStatusCode:any;
  Data:{
      Id: number;
      DegreeTypeName: string;
      Description: string;
      Status: number;
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