import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { SidebarService } from './sidebar/sidebar.service';
import {IntegrationURL} from '@app/shared/enums/marketplace.enum';
import { TranslateService } from '@ngx-translate/core';

export interface ResponseData {
  status: string;
  data: any[];
}
@Injectable({
  providedIn: 'root'
})
export class CommonServiesService {
  objectKey = [];
  previewData: any;
  resData: any;
  showlabel:string
  responseMessage: any;
  HtmlMessage: any;
  private baseURL = 'http://dummy.restapiexample.com/api/v1/employees';

  private configUrl = 'https://entdevstaff.entirehr.com.au/Services/EmailDocuments.asmx/GetEmailTemps?userType=CLIENTS';

  constructor(private httpClient: HttpClient, public _sidebarService: SidebarService, private translateService: TranslateService) { };
  fetch(): Observable<ResponseData[]> {
    return this.httpClient.get(this.baseURL) as Observable<ResponseData[]>;
  }


  private fireEvent = new Subject<string>();
  event = this.fireEvent.asObservable();
  emitEvent(dirVal: string) {
    this.fireEvent.next(dirVal);
  }

  fetchClientData(): Observable<ResponseData[]> {
    return this.httpClient.get(this.configUrl) as Observable<ResponseData[]>;
  }

  /*
    @Type: File, <ts>
    @Name: insertHTML function
    @Who: Adarsh Singh
    @When: 13-Dec-2022
    @Why:  
    @What: For convert object ({{}}) into real value
    for using this pattern call this function insertHTML(value, response data) 
  */
  public insertHTML(localMessage, resMessage): void {
    this.HtmlMessage = localMessage;
    this.responseMessage = resMessage;
    let regExp = /{{([^}}]+)\}}/g;
    let matchesResult = this.HtmlMessage.match(regExp);
    this.objectKey = matchesResult;
    this.onReplaceHandler();
  }
  /*
    @Type: File, <ts>
    @Name: onReplaceHandler function
    @Who: Adarsh Singh
    @When: 13-Dec-2022
    @Why:  
    @What: For convert object ({{}}) into real value
  */
  onReplaceHandler(): void {
    this.objectKey.forEach((e: any) => {
      const getReplaceData = this.onReplaceArrayData(e);
      if (getReplaceData != undefined) {
        this.HtmlMessage = this.HtmlMessage.replace(e, getReplaceData);
      }
    });
    this.previewData = this.HtmlMessage;
  }
  /*
    @Type: File, <ts>
    @Name: onReplaceArrayData function
    @Who: Adarsh Singh
    @When: 13-Dec-2022
    @Why:  
    @What: For convert object ({{}}) into real value
  */
  onReplaceArrayData(value) {
    const replaceLeftSideMatchingList = value
      .replaceAll('{{Jobs.', '')
      .replaceAll('{{Candidate.', '')
      .replaceAll('{{Employee.', '');
    // let temp = value.replace('{{Jobs.', '');
    let replaceRightSideMatchingList = replaceLeftSideMatchingList.replace('}}', '');
    return this.responseMessage[replaceRightSideMatchingList];
  }

  /* @When: 23-03-2023 @who:Amit @why: EWM-11380 @what: search enable */
  searchEnableCheck(searchData: any) {
    if (searchData == 1) {
      this._sidebarService.searchEnable.next('1');
    }
    else {
      this._sidebarService.searchEnable.next('0');
    }
  }

  /* @When: 05 March 2024 @who:Adarsh singh @why: EWM-16318 */
  removeDuplicateRecordFromArryObj(arr: any, findBy:string) {
    const unique = arr.filter((obj: any, index: any) => {
      return index === arr.findIndex(o => obj[findBy] === o[findBy]);
    });
    return unique;
  }
  /* @When: 05 March 2024 @who:Adarsh singh @why: EWM-16318 */
  getIntegrationRedirection(integrationId: string, baseURL:string = '/client/core/administrators/integration-interface-board/') {
    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    let findObj = otherIntegrations.find((obj: any) => obj?.RegistrationCode === integrationId);
    let url: string;
    if (findObj) {
      url = `${baseURL}${IntegrationURL[findObj.RegistrationCode as keyof typeof IntegrationURL]}?code=${findObj.RegistrationCode}&name=${findObj.Name}&req=1`;
    }
    return url;
  }

  // Adarsh singh for-16034 on 19 March 2024
  checkOnlyIphoneDevice(){
    return [
      // 'iPad Simulator',
      // 'iPhone Simulator',
      // 'iPod Simulator',
      // 'iPad',
      'iPhone',
      // 'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  }

  // @When: 05-08-2024 @who:Amit & Mukesh Sir @why: EWM-17809 @what: stage name show
  getreplace(param:string,value:any){
    const paragraph = this.translateService.instant(param)
    let result:string='';
    if (paragraph && paragraph.length > 0) {
        const regExp = /\{dynamic_value}/gi
        result = paragraph.replace(regExp, value)
        return result;
      }
  }
  // @When: 05-08-2024 @who:Amit & Maneesh @why: EWM-17817 @what: skill count show
  getreplaceSkill(param:string,value:any,count:number){
    const paragraph = this.translateService.instant(param)
    let result:string='';
    if (paragraph && paragraph.length > 0) {
      const regExp = /\{dynamic_value}/gi
      result = paragraph.replace(regExp, value)
      if (count>0) {
        this.showlabel=count + ' ' + result;
      }else{
        this.showlabel= result;
      }
      return this.showlabel;
    }
  }

}
