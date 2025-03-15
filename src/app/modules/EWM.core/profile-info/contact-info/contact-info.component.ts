/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash
  @When: 16-Nov-2020
  @Why: ROST-365 ROST-396
  @What:  This page will be use for the contact info Component ts file
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileInfoService } from '../../shared/services/profile-info/profile-info.service';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {

  /****************Decalaration of Global Variables*************************/
  public loadingPopup: boolean;
  pageNumber = 1
  pageSize = '200'
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  countryList:any = [];
  countryBuffer = [];
  contactFrom: FormGroup;
  submitted = false;
  status: boolean = false;
  loading: boolean;
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  public emailPattern:string; //= '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public mobilePattern : string;//= '^[0-9]*$';
  public numberPattern  : string;// = '^[0-9]*$';
  public maxCharacterLengthSubHead = 115;
  moreCountry: any;
  selectedValue: any;
  selectedHomeNumberValue:any;
  selectedMobileNumberValue:any;
  selectedContactNumberValue:any;
  defaultCountryCode: number;
  defaultCountryId: number;
  CountryStatus:boolean=false;
/*
  @Type: File, <ts>
  @Name: constructor function
  @Who: Renu
  @When: 16-Nov-2020
  @Why: ROST-316
  @What: constructor for injecting services and formbuilder and other dependency injections
  */
  constructor(private profileInfoService: ProfileInfoService, private fb: FormBuilder, private route: Router,
    private snackBService: SnackBarService, public _sidebarService: SidebarService,
     private translateService: TranslateService,private commonserviceService: CommonserviceService,private appSettingsService:AppSettingsService) {
    /**************************@suika@EWM-10675 EWM-10947 only fullname and rekationshiop is required***************************** */
    this.mobilePattern = this.appSettingsService.phoneNumberPattern;
    this.emailPattern=this.appSettingsService.emailPattern;
    this.numberPattern = this.appSettingsService.phoneNumberPattern;
    console.log(this.mobilePattern,"mobilePattern");
    console.log(this.numberPattern,"numberPattern");
    this.contactFrom = this.fb.group({
      UserId: [''],
      sameasAbove:[''],
      Address_1: ['', [Validators.minLength(2), Validators.maxLength(30), Validators.pattern(this.specialcharPattern)]],
      Address_2: ['', [Validators.minLength(2), Validators.maxLength(100)]],
      Country: [''],
      CountryName: [''],
      ContactNumberCode:[''],
      HomeNumberCode:[''],
      MobileNumberCode:[''],
      City: ['', [Validators.minLength(2), Validators.maxLength(30), Validators.pattern(this.specialcharPattern)]],
      State: ['', [Validators.minLength(2), Validators.maxLength(30), Validators.pattern(this.specialcharPattern)]],
      Zipcode: ['', [Validators.pattern(this.numberPattern), Validators.maxLength(10)]],
      KinRelationShip: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(12), Validators.pattern(this.specialcharPattern)]],
      KinFullAddress: ['', [ Validators.minLength(2), Validators.maxLength(100)]],
      KinFullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(this.specialcharPattern)]],
      KinContactNumber: ['', [Validators.pattern(this.mobilePattern), Validators.minLength(10), Validators.maxLength(12)]],
      KinEmailid: ['', [Validators.pattern(this.emailPattern), Validators.email]],
      UserPhone: ['', [Validators.pattern(this.mobilePattern), Validators.minLength(10), Validators.maxLength(12)]],
      HomeNumber: ['', [Validators.pattern(this.mobilePattern), Validators.minLength(6), Validators.maxLength(12)]]
    })
   

    
  }

  clickEvent() {
    this.status = !this.status;
  }

  ngOnInit() {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.getCountryInfo();
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if(value!==null)
      {
          this.reloadApiBasedOnorg();
      }
     })
//@suika@EWM-10675 EWM-10947 to set default values for phone code and country 
     this.defaultCountryCode = this.appSettingsService.defaultCountryCode;
     this.defaultCountryId = this.appSettingsService.defaultCountryId;
     this.selectedContactNumberValue=Number(this.defaultCountryId);
     this.selectedHomeNumberValue=Number(this.defaultCountryId);
     this.selectedMobileNumberValue=Number(this.defaultCountryId);
     this.ddlContactNumberChange(this.selectedContactNumberValue);
     this.ddlHomeNumberChange(this.selectedHomeNumberValue);
     this.ddlMobileNumberChange(this.selectedMobileNumberValue);
  
  }

  router(url) {
    this.route.navigate(['./client/' + url]);
  }

  /*
  @Type: File, <ts>
  @Name: getCountryInfo
  @Who: Renu
  @When: 16-Nov-2020
  @Why: ROST-316
  @What: to get all country related info
  */
  getCountryInfo() {
    this.profileInfoService.fetchCountryInfo(this.pageNumber, this.pageSize).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.countryList = repsonsedata['Data'];
          this.CountryStatus=true;
          this.getContactInfo();
        }
      }, err => {
        this.loading = false;
        //console.warn(err);
      })
  }
/*
  @Type: File, <ts>
  @Name: onScrollToEnd
  @Who: Nitin Bhati
  @When: 16-March-2021
  @Why: EWM-1051
  @What: to scroll all country related info
  */
  onScrollToEnd() {
    this.fetchMore();
    this.fetchMoreCountry();
}
/*
  @Type: File, <ts>
  @Name: onScroll
  @Who: Nitin Bhati
  @When: 16-March-2021
  @Why: EWM-1051
  @What: to scroll all country related info
  */
onScroll({ end }) {
  if (this.loading || this.countryList.length <= this.countryBuffer.length) {
      return;
  }
  if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.countryBuffer.length) {
      this.fetchMore();
  }
}
/*
  @Type: File, <ts>
  @Name: fetchMoreCountry
  @Who: Nitin Bhati
  @When: 16-March-2021
  @Why: EWM-1051
  @What: to scroll all country related info
  */
private fetchMoreCountry() {
  this.loadingPopup=false;
 this.pageNumber = this.pageNumber + 1;
    this.profileInfoService.fetchCountryInfo(this.pageNumber , this.pageSize).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.moreCountry = repsonsedata['Data'];
          this.countryList = this.countryList.concat(this.moreCountry);
          this.loadingPopup=false;
        
       }
      }, err => {
        this.loadingPopup=false;
      })
  
}

/*
  @Type: File, <ts>
  @Name: fetchMore
  @Who: Nitin Bhati
  @When: 16-March-2021
  @Why: EWM-1051
  @What: to scroll all country related info
  */
private fetchMore() {
  this.loadingPopup=false;
  const len = this.countryBuffer.length;
  const more = this.countryList.slice(len, this.bufferSize + len);
  if(!more){
    this.pageNumber = this.pageNumber + 1
    this.profileInfoService.fetchCountryInfo(this.pageNumber , this.pageSize).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.moreCountry = repsonsedata['Data'];
          this.countryList = this.countryList.concat(this.moreCountry);
          this.loadingPopup=false;
         
        }
      }, err => {
        this.loadingPopup=false;
        this.loading = false;
      })
  }
  //this.loading = true;
  // using timeout here to simulate backend API delay
  setTimeout(() => {
      //this.loading = false;
      this.countryBuffer = this.countryBuffer.concat(more);
  }, 200)
}

  // getCountryInfoScroll() {
  //   this.profileInfoService.fetchCountryInfo(1,5).subscribe(
  //     repsonsedata => {
  //       if (repsonsedata['HttpStatusCode'] == '200') {
  //         this.countryList = repsonsedata['Data'];
  //         this.countryBuffer = this.countryList.slice(0, this.bufferSize)
  //       }
  //     }, err => {
  //  
  //     })
  // }
/*
  @Type: File, <ts>
  @Name: updateContactDetails
  @Who: Renu
  @When: 16-Nov-2020
  @Why: ROST-316
  @What: to update contact related info
  */
  updateContact(value) {
    var removeJsonId = value;
    removeJsonId['HomeNumber'] = value.HomeNumberCode+'-'+value.HomeNumber;  
    removeJsonId['UserPhone'] = value.MobileNumberCode+'-'+value.UserPhone;
    removeJsonId['KinContactNumber'] = value.ContactNumberCode+'-'+value.KinContactNumber;
    // <!---------@When: 12-07-2023 @who:Adarsh singh @why: EWM-11868 --------->
    removeJsonId['IsSameAsAbove'] = value.sameasAbove ? 1 : 0;
    removeJsonId['CountryName'] = value.CountryName;
    delete value['sameasAbove']; 
    // End 
    this.submitted = true;
    if (this.contactFrom.invalid) {
      return;
    } else {
      this.loading = true;
      value['Country'] = String(value['Country']);
      this.profileInfoService.updateContactDetails(JSON.stringify(value)).subscribe(
        repsonsedata => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode == 200) {
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
         
        })
    }
  }

  /*
  @Type: File, <ts>
  @Name: getContactInfo
  @Who: Renu
  @When: 16-Nov-2020
  @Why: ROST-316
  @What: get user contact Info list
  */
  getContactInfo() {
    this.loading = true;
    this.profileInfoService.fetchContactInfo().subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata['HttpStatusCode'] == '200') {
          if(repsonsedata['Data']['KinContactNumber']!=null){ 
          var ContactNumber = repsonsedata['Data']['KinContactNumber'].split("-");
          var ContactNumberCode = ContactNumber[0];
          var KinContactNumber =  ContactNumber[1];
          this.selectedContactNumberValue=Number(ContactNumberCode);
          this.ddlContactNumberChange(this.selectedContactNumberValue);
          }else{
            //@suika@EWM-10675 EWM-10947 to set default values for phone code and country
            var ContactNumberCode = Number(this.defaultCountryId);
            var KinContactNumber =  "";
            this.selectedContactNumberValue=Number(this.defaultCountryId);
            this.ddlContactNumberChange(this.selectedContactNumberValue);
          }
          if(repsonsedata['Data']['HomeNumber']!=null){ 
          var HomeNumber = repsonsedata['Data']['HomeNumber'].split("-");
          var HomeNumberCode = HomeNumber[0];
          var HomeNumbers  = HomeNumber[1];          
           this.selectedHomeNumberValue=Number(HomeNumberCode);
           this.ddlHomeNumberChange(this.selectedHomeNumberValue);
          }else{
            //@suika@EWM-10675 EWM-10947 to set default values for phone code and country
            var HomeNumberCode = Number(this.defaultCountryId);
            var HomeNumbers =  "";
            this.selectedHomeNumberValue=Number(this.defaultCountryId);
            this.ddlHomeNumberChange(this.selectedHomeNumberValue);
          }
          if(repsonsedata['Data']['UserPhone']!=null){ 
          var UserPhone = repsonsedata['Data']['UserPhone'].split("-");
          var MobileNumberCode = UserPhone[0];
          var MobileNumber  = UserPhone[1];
          this.selectedMobileNumberValue=Number(MobileNumberCode);
          this.ddlMobileNumberChange(this.selectedMobileNumberValue);
          }else{
            //@suika@EWM-10675 EWM-10947 to set default values for phone code and country
            var MobileNumberCode = Number(this.defaultCountryId);
            var MobileNumber =  "";
            this.selectedMobileNumberValue=Number(this.defaultCountryId);
            this.ddlMobileNumberChange(this.selectedMobileNumberValue);
          }
          
          this.contactFrom.patchValue({
            'UserId': repsonsedata['Data']['UserId'],
            'Address_2': repsonsedata['Data']['Address_2'],
            'Address_1': repsonsedata['Data']['Address_1'],
            'City': repsonsedata['Data']['City'],
            'Country': Number(repsonsedata['Data']['Country']),
            'State': repsonsedata['Data']['State'],
            'Zipcode': repsonsedata['Data']['Zipcode'],
            'KinRelationShip': repsonsedata['Data']['KinRelationShip'],
            'KinFullAddress': repsonsedata['Data']['KinFullAddress'],
            'KinFullName': repsonsedata['Data']['KinFullName'],           
            'KinEmailid': repsonsedata['Data']['KinEmailid'],
            'KinContactNumber': KinContactNumber,
            'ContactNumberCode': ContactNumberCode,
            'UserPhone': MobileNumber,
            'MobileNumberCode': MobileNumberCode,
            'HomeNumber': HomeNumbers,
            'HomeNumberCode': HomeNumberCode,
            'sameasAbove': repsonsedata['Data']['IsSameAsAbove'],
          });
          // <!---------@When: 12-07-2023 @who:Adarsh singh @why: EWM-11868 --------->
          if (repsonsedata['Data']['IsSameAsAbove'] === 1) {
            this.contactFrom.controls["KinFullAddress"].disable();
          }
          // End 
          if(repsonsedata['Data']['Country']!=null){ 
            this.selectedValue={'Id':Number(repsonsedata['Data']['Country']), 'CountryName': repsonsedata['Data']['CountryName']};         
            this.ddlchange(this.selectedValue);
          }else{
            //@suika@EWM-10675 EWM-10947 to set default values for phone code and country
            this.selectedValue={'Id':Number(this.defaultCountryId)};
            this.ddlchange(this.selectedValue);
          }
                   
        


          if(repsonsedata['Data']['KinContactNumber']===null){ 
            this.contactFrom.patchValue({          
            'ContactNumberCode': Number(this.defaultCountryId)  //@suika@EWM-10675 EWM-10947 to set default values for phone code and country
          })}else{
            this.contactFrom.patchValue({
            'ContactNumberCode':ContactNumberCode
            })
          }

          if(repsonsedata['Data']['HomeNumber']===null){ 
            this.contactFrom.patchValue({          
            'HomeNumberCode': Number(this.defaultCountryId)  //@suika@EWM-10675 EWM-10947 to set default values for phone code and country
          })}else{
            this.contactFrom.patchValue({
            'HomeNumberCode':HomeNumberCode
            })
          }


          if(repsonsedata['Data']['UserPhone']===null){ 
            this.contactFrom.patchValue({          
            'MobileNumberCode': Number(this.defaultCountryId) //@suika@EWM-10675 EWM-10947 to set default values for phone code and country
          })}else{
            this.contactFrom.patchValue({
            'MobileNumberCode':MobileNumberCode
            })
          }



        }
      }, err => {
        this.loading = false;
      })
  }

  getsearchDataList(event: any)
 {
  this.loadingPopup=true;
   if(event.target.value){
     this.profileInfoService.fetchCountryInfoSearch(event.target.value).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.countryList = repsonsedata['Data'];
          this.loadingPopup=false;
        }
      }, err => {
        this.loadingPopup=false;
        this.loading = false;
      })
     
   }else{
     this.pageNumber = 1;
     this.getCountryInfo();
     this.loadingPopup=false;
   }
 }

 /*
    @Type: File, <ts>
    @Name: reloadApiBasedOnorg function
    @Who: Renu
    @When: 13-Apr-2021
    @Why: EWM-1356
    @What: Reload Api's when user change organization
  */

    reloadApiBasedOnorg(){
      this.getCountryInfo();
      this.getContactInfo();
    }
    /*
  
    @Who: priti
    @When: 11-june-2021
    @Why: EWM-1806
    @What: get selected data
  */
    // ddlchange(data)
    // {     
    //  // console.log("data "+data.Id);
    //   if(data.Id==null || data.Id=="" || data.Id==undefined)
    //   {
    //     this.contactFrom.get("Country").setErrors({ required: true });
    //     this.contactFrom.get("Country").markAsTouched();
    //     this.contactFrom.get("Country").markAsDirty();
    //   }
    //   else
    //   {
    //     this.contactFrom.get("Country").clearValidators();
    //     this.contactFrom.get("Country").markAsPristine();
    //     this.selectedValue=data;
    //     this.contactFrom.patchValue(
    //       {
    //         Country:data.Id
    //       }
    //     )
    //   }
    // }
    ddlchange(data) {
     // console.log(data,"data");
      //@suika@EWM-10675 EWM-10947 only fullname and rekationshiop is required
      if (data == null || data == "" || data==undefined) {
        //this.contactFrom.get("Country").setErrors({ required: true });
        this.contactFrom.get("Country").markAsTouched();
        this.contactFrom.get("Country").markAsDirty();
      }
      else {
        this.contactFrom.get("Country").clearValidators();
        this.contactFrom.get("Country").markAsPristine();
        this.selectedValue = data;
        this.contactFrom.patchValue(
          {
            Country: data?.Id,
            CountryName: data?.CountryName
          }
        )
      }
    }

    

     /*
  
    @Who: priti
    @When: 11-june-2021
    @Why: EWM-1806
    @What: get selected data
  */
 ddlHomeNumberChange(data)
 {  
   if(data==null || data=="" || data==undefined)
   {
        //@suika@EWM-10675 EWM-10947 only fullname and rekationshiop is required
     //this.contactFrom.get("HomeNumberCode").setErrors({ required: true });
     this.contactFrom.get("HomeNumberCode").markAsTouched();
     this.contactFrom.get("HomeNumberCode").markAsDirty();
   }
   else
   {
     this.contactFrom.get("HomeNumberCode").clearValidators();
     this.contactFrom.get("HomeNumberCode").markAsPristine();
     this.selectedHomeNumberValue=data;
     this.contactFrom.patchValue(
       {
        // HomeNumberCode:data.HomeNumberCode
        HomeNumberCode:data

       }
     )  
   }
 }



  /*
  
    @Who: priti
    @When: 11-june-2021
    @Why: EWM-1806
    @What: get selected data
  */
 ddlMobileNumberChange(data)
 {
   if(data==null || data=="")
   {
        //@suika@EWM-10675 EWM-10947 only fullname and rekationshiop is required
     //this.contactFrom.get("MobileNumberCode").setErrors({ required: true });
     this.contactFrom.get("MobileNumberCode").markAsTouched();
     this.contactFrom.get("MobileNumberCode").markAsDirty();
   }
   else
   {
     this.contactFrom.get("MobileNumberCode").clearValidators();
     this.contactFrom.get("MobileNumberCode").markAsPristine();
     this.selectedMobileNumberValue=data;
     this.contactFrom.patchValue(
       {
        MobileNumberCode:data
       }
     )
   }
 }


  /*
  
    @Who: priti
    @When: 11-june-2021
    @Why: EWM-1806
    @What: get selected data
  */
 ddlContactNumberChange(data)
 {
   //console.log(data,"data");
   if(data==null || data=="")
   {
        //@suika@EWM-10675 EWM-10947 only fullname and rekationshiop is required
     //this.contactFrom.get("ContactNumberCode").setErrors({ required: true });
     this.contactFrom.get("ContactNumberCode").markAsTouched();
     this.contactFrom.get("ContactNumberCode").markAsDirty();    
   }
   else
   {
     this.contactFrom.get("ContactNumberCode").clearValidators();
     this.contactFrom.get("ContactNumberCode").markAsPristine();
     this.selectedContactNumberValue=data;
     this.contactFrom.patchValue(
       {
        ContactNumberCode:data
       }
     )
   }
 }

  /*
  
    @Who: suika
    @When: 28-feb-2023
    @Why: EWM-10675
    @What: copy address data
  */
 copyAddress(event){
if (event.checked === true) {
  let val = this.contactFrom.getRawValue();
  const Address_1 = val.Address_1 ? val.Address_1 + ',' : '';
  const City = val.City ? val.City + ',' : '';
  const Address_2 = val.Address_2 ? val.Address_2 + ',' : '';
  const Country = val.CountryName ? val.CountryName + ',' : '';
  const State = val.State ? val.State + ',' : '';
  const Zipcode = val.Zipcode ? val.Zipcode + '' : '';
  // <!---------@When: 12-07-2023 @who:Adarsh singh @why: EWM-11868 --------->
  this.contactFrom.controls["KinFullAddress"].disable();
  this.contactFrom.patchValue({
    KinFullAddress: Address_1 + City + Address_2 + Country + State + Zipcode
  })
  
}else{
  this.contactFrom.patchValue({
    KinFullAddress:''
  })
  this.contactFrom.controls["KinFullAddress"].enable();
}

 
 }
}
