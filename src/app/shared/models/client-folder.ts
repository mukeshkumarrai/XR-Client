//who:maneesh,what:ewm-15817,when:29/01/2024
export class ClientFolderMaster {
    Message:string;
    HttpStatusCode:any;
    Data:{
        FolderName: string;
        FolderId: number;
        Description: string;
        Count: number;
        FolderOwner: string;
        GrantAccessList:[];
        AccessId:number;
        };
    PageNumber: number;
    PageSize: number;
    Status: any;
    TotalRecord: number;
}