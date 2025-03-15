export interface addVxtCalllog {
    SaveTo: string;
    SaveToId: string;
    CategoryId: number;
    CategoryName: string;
    StartDate: string;
    FromId: string;
    FromName: string;
    ToId: string;
    ToName: string;
    CallType: string;
    RelatedTo: string;
    DetailsId: string;
    DetailsName:string
    Notes: string;
    Duration: number;
    IsNotes: number;
    Source: string;
    FromSummaryURL: string;
    ToSummaryURL: string;
    DetailsSummaryURL: string;
    NotesURL:string,
    SaveToName?: string | null; // Making Validation optional
    SaveToSummaryURL?: string | null; // Making Validation optional
    EndCallerTypeCode?: string | null; // Making Validation optional
    contactIdForUrlFrom?: number | null; // Making Validation optional
    ToProfileImage?: string;
    ToProfileImageUrl?: string;
    FromProfileImage?: string;
  FromProfileImageUrl?: string;
  SaveToPhoneNumber?: string;
  CallStatusId?: string;
  CallStatus?: string;
  }
  export interface GetCandidateListCallLog {
    UserType: string;
    Id: string;
    GlobalFilter: string;
    search: string;
    FilterParams?: (FilterParamsdata)[] | null;
    ByPassPaging: string;
    Filter: string;
    Page: string;
    Sort: string;
    PageNumber: string;
    PageSize: string;
    OrderBy: string;
    HaveOrderBy: boolean;
    FromSummaryURL: string;
    ToSummaryURL: string;
    DetailsSummaryURL: string;
    NotesURL: string;
  }
  export interface FilterParamsdata {
    ColumnName: string;
    ColumnType: string;
    FilterValue: string;
    FilterOption: string;
    FilterCondition:string
  }
  export interface updateVxtCalllog {
    SaveTo: string;
    SaveToId: string;
    CategoryId: number;
    CategoryName: string;
    StartDate: string;
    FromId: string;
    FromName: string;
    ToId: string;
    ToName: string;
    CallType: string;
    RelatedTo: string;
    DetailsId: string;
    DetailsName:string
    Notes: string;
    Duration: number;
    IsNotes: number;
    Source: string;
    SaveToPhoneNumber?: string;
    CallStatusId?: string;
    CallStatus?: string;
  }
