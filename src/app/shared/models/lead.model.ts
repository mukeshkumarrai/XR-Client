export interface leadCard {
    PageNumber?: number
    PageSize?: number
    OrderBy?: string
    search?: string
    FilterParams?: FilterParams
    ByPassPaging?: boolean
    IsInterviewedCategory?: number
    GridId?: string
    LeadFilterParams?: LeadFilterParam[]
    WorkflowId?: string
    StageId?: string
    Latitude?: number
    Longitude?: number
  }
  
  export interface FilterParams {
    ColumnName: string
    ColumnType: string
    FilterValue: string
    FilterOption: string
    FilterCondition: string
  }
  
  export interface LeadFilterParam {
    ColumnName: string
    ColumnType: string
    FilterValue: string
    FilterOption: string
    FilterCondition: string
  }
  
  export interface LeadDetails{
    LeadId?: string |string[],
    LeadName?: string,
    WorkflowId?: string,
    WorkflowName?: string,
    StageId?: string,
    StageName?: string,
    StageDisplaySeq?: 0
}

export interface leadsLikeEntity {
    LeadId: any; 
    LeadName: any;
    StageId: any;
    StageName: any; 
    StageDisplaySeq: any; 
}

export class LeadStageDetails {
  WorkflowId:string;
  StageIds:string;
}

export class leadCardModel {
  TopParentId: string
  TopParentName: string
  ParentStageDisplaySeq: number
  Id: string
  Name: string
  IsRejectedStagetype: boolean
  StageType: string
  LeadId: string
  LeadName: string
  LastActivity: number
  StatusId: string
  StatusName: any
  StageColorCode: string
  StageVisibility: number
  ShortName: string
  IsPin: number
  StatusColorCode: string
  ParentId: string
  ParentName: string
  WorkflowId: string
  WorkflowName: string
  StageId: string
  StageName: string
  EmailId: string
  PhoneNumber: string
  PhoneCode: any
  StageDisplaySeq: number
  LeadSource?: string
  WorkflowDateIn: number
  Location: string
  LeadGeneratedBy: string
  LeadGeneratedOn: number
  MappedWithFolder: number
  Tags: any
}
