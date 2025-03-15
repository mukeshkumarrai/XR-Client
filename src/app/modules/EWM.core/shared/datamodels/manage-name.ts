/* 
 @Type: File, <ts>
 @Name: modal class
 @Who: Nitin Bhati
 @When: 17-May-2021
 @Why: ROST-1527
*/

export class locationMaster {
    Message:string;
    HttpStatusCode:any;
    Data:{
        IsBuiltIn: number;
        Name: string;
        Id: number;
        IsActive: number;
        };
    Datas: any;
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