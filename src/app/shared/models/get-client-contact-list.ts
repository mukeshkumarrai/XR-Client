  // who:maneesh,what:ewm-13766export GetClientContactListModel model, when:13/09/2023
  export  class GetClientContactListModel { 
    GridId:string
    ClientId: string
    Search: string
    PageNumber: number
    PageSize:number
    OrderBy:string
    Filter:string
}
export  class UpdateclientAccess { 
  ClientId:string;
  ClientName: string;
  AccessId: number=0;
  AccessName: String;
  GrantAccessList: [];
  PageURL:string
  
}

