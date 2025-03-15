/* 
 @Type: File, <ts>
 @Name: modal class
 @Who: Nitin Bhati
 @When: 17-May-2021
 @Why: ROST-1527
*/

export class ExperienceMaster {
    Message:string;
    HttpStatusCode:any;
    Data:{
        Name: string;
        Id: number;
        Status: number;
        Weightage:number
        WeightageId
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