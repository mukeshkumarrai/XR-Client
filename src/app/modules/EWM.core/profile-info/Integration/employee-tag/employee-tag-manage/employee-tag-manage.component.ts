/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who:Priti Srivastava
    @When: 12-July-2021
    @Why:EWM-2114
    @What:  This component is used for perform add edit of emplooyee tag.
*/
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { required } from '@rxweb/reactive-form-validators';
import { statusMaster } from 'src/app/modules/EWM.core/shared/datamodels/status-master';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import{EmployeeTagService} from './../../../../shared/services/employeeTag/employee-tag.service'

@Component({
  selector: 'app-employee-tag-manage',
  templateUrl: './employee-tag-manage.component.html',
  styleUrls: ['./employee-tag-manage.component.scss']
})
export class EmployeeTagManageComponent implements OnInit {
  employeeTagtForm:FormGroup;
  statusList:any[];
  disabledCondition=false;
  loading:boolean=false;
  public primaryTxtColor: string;
  viewMode: any;
  activestatus: string;
  disable: boolean;
  submitted: boolean=false;
  employee:any;
  public specialcharPattern = "[A-Za-z0-9 ]+$";
  public defaultColorValue = "#b6b6b6";
  public StatusDataId: any[];
  //<!--@Who: Bantee Kumar,@Why:EWM-11417,@When: 20-Mar-2023 -->

  public StatusDataName:any='Active';
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
  constructor(private fb: FormBuilder,public activateroute:ActivatedRoute,private route: Router,public _sidebarService: SidebarService,
    private commonserviceService:CommonserviceService,private snackBService: SnackBarService,
    private textChangeLngService:TextChangeLngService,
    private translateService: TranslateService,public employeeTagService:EmployeeTagService) { 
    this.employeeTagtForm=this.fb.group({
      DisplaySequence:["",[Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(8)]],
      Code:["",[Validators.required,Validators.maxLength(100),Validators.pattern(this.specialcharPattern),this.noWhitespaceValidator()]],
      DescriptionShort:['',[Validators.required,Validators.maxLength(100),this.noWhitespaceValidator()]],
      Description:['',[Validators.required,Validators.maxLength(200),this.noWhitespaceValidator()]],
      Keyword:['',[Validators.maxLength(100)]],
      ColorCode:[this.defaultColorValue],
      Status:[1,[Validators.required]],  //<!-----@suika@EWM-10681 EWM-10818  @02-03-2023 to set default values for status in master data---->
     // IsBuiltin:[false,[Validators.required]],
      Id:[]
    });
  }

  ngOnInit(): void {
    this.getColorCodeAll();
    //this.employee = this.textChangeLngService.getDataEmployee('singular');
    this.commonserviceService.ononnameManageChangeObs.subscribe(value=>{
      this.employee=value;
     })
    let URL = this.route.url;
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
     URL_AS_LIST = URL.split('/');
    }else
    {
     URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
     this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    // this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
     this._sidebarService.activesubMenuObs.next('masterdata');

     this.activateroute.queryParams.subscribe((params) => {
      if(Object.keys(params).length!=0){
       this.viewMode = params['mode'];
       this.activestatus =  params['View']
      }
     });

     if (this.activateroute.snapshot.params.id != null &&  this.activestatus != 'View') {
       this.editForm();
       this.disable = true;
       this.activestatus = "Edit";
     }else if (this.activateroute.snapshot.params.id != null &&  this.activestatus === 'View') {
      this.activestatus = "View";
      this.editForm();
      this.employeeTagtForm.disable();
      this.disable = true;
      
     }else {
       this.activestatus = "Add";
     }
   
     this.getStatus();
     this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })

     
  }

  onCancel()
  {
   /* this.route.navigate(['./client/core/administrators/employeetag' ], 
    {queryParams: {mode: this.viewMode}});*/
    this.route.navigate(['./client/core/administrators/employeetag' ]);
  }
  getStatus()
  {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
            this.statusList=repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });

  }
  setValue(ev)
  {

  }
  editForm() {
    this.loading = true;
    this.employeeTagService.fetchEmployeeTagById(this.activateroute.snapshot.params.id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          this.employeeTagtForm.patchValue({
            Id: data.Data.Id,
            DisplaySequence:data.Data.DisplaySequence,
            Code:data.Data.Code,
            DescriptionShort:data.Data.DescriptionShort,
            Description:data.Data.Description,
            Keyword:data.Data.Keyword,
            ColorCode:data.Data.ColorCode,
            Status:data.Data.Status
          });
          // who:maneesh,why:ewm-11120 for color picker change variabel defaultColorValue into selctedColor ,when:11/03/2023
          this.selctedColor = (data.Data.ColorCode == null) ? '#ffffff' : data.Data.ColorCode;
          this.StatusDataName = data.Data.StatusName;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })

 }

onSave() {
  this.submitted = true;
  if (this.employeeTagtForm.invalid) {
    return;
  }
  if (this.activestatus == 'Add') {
    this.add(this.employeeTagtForm.value);
  } else {
    this.update(this.employeeTagtForm.value);
  }

}


onNameChanges(checkFor) {
  let Id;
  if (this.activateroute.snapshot.params.id != undefined) {
    Id = this.activateroute.snapshot.params.id;
  } else {
    Id = '';
  }
  if(checkFor=='Code'){
  if (this.employeeTagtForm.controls['Code'].value == '') {
    return false;
  }
}else{
  if (this.employeeTagtForm.controls['DisplaySequence'].value == '') {
    return false;
  }
}
 let duplicacyExist={};
 if(checkFor=='Code'){
  duplicacyExist['Value']=(this.employeeTagtForm.controls['Code'].value);
 }else{
  duplicacyExist['Value']=this.employeeTagtForm.controls['DisplaySequence'].value;
 }

 duplicacyExist['Id']=Number(Id);
 duplicacyExist['CheckFor']=checkFor;
 this.employeeTagService.checkdDuplicay(duplicacyExist).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 402) {
        if (repsonsedata.Status == false) {
          if(checkFor=='Code'){
            this.employeeTagtForm.get("Code").setErrors({ codeTaken: true });
            this.employeeTagtForm.get("Code").markAsDirty();
         
          }else{
            this.employeeTagtForm.get("DisplaySequence").setErrors({ orderTaken: true });
            this.employeeTagtForm.get("DisplaySequence").markAsDirty();
         
          }
            
        } else if (repsonsedata.Status == true) {
          if(checkFor=='Code'){
            this.employeeTagtForm.get("Code").clearValidators();
            this.employeeTagtForm.get("Code").markAsPristine();
            this.employeeTagtForm.get('Code').setValidators([Validators.required, Validators.pattern(this.specialcharPattern),Validators.maxLength(100),this.noWhitespaceValidator()]);
          }else{
            this.employeeTagtForm.get("DisplaySequence").clearValidators();
            this.employeeTagtForm.get("DisplaySequence").markAsPristine();
            this.employeeTagtForm.get('DisplaySequence').setValidators([Validators.pattern("^[0-9]*$"),Validators.maxLength(8)]);
          }
        }

      } else if(repsonsedata['HttpStatusCode']==204)
      {
        if(checkFor=='Code'){
        this.employeeTagtForm.get("Code").clearValidators();
        this.employeeTagtForm.get("Code").markAsPristine();
        this.employeeTagtForm.get('Code').setValidators([Validators.required, Validators.pattern(this.specialcharPattern),Validators.maxLength(100),,this.noWhitespaceValidator()]);
        }else{
          this.employeeTagtForm.get("DisplaySequence").clearValidators();
          this.employeeTagtForm.get("DisplaySequence").markAsPristine();
          this.employeeTagtForm.get('DisplaySequence').setValidators([Validators.pattern("^[0-9]*$"),Validators.maxLength(8)]);
        }     
      } 
      else{
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading=false;
      } 
      // if(checkFor=='Code'){
      //  this.employeeTagtForm.get('StatusCode').updateValueAndValidity();
      // }else{
      //   this.employeeTagtForm.get('Keyword').updateValueAndValidity();
      // }
 
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    });
}






// public onKeywordChanges() {
//   let ID = this.employeeTagtForm.get("Id").value;
//   if (ID == null||ID=='') {
//     ID = 0;
//   } if(this.employeeTagtForm.get("Keyword").value==undefined || this.employeeTagtForm.get("Keyword").value=="")
//   {
//     return;
//   }

//   this.employeeTagService.checkdDuplicayOfKeyword('?Value=' + this.employeeTagtForm.get("Keyword").value + '&Id=' + ID).subscribe(
//     (data: ResponceData) => {
//       if (data.HttpStatusCode == 200) {
//         if (data.Data == true) {
//           this.employeeTagtForm.get("Keyword").setErrors({ codeTakenkey: true });
//           this.employeeTagtForm.get("Keyword").markAsDirty();
//           this.submitted = false;
//         }
//       }
//       else if (data.HttpStatusCode == 204) {
//         if (data.Data == false) {
//           this.employeeTagtForm.get("Keyword").markAsPristine();
//           if(this.employeeTagtForm && this.submitted==true)
//           {  if(this.activestatus=='Add')
//           {
//             this.add(this.employeeTagtForm.value);
//           }
//           else
//           {
//             this.update(this.employeeTagtForm.value);
//           }
//         }
   
//         }
//       }
//       else {
//         this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
//         this.loading = false;
//       }
//     },
//     err => {
//       if (err.StatusCode == undefined) {
//         this.loading = false;
//       }
//       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
//       this.loading = false;
//     });
// }

 add(value) {
   this.loading = true;
   let saveEmployeeTagObj = {};
   let seqOrder: any;
   if (value.DisplaySequence == '' || value.DisplaySequence == null) {
     seqOrder = 0;
   } else {
     seqOrder = value.DisplaySequence;
   }
   saveEmployeeTagObj['DisplaySequence'] = parseInt(seqOrder);
   saveEmployeeTagObj['Code'] = value.Code;
   saveEmployeeTagObj['DescriptionShort'] = value.DescriptionShort;
   saveEmployeeTagObj['Description'] = value.Description;
   saveEmployeeTagObj['Keyword'] = value.Keyword;
    // who:maneesh,why:ewm-11120 for color picker change variabel defaultColorValue into selctedColor ,when:11/03/2023
   saveEmployeeTagObj['ColorCode'] = this.selctedColor;
   saveEmployeeTagObj['Status'] =value.Status;
   saveEmployeeTagObj['StatusName'] = this.StatusDataName;


   this.employeeTagService.createEmployeeTag(saveEmployeeTagObj).subscribe(
     (data: ResponceData) => {
       if (data.HttpStatusCode == 200) {
         this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.onCancel();
        
       } else {
         this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
         this.loading = false;
       }
     }, err => {
       if (err.StatusCode == undefined) {
         this.loading = false;
       }
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       this.loading = false;
     })
 }

 update(value) {
   this.loading = true;
   let updateemployeeTagObj = {};
   let seqOrder: any;
   if (value.DisplaySequence == '' || value.DisplaySequence == null) {
     seqOrder = 0;
   } else {
     seqOrder = value.DisplaySequence;
   }
   updateemployeeTagObj['Id'] = value.Id;
   updateemployeeTagObj['DisplaySequence'] = parseInt(seqOrder);
   updateemployeeTagObj['Code'] = value.Code;
   updateemployeeTagObj['DescriptionShort'] = value.DescriptionShort;
   updateemployeeTagObj['Description'] = value.Description;
   updateemployeeTagObj['Keyword'] = value.Keyword;
    // who:maneesh,why:ewm-11120 for color picker change variabel defaultColorValue into selctedColor ,when:11/03/2023
   updateemployeeTagObj['ColorCode'] = this.selctedColor;
   updateemployeeTagObj['Status'] =value.Status;
   updateemployeeTagObj['StatusName'] = this.StatusDataName;


   this.employeeTagService.updateEmployeeTag(updateemployeeTagObj).subscribe(
     (data: ResponceData) => {
       if (data.HttpStatusCode == 200) {
         this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
         this.onCancel();
       } else {
         this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
         this.loading = false;
       }
     }, err => {
       if (err.StatusCode == undefined) {
         this.loading = false;
       }
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       this.loading = false;
     });
 }

 reloadApiBasedOnorg() {
   this.route.navigate(['./client/core/profile/integration/employeetag']);
 }

   /* 
   @Type: File, <ts>
   @Name: onChange function
   @Who: Adarsh Singh
   @When: 07-07-2022
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
   @Name: clickStatusID function
   @Who: Adarsh singh
   @When: 22-Aug-2022
   @Why: EWM-8238
   @What: For status Click event
*/

 clickStatusID(Id) {
  this.StatusDataId = this.statusList.filter((dl: any) => dl.StatusId == Id);
  this.StatusDataName = this.StatusDataId[0].StatusName;
}

/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 05-jan-2023
   @Why: EWM-10101
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
  @Why: EWM-11120
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
  @Why: EWM-11120
  @What: for which coor we have choose
*/
onSelectColor(codes: any) {
  if(codes){
    this.selctedColor = codes.colorCode;
    this.employeeTagtForm.patchValue({
      ColorCode: this.selctedColor
    })
  }else{
    this.employeeTagtForm.patchValue({
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
  @Why: EWM-11120
  @What: selecting color on change
*/
onChaneColor(e: any) {
  this.color = e.target.value;
  this.selctedColor = e.target.value;
  this.employeeTagtForm.patchValue({
    ColorCode: this.selctedColor
  })
}
/*
  @Type: File, <ts>
  @Name: closeTemplate funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11120
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
  @Why: EWM-11120
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
