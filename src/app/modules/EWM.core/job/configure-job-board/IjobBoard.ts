

export interface IJobBoard {
    JobBoardId?: number;
    JobBoardCategoryId?: number;
    JobBoardItemId?: number;
    JobBoardItemName?: string;
    EWMItemList?: IeWMItemList[];
}


export interface IeWMItemList {
    Id?: string;
    Name?: string;
}