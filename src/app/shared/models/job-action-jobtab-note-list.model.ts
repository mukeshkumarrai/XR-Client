  // who:maneesh,what:ewm-13870 export CandidateAddNotes model, when:24/08/2023
  export  class GetNotesListModel { 
    PageNumber: number
    PageSize:number
    OrderBy: string
    GridId: string
    JobId: string
    Year:number
    Month: string
    OwnerIds:OwnerIds []
    CategoryIds: CategoryIds[]
    FromDate: string
    ToDate: string
    NotesFilterParams:NotesFilterParams []
    Search:string 
}
export interface NotesFilterParams {
    ColumnName: string
    ColumnType: string
    FilterValue:string
    FilterOption: string
    FilterCondition:string
}
export interface CategoryIds {

}
export interface OwnerIds {

}
