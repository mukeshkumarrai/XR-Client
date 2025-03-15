import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { Industry } from '../../industry/model/industry';

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.scss']
})
export class ManageCustomerComponent implements OnInit {

  addForm: FormGroup;
  submitted = false;
  InputValue :any;
  public loading:boolean=false;
  public actionStatus: string = 'Add';
  public customerJsonObj = {};
  public codePattern = '^[A-Z]{5,20}$';
  public isHideExternally :number = 1;
  public isBuiltIn :number = 0;
  public scorePattern =   new RegExp(/^(?:100(?:\.0)?|\d{1,3}(?:\.\d{1,2})?)$/);
  tempID : string;
  public statusList:any=[];
  public customerId;
  viewModeValue: any;  
  public namePattern =  new RegExp(/^[a-zA-Z\s]{1,50}$/);
  constructor(private fb: FormBuilder,private router: Router,private route: ActivatedRoute,
    public industryService:SystemSettingService,private snackBService: SnackBarService,
    private commonserviceService:CommonserviceService, public _sidebarService: SidebarService,
    private translateService: TranslateService) {  
    this.addForm = this.fb.group({
      Id: [''],
      type: ['',[Validators.required,Validators.pattern(this.namePattern)]],
      status: ["1",Validators.required], //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->    
    });
   }


  ngOnInit(): void {
    let URL = this.router.url;
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
     URL_AS_LIST = URL.split('/');
    }else
    {
     URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);

    this.getStatusList();
    this.route.params.subscribe(
      params => {
        if (params['id'] != undefined) {
        this.actionStatus = 'Edit'
        this.tempID = params['id'];
        this.editForm(this.tempID);
        }else{
          this.customerId = localStorage.getItem('customerId');         
        }
      });

      this.route.queryParams.subscribe((params) => { 
        this.viewModeValue = params['viewModeData'];
         })
       
  }




/* 
 @Type: File, <ts>
 @Name: editForm function
 @Who: Suika
 @When: 19-June-2021
 @Why: ROST-1904
 @What: For setting value in the edit form
*/

editForm(Id:String){
  this.loading = true;
  this.industryService.getCustomerById('?id=' + Id).subscribe(
    (data: ResponceData) => {
      this.loading = false;    
      if (data['HttpStatusCode'] == 200) {   
        this.addForm.patchValue({ 
          Id: Id,
          type: data.Data.TypeName,
          status: data.Data.Status.toString()
        });   
      }else if (data['HttpStatusCode'] == 400) {  
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
       
      } else {       
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
       
      }
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
     
    })
}




  onSave(value,actionStatus){
    this.submitted = true;  
    if (this.addForm.invalid) {
      return;
    }
    if (actionStatus == 'Add') {
      this.createCustomer(value);
    } else {
      this.updateCustomer(value);
    }
  

  }

  createCustomer(value){
    this.loading=true; 
    let customerId;
    if(this.tempID!= undefined){
      customerId=this.tempID;
    }else
    {
      customerId='0';
    }
    this.customerJsonObj['Id'] = parseInt(customerId); 
    this.customerJsonObj['TypeName']  = value.type;
    this.customerJsonObj['Status']  = parseInt(value.status);
    this.industryService.createCustomer(this.customerJsonObj).subscribe(repsonsedata=>{     
      if(repsonsedata['HttpStatusCode']==200)
      {
        this.loading=false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);     
        // let viewModeData: any = this.viewModeValue;
        // this.router.navigate(['./client/core/administrators/customer-master'], {
        //   queryParams: { viewModeData }
        // }) 
        this.router.navigate(['./client/core/administrators/customer-master']);
       
      } else if(repsonsedata['HttpStatusCode']==400)
      {
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading=false;
      }
      else{
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading=false;
      }
    },
    err=>{
      if(err.StatusCode==undefined)
      {
        this.loading=false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading=false;
  });
   
  }

  updateCustomer(value){ 
    this.loading=true; 
    let customerId;
    if(this.tempID!= undefined){
      customerId=this.tempID;
    }else
    {
      customerId='0';
    }
    this.customerJsonObj['Id'] = parseInt(customerId); 
    this.customerJsonObj['TypeName']  = value.type;
    this.customerJsonObj['Status']  = parseInt(value.status);
    this.industryService.updateCustomerById(this.customerJsonObj).subscribe(repsonsedata=>{ 
      if(repsonsedata['HttpStatusCode']==200)
      {
        this.loading=false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        
        // let viewModeData: any = this.viewModeValue;
        // this.router.navigate(['./client/core/administrators/customer-master'], {
        //   queryParams: { viewModeData }
        // }) 
        this.router.navigate(['./client/core/administrators/customer-master']);
       
      } else if(repsonsedata['HttpStatusCode']==400)
      {
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading=false;
      }
      else{
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading=false;
      }
    },
    err=>{
      if(err.StatusCode==undefined)
      {
        this.loading=false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading=false;
  });
   
  }

  onCancel(e){
   e.preventDefault();
   this.addForm.reset();
   this.actionStatus = 'Add';
  //  let viewModeData: any = this.viewModeValue;
  //  this.router.navigate(['./client/core/administrators/customer-master'], {
  //    queryParams: { viewModeData }
  //  }) 
   this.router.navigate(['./client/core/administrators/customer-master']);

  }
 



  
/*
@Type: File, <ts>
@Name: onCodeChanges function
@Who:  Suika
@When: 13-May-2021
@Why: EWM-1506
@What: This function is used for checking duplicacy for code 
*/


onTypeChanges()
{
  let alreadyExistCheckObj = {};
  let customerId;
  if(this.tempID!= undefined){
    customerId=this.tempID;
  }else
  {
    customerId=0;
  }
  alreadyExistCheckObj['id'] = customerId; 
  alreadyExistCheckObj['typename']  = this.addForm.get("type").value; 
 if(this.addForm.get("type").value){
  this.industryService.checkCustomerIsExist(alreadyExistCheckObj).subscribe(
    repsonsedata=>{    
       if(repsonsedata['HttpStatusCode']==200)
      {
        if(repsonsedata['Data'] == true) {
          this.addForm.get("type").setErrors({ codeTaken: true });
          this.addForm.get("type").markAsDirty();

        }else if(repsonsedata['Data'] == false) {
          this.addForm.get("type").clearValidators();
          this.addForm.get("type").markAsPristine();
          this.addForm.get('type').setValidators([Validators.required,Validators.pattern(this.namePattern)]);
        
        }
      }
      else if(repsonsedata['HttpStatusCode']==400)
      {
          this.addForm.get("type").clearValidators();
          this.addForm.get("type").markAsPristine();
          this.addForm.get('type').setValidators([Validators.required,Validators.pattern(this.namePattern)]);
                 
      }

      else{
      // <!--  @Who: maneesh, @When: 20-june-2023,for when duplicate value enter then popup comment  -->
        // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading=false;
      }
    },
    err=>{
      if(err.StatusCode==undefined)
      {
        this.loading=false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading=false;
  });
}
else
{
  this.addForm.get('type').setValidators([Validators.required,Validators.pattern(this.namePattern)]);
         
}
this.addForm.get('type').updateValueAndValidity();
 } 


 setDefaultSignature(e){
   if(e.checked===false){
   this.isHideExternally = 0;
   }else{
   this.isHideExternally = 1;
   }

 }

 setDefaultBuilInSignature(e){   
  if(e.checked===false){
   this.isBuiltIn = 0;
  }else{
  this.isBuiltIn = 1;
  }
 }





 /* 
   @Type: File, <ts>
   @Name: getStatusList function
   @Who:  Suika
   @When: 20-May-2021
   @Why: ROST-1452
   @What: For status listing 
  */
 getStatusList() {
  this.commonserviceService.getStatusList().subscribe(
    (repsonsedata: Industry) => {
      if (repsonsedata.HttpStatusCode === 200) {
          this.statusList=repsonsedata.Data;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}


}

