import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SystemSettingService } from '../../../services/system-setting/system-setting.service';
import {ThemePalette} from '@angular/material/core';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
export interface Task {
  isCollapse:boolean
  Name: string;
  IsChecked: boolean;
  color: ThemePalette;
  IsIntermediate:boolean;
  ListColumn?: Task[];
}
@Component({
  selector: 'app-configure-job-fields',
  templateUrl: './configure-job-fields.component.html',
  styleUrls: ['./configure-job-fields.component.scss']
})
export class ConfigureJobFieldsComponent implements OnInit {
  sendSMSForm: FormGroup;
  isCollaps: any;
  allchecked: any=false;
  Menudata=[];
  addPermissionForm:any;
  loading: boolean;
  constructor(public dialogRef: MatDialogRef<ConfigureJobFieldsComponent>,@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog, 
  private fb: FormBuilder,private systemSettingService: SystemSettingService,private snackBService: SnackBarService,
  public _sidebarService: SidebarService,private translateService: TranslateService) {
    this.addPermissionForm=this.fb.group({
      Menus:[]}); 
    }


  ngOnInit(): void {
    // this.JobId = this.data?.JobId;
    // this.JobName = this.data?.JobName; 
    this.getJobConfigureFieldPermission(); 
   }

/*
    @Type: File, <ts>
    @Name: getJobConfigureFieldPermission function
    @Who:  Nitin Bhati
    @When: 6th Feb 2023
    @Why: EWM-10420
    @What: For get Job Configure Field Permission
  */
   getJobConfigureFieldPermission(){
    this.systemSettingService.getJobConfigurePermission().subscribe(
      (responsedata:any) => {
        if(responsedata.HttpStatusCode==200 && responsedata.Data!=null){
          this.Menudata=responsedata.Data;
        }
      });
   }
  /*
    @Type: File, <ts>
    @Name: onDismiss function
    @Who:  Nitin Bhati
    @When: 6th Feb 2023
    @Why: EWM-10420
    @What: For cancel popup
  */
  onDismiss(): void {
   document.getElementsByClassName("ConfigureJobFields")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("ConfigureJobFields")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
/*
  @Type: File, <ts>
  @Name: onConfirm function
  @Who:  Nitin Bhati
  @When: 6th Feb 2023
  @Why: EWM-10420
  @What: For save data
*/
  onConfirm() {
    document.getElementsByClassName("ConfigureJobFields")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("ConfigureJobFields")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(true); }, 200);
  }
   /*
    @Type: File, <ts>
    @Name: somechecked function
    @Who:  Nitin Bhati
    @When: 7th Feb 2023
    @Why: EWM-10420
    @What: For some checked
  */
  somechecked(): boolean {
    if (this.Menudata==undefined || this.Menudata .length == 0) {
      return false;
    }
    this.allchecked=this.Menudata.length > 0 && this.Menudata.every((t)=> t.IsChecked );
    return (this.Menudata.filter((t:any) => t.IsChecked).length > 0 ||this.Menudata.filter((t:any) => t.IsIntermediate).length > 0) && !this.allchecked;
  }
 /*
    @Type: File, <ts>
    @Name: checkAll function
    @Who:  Nitin Bhati
    @When: 7th Feb 2023
    @Why: EWM-10420
    @What: For check All
  */
  checkAll(checked:boolean)
  {
    this.Menudata.forEach(t=>{
      t.IsChecked=checked;
      t.IsIntermediate=false;
      t.ListColumn.forEach((tc:any) =>{ 
        if(tc?.IsDefault===0){
          tc.IsChecked = checked;
          tc.IsIntermediate=false;
        }
      });
    });
  }
 /*
    @Type: File, <ts>
    @Name: onDismiss function
    @Who:  Nitin Bhati
    @When: 6th Feb 2023
    @Why: EWM-10420
    @What: For cancel popup
  */
  toggleAccordian()
{
  if(this.isCollaps)
  {
    this.isCollaps=false;
  }
  else{
    this.isCollaps=true;
  }
  this.Menudata.forEach(t=>{t.isCollapse=this.isCollaps;
    t.ListColumn.forEach((tc:any) =>{ tc.isCollapse = this.isCollaps;
    // tc.ListColumn.forEach((tch:any) =>{ tch.isCollapse = this.isCollaps})
    });
  });
}

  /*
    @Type: File, <ts>
    @Name: onDismiss function
    @Who:  Nitin Bhati
    @When: 6th Feb 2023
    @Why: EWM-10420
    @What: For cancel popup
  */
    updatedata(data)
    {
    this.Menudata.find(item => item.Id == data.Id).IsChecked = data.IsChecked;
    this.Menudata.find(item => item.Id == data.Id).IsIntermediate = (data.ListColumn.filter((t:any) => t.IsChecked).length > 0||data.Children.filter((t:any) => t.IsIntermediate).length > 0);    
    }
 /*
    @Type: File, <ts>
    @Name: onSavePermission function
    @Who:  Nitin Bhati
    @When: 6th Feb 2023
    @Why: EWM-10420
    @What: For Save permission data
  */
    onSavePermission()
   {
     let selectedmenu;
     let menuList=[];
      this.Menudata.forEach(t=>{ if(t.IsChecked)
       {
         selectedmenu= {
         MenuID: t.Id };
         menuList.push(selectedmenu);
       t.ListColumn.forEach((tc:any) =>{ selectedmenu= {
         MenuID: tc.Id };
         menuList.push(selectedmenu);
      //  tc.Children.forEach((tch:any) =>{  selectedmenu= {
      //    MenuID: tch.Id } ;
      //    menuList.push(selectedmenu);})
       });
     }else if(t.IsIntermediate){
       selectedmenu= {
         MenuID: t.Id };
         menuList.push(selectedmenu);
       t.ListColumn.forEach((tc:any) =>{
         if(tc.IsChecked){
         selectedmenu= {
         MenuID: tc.Id };
         menuList.push(selectedmenu);
        }
       });
     }
     });
    this.addPermissionForm.patchValue({Menus:menuList}); 
    this.loading = true;
     this.systemSettingService.createJobConfigureField(this.Menudata).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
          document.getElementsByClassName("ConfigureJobFields")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("ConfigureJobFields")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          //this.userRoleList(this.pagesize,this.pagneNo,this.sortingValue,this.searchVal);
          //this.isPermission = false;
          this.addPermissionForm.reset();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      }, err => {
        if(err.StatusCode==undefined)
        {
          this.loading=false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
   }

}
