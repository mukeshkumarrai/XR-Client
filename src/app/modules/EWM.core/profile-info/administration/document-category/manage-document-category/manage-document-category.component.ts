import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DocumentCategoryService } from 'src/app/modules/EWM.core/shared/services/profile-info/document-category.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-manage-document-category',
  templateUrl: './manage-document-category.component.html',
  styleUrls: ['./manage-document-category.component.scss']
})
export class ManageDocumentCategoryComponent implements OnInit {
  addForm: FormGroup;
  public loading:boolean=false;
  public activestatus: string = 'Add';
  public primaryBgColor:string;
  public  tempID: number;
  public submitted = false;
  public statusAddObj = {};
  public GroupId: any;
  public specialcharPattern = "[A-Za-z0-9 ]+$";
  public  statusList: any=[];
  public viewMode: any;
  public codePattern =  new RegExp(/^[A-Z0-9]{1,20}$/);
  public userTYpeList:any=[];
  oldData: any;
  public isClick: any;
  public isHideExternally:boolean=true;
  constructor(private fb: FormBuilder,private translateService: TranslateService,private router: ActivatedRoute,
    private snackBService: SnackBarService,private statusService:SystemSettingService,private route:Router, 
    public _sidebarService: SidebarService,private commonserviceService:CommonserviceService ,private _Service:DocumentCategoryService,) {
    this.addForm = this.fb.group({
      Id: [''],
      UserTypeId: [null, [Validators.required]],
      UserTypeName: ['', [Validators.required]],
      //  @Who: maneesh, @When: 21-dec-2022,@Why: EWM-9955 addnoWhitespaceValidator 
      CategoryName:['',[Validators.maxLength(100),Validators.required,this.noWhitespaceValidator()]],
      HideExternally:[false],
      Status: [1, Validators.required], //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data---->
      StatusName:[],
      LastUpdated:[]
    });
  
      this.primaryBgColor = localStorage.getItem('HeaderBackground');
    }
  
  
    ngOnInit(): void {  
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
          if (params['documentcategoryId'] != undefined) {
            this.activestatus = 'Edit'
            this.tempID = params['documentcategoryId'];
            this.editForm(this.tempID);
          } else {
            this.activestatus = 'Add';
          }
          if(params['V'] != undefined)
          {
            this.viewMode=params['V'];
          }
        });
        this.getUserTypeList();
      }
      editForm(Id: Number) {
        this.loading = true;
        this._Service.getDocumentCategoryById( Id).subscribe(
          (data: ResponceData) => {
            this.loading = false;
            if (data.HttpStatusCode === 200) {
              this.oldData=data.Data;
              this.addForm.patchValue({
                Id: data.Data.Id,
                UserTypeId: data.Data.UserTypeId,
                UserTypeName: data.Data.UserTypeName,
                CategoryName: data.Data.CategoryName,
                HideExternally: data.Data.HideExternally,
                Status: data.Data.Status,
                StatusName: data.Data.StatusName,
                LastUpdated: data.Data.LastUpdated,
             


              });
    
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
      getUserTypeList() {
        this._Service.getTenantUserType().subscribe(
          repsonsedata => {
            this.userTYpeList = repsonsedata['Data'];
            
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          });
      }
  onSave(value: any, activestatus: any)
  {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    value.HideExternally=value.HideExternally?1:0;
    // value.ExpiryDate=value.ExpiryDate?1:0;

    // if (this.activestatus == 'Add') {
    //   this.create(value);
    // } else {
    //   this.update(value);
    // }
    this.activestatus = activestatus;
    // this.isClick = true;
    this.checkUnique(true);
  }
  update(value: any) { 
    let addObj;
    addObj = [{
    "From": this.oldData,
    "To": value
  }];
  this._Service.update(addObj[0]).subscribe((repsonsedata:ResponceData) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
     // this.route.navigate(['./client/core/administrators/document-category'],{ queryParams: {V:this.viewMode}});
      this.route.navigate(['./client/core/administrators/document-category']);
      this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
    } else if(repsonsedata.HttpStatusCode===412||repsonsedata.HttpStatusCode===402)
    {
      this.addForm.get("CategoryName").setErrors({codeTaken: true});
      this.addForm.get("CategoryName").markAsDirty();
      this.loading = false;
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
    this._Service.Create(value).subscribe((repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        //this.route.navigate(['./client/core/administrators/document-category'],{ queryParams: {V:this.viewMode}});
        this.route.navigate(['./client/core/administrators/document-category']);
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
      } else if(repsonsedata.HttpStatusCode===412||repsonsedata.HttpStatusCode===402)

       {  
         this.loading = false;
        this.addForm.get("CategoryName").setErrors({codeTaken: true});
        this.addForm.get("CategoryName").markAsDirty();
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
  checkUnique(isClick)
  {
    let ID = this.addForm.get("Id").value;
    let userTypeId = this.addForm.get("UserTypeId").value;
    let value = this.addForm.get("CategoryName").value;
    if (ID == null) {
      ID = 0;
    }
    if (ID == '') {
      ID = 0;
    }
    if(userTypeId==null || userTypeId=='')
    {
      userTypeId=0;
    }
    if(value=='')
    {
      return;
    }
    this._Service.checkduplicityofDocumentCategory(ID,value,userTypeId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 402) {
          if (repsonsedata.Status == false) {

            this.addForm.get("CategoryName").setErrors({codeTaken: true});
           this.addForm.get("CategoryName").markAsDirty();

          }
        } else if (repsonsedata.HttpStatusCode === 204) {
          if (repsonsedata.Status == true) {

            this.addForm.get("CategoryName").clearValidators();
           this.addForm.get("CategoryName").markAsPristine();
           this.addForm.get('CategoryName').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);
        if (isClick) {
          if (this.addForm && this.submitted == true) {
            if (this.activestatus == 'Add') {
              this.create(this.addForm.value);
            } else {
              this.update(this.addForm.value);
            }
          }
        }
          }
        }
        else if (repsonsedata.HttpStatusCode == 400) {
          this.addForm.get("CategoryName").clearValidators();
           this.addForm.get("CategoryName").markAsPristine();
           this.addForm.get('CategoryName').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          this.loading = false;
        }

      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  onUserTypeChange(value)
  {
    let userTypename=this.userTYpeList.filter((ut:any)=>ut.Id==value);
    this.addForm.patchValue({
      UserTypeName:userTypename[0].InternalName
    });
  }
  setValue(value)
  {
  }

/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 21-dec-2022
   @Why: EWM-9955
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
}
