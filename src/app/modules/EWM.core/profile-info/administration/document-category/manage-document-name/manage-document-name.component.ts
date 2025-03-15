import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DocumentCategoryService } from 'src/app/modules/EWM.core/shared/services/profile-info/document-category.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-manage-document-name',
  templateUrl: './manage-document-name.component.html',
  styleUrls: ['./manage-document-name.component.scss']
})
export class ManageDocumentNameComponent implements OnInit {

  addForm: FormGroup;
  public loading:boolean=false;
  public activestatus: string = 'Add';
  public primaryBgColor:string;
  public  tempID: number;
  public submitted = false;
  public statusAddObj = {};
  public categoryId: any;
  public categoryName: any;
  public specialcharPattern = "[A-Za-z0-9 ]+$";
  public  statusList: any=[];
  public viewMode: any;
  oldData: any;
  public WeightageDataId: any[];

  public StatusDataName;
  public weightageDataName;

  public getWeightageType:any=[];
  
  // public Weightage;
  public selectedweightage: any = {};
  WeightageId: any;
  public WeightageValue;
  public WeightageIdData:any
  public addObj = {};
  CategoryHideExternally: any;
  ishide: boolean;
  public HideExternally:any;
  constructor(private fb: FormBuilder,private translateService: TranslateService,private router: ActivatedRoute,
    private snackBService: SnackBarService,private route:Router, 
    public _sidebarService: SidebarService,private commonserviceService:CommonserviceService 
    ,private _SystemSettingService: SystemSettingService,private _Service:DocumentCategoryService,) {
    
      this.addForm = this.fb.group({
      Id: [''],
      DocumentCategoryId: [''],
      CategoryName: [''],
      DocumentName:['',[Validators.maxLength(100),Validators.required]],
      HideExternally:[false],
      ExpiryDate:[false],
      Status: [1, Validators.required],
      StatusName:[],
      LastUpdated:[],
      Weightage: [null, [Validators.required, Validators.maxLength(10)]],
      WeightageId: [null],/*  @Who: bantee @When: 15-may-2023 @Why: EWM-12428 */
      ReferenceId:[''],
      StartDate:['']

      // ExpiryDate:[false],
    });
  
      this.primaryBgColor = localStorage.getItem('HeaderBackground');
    }
  
  
    ngOnInit(): void {        
      this.getWeightageUserType()
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

          if (params['Id'] != undefined) {
            this.activestatus = 'Edit'
            this.tempID = params['Id'];
            this.editForm(this.tempID);
          } else {
            this.activestatus = 'Add';
          }
          if(params['categoryId'] != undefined)
          {
            this.categoryId=parseInt(params['categoryId']) ;
          }
          if(params['name'] != undefined)
          {
            this.categoryName=params['name'] ;
          }
          if(params['V'] != undefined)
          {
            this.viewMode=params['V'];
          }
          if(params['isHideExternally'] != undefined)
          {
            this.HideExternally=params['isHideExternally'] ;
            // this.editForm(this.HideExternally);

          }
        });
        if (this.HideExternally=='1') {
         
          this.addForm.get('HideExternally').setValue(true);
        } else {
          this.addForm.get('HideExternally').setValue(false);
          
        }
      }
      editForm(Id: Number) {
        this.loading = true;
        this._Service.getDocumentNameById( Id).subscribe(
          (data: ResponceData) => {
            this.loading = false;
            if (data.HttpStatusCode === 200) {
              this.oldData=data.Data;              
              this.CategoryHideExternally=data.Data.HideExternally;
              if (this.CategoryHideExternally==0) {
                this.ishide=true;
              }else{
                this.ishide=false;
              }
              this.addForm.patchValue({
                Id: data.Data.Id,
                DocumentCategoryId: data.Data.DocumentCategoryId,
                CategoryName: data.Data.CategoryName,
                DocumentName: data.Data.DocumentName,
                HideExternally: data.Data.HideExternally,
                ExpiryDate:data.Data.ExpiryDate,
                Status: data.Data.Status,
                StatusName: data.Data.StatusName,
                LastUpdated: data.Data.LastUpdated,
                Weightage: data.Data.Weightage,
                WeightageId: data.Data.WeightageId,
                ReferenceId: data.Data.ReferenceId,
                StartDate: data.Data.StartDate

              });
              this.weightageDataName = data.Data.Weightage;          
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
      getStatusList() {
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
    
          })
      }
     
  onSave(value)
  {
    if (this.addForm.invalid) {
      return;
    }
    this.submitted =true;
   this.checkUnique(value)
  }

  update(value: any) { 
    let addObj;
    addObj = [{
    "From": this.oldData,
    "To": value
  }];
  this._Service.updateDocumentName(addObj[0]).subscribe((repsonsedata:ResponceData) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
           /*  @Who: maneesh @When: 11-jan-2023 @Why: EWM-9734 (isHideExternally:this.HideExternally ),prNomber:10154*/
      this.route.navigate(['./client/core/administrators/document-category/document-name'],{ queryParams: {documentcategoryId:this.categoryId,V:this.viewMode,isHideExternally:this.HideExternally}});
      //this.route.navigate(['./client/core/administrators/document-category/document-name']);
      this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
    }  else if(repsonsedata.HttpStatusCode===412||repsonsedata.HttpStatusCode===402)

    {
      this.addForm.get("DocumentName").setErrors({codeTaken: true});
      this.addForm.get("DocumentName").markAsDirty();
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
  create(value: any) {
    this.loading=true;
    this._Service.CreateDocumentName(value).subscribe((repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
           /*  @Who: maneesh @When: 11-jan-2023 @Why: EWM-9734 (isHideExternally:this.HideExternally ),prNomber:10154*/
        this.route.navigate(['./client/core/administrators/document-category/document-name'],{ queryParams: {documentcategoryId:this.categoryId,V:this.viewMode,isHideExternally:this.HideExternally}});
        //this.route.navigate(['./client/core/administrators/document-category/document-name']);
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
      } else if(repsonsedata.HttpStatusCode===412||repsonsedata.HttpStatusCode===402)

       {
        this.addForm.get("DocumentName").setErrors({codeTaken: true});
        this.addForm.get("DocumentName").markAsDirty();
       }
       else if (repsonsedata.HttpStatusCode === 400) {
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


  checkUnique(value)
  {
    let ID = this.addForm.get("Id").value;
    if (ID == null) {
      ID = 0;
    }
    if (ID == '') {
      ID = 0;
    }
    if(this.addForm.get("DocumentName").value=='')
    {
      return;
    }
   this._Service.checkduplicityofDocumentName(ID,this.categoryId,this.addForm.get("DocumentName").value).subscribe(
     (data: ResponceData) => {
       if (data.HttpStatusCode == 402) {
         if (data.Data == false) {
           this.addForm.get("DocumentName").setErrors({codeTaken: true});
           this.addForm.get("DocumentName").markAsDirty();
           this.submitted=false;
         }
       }
       else if (data.HttpStatusCode == 204) {
         if (data.Data == true) {
           this.addForm.get("DocumentName").clearValidators();
           this.addForm.get("DocumentName").markAsPristine();
           /*  @Who: Adarsh @When: 04-Dec-2021 @Why: EWM-3666 (accept special character )*/
           this.addForm.get('DocumentName').setValidators([Validators.required, Validators.maxLength(100)]);
            if (this.addForm && this.submitted == true) {
           value.HideExternally=value.HideExternally?1:0;
           value.ExpiryDate=value.ExpiryDate?1:0;
           value.StartDate=value.StartDate?1:0;
           value.ReferenceId=value.ReferenceId?1:0;
           if (this.activestatus == 'Add') {
             value.DocumentCategoryId=this.categoryId;
             value.CategoryName=this.categoryName;
             this.create(value);
           } else {
             this.update(value);
           }

          }

         }
       }
       else {
         this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
         this.loading = false;
       }
     },
     err => {

       if(err.StatusCode==undefined)
       {
         this.loading=false;
       }
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       this.loading = false;
     });
  }
  /* 
   @Type: File, <ts>
   @Name: clickWeightage function
   @Who:maneesh
   @When: 24Aug-2021
   @Why: EWM-2596
   @What: For Weightage Click event
  */
   clickWeightage(Id) {
    
    this.WeightageDataId = this.getWeightageType.filter((dl: any) => dl.Id == Id);
    this.WeightageIdData = this.WeightageDataId[0].Id;
    this.WeightageValue = this.WeightageDataId[0].Weightage;

    // console.log('WeightageIdData',this.WeightageIdData);
    // console.log('this.WeightageValue',this.WeightageValue);
    
      // this.oldData=data.Data;
      this.addForm.patchValue({
       
        Weightage: this.WeightageValue,
        WeightageId: this.WeightageIdData,


      });
    
    
  }
  getWeightageUserType() {
    this._SystemSettingService.getWeightageUserType().subscribe(
      repsonsedata => {
        this.getWeightageType = repsonsedata['Data'];
        
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
}
