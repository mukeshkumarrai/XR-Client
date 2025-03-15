/*
  @(C): Entire Software
  @Type: ts
  @Who: Mukesh
  @When: 20-Dec-2022
  @Why: change filter data in QueryString
  @What:
*/

import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { handleError } from '../../helper/exception-handler';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class FilterService {

  constructor() { }
  /*
    @Type: File, <ts>
    @Name: FilterQueryString
    @Who: Mukesh Kumar Rai
    @When: 20-Dec-2022
    @Why: EWM-8746 EWM-8889
    @What: make filter   for QueryString
    */
    FilterQueryString(data,searchValue,sortingValue,otherParams:any[]){ /* modified by : renu @why:9844 ewm-10187 @when:04-05-2023*/
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
        let ParamValue = value['ValueName'];
        temp += Field+ '$' + condition+ '$' + ParamValue  + '~' ;
      });
        let result:string[] | void[];
        result = temp.split("~");
        result.pop();
          //  <!-- @Who: bantee ,@When: 18-09-2023, @Why: EWM-14057 ,What: Managing kendo grid via data state -->

      let final_result='';
       if(sortingValue){
        final_result = '?XeopleFilter='+result.join("~")+"&Search="+searchValue+'&OrderBy='+sortingValue+'&'+otherparam;}
       else{
         final_result = '?XeopleFilter='+result.join("~")+"&Search="+searchValue+'&'+otherparam;
       }
       return  final_result;

      }

      // VxtFilterQueryString(data,searchValue,sortingValue,otherParams:any[]){ //by maneesh for vxt
      //   let otherparam:string='';
      //   otherParams?.forEach(function (x,i) {
      //     Object.keys(x).map(function(k){
      //       otherparam+=k+'='+ x[k]+'&';
      //       })
      //   })
      //   otherparam.slice(0,-1);
      //   let lastIndex = otherparam.lastIndexOf("&");
      //   otherparam = otherparam.substring(0, lastIndex);
      //     let temp:string='';
      //     data?.forEach(function (value) {
      //     let Field = value['ColumnName'];
      //     let condition = value['FilterOption'];
      //     let ParamValue = value['ValueName'];
      //     temp += Field+ '$' + condition+ '$' + ParamValue  + '~' ;
      //   });
      //     let result:string[] | void[];
      //     result = temp.split("~");
      //     result.pop();
      //       //  <!-- @Who: bantee ,@When: 18-09-2023, @Why: EWM-14057 ,What: Managing kendo grid via data state -->
  
      //   let final_result='';
      //    if(sortingValue){
      //     final_result = '?GlobalFilter='+result.join("~")+"&Search="+searchValue+'&OrderBy='+sortingValue+'&'+otherparam;}
      //    else{
      //      final_result = '?GlobalFilter='+result.join("~")+"&Search="+searchValue+'&'+otherparam;
      //    }
      //    return  final_result;
  
      //   }
        VxtFilterQueryString(data,searchValue,sortingValue,otherParams:any[]){
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
            final_result = '?GlobalFilter='+result.join("~")+"&Search="+searchValue+'&OrderBy='+sortingValue+'&'+otherparam;}
           else{
             final_result = '?GlobalFilter='+result.join("~")+"&Search="+searchValue+'&'+otherparam;
           }
           return  final_result;  
    
          }
}
