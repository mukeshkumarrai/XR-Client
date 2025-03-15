import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../../../shared/helper/exception-handler';
import { BehaviorSubject, Observable } from 'rxjs';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { formatDate } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class PushCandidateEOHService {
  SetPushCandPageType = new BehaviorSubject<number>(null);
  SetAlreadyPushCandInfo = new BehaviorSubject<number>(null);
  SetOfficeChangeAlert = new BehaviorSubject<boolean>(null);


  constructor(private http:HttpClient,private serviceListClass:ServiceListClass) { }

  
  /* @Name: getEOHIndustryMaster @Who: renu @When: 31-jan-2023 @Why:EWM-15844 EWM-15869 @What: get Industry list*/
  getEOHIndustryMaster(pagesize: number, searchVal: string) {
    return this.http.get(this.serviceListClass.getIndustryList + '?pageSize=' + pagesize +'&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

    /* @Name: getEOHQualMaster @Who: renu @When: 31-jan-2023 @Why:EWM-15844 EWM-15869 @What: get Qualification list*/
    getEOHQualMaster(pagesize: number, searchVal: string,IndustryId:string) {
      return this.http.get(this.serviceListClass.getQualificationList + '?pageSize=' + pagesize +'&search=' + searchVal+'&IndustryId='+IndustryId,{ headers: new HttpHeaders({ EOHAuth: 'EOH' }) }).pipe(
        retry(1),
        catchError(handleError)
      );
    }

     /* @Name: getEOHTitleMaster @Who: renu @When: 31-jan-2023 @Why:EWM-15844 EWM-15869 @What: get Title list*/
     getEOHTitleMaster() {
      return this.http.get(this.serviceListClass.getTitleMaster).pipe(
        retry(1),
        catchError(handleError)
      );
    }
    
    
     /* @Name: getGenralInfoCandidateById @Who: renu @When: 31-jan-2023 @Why:EWM-15844 EWM-15869 @What: get candidate General Information*/
     getGenralInfoCandidateById(candidateId:string) {
      return this.http.get(this.serviceListClass.getCandidateInfoById+candidateId).pipe(
        retry(1),
        catchError(handleError)
      );
    }
    
  /* @Name: pushCandidateToEOH @Who: renu @When: 19-Sept-2023 @Why:EWM-13752 EWM-14378 @What: push candidate to EOH*/
  pushCandidateToEOH(formdata: {}): Observable<any> {
    return this.http.post(this.serviceListClass.pushCandidateToEOH,formdata).pipe(
      retry(1),
      catchError(handleError)
    );
   
  }
  /* @Name: pushCandidateToEOHV2 @Who: renu @When: 26-05-2024 @Why:EWM-17104 EWM-17209 @What: push candidate to EOH from job action*/
  pushCandidateToEOHV2(formdata: {}): Observable<any> {
    return this.http.post(this.serviceListClass.pushCandidateToEOHV2,formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  async generateExcel(data: any[]) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    let downloadObj=data[0];
      let keys = ['applicantId', 'Title', 'FirstName', 'FamilyName', 'Gender', 'DOB', 'Email', 'CountryCode', 'MobileNo',
        'FullAddress','Street', 'SuburbName', 'CountryName', 'StateName', 'PostCode', 'Industry','Qualification', 'HowDidYouHear','httpstatus','message'];
      let result = data.map(o => keys.map(k => o[k]));
      const header =['Applicant  Id', 'Title', 'First Name', 'Last Name',  'Gender', 'DOB', 'Email',
      'Country Code', 'Phone No', 'Street Address','Address Line 1', 'District/Suburb', 'Country', 'State','Postalcode', 'Industry', 'Qualification', 
      'How did you hear about us', 'Status', 'Status Message'];
      const headerRow = worksheet.addRow(header);
      result.forEach((d, i) => {
        const row = worksheet.addRow(d);
       const status = row.getCell(19);
       let bgcolor: string;
       let fgColor: string;
      if (status.value == 200) {
        status.value='SUCCESS';
        bgcolor = 'ffffff';
        fgColor='ffffff';
      }else{
        status.value='FAILED';
        bgcolor = 'ff0000';
        fgColor='C00000';
      }
      [19,20].map(x=>worksheet.getCell(worksheet.rowCount,x).fill= { type: 'pattern',
      pattern: 'solid',
      fgColor:{argb:fgColor},
      bgColor:{argb:bgcolor}})
      }
      );
      
      worksheet.columns.forEach(column => {
        column.width = 30;
      });
      // Generate Excel File with given name
      workbook.xlsx.writeBuffer().then((result: any) => {
      const blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'XeopleSharePersonnel_EOH_'+downloadObj?.FirstName+' '+downloadObj?.FamilyName+'_'+formatDate(new Date(),'ddMMYYYYHHmm','en_US')+'.xlsx');
    });
  }
  
  /* @Name: getCandidateActivitiesById @Who: renu @When: 22-05-2023 @Why:EWM-17107 EWM-17173 @What: get candidate Activites*/
  getCandidateActivitiesById(candidateId:string) {
    return this.http.get(this.serviceListClass.getCandidateActivitiesById+candidateId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /* @Name: getScreeningInterviewStatus @Who: renu @When: 22-05-2023 @Why:EWM-17107 EWM-17173 @What: get candidate interview Screening status*/
   getScreeningInterviewStatus(params:string) {
    return this.http.get(this.serviceListClass.getScreeningInterviewStatus+params).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  pushCandidateToEOHV2Member(formdata: {}): Observable<any> {
    return this.http.post(this.serviceListClass.pushCandidateToEOHV2Member,formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  }
  
