/*@Type: File, <ts>
@Name: job-workflow-manage-master.ts
@Who: Renu
@When: 18-Dec-2024
@Why: EWM-18939 EWM-18965
@What: All lead workflow schema realted variables will be used from here
*/
export class leadWorkFlow {
    Data:{
        WorkflowName: string,
        Status: number,
        Stages: [
          {
            StageName: string,
            StageDesc: string,
            Status: number,
            IsBuiltIn: number,
            Keyword: string,
            DisplaySeq: number,
            IsActiveFixed: number,
            IsIncludeFixed: number,
            NavigateURL: string,
            ColorCode: string,
            IsIncludeInPipeline: number,
            IsEditable: number,
            Stages: [
              null
            ]
          }
        ]
        };
    PageNumber: number;
    PageSize: number;
    Status: any;
    TotalRecord: number;
    Message:string;
    HttpStatusCode:any;
  
}
