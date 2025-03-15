export interface EmployeeNotesEntity {
    CandidateId: string;
    NoteTitle: string;
    Description: string;
    NotesDate: string;
    CategoryId: number;
    CategoryName: string;
    Attachment: string;
    AttachmentName: string;
    AccessId: number;
    AccessName: string;
    UserTypeCode: string;
    GrantAccesList: GrantAccesList[];
    CandidateName: string;
    NotesURL: string;
    JobId: string;
    PageName: string;
    Files: File[];
    XRNotifications: XRNotifications;
    NotesContacts?: NotesContact[];
    Id?:number;
    IconName?:string;
    CreateByName?:string;
    AccessDescription?:string;
    CallReferenceId?: number | null;  
  }
 
  export interface NotesContact {
    ContactId: string;
    FirstName: string;
    LastName: string;
  }
  export interface XRNotifications {
    UserProfilePic: string;
    NotifyUser: NotifyUser[];
    NavigateUrl: string;
    CompletePath: string;
  }
  export interface NotifyUser {
    ID: string;
    Name: string;
    ProfilePath: string;
    UserType: string;
    ShortName?:string;
    ProfileImage?:string;
  }
  export interface File {
    Path: string;
    Name: string;
    Size: number;
  }
  export interface GrantAccesList {
    UserId: string;
    EmailId: string;
    UserName: string;
    Id: number;
    Mode: number;
  }

  export interface clientNotesEntity {
    ClientId: string;
    NotesDate: string;
    CategoryId: number;
    Subject: string;
    Description: string;
    Attachment: string;
    AttachmentName: string;
    AccessId: number;
    GrantAccesList: GrantAccesListClient[];
    NotesURL: string;
    Files: File[];
    NotesContacts: NotesContact[];
    XRNotifications: XRNotifications;
    UserTypeCode:string,
    Id?:number
    CallReferenceId?: number | null;  

  }
  interface GrantAccesListClient {
    UserId: string;
    EmailId: string;
    UserName: string;
    MappingId: number;
    Mode: number;
  }

  export interface jobActionNotes {
    JobId: string;
    NotesDate: string;
    CategoryId: number;
    CategoryName: string;
    Subject: string;
    Description: string;
    Attachment?: string;
    AttachmentName?: string;
    AccessId: number;
    AccessName: string;
    GrantAccesList: GrantAccesList[];
    NotesURL: string;
    RelatedToIds: string[];
    WorkflowStageId: string;
    WorkflowStageName: string;
    Files: File[];
    NotesContacts?: NotesContact[];
    XRNotifications: XRNotifications;
  }

 export interface jobActionComment {
    Id?: number;
    JobId: string;
    JobName: string;
    Candidates: string[];
    ParentStageId: string;
    ParentStageName: string;
    ChildStageId: string;
    ChildStageName: string;
    SubChildStageId?: string;
    SubChildStageName?: string;
    Comment: string;
    XRNotifications: XRNotifications;
  }