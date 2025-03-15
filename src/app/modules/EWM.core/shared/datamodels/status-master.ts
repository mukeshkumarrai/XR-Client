/*@Type: File, <ts>
@Name: status-master.ts
@Who: Renu
@When: 13-May-2021
@Why: ROST-1538
@What: All table status master schema realted variables will be used from here
*/
export class statusMaster {
    Data:{
        BuiltIn: number;
        ShortDescription: string;
        Description: string;
        Id: number;
        Status: number;
        Keyword: any;
        Code: any;
        ColorCode: any;
        DisplaySequence: number;
        StatusName: string;
        };
    PageNumber: number;
    PageSize: number;
    Status: any;
    TotalRecord: number;
    Message:string;
    HttpStatusCode:any;
  
}

export class groupMaster {
    Message:string;
    HttpStatusCode:any;
    Data:{
        BuiltIn: number;
        Code: string;
        Description: string;
        ID: number;
        Status: number;
        };
    PageNumber: number;
    PageSize: number;
    Status: any;
    TotalRecord: number;
}

export class reasonMaster {
    Data:{
        Id: number;
        Status: number;
        BuiltIn: number;
        Description: string;
    }
    PageNumber: number;
    PageSize: number;
    Status: any;
    TotalRecord: number;
    Message:string;
    HttpStatusCode:any
}