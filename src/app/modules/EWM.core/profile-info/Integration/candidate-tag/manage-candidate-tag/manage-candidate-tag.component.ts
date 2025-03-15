/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who:Priti Srivastava
    @When: 14-July-2021
    @Why:EWM-2109
    @What:  This component is used for perform add edit of candidate tag.
*/
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { statusMaster } from 'src/app/modules/EWM.core/shared/datamodels/status-master';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import{CandidateTagService} from './../../../../shared/services/candidateTag/candidate-tag.service';

@Component({
  selector: 'app-manage-candidate-tag',
  templateUrl: './manage-candidate-tag.component.html',
  styleUrls: ['./manage-candidate-tag.component.scss']
})
export class ManageCandidateTagComponent implements OnInit {
  candidateTagForm:FormGroup;
  statusList:any[];
  disabledCondition=false;
  loading:boolean=false;
  public primaryTxtColor: string;
  viewMode: any;
  activestatus: string;
  disable: boolean;
  submitted: boolean=false;
  public specialcharPattern = "[A-Za-z0-9 ]+$";
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

  constructor(private fb: FormBuilder,public activateroute:ActivatedRoute,private route: Router,public _sidebarService: SidebarService,
    private commonserviceService:CommonserviceService,private snackBService: SnackBarService,
    private translateService: TranslateService,public candidateTagService:CandidateTagService) {
    this.candidateTagForm=this.fb.group({
      DisplaySequence:['',[Validators.pattern("^[0-9]*$"),Validators.maxLength(8),Validators.min(0)]],
      //  @Who: maneesh, @When: 04-jan-2023,@Why: EWM-10099 add noWhitespaceValidator 
      Code:['',[Validators.required,Validators.maxLength(100),Validators.pattern(this.specialcharPattern),this.noWhitespaceValidator()]],
      DescriptionShort:['',[Validators.required,Validators.maxLength(100),this.noWhitespaceValidator()]],
      Description:['',[Validators.required,Validators.maxLength(200),this.noWhitespaceValidator()]],
      Keyword:['',[Validators.maxLength(100)]],
      ColorCode:[this.defaultColorValue],
      Status:[1,[Validators.required]], //<!-----@suika@EWM-10681 EWM-10818  @02-03-2023 to set default values for status in master data---->
      Id:[] 
  }); }

  ngOnInit(): void {let URL = this.route.url;
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
     } else if (this.activateroute.snapshot.params.id != null &&  this.activestatus === 'View'){
      
      this.activestatus = "View";
      this.editForm();
      this.candidateTagForm.disable();
     }
     else {
       this.activestatus = "Add";
     }
     
   
     this.getStatus();
     this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })
    
    this.getColorCodeAll();  
  }
  onCancel()
  {
    this.route.navigate(['./client/core/administrators/candidatetag' ], 
    {queryParams: {mode: this.viewMode}});
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
    this.candidateTagService.fetchCandidateTagById(this.activateroute.snapshot.params.id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          this.candidateTagForm.patchValue({
            Id: data.Data.Id,
            DisplaySequence:data.Data.DisplaySequence,
      Code:data.Data.Code,
      DescriptionShort:data.Data.DescriptionShort,
      Description:data.Data.Description,
      Keyword:data.Data.Keyword,
      ColorCode:data.Data.ColorCode,
      Status:data.Data.Status,
      IsBuiltin:data.Data.IsBuiltin==1?true:false,
          });
          // who:maneesh,why:ewm-11118 for color picker change varibel when:11/03/2023
          // this.defaultColorValue = (data.Data.ColorCode == null) ? '#ffffff' : data.Data.ColorCode
          this.selctedColor = (data.Data.ColorCode == null) ? '#ffffff' : data.Data.ColorCode


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
onSave()
{this.submitted = true;
 if (this.candidateTagForm.invalid) {
   return;
 }
 if (this.activestatus == 'Add') {
   this.add(this.candidateTagForm.value);
 } else {
   this.update(this.candidateTagForm.value);
 }
}
// public onNameChanges() {
//   let ID = this.candidateTagForm.get("Id").value;
//   if (ID == null||ID=='') {
//     ID = 0;
//   }
//   this.candidateTagService.checkdDuplicay('?code=' + this.candidateTagForm.get("Code").value + '&id=' + ID).subscribe(
//     (data: ResponceData) => {
//       if (data.HttpStatusCode == 402) {
//         if (data.Data == false) {
//           this.candidateTagForm.get("Code").setErrors({ codeTaken: true });
//           this.candidateTagForm.get("Code").markAsDirty();
//           this.submitted = false;
//         }
//       }
//       else if (data.HttpStatusCode == 204) {
//         if (data.Data == true) {
//           this.candidateTagForm.get("Code").markAsPristine();
//           if(this.candidateTagForm && this.submitted==true)
//           {  if(this.activestatus=='Add')
//           {
//             this.add(this.candidateTagForm.value);
//           }
//           else
//           {
//             this.update(this.candidateTagForm.value);
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

onNameChanges(checkFor) {
  let Id;
  if (this.activateroute.snapshot.params.id != undefined) {
    Id = this.activateroute.snapshot.params.id;
  } else {
    Id = '';
  }
  if(checkFor=='Code'){
  if (this.candidateTagForm.controls['Code'].value == '') {
    return false;
  }
}else{
  if (this.candidateTagForm.controls['DisplaySequence'].value == '') {
    return false;
  }
}
 let duplicacyExist={};
 if(checkFor=='Code'){
  duplicacyExist['Value']=(this.candidateTagForm.controls['Code'].value);
 }else{
  duplicacyExist['Value']=this.candidateTagForm.controls['DisplaySequence'].value;
 }

 duplicacyExist['Id']=Number(Id);
 duplicacyExist['CheckFor']=checkFor;
 this.candidateTagService.checkdDuplicay(duplicacyExist).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 402) {
        if (repsonsedata.Status == false) {
          if(checkFor=='Code'){
            this.candidateTagForm.get("Code").setErrors({ codeTaken: true });
            this.candidateTagForm.get("Code").markAsDirty();
         
          }else{
            this.candidateTagForm.get("DisplaySequence").setErrors({ orderTaken: true });
            this.candidateTagForm.get("DisplaySequence").markAsDirty();
         
          }
            
        } else if (repsonsedata.Status == true) {
          if(checkFor=='Code'){
            this.candidateTagForm.get("Code").clearValidators();
            this.candidateTagForm.get("Code").markAsPristine();
            this.candidateTagForm.get('Code').setValidators([Validators.required, Validators.pattern(this.specialcharPattern),Validators.maxLength(100),,this.noWhitespaceValidator()]);
          }else{
            this.candidateTagForm.get("DisplaySequence").clearValidators();
            this.candidateTagForm.get("DisplaySequence").markAsPristine();
            this.candidateTagForm.get('DisplaySequence').setValidators([Validators.pattern("^[0-9]*$"),Validators.maxLength(8)]);
          }
        }

      } else if(repsonsedata['HttpStatusCode']==204)
      {
        if(checkFor=='Code'){
        this.candidateTagForm.get("Code").clearValidators();
        this.candidateTagForm.get("Code").markAsPristine();
        this.candidateTagForm.get('Code').setValidators([Validators.required, Validators.pattern(this.specialcharPattern),Validators.maxLength(100),,this.noWhitespaceValidator()]);
        }else{
          this.candidateTagForm.get("DisplaySequence").clearValidators();
          this.candidateTagForm.get("DisplaySequence").markAsPristine();
          this.candidateTagForm.get('DisplaySequence').setValidators([Validators.pattern("^[0-9]*$"),Validators.maxLength(8)]);
        }     
      } 
      else{
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading=false;
      } 
      // if(checkFor=='Code'){
      //  this.candidateTagForm.get('StatusCode').updateValueAndValidity();
      // }else{
      //   this.candidateTagForm.get('Keyword').updateValueAndValidity();
      // }
 
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    });
}

add(value) {
  this.loading = true;
  // const formData = new FormData();
  // var removeJsonId = value;
  // delete removeJsonId.Id;
  // removeJsonId.IsBuiltin=removeJsonId.IsBuiltin?1:0;

  let saveCandidateTagObj = {};
  let seqOrder: any;
  if (value.DisplaySequence == '' || value.DisplaySequence == null) {
    seqOrder = 0;
  } else {
    seqOrder = value.DisplaySequence;
  }
  saveCandidateTagObj['DisplaySequence'] = parseInt(seqOrder);
  saveCandidateTagObj['Code'] = value.Code;
  saveCandidateTagObj['DescriptionShort'] = value.DescriptionShort;
  saveCandidateTagObj['Description'] = value.Description;
  saveCandidateTagObj['Keyword'] = value.Keyword;
  // who:maneesh,why:ewm-11118 for color picker change varibel when:11/03/2023
  saveCandidateTagObj['ColorCode'] = this.selctedColor;
  saveCandidateTagObj['Status'] =value.Status;
  saveCandidateTagObj['IsBuiltin'] =value.IsBuiltin?1:0
  this.candidateTagService.createCandidateTag(saveCandidateTagObj).subscribe(
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
 // value.IsBuiltin=value.IsBuiltin?1:0;
 let updateCandidateTagObj = {};
 let seqOrder: any;
 if (value.DisplaySequence == '' || value.DisplaySequence == null) {
   seqOrder = 0;
 } else {
   seqOrder = value.DisplaySequence;
 }
 updateCandidateTagObj['Id'] = value.Id;
 updateCandidateTagObj['DisplaySequence'] = parseInt(seqOrder);
 updateCandidateTagObj['Code'] = value.Code;
 updateCandidateTagObj['DescriptionShort'] = value.DescriptionShort;
 updateCandidateTagObj['Description'] = value.Description;
 updateCandidateTagObj['Keyword'] = value.Keyword;
 // who:maneesh,why:ewm-11118 for color picker change variabel defaultColorValue into  selctedColor when:11/03/2023
 updateCandidateTagObj['ColorCode'] = this.selctedColor;
 updateCandidateTagObj['Status'] =value.Status;
 updateCandidateTagObj['IsBuiltin'] =value.IsBuiltin?1:0;
  this.candidateTagService.updateCandidateTag(updateCandidateTagObj).subscribe(
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
  this.route.navigate(['./client/core/profile/integration/candidatetag']);
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
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 04-jan-2023
   @Why: EWM-10099
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
  @Why: EWM-11118
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
  @Why: EWM-11118
  @What: for which coor we have choose
*/
onSelectColor(codes: any) {
  if(codes){
    this.selctedColor = codes.colorCode;
    this.candidateTagForm.patchValue({
      ColorCode: this.selctedColor
    })
  }else{
    this.candidateTagForm.patchValue({
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
  @Why: EWM-11118
  @What: selecting color on change
*/
onChaneColor(e: any) {
  this.color = e.target.value;
  this.selctedColor = e.target.value;
  this.candidateTagForm.patchValue({
    ColorCode: this.selctedColor
  })
}
/*
  @Type: File, <ts>
  @Name: closeTemplate funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11118
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
  @Why: EWM-11118
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
