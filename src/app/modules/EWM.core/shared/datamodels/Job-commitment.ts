/*
@Type: File, <ts>
@Name: job-commitment.ts
@Who: Renu
@When: 24-May-2021
@Why: ROST-1630
@What: All table jb commitment schema realted variables will be used from here
*/

export interface JobCommitment{
    Message:string;
    HttpStatusCode:any;
    Data:{
        Name: any;
        Id: number;
        Status: number;
        };
    PageNumber: number;
    PageSize: number;
    Status: any;
    TotalRecord: number;
    }