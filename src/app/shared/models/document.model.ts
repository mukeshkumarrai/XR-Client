
import { Injectable } from '@angular/core';
@Injectable()
/*--@When:024-08-2023,@who:Nitin Bhati,@why:EWM-13937,@what:For documents */
  export interface DocumentEntity {
    ExpiryDate: number;
    Owner: string;
    IsCollapse: boolean;
    HashParameter: string;
    Hierarchy?: (HierarchyEntity)[] | null;
    AccessModeId: number;
    IsOwner: number;
    IsEditAccess: number;
    SharedOn: number;
    SharedBy: string;
    Children?: (ChildrenEntity)[] | null;
    IsResume: number;
    View: number;
    Edit: number;
    Delete: number;
    UserType: number;
    Comments: string;
    Id: number;
    ParentId: number;
    Name: string;
    CategoryId: number;
    Category: string;
    DocumentId: number;
    DocumentName: string;
    LastActivity: number;
    DocumentType: string;
    UploadDocument: string;
    PreviewUrl: string;
    DocumentSize: string;
    ReferenceId: string;
  }
  export interface HierarchyEntity {
    Id: number;
    Name: string;
    text: string;
  }
  export interface ChildrenEntity {
    AccessModeId: number;
    Category: string;
    CategoryId: number;
    Children?: (ChildrenEntity)[] | null;
  }

  
  
 