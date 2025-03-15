export interface XeopleEohCard {
    CandidateId: string;
    Resume: string;
    ResumePath: string;
    CandidateName: string;
    MemberAddress: string;
    Experience: string;
    Qualification: string;
    Skills: string;
    MemberStatus: string;
    Office: string;
    Email: string;
    isExtracted: boolean;
    total:number

}

export interface Image{
    MemberId:string;
    Base64Photo:string;
}

export class pushMailNotification {
    JobId: string
    JobTitle: string
    JobRefNo: string
    MembersDetails: MembersDetail[]
    MembersDetailsInfo:string
  CandidateId: string
  }
  
  export class MembersDetail {
    MemberId: string
    MemberName: string
    EmailId: string
  }

  export interface OutputField {
    OutputFieldId: number
    OutputFieldName: string
    DisplayIndex: number
    DBColumnName: string
    Filterable: boolean
    FilterableDataType?: string
    Width: string
    Alignment: string
  }
  
export interface InputField {
  InputColumnId: number
  InputColumnName: string
  DBColumnName: string
  IsJobParameter: number
  InputColumnType: string
  APIEndpoint?: string
  APIKey?: string
  InputColumnConditionId: number
  InputColumnCondition: string
  IsMultiple: boolean
  Condition: Condition[]
}

export interface Condition {
  ConditionId: number
  ConditionName: string
}