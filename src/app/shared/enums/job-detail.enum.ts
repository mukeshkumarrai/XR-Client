// <!--@Who: Adarsh singh, @When: 28-Feb-2024, @Why: EWM-16160 -->
export enum DropdownMouseState {
    inside,
    outside,
}
export enum EventType {
    REFRESH,
    SEARCH_CLEAR,
    FILTER,
    ACTION,
    REALOAD_HEADER_CHART_LIST,
    REALOAD_WORKFLOW_STAGES,
}
export enum CommonMethodeType {
    HEADER_DETAILS,
    GET_ALL_STAGES,
    FILTER_CONFIG,
    GET_DATA_WITH_DEFAULT_CONFIG,
    REALOAD_FILTER_STAGES,
    REALOAD_PIECHART_FROM_HEADER,
    REALOAD_FROM_QUICK_FILTER,
    FILTER_CLEAR,
    INPUT_SEARCH,
}
export enum ParentEventType {
    CREATE_ACTIVITY,
    OPEN_CANDIDATE_SUMMARY_OVERLAY,
    SEND_SMS_HISTORY
}
export class ListModeObj {
    JobId: string;
    GridId: string;
    JobFilterParams: any[];
    Search: string;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    WorkflowId: string;
    Longitude: number;
    Latitude: number;
    QuickFilter: string;
    StageId: string;
  }
export enum JobDetailIndexDBList {
    DB_NAME = 'Job_Detail_List', 
    STORE_NAME = 'List'
}
export enum JobDetailIndexDBCard {
    DB_NAME = 'Job_Detail_Card', 
    ALL_STAGE_LIST = 'stage_list', 
    STORE_NAME = 'Card'
}
export enum JobDetailLocalCalculationName {
    LIST_COUNT = 'List_Count', 
    CARD_COUNT = 'Card_Count'
}
export enum GetScreenSize {
    XS = 'XS', 
    SM = 'SM', 
    MD = 'MD', 
    LG = 'LG', 
    XL = 'XL', 
    XXL= 'XXL'
}
export enum ImageSize {
    ICON = 40,
    SMALL = 200,
    MEDIUM = 400
  }

  export interface JobOrderShare {
    JobId: string
    JobTitle: string
    ClientId: string
    ServiceLocationId: string
    ServiceLocation: string
    ServicingOfficeId: string
    ServicingOffice: string
    CandidateId: string
    MemberId: string
    MemberName: string
    QualificationCode: string
    Qualification: string
    From: string
    To: string
    ShiftType: string
    StartTime: string
    EndTime: string
    ContactPersonId?: string
    ContactPersonName: string
    BookingNotes: string
    EOHJobId?: string
  }
  