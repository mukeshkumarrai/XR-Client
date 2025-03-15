/* 
 @Type: File, <ts>
 @Name: modal class
 @Who: Nitin Bhati
 @When: 19-May-2021
 @Why: ROST-1786
*/

export class BrandsMaster {
    Message:string;
    HttpStatusCode:any;
    Data:{
        Brand: string;
        Id: number;
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