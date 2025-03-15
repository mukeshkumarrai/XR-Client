/*
@(C): Entire Software
@Type: File, <html>
@Who: Anup Singh
@When: 14-April-2022
@Why: EWM-4945 EWM-6165
@What:  This page wil be use only for document email template Component TS
*/
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs-compat/operator/filter';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { DocumentCategoryService } from 'src/app/modules/EWM.core/shared/services/profile-info/document-category.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import SwiperCore, { Pagination, Navigation } from "swiper/core";


SwiperCore.use([Pagination, Navigation]);
@Component({
  selector: 'app-document-email-template',
  templateUrl: './document-email-template.component.html',
  styleUrls: ['./document-email-template.component.scss']
})
export class DocumentEmailTemplateComponent implements OnInit {
 public loading:boolean=false;
 public userTypeList:any=[];
 public screnSizePerStage: number=3;

 searchVal:string='';
 pageSize: any=500;
 pageNo: any=1;
 sortingValue: any='DocumentName,asc';

 public categoryList:any = [];
 public subCategoryList:any=[];
 public CategoryName:string='';
 public subCategoryChecked=[];
 public typeName:any=null;
 public typeId:any =0;
 public CodeInternal:string='';

 public isNoRecordSubCategory:boolean = false;
 public currentMenuWidth: number;
 public screenPreviewClass: string = "";
 public totalStages: number;
 public newArray:any[]=[];
 

 constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DocumentEmailTemplateComponent>,
  private textChangeLngService: TextChangeLngService, private jobService: JobService, private route: Router,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
     private profileInfoService: ProfileInfoService,private _appSetting: AppSettingsService,
     private _Service:DocumentCategoryService,) {

      
      
      }

  ngOnInit(): void {
    this.getTenantUserType();

    if(this.data?.typeId!=undefined && this.data?.typeId!=null && this.data?.typeId!=''){
      this.subCategoryChecked= [...this.data?.subCategoryChecked];
      this.newArray = JSON.parse(JSON.stringify(this.data?.subCategoryChecked));
      this.typeId= this.data?.typeId;
      this.typeName= this.data?.typeName;
      this.CodeInternal= this.data?.CodeInternal;
     let typeCollection = {Id:this.typeId,CodeInternal:this.CodeInternal};
     this.onUserTypeChangeGetCategory(typeCollection);
    }
    this.onResize(window.innerWidth, 'onload');
  }
  maxNumberClass(perSlide) {
    if (this.totalStages > perSlide) {
      this.screenPreviewClass = '';
    } else {
      this.screenPreviewClass = 'flex-center';
    }
  }
  @HostListener("window:resize", ['$event'])
  private onResize(event, loadingType) {
    if (loadingType == 'onload') {
      this.currentMenuWidth = event;
    } else {
      this.currentMenuWidth = event.target.innerWidth;
    }

    if (this.currentMenuWidth > 481 && this.currentMenuWidth < 640) {
      this.screnSizePerStage = 2;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 240 && this.currentMenuWidth < 480) {
      this.screnSizePerStage = 1;
      this.maxNumberClass(this.screnSizePerStage);
    } else {
      this.screnSizePerStage = 3;
      this.maxNumberClass(this.screnSizePerStage);
    }
  }

       /* 
  @Type: File, <ts>
  @Name: onDismiss
  @Who: Anup Singh
  @When: 14-April-2022
  @Why: EWM-4945 EWM-6165
  @What: for close popup.
*/
onClose(): void {
  document.getElementsByClassName("add_documents")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("add_documents")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close( { resType: true, subCategoryChecked11:this.newArray,
    typeId:this.typeId,CodeInternal:this.CodeInternal,typeName:this.typeName}); }, 200);
}


getTenantUserType() {
  this._Service.getTenantUserType().subscribe(
    (repsonsedata:any) => {
      if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
      this.userTypeList = repsonsedata['Data'];
      if(this.typeId!=undefined && this.typeId!=null && this.typeId!=0){
        let listCollection:any = this.userTypeList.filter(x=>{
          return x.Id == this.typeId
        });

        this.typeName = listCollection[0]?.InternalName;
     };

      };
    }, err => {
      this.loading = false;
      //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}


onUserTypeChangeGetCategory(value){
  this.typeId = value.Id;
  this.typeName = value.InternalName;
  this.CodeInternal = value.InternalCode;
  this.loading = true;
  this._Service.getCategoryListByType('?userTypeId='+value.Id).subscribe(
    (repsonsedata:any) => {
      if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
      this.categoryList = repsonsedata['Data'];
      if( this.categoryList!=undefined && this.categoryList!=null && this.categoryList.length!=0){
      this.getSubCategory(this.categoryList[0]);
       this.totalStages = this.categoryList?.length;
       this.onResize(window.innerWidth, 'onload');
      }else{
        this.loading = false;
        this.subCategoryList=[];
        this.isNoRecordSubCategory= true;
      }
      }
    }, err => {
      this.loading = false;
     // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });

}

onSwiper(swiper) {
  // console.log(swiper);
}


getSubCategory(category:any){
  this.loading = true;
  this.isNoRecordSubCategory= true;
  this.CategoryName= category.CategoryName;
 this._Service.getDocumentName(category.Id,this.pageNo,this.pageSize,this.sortingValue,this.searchVal).subscribe(
  (repsonsedata:any) => {
    if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
      let subCategoryData = repsonsedata['Data'];
      this.loading = false;

      if(subCategoryData!=undefined && subCategoryData!=null && subCategoryData?.length!=0){
      this.subCategoryChecked.forEach(checked=>{
        subCategoryData.forEach(element => {
      if(checked.Id == element.Id){
       element['completed'] = true;
         }
      });   
      });
     }

      this.subCategoryList = subCategoryData;
    }
    }, err => {
      this.loading = false;
    //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    }); 
}

//<!---------@When: 05-05-2023 @who:Bantee Kumar@why: EWM-11208 What:User Type is not displaying under the Document field.--------->

checkedSubCategory(value,subCategory,typeName){
  if(value.checked==true){
    subCategory.TypeName = typeName;
   this.subCategoryList.forEach(x=>{
      if(x.Id==subCategory.Id)
      {
        x.completed=true;
        this.subCategoryChecked.push(subCategory);
      }
    });
   
  }else{

    const index = this.subCategoryChecked.findIndex(x => x.Id == subCategory.Id);
    if (index !== -1) {
    this.subCategoryChecked.splice(index, 1);
    }
    this.subCategoryList.forEach(x=>{
      if(x.Id==subCategory.Id)
      {
        x.completed=false;
      }
    });
  }

}


onRemoveDocument(subCategory){
  const index = this.subCategoryChecked.findIndex(x => x.Id == subCategory.Id);
  if (index !== -1) {
  this.subCategoryChecked.splice(index, 1);
  }

  this.subCategoryList.forEach(x=>{
    if(x.DocumentName==subCategory.DocumentName)
    {
      x.completed=false;
    }
  });

}


onSave(){
   document.getElementsByClassName("add_documents")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("add_documents")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close({ resType: true, subCategoryChecked11:this.subCategoryChecked,
    typeId:this.typeId,CodeInternal:this.CodeInternal,typeName:this.typeName}); }, 200);
}

}
