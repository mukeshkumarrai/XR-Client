
import { Injectable } from '@angular/core';
@Injectable()

export class ResponceData {
  HttpStatusCode: any;
  Data: any;
  Status: any;
  max: number;
  Message: string;
  TotalRecord: number;
  PageNumber: any;
  TotalPages: number;
  data: any;
  EOHResponseMsg:string;
  RetryCount:number

}
export class ValidationError {
  field_name: string;
  error_message: string;
}
