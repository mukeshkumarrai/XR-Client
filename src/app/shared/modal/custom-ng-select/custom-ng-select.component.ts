import { Component, OnInit , Output,  Input, EventEmitter, SimpleChanges, ViewChild} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable, Subscription } from 'rxjs';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { CommonserviceService } from '../../services/commonservice/commonservice.service';

@Component({
  selector: 'app-custom-ng-select',
  templateUrl: './custom-ng-select.component.html',
  styleUrls: ['./custom-ng-select.component.scss']
})
export class CustomNgSelectComponent implements OnInit {
  selectedValue=new FormControl('');
  selected:any;
  selectall:{ Id: 0 };
  /****Modified by renu ! 28th June 2021 |EWM-1895 */
  private _selectedIn: any;
  @Input() set selectedIn(value: string) {
  
    if(value && (Object.keys(value).length === 0)){
    this._selectedIn = null;
   this.detectInputChanges(this._selectedIn)
      }
    else{
       this._selectedIn = value;
       this.detectInputChanges(this._selectedIn);
      }
 }

 get selectedIn(): string {  
  return this._selectedIn;
}

  /****Modified by renu ! 28th June 2021 |EWM-1895 */
  @Input()placeholder;
  @Input()IsRequired:Boolean;
  @Input()IsDisabled:Boolean;  
  @Input()isselectAll:Boolean = false;
  @Input() isErrorMsg:Boolean = false;
  @Output() selectedOut:EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedReset:EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedcountryISO:any;
  pageNumber: any=1;
  pageSize: any=500;
  //countryList: any;
  isReq: Boolean;
  isDis:Boolean;
  @Input() countryList:any;
   @ViewChild(NgSelectComponent) select: NgSelectComponent
  @Input()isCutomeLocationState:string;
  @Input() isCrossIcon:boolean;
  constructor(private profileInfoService: ProfileInfoService,private commonserviceService:CommonserviceService) { 
     this.isReq=this.IsRequired;
     this.isDis = this.IsDisabled;
  }

  ngOnInit(): void {
     //this.getCountryInfo();
     /*-@When:31-07-2023,@why:EWM-13251,@who: Nitin Bhati-*/
    if(this.countryList?.length==0){
      this.getCountryInfo();
     }

     if(this.IsDisabled){
      this.selectedValue.disable();
     }else{
       this.selectedValue.enable();
     }
   // console.log('placeholder',this.placeholder);
   if(this.IsRequired)
   {
     this.selectedValue.setValidators([Validators.required]);
     this.selectedValue.updateValueAndValidity();
   }else{
    this.selectedValue.clearValidators();
   }
  }

  public ngAfterViewInit(): void {
  
  }


  /*
    @Who: Renu
    @When: 28-june-2021
    @Why: EWM-1895
    @What: get detect Input changes from parent
  */

  detectInputChanges(selectedIn)
  {   
   if(selectedIn!=undefined && selectedIn!=null){ 
    let Id=[];
    if(Object.keys(selectedIn)[0]!=='' || Object.keys(selectedIn)[0]!==undefined)
    {
      if(Object.keys(selectedIn)[0]=='Id'){
        if(this.select!=undefined){
        Id=this.select.itemsList.filteredItems.filter(x=>x.value['Id']==selectedIn.Id);
         }
      }else if(Object.keys(selectedIn)[0]=='ISOCode1'){
        if(this.select!=undefined){
        Id=this.select.itemsList.filteredItems.filter(x=>x.value['ISOCode1']==selectedIn.ISOCode1);
        }
      }
      if(Id.length!=0){
        this.selectedOut.emit(Id[0].value);
      }
    }
   }else{   
    this.selectedOut.emit(this.selectedIn);
   }
   
  }

  getValues()
  {
    if(this.selectedIn!=undefined){
      this.selectedOut.emit(this.selectedIn);
    }   
  }
/*
@Who: Adarsh singh
@Name: resetData function
@When: 02-sep-2022
@Why: EWM-8060
@What: Add extra event handler for clear on click in cutome location component
resetData() it will clear other dropdown value like (Country to state)
*/
  resetData(){
    if (this.isCutomeLocationState == 'cutomeLocation') {
      this.selectedReset.emit(this.selectedIn);
    }
  }
  getCountryInfo() {   
    this.profileInfoService.fetchCountryInfo(this.pageNumber, this.pageSize).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.countryList = repsonsedata['Data'];   
         }
      }, err => {
        //console.log(err);
      })
  }

   /*
    @Who: Renu
    @When: 28-june-2021
    @Why: EWM-1895
    @What: to compare objects selected
  */
  compareFn(c1: any, c2:any): boolean {     
    return c1 && c2 ? c1.ISOCode1 === c2.ISOCode1 || c1.Id === c2.Id : c1 === c2; 
}


}
