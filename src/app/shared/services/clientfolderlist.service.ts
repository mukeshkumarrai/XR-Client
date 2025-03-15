import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientfolderlistService {

  constructor() { }
    ClientFolderQueryString(searchValue){
      let final_result='';
       if(searchValue){
        final_result = "?Search="+searchValue;
      }
       else{
         final_result = "?Search="+searchValue;
       }
       return  final_result;

      }
}

