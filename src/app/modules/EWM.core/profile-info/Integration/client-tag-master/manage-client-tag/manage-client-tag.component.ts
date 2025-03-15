/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: manage-client-tag-master.component.ts
  @Who: Renu
  @When: 13-July-2021
  @Why: ROST-2104
  @What: client tag master edit/add manage forms
 */

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { statusList } from '../../../../shared/datamodels/common.model';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { ResponceData } from 'src/app/shared/models';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { IfStmt } from '@angular/compiler';
import { statusMaster } from 'src/app/modules/EWM.core/shared/datamodels/status-master';

@Component({
  selector: 'app-manage-client-tag',
  templateUrl: './manage-client-tag.component.html',
  styleUrls: ['./manage-client-tag.component.scss']
})
export class ManageClientTagComponent implements OnInit {
/**********************All generic variables declarations for accessing any where inside functions********/
clientTagForm: FormGroup;
public loading:boolean=false;
public activestatus: string = 'Add';
public primaryBgColor:string;
public  tempID: number;
public submitted = false;
public clientTagObj = {};
public specialcharPattern = "[A-Za-z0-9 ]+$";
public  statusList: any=[];
public viewMode: any;
public codePattern =  new RegExp(/^[A-Z0-9]{1,20}$/); //^[A-Z0-9]{1,20}$
visibility:number=0;
public visibilityID:number;
visibilityStatus = false;
client:any;
  disabled: boolean=false;
  public defaultColorValue = "#b6b6b6";
  // color picker varibale 
  showColorPallateContainer = false;
  color: any = '#2883e9'
  selctedColor = '#b6b6b6';
  themeColors:[] = [];
  standardColor: [] = [];
  overlayViewjob = false;
  isOpen = false;
  isMoreColorClicked!: boolean;
  // color picker End
/* 
@Type: File, <ts>
@Name: constructor function
@Who: Renu
@When: 18-May-2021
@Why: ROST-2104
@What: For injection of service class and other dependencies
*/
constructor(private fb: FormBuilder,private translateService: TranslateService,private router: ActivatedRoute,
  private snackBService: SnackBarService,private clientTagService:ProfileInfoService,private route:Router, 
  private textChangeLngService:TextChangeLngService,
  public _sidebarService: SidebarService,private commonserviceService:CommonserviceService ) {
  this.clientTagForm = this.fb.group({
    ID: [''],
    StatusCode: ['', [Validators.required,Validators.pattern(this.specialcharPattern),Validators.maxLength(100),this.noWhitespaceValidator()]],
    ShortDescription: ['', [Validators.required,Validators.maxLength(100),this.noWhitespaceValidator()]],
    Description:['',[Validators.maxLength(200),Validators.required,this.noWhitespaceValidator()]],
    ColorCode:[],
    Order:['',[Validators.pattern("^[0-9]*$"),Validators.maxLength(8),Validators.required]],
   // IsBuiltIn: [true],
    Keyword:['',[Validators.maxLength(100)]],
    status: [null,[Validators.required]]
  });
  //  this.primaryBgColor = localStorage.getItem('HeaderBackground');
  }
  ngOnInit(): void {
   // this.client=this.textChangeLngService.getData('singular'); 
   this.getColorCodeAll();
   this.commonserviceService.ononnameManageChangeObs.subscribe(value=>{
    this.client=value;
   })
    this.getStatusList();
    let URL = this.route.url;
   // let URL_AS_LIST = URL.split('/');
   let URL_AS_LIST;
   if(URL.substring(0, URL.indexOf("?"))==''){
    URL_AS_LIST = URL.split('/');
   }else
   {
    URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
   }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.router.queryParams.subscribe(
      params => {
        if (params['Id'] != undefined && params['View']!='View') {
          this.activestatus = 'Edit'
          this.disabled=false;
          this.tempID = params['Id'];
          this.visibilityID = parseInt(params['R']);
          this.editForm(this.tempID);
        }else if(params['Id'] != undefined && params['View']=='View'){
          this.activestatus = 'View';
          this.tempID = params['Id'];
          this.editForm(this.tempID);
          this.clientTagForm.disable();
          this.disabled=true;
        }
         else {
          this.disabled=false;
          this.activestatus = 'Add';
        }
        if(params['V'] != undefined)
        {
          this.viewMode=params['V'];
        }
      });


       //<!-----@suika@EWM-10681 EWM-10818  @02-03-2023 to set default values for status in master data---->
      this.clientTagForm.patchValue({
        status:"1"
      })
  }
  /*
 @Type: File, <ts>
 @Name: editForm function
 @Who: Renu
 @When: 18-May-2021
 @Why: ROST-2104
 @What: For setting value in the edit form
*/
  editForm(Id: Number) {
    this.loading = true;
    this.clientTagService.getClientTagByID( '?Id=' + Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.clientTagForm.patchValue({
            ID: data.Data.Id,
            StatusCode: data.Data.Code,
            ShortDescription: data.Data.ShortDescription,
            Description: data.Data.Description,
            Keyword: data.Data.Keyword,
            Order: data.Data.DisplaySequence,
            //IsBuiltIn: Boolean(data.Data.IsBuiltin),
            status: String(data.Data.Status),
            ColorCode :(data.Data.ColorCode == null) ? '#ffffff' : data.Data.ColorCode

          });
          // who:maneesh,why:ewm-11119 patch color value ,when:11/03/2023
          this.selctedColor = (data.Data.ColorCode == null) ? '#ffffff' : data.Data.ColorCode
        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
     @Type: File, <ts>
     @Name: onSave function
     @Who: Renu
     @When: 18-May-2021
     @Why: ROST-2104
     @What: For checking wheather the data save or edit on the basis on active satatus
    */
  onSave(value) {
    this.submitted = true;
    if (this.clientTagForm.invalid) {
      return;
    }
    this.checkCodeKeywordUnique('Code', true)
  }
  /*
     @Type: File, <ts>
     @Name: createClientTagMaster function
     @Who: Renu
     @When: 18-May-2021
     @Why: ROST-2104
     @What: For saving data for status master
    */
  createClientTagMaster(value: any) {
    this.loading = true;
   // let isBuiltIn: any;
    let seqOrder: any;
    // if (value.IsBuiltIn == true) {
    //   isBuiltIn = 1;
    // } else {
    //   isBuiltIn = 0;
    // }
    if (value.Order == '' || value.Order == null) {
      seqOrder = 0;
    } else {
      seqOrder = value.Order;
    }
    
    this.clientTagObj['Keyword'] = value.Keyword;
    this.clientTagObj['Code'] = value.StatusCode;
    this.clientTagObj['ShortDescription'] = value.ShortDescription;
    this.clientTagObj['Description'] = value.Description;
    // who:maneesh,why:ewm-11119 change color picker variabel defaultColorValue into selctedColor ,when:10/03/2023
    this.clientTagObj['ColorCode'] = this.selctedColor;
    this.clientTagObj['DisplaySequence'] = parseInt(seqOrder);
    //this.clientTagObj['IsBuiltin'] = parseInt(isBuiltIn);
    this.clientTagObj['Status'] = parseInt(value.status);
    this.clientTagService.clientTagCreate(this.clientTagObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        //this.route.navigate(['./client/core/administrators/client-tag-master'], { queryParams: {V:this.viewMode } });
        this.route.navigate(['./client/core/administrators/client-tag-master']);
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  /*
   @Type: File, <ts>
   @Name: updateClientTagMaster function
   @Who: Renu
   @When: 18-May-2021
   @Why: ROST-2104
   @What: For saving data for status master
  */
  updateClientTagMaster(value: any) {
    let updateClientTagObj = {};
    this.loading = true;
   // let isBuiltIn: any;
    let seqOrder: any;
    // if (value.IsBuiltIn == true) {
    //   isBuiltIn = 1;
    // } else {
    //   isBuiltIn = 0;
    // }
    if (value.Order == '' || value == null) {
      seqOrder = 0;
    } else {
      seqOrder = value.Order;
    }
    updateClientTagObj['Id'] = value.ID;
    updateClientTagObj['Code'] = value.StatusCode;
    updateClientTagObj['ShortDescription'] = value.ShortDescription;
    updateClientTagObj['Description'] = value.Description;
     // who:maneesh,why:ewm-11119 change color picker variabel defaultColorValue into selctedColor ,when:10/03/2023
    updateClientTagObj['ColorCode'] = this.selctedColor;
    updateClientTagObj['DisplaySequence'] = parseInt(seqOrder);
    //updateClientTagObj['IsBuiltin'] = parseInt(isBuiltIn);
    updateClientTagObj['Status'] = parseInt(value.status);
    updateClientTagObj['Keyword'] =value.Keyword;
    this.clientTagService.updateClientTag(updateClientTagObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.route.navigate(['./client/core/administrators/client-tag-master']);
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
       // this.route.navigate(['./client/core/administrators/client-tag-master'], { queryParams: { V:this.viewMode } });
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });
  }
  /*
     @Type: File, <ts>
     @Name: checkCodeKeywordUnique function
     @Who: Renu
     @When: 18-May-2021
     @Why: ROST-2104
     @What: For checking duplicacy for code
    */
  checkCodeKeywordUnique(checkFor, isSave:boolean) {
    let Id;
    if (this.tempID != undefined) {
      Id = this.tempID;
    } else {
      Id = '';
    }
    if(checkFor=='Code'){
    if (this.clientTagForm.controls['StatusCode'].value == '') {
      return false;
    }
  }
  // else{
  //   if (this.clientTagForm.controls['Order'].value == '') {
  //     return false;
  //   }
  // }
   let duplicacyExist={};
   if(checkFor=='Code'){
    duplicacyExist['Value']=this.clientTagForm.controls['StatusCode'].value;
   }else{
    duplicacyExist['Value']=this.clientTagForm.controls['Order'].value; 
   }
   duplicacyExist['Id']=Number(Id);
   duplicacyExist['CheckFor']=checkFor;
    this.clientTagService.checkCodeKeywordDuplicacy(duplicacyExist).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 402) {
          if (repsonsedata.Status == false) {
            if(checkFor=='Code'){
              this.clientTagForm.get("StatusCode").setErrors({ statusCodeTaken: true });
              this.clientTagForm.get("StatusCode").markAsDirty();
              this.submitted = false;
            }
            // else{
            //   this.clientTagForm.get("Order").setErrors({ orderTaken: true });
            //   this.clientTagForm.get("Order").markAsDirty();
           
            // }
          }
        } else if(repsonsedata['HttpStatusCode']==204 && repsonsedata.Status == true) 
        {
          if(checkFor=='Code'){
          this.clientTagForm.get("StatusCode").clearValidators();
          this.clientTagForm.get("StatusCode").markAsPristine();
          this.clientTagForm.get('StatusCode').setValidators([Validators.required, Validators.pattern(this.specialcharPattern),Validators.maxLength(100),this.noWhitespaceValidator()]);
          }
          // else{
          //   this.clientTagForm.get("Order").clearValidators();
          //   this.clientTagForm.get("Order").markAsPristine();
          //   this.clientTagForm.get('Order').setValidators([Validators.pattern("^[0-9]*$"),Validators.maxLength(8)]);
          // } 
          
          if (this.clientTagForm && this.submitted == true && isSave===true){ 
            if(this.clientTagForm && this.submitted == true && this.activestatus == 'Add'){
              this.createClientTagMaster(this.clientTagForm.value);;
            }else{
              this.updateClientTagMaster(this.clientTagForm.value);
            }    
          }
        } 
        else{
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading=false;
        } 
        // if(checkFor=='Code'){
        //  this.clientTagForm.get('StatusCode').updateValueAndValidity();
        // }else{
        //   this.clientTagForm.get('Keyword').updateValueAndValidity();
        // }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  /* 
   @Type: File, <ts>
   @Name: getStatusList function
   @Who: Renu
   @When: 20-May-2021
   @Why: ROST-2104
   @What: For status listing 
  */
   getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: statusList) => {
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

    /* 
   @Type: File, <ts>
   @Name: onChange function
   @Who: Adarsh Singh
   @When: 06-07-2022
   @Why: EWM-7363 EWM-7607
   @What: For change color on chnage while select color
*/
public onChange(getColor: string): void {
  const color = getColor;
  const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
  const hex = `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1)}`;
  this.defaultColorValue = hex;
}
/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 05-jan-2023
   @Why: EWM-10103
   @What: Remove whitespace
*/

noWhitespaceValidator(): ValidatorFn {  
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value as string || '')?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
// color picker start 
/*
  @Type: File, <ts>
  @Name: showColorPallate funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11119
  @What: for open color picker dropdown
*/
showColorPallate(e:any) { 
  this.overlayViewjob=!this.overlayViewjob;
  this.showColorPallateContainer = !this.showColorPallateContainer;
}
/*
  @Type: File, <ts>
  @Name: onSelectColor funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11119
  @What: for which coor we have choose
*/
onSelectColor(codes: any) {
  if(codes){
    this.selctedColor = codes.colorCode;
    this.clientTagForm.patchValue({
      ColorCode: this.selctedColor
    })
  }else{
    this.clientTagForm.patchValue({
      ColorCode: null
    })
    this.selctedColor = null;
  }
  
}
/*
  @Type: File, <ts>
  @Name: onChaneColor funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11119
  @What: selecting color on change
*/
onChaneColor(e: any) {
  this.color = e.target.value;
  this.selctedColor = e.target.value;
  this.clientTagForm.patchValue({
    ColorCode: this.selctedColor
  })
}
/*
  @Type: File, <ts>
  @Name: closeTemplate funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11119
  @What: close dropdown while click on more label
*/
closeTemplate() {
  this.showColorPallateContainer = true;
  this.isMoreColorClicked = true;
  setTimeout(() => {
    this.isMoreColorClicked = false;
  }, 100);
}
/*
  @Type: File, <ts>
  @Name: getColorCodeAll funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11119
  @What: get all custom color code from config file
*/
  getColorCodeAll() {
    this.loading = true;
    this.commonserviceService.getAllColorCode().subscribe((data: statusMaster) => {
      this.loading = false;
      this.themeColors = data[0]?.themeColors;
      this.standardColor = data[1]?.standardColors;
    },
      err => {
        this.loading = false;
      })
  }
// color picker End  
}
