import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';

@Component({
  selector: 'app-custom-ng-select-currency',
  templateUrl: './custom-ng-select-currency.component.html',
  styleUrls: ['./custom-ng-select-currency.component.scss']
})
export class CustomNgSelectCurrencyComponent implements OnInit {
  items=[{id:1,name:'Acc'},{id:2,name:'Bss'}];
  selected:any;
  @Input() selectedIn:any;
  @Input()IsRequired:Boolean;
  @Input()IsDisabled:Boolean;
  @Input()placeholder;
  @Input() isErrorMsg:Boolean = false;
  @Output() selectedOut:EventEmitter<any> = new EventEmitter<any>();
  pageNumber: any=1;
  pageSize: any=500;
  currencyList: any;
  isReq: Boolean;
  isDis:Boolean;
  selectedValue=new FormControl('');

  constructor(private profileInfoService: ProfileInfoService) { 
     this.isReq=this.IsRequired;
     this.isDis = this.IsDisabled;
  }

  ngOnInit(): void {
    this.getCountryInfo();
    //console.log('defaultCountry',this.placeholder);
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

  getValues()
  {
    this.selectedOut.emit(this.selectedIn);
  }
  
  getCountryInfo() {
    this.profileInfoService.getCurrency(this.pageNumber,this.pageSize).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.currencyList = repsonsedata['Data'];
        }
      }, err => {
        //console.log(err);
      })
  }
}
