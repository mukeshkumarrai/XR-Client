// who:maneesh,what:ewm-16064 for contact histroy when:23/02/2024
export class SendSmsData {
    PhoneList:ToPhone[]
    Subject:string;
    MessageBody:string
    Provider:string
    Type:string
    UserType:string;
    JobName:string;
    JobId:string;
}
export interface ToPhone { 
    Name:string;
    Id:string;
    ToPhone
  }