/* 
 @Type: File, <ts>
 @Name: modal class
 @Who: Nitin Bhati
 @When: 18-Aug-2021
 @Why: EWM-2429
*/

export class FolderMaster {
    Message:string;
    HttpStatusCode:any;
    Data:{
        FolderName: string;
        FolderId: number;
        Description: string;
        Count: number;
        FolderOwner: string;
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