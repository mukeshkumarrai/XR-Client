import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class EmployeelistkendopagingService {

  constructor() { }
    QueryString(data,searchValue,sortingValue,otherParams:any[]){
      let otherparam:string='';
      otherParams?.forEach(function (x,i) {
        Object.keys(x).map(function(k){
          otherparam+=k+'='+ x[k]+'&';
          })
      })
      otherparam.slice(0,-1);
      let lastIndex = otherparam.lastIndexOf("&");
      otherparam = otherparam.substring(0, lastIndex);
        let temp:string='';
        data?.forEach(function (value) {          
        let Field = value['ColumnName'];
        let condition = value['FilterOption'];
        let ParamValue = value['FilterValue'];
        temp += Field+ '$' + condition+ '$' + ParamValue  + '~' ;
      });
        let result:string[] | void[];
        result = temp.split("~");
        result.pop();

      let final_result='';
       if(sortingValue){
        final_result = '?GlobalFilter='+result.join("~")+"&Search="+searchValue +'&'+otherparam;}
       else{
         final_result = '?GlobalFilter='+result.join("~")+"&Search="+searchValue+'&'+otherparam;
       }
       return  final_result;  

      }
}


