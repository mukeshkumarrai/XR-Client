import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';

@Component({
  selector: 'app-custom-ng-select-phonecode',
  templateUrl: './custom-ng-select-phonecode.component.html',
  styleUrls: ['./custom-ng-select-phonecode.component.scss']
})
export class CustomNgSelectPhonecodeComponent implements OnInit {
  selectedValue=new FormControl('');
  @Input() placeholder;
  items=[{id:1,name:'Acc'},{id:2,name:'Bss'}];
  selected:any;
  @Input() selectedIn:any;
 /* private _selectedIn: any;
  @Input() set selectedIn(value: number) {
  
    if(value && (Object.keys(value).length === 0)){
     this._selectedIn = null;
     this.detectInputChanges(this._selectedIn);
      }
    else{
       this._selectedIn = value;
       this.detectInputChanges(this._selectedIn);
      }
 }
 
 get selectedIn(): number { 
   return this._selectedIn;
 }*/

  @Input()IsRequired:Boolean;
  @Input()IsDisabled:Boolean;
  @Output() selectedOut:EventEmitter<any> = new EventEmitter<any>();
  pageNumber: any=1;
  pageSize: any=500;
  //countryList: any=[];
  isReq: Boolean;
  isDis:Boolean;
  data$: any;
  @Input() countryList:any;
  constructor(private profileInfoService: ProfileInfoService) { 
     this.isReq=this.IsRequired;
     this.isDis = this.IsDisabled;
  }

  ngOnInit(): void {
    /*-@When:26-07-2023,@why:EWM-13251,@who: Nitin Bhati-*/
    if(this.countryList?.length==0){
     this.getCountryInfo();
    }
    //this.getCountryInfo();
    
    if(this.IsDisabled){
      this.selectedValue.disable();
     }else{
       this.selectedValue.enable();
     }
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

  getValues()
  {
    // this.selectedOut.emit(this.selectedIn);
    if(this.selectedIn!=undefined){
      this.selectedOut.emit(this.selectedIn);
    }else{
      this.selectedOut.emit(this.selectedIn);
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


  
  detectInputChanges(selectedIn)
  {   
   if(selectedIn!=undefined && selectedIn!=null){ 
    this.selectedOut.emit(selectedIn);
   }else{
    this.selectedOut.emit(this.selectedIn);
   }
  }
}
