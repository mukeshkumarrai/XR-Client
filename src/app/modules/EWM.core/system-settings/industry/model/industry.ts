/* 
 @Type: File, <ts>
 @Name: modal class
 @Who: Suika
 @When: 13-May-2021
 @Why: ROST-1506
*/
export class Industry {
    Message:string;
    HttpStatusCode:any;
    Data: {
        Id: number;
        Code: string;
        Description: string;
        ExternalId: string;
        HideExternally: number;  
        Order: number;
        IsBuiltIn: number;
        Score: number;
        Status: number;
        IndustryId: number;
    
    };  
    PageNumber: number;
    PageSize: number;
    Status: any;
    TotalRecord: number;
  
}
