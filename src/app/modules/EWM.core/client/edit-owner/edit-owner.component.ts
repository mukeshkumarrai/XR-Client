import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ManageAccessService } from '../../shared/services/candidate/manage-access.service';
import { ClientService } from '../../shared/services/client/client.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ActivatedRoute } from '@angular/router';
import { ResponceData } from 'src/app/shared/models';

@Component({
  selector: 'app-edit-owner',
  templateUrl: './edit-owner.component.html',
  styleUrls: ['./edit-owner.component.scss']
})
export class EditOwnerComponent implements OnInit {
 /**********************All generic variables declarations for accessing any where inside functions********/
 addForm: FormGroup; 
 public GridId: any = 'ClientTeamDetails_grid_001';
 public loading: boolean = false;
 public submitted = false;
 public loadingSearch: boolean;
 orgId: any; 
 clientId: any ;
 clientName:any;
 UserName: any; 
 maxMessage = 1000;
 currentUser: any;
 public PreviewUrl: string;
 searchTextTag;
 candidateMapTagAll = [];
 candidateMapTagSelected = []; 
 public clientIdData: any;
 tagLength: number;
 tagLengthStatus: boolean;
 gridListData:any;
 updateListData = [];
 oldPatchValues:any;
 public pagesize ;
 public pagneNo = 1;
 public sortingValue: string = "IsCurrent,desc";
 public searchValue: string = ""; 
 isStarActive:any = [];
 /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Suika
  @When: 03-Feb-2022
  @Why: EWM-4670
  @What: For injection of service class and other dependencies
 */
 constructor(public dialogRef: MatDialogRef<EditOwnerComponent>, public dialog: MatDialog,private _appSetting: AppSettingsService,
   @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService,
   private snackBService: SnackBarService, private _ManageAccessService: ManageAccessService, private routes: ActivatedRoute, 
   private clientService:ClientService, private _CommonserviceService: CommonserviceService,private appSettingsService: AppSettingsService,) {
   this.PreviewUrl = "/assets/user.svg";
   this.clientId = data.clientId;
   this.clientName = data.clientName;
   this.pagesize = appSettingsService.pagesize;

 }

 ngOnInit(): void {
  if (this.clientId != undefined) {
    this.clientIdData = this.clientId;
  }
  if (this.clientIdData == undefined) {
    this.routes.queryParams.subscribe((value) => {
      this.clientIdData = value.clientId;     
    });
  }
   this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false); 
   this.getClientmappingTagList();
   this.orgId = localStorage.getItem('OrganizationId'); 
   let tenantData = JSON.parse(localStorage.getItem('currentUser'));   
   this.currentUser = tenantData;
 }

 
 /*
   @Name: onDismiss
   @Who:  Suika
   @When: 03-Dec-2021
   @Why:  EWM-3867
   @What: Function will call when user click on cancel button.
 */
 onDismiss(): void {
   document.getElementsByClassName("edit-visibilty")[0].classList.remove("animate__zoomIn");
   document.getElementsByClassName("edit-visibilty")[0].classList.add("animate__zoomOut");
   setTimeout(() => { this.dialogRef.close(true); }, 200);
 }

 sortName(fisrtName, lastName) {
   const Name = fisrtName + " " + lastName;
   const ShortName = Name.match(/\b(\w)/g).join('');
   return ShortName.toUpperCase();

 }


/*
  @Name: onDismiss
   @Who:  Suika
   @When: 03-Dec-2021
   @Why:  EWM-3867
   @What: service call for creating Tag List data
  */
 getClientmappingTagList() {
   this.loading=true;
  this.clientService.getClientMappingTagList("?clientid=" + this.clientIdData).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
        this.candidateMapTagAll = repsonsedata.Data;
        if (this.candidateMapTagAll != null)
        {
          const filterselectedTag = this.candidateMapTagAll.filter((e: any) => {
            return e.IsSelected === 1;
          });
          this.candidateMapTagSelected = filterselectedTag;
          this.tagLength = this.candidateMapTagSelected.length;
          if (this.tagLength === 0) {
            this.tagLengthStatus = true;
          } else {
            this.tagLengthStatus = false;
          }
          this.loading=false;
         // this.mobileMenu(this.candidateMapTagSelected);
          //console.log("tagdata:",this.candidateMapTagSelected);
        }

      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading=false;
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}



input($event: any) {
  $event.stopPropagation();
}


getClientTeamAll(pagesize: any, pagneNo: any, sortingValue: string, searchValue: any, isSearch: boolean, isScroll: boolean) {
  if (isSearch == true) {
    this.loading = false;
  } else if (isScroll) {
    this.loading = false;
  } else {
    this.loading = true;
  }
  let jsonObj = {};
  jsonObj['FilterParams'] = [];
  jsonObj['GridId'] = this.GridId;
  jsonObj['ClientId'] = this.clientIdData;
  jsonObj['search'] = searchValue;
  jsonObj['PageNumber'] = pagneNo;
  jsonObj['PageSize'] = pagesize;
  jsonObj['OrderBy'] = sortingValue;
  this.clientService.clientTeamDetails(jsonObj)
    .subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {        
          this.gridListData = data.Data;     
          this.oldPatchValues = this.gridListData;
          this.loading = false;
          this.loadingSearch = false;
        }
        else if (data.HttpStatusCode === 204) {         
          this.gridListData = data.Data;         
          this.oldPatchValues = this.gridListData;
          this.loading = false;
          this.loadingSearch = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
          this.loadingSearch = false;
          //  this.loadingAssignJobSaved = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });

}
  




/*
@Name: onFilter function
@Who:  Suika
@When: 03-Dec-2021
@Why:  EWM-3867
@What: filter data 

*/
isFilter: boolean = false;
public onFilter(inputValue: string): void {
  this.isFilter = true;
  this.loadingSearch = true;
  if (inputValue.length > 0 && inputValue.length <= 2) {
    this.loadingSearch = false;
    return;
  }
  this.pagneNo = 1;
   this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, inputValue, true, false);

}


/*
@Name: onFilterClear function
@Who:  Suika
@When: 03-Dec-2021
@Why:  EWM-3867
@What: for clear filter

*/
public onFilterClear(): void {
  this.loadingSearch = false;
  this.searchValue = '';
  this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
}

onSave(value){
console.log("value ",value);
}


  /*
      @Type: File, <ts>
      @Name: selectTeamList function
      @Who:  Suika
      @When: 03-Dec-2021
      @Why:  EWM-3867
      @What:select tag list
      */
     selectTeamList($event: any, team: any) {      
      // this stops the menu from closing
      $event.stopPropagation();
      $event.preventDefault();
     // this.reloadTeamsData(tag.EmployeeId);    
      var item = this.gridListData.find(x => x['EmployeeId'] === team.EmployeeId);
      if (item) {
        if (team.IsOwner == 1) {
          item.IsOwner = 0;
        } else {
          item.IsOwner = 1;
        }   
      this.updateListData.push(item);
      }
    
    }


    reloadTeamsData(EmployeeId) { 
      let selectedTeamArray =  this.gridListData.filter(x => x['EmployeeId'] === EmployeeId);
      selectedTeamArray.forEach(element => {
        if (element.IsOwner == 1) {
          element['IsOwner'] = 0;
        } else {
          element['IsOwner'] = 1;
        }
      }); 
    }



    /*
      @Type: File, <ts>
      @Name: UpdateTeamList function
      @Who:  Suika
      @When: 03-Dec-2021
      @Why:  EWM-3867
      @What:update team list
      */
    UpdateTeamList() {
    this.loading = true;
    let fromObj={};
    let toObj={};  
    fromObj = this.oldPatchValues;
    toObj =this.updateListData;
    let addObj = {};
    addObj = [{
      "From": fromObj,
      "To": toObj
    }];
    this.clientService.updateOwnerList(addObj[0]).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
          this.onDismiss();
           this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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



}


