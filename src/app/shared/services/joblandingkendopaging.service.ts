
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class JoblandingkendopagingService {

  constructor() { }
  /*
    @Type: File, <ts>
    @Name: FilterQueryString
    @Who: Mukesh Kumar Rai
    @When: 20-Dec-2022
    @Why: EWM-8746 EWM-8889
    @What: make filter   for QueryString
    */
    QueryString(data,searchValue,sortingValue,otherParams:any[]){ /* modified by : renu @why:9844 ewm-10187 @when:04-05-2023*/
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
        final_result = '?GFilter='+result.join("~")+"&Search="+searchValue+'&OrderBy='+sortingValue+'&'+otherparam;}
       else{
         final_result = '?GFilter='+result.join("~")+"&Search="+searchValue+'&'+otherparam;
       }
       return  final_result;  

      }
}

