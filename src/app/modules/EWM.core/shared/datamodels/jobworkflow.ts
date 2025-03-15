/*@Type: File, <ts>
@Name: job-workflow-manage-master.ts
@Who: Renu
@When: 19-June-2021
@Why: ROST-1871
@What: All job workflow scheme schema realted variables will be used from here
*/
export class jobWorkFlow {
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
