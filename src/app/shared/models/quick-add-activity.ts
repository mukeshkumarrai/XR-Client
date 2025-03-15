
/*
   @Type: ts
   @Name: CreateActivity
   @Who: Adarsh singh
   @When: 31-Aug-2023
   @Why: export quick add acivity
*/
export interface CreateActivity {
    ActivityTitle: string
    RelatedUserType: string
    RelatedUserTypeName: string
    RelatedUserId: string
    RelatedUserUserName: string
    CategoryId: number
    CategoryName: string
    ScheduleActivity: ScheduleActivity
    Location: string
    OptionalAttendeesList: OptionalAttendeesList[]
    AttendeesList: AttendeesList[]
    OrganizersList: OrganizersList[]
    ActivityUrl: string
    AccessId: number
    AccessName: string
    Description: string
    GrantAccesList: any[]
    IsAttachment: number
    Files: File[]
    ActivityCoreUrl: string
    MeetingPlatformId: string
    MeetingPlatform: string
    MeetingId: string
    IsSendCalendarInviteToAttendees: number
    IsSendEmailToAttendees: number
    ReplaceTag: ReplaceTag[]
  }

  
  export interface ScheduleActivity {
    TimeZone: string
    DateStart: string
    TimeStart: string
    DateEnd: string
    TimeEnd: string
  }
  
  export interface OptionalAttendeesList {
    Id: string
    Name: string
    Email: string
  }
  
  export interface AttendeesList {
    Id: string
    Name: string
    Email: string
  }
  
  export interface OrganizersList {
    Id: number
    Email: string
    UserId: string
    UserName: string
    UserTypeCode: string
    PeopleType: string
    RoleCode: string
    Role: string
    AccessLevelId: number
    AccessLevel: string
    SiteAccess: number
    LastSignIn: number
    EmployeeTag: number
    ProfileImageUrl: string
    PhoneNo: string
  }
  
  export interface File {
    Path: string
    Preview: string
    Name: string
    Size: number
  }
  
  export interface ReplaceTag {
    Id: string
    ObjectType: string
  }