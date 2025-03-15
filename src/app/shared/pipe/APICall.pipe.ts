import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { CommonserviceService } from '../services/commonservice/commonservice.service';
import { CacheServiceService } from '../services/commonservice/CacheService.service';

@Pipe({
  name: 'apiCallPipe',

})
export class APICallPipe implements PipeTransform {
  private data: any = null;
  private cache = new Map<string, any>();
  constructor(private http: HttpClient,private commonserviceService: CommonserviceService,
    private CacheService : CacheServiceService) { }
  transform(id: string): any {
    let sessionStoragedata = sessionStorage.getItem(id);
    if(sessionStoragedata !=null){
           return  sessionStoragedata;
    }else{
      this.commonserviceService.getUserDetailsByID().subscribe(result => {

        this.data = result['Data'];
        sessionStorage.setItem(id, this.data.UserFirstName);

        return  this.data.UserFirstName;
      });
    }


  }

}
