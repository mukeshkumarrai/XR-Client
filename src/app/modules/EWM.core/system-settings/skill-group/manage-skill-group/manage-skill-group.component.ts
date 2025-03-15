import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { Industry } from 'src/app/modules/EWM.core/system-settings/industry/model/industry';
import { ResponceData, SCREEN_SIZE } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-manage-skill-group',
  templateUrl: './manage-skill-group.component.html',
  styleUrls: ['./manage-skill-group.component.scss']
})
export class ManageSkillGroupComponent implements OnInit {

  addForm: FormGroup;
  submitted = false;
  InputValue: any;
  public loading: boolean = false;
  public loadingSearch:boolean = false;
  public actionStatus: string = 'Add';
  public groupJsonObj = {};
  public codePattern = '^[A-Z]{5,20}$';
  public isHideExternally: number = 1;
  public isBuiltIn: number = 0;
  public scorePattern = new RegExp(/^(?:100(?:\.0)?|\d{1,3}(?:\.\d{1,2})?)$/);
  tempID: string;
  public statusList: any = [];
  public skillData:any=[];
  public skillIdVal;
  viewModeValue: any;
  public oldPatchValues:any={};
  public pageNo: number = 1;
  public pageSize:number=1000;
  public sortingValue: string = "SkillName,asc";
  public sortedcolumnName: string = 'Order';
  searchVal: string ='';
  searchTextSkill;
  candidateMapTagAll = [];
  candidateMapTagSelected = [];
  @ViewChild('mobileSide') mobileSide: MatMenuTrigger;
  largeScreenTag: boolean = true;
  mobileScreenTag: boolean = false
  selectedSkillData: any = [];
  smallScreenTagData: any = [];
  isMenuOpen = false;
  sizes = [
    {
      id: SCREEN_SIZE.small, name: 'small',
      css: `showMenu`
    },
    {
      id: SCREEN_SIZE.large, name: 'large',
      css: `hide`
    }
  ];
  prefix = 'is-';
  currentMenuWidth;
  overflowMenuItems;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,private elementRef: ElementRef,
    public systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private commonserviceService: CommonserviceService, public _sidebarService: SidebarService,
    private translateService: TranslateService) {
    this.addForm = this.fb.group({
      Id: [''],
      //@who:maneesh @why:EWM-9954 @what:fixed white space validator in name field @when:20-dec-2022-->

      name: ['', [Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]],//@who:priti @why:EWM-4298 @what:change length of character @when:29-DEC-2021-->
      //@who:ANUP @why:EWM-4298 @what:change length of character @when:23-Feb-2022-->
      status: ["1", Validators.required],// <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->   
      //skills: this.fb.array([this.createItem()]) 
    });
  }


  ngOnInit(): void {
    let URL = this.router.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata');
    this.getStatusList();
    this.skillsList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
    this.route.params.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.actionStatus = params['mode'];
          this.tempID = params['id'];
          this.editForm(this.tempID);
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
   @When: 13-May-2021
   @Why: ROST-1506
   @What: For setting value in the edit form
  */

  createItem(){
    return this.fb.group({
      Id:[],
      SkillName: ['',[Validators.required]] ,
      isActive:[0,[Validators.required]]  
    })
  }

  get f() { return this.addForm.controls; }
  get t() { return this.f.skills as FormArray; }
  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: Suika
   @When: 13-May-2021
   @Why: ROST-1506
   @What: For setting value in the edit form
  */

  editForm(Id: String) {
    this.loading = true;
    this.systemSettingService.getskillTagListById('?Id=' + Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data['HttpStatusCode'] == 200) {
          this.oldPatchValues = data.Data;
         // this.isBuiltIn = data.Data.IsBuiltIn;
          this.addForm.patchValue({
            Id: Id,          
            name: data.Data.GroupName,           
            status: data.Data.Status.toString(),        
          });
          // if(data.Data.Skills.length>0){
          //   this.skillData = data.Data.Skills;  
          //   this.selectedSkillData =  this.skillData.filter(x => x.IsMapped == 1);
          //   this.patchValueInFormArray();
          // }  
          //this.addForm.get('name').readOnly(); 
          if(this.actionStatus=='view'){
           // this.selectedSkillData =  this.skillData.filter(x => x.IsMapped == 1);
            this.addForm.disable();
          }       
        } else if (data['HttpStatusCode'] == 400) {
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




  onSave(value, actionStatus) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    //@who:priti @why:EWM-4287  @when:29-DEC-2021-->
    this.actionStatus=actionStatus;
    this.onNameChanges(value);

  }

  createSkill(value) {
    this.loading = true;
    let Id;
    if (this.tempID != undefined) {
      Id = this.tempID;
    } else {
      Id = '0';
    }
    
   // let activeSkills = value.skills.filter(x => x.isActive == true);   
    //this.groupJsonObj['id'] = parseInt(Id);  
    this.groupJsonObj['GroupName'] = value.name.trim();  //@who:priti @why:EWM-4287  @when:30-DEC-2021
    this.groupJsonObj['Status'] = parseInt(value.status);
    //this.groupJsonObj['Skills'] = this.selectedSkillData;//activeSkills;  
    this.systemSettingService.createSkillTag(this.groupJsonObj).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        let viewModeData: any = this.viewModeValue;
        this.router.navigate(['./client/core/administrators/skill-tag'], {
          queryParams: { viewModeData }
        }) 
       // this.router.navigate(['./client/core/administrators/skill-group']);

      } else if (repsonsedata['HttpStatusCode'] == 412) {//@who:priti @why:EWM-4287  @when:30-DEC-2021
      this.addForm.get("name").setErrors({ nameTaken: true });
      this.addForm.get("name").markAsDirty();
       this.loading = false;
    }
      else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });

  }

  updateSkill(value) {
    this.loading = true;
    let fromObj = {};
    let toObj = {};
    let addObj = {};
    fromObj = this.oldPatchValues;
    //let activeSkills = value.skills.filter(x => x.isActive == true); 
    toObj['Id'] = parseInt(value.Id);    
    toObj['GroupName'] = value.name.trim();   //@who:priti @why:EWM-4287  @when:30-DEC-2021
    toObj['Status'] = parseInt(value.status);
    //toObj['Skills'] = this.selectedSkillData;  
    addObj = [{
      "From": fromObj,
      "To": toObj
    }]; 
    this.systemSettingService.updateSkillTag(addObj[0]).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        let viewModeData: any = this.viewModeValue;
        this.router.navigate(['./client/core/administrators/skill-tag'], {
          queryParams: { viewModeData }
        })
        //this.router.navigate(['./client/core/administrators/skill-group']);

      } else if (repsonsedata['HttpStatusCode'] == 412) {//@who:priti @why:EWM-4287  @when:30-DEC-2021
        this.addForm.get("name").setErrors({ nameTaken: true });
        this.addForm.get("name").markAsDirty();
        this.loading = false;
      }
        else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
  }

  onCancel(e){
   e.preventDefault();
   this.addForm.reset();
   this.actionStatus = 'Add';
   let viewModeData: any = this.viewModeValue;
   this.router.navigate(['./client/core/administrators/skill-tag'], {
     queryParams: { viewModeData }
   }) 
   //this.router.navigate(['./client/core/administrators/skill-group']);
  }

  setDefaultSignature(e) {
    if (e.checked === false) {
      this.isHideExternally = 0;
    } else {
      this.isHideExternally = 1;
    }

  }

  setDefaultBuilInSignature(e) {
    if (e.checked === false) {
      this.isBuiltIn = 0;
    } else {
      this.isBuiltIn = 1;
    }
  }


  /*
  @Type: File, <ts>
  @Name: onNameChanges function
  @Who:  Suika
  @When: 13-May-2021
  @Why: EWM-1506
  @What: This function is used for checking duplicacy for code
  */

 onNameChanges(value?:any) {
    let Id;
    if (this.tempID != undefined) {
      Id = this.tempID;
    } else {
      Id = 0;
    }
    let GroupName = this.addForm.get("name").value;
    if (this.addForm.get("name").value) {
      this.systemSettingService.checkSkillGroupDuplicay(Id,GroupName).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == 402) {
            if (repsonsedata['Data'] == false) {
              this.addForm.get("name").setErrors({ nameTaken: true });
              this.addForm.get("name").markAsDirty();
              this.submitted=false;//@who:priti @why:EWM-4287  @when:29-DEC-2021-->
            }
          }else if (repsonsedata['HttpStatusCode'] == 204 ) {
            if (repsonsedata['Data'] == true) {
            this.addForm.get("name").clearValidators();
            this.addForm.get("name").markAsPristine();
            this.addForm.get('name').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);//@who:priti @why:EWM-4298 @what:change length of character @when:29-DEC-2021-->
           // this.addForm.get('name').setValidators([Validators.required, Validators.maxLength(100)]);
           //@who:priti @why:EWM-4287  @when:29-DEC-2021-->
          if(this.submitted) 
          {
            if (this.actionStatus == 'Add') {
              this.createSkill(value);
            } else {
              this.updateSkill(value);
            }
          }
          }
          }
          else if (repsonsedata['HttpStatusCode'] == 400) {
            this.addForm.get("name").clearValidators();
            this.addForm.get("name").markAsPristine();
            this.addForm.get('name').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);//@who:priti @why:EWM-4298 @what:change length of character @when:29-DEC-2021-->
           // this.addForm.get('name').setValidators([Validators.required, Validators.maxLength(100)]);

          }

          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
            this.loading = false;
          }
        },
        err => {
          if (err.StatusCode == undefined) {
            this.loading = false;
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loading = false;
        });
    }
    else {
      this.addForm.get('name').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);//@who:priti @why:EWM-4298 @what:change length of character @when:29-DEC-2021-->
     // this.addForm.get('name').setValidators([Validators.required, Validators.maxLength(100)]);

    }
    this.addForm.get('name').updateValueAndValidity();
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
          this.statusList = repsonsedata.Data;
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
@Name: skillsList function
@Who: Suika
@When: 07-September-2021
@Why: ROST-2693
@What: service call for get list for skills data
*/
skillsList(pagesize, pagneNo, sortingValue, searchVal) {
  this.loading = true;
  this.systemSettingService.getskillsList(pagesize, pagneNo, sortingValue, searchVal).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
        this.loading = false;
        if(repsonsedata['Data']){
          this.skillData = repsonsedata['Data'].filter(x => x.Status == 1);         
        if(this.skillData.length>0){         
          this.patchValueInFormArray();   
        }  
        }          
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    }, err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      }
    })
}

/*
    @Type: File, <ts>
    @Name: patchValueInFormArray function
    @Who: Suika
    @When: 07-Sep-2021
    @Why: EWM-2640.EWM-2693
    @What: patch Value In FormArray
    */
   patchValueInFormArray() {
    const formArray = this.addForm.get("skills") as FormArray;
    formArray.clear();
   this.skillData.forEach(element => {    
    formArray.push(
        this.fb.group({
          Id:[element.Id],
          SkillName: [element.SkillName] ,
          isActive:[element.IsMapped]        
        })
      ); 
    });
  }


 /*@Type: File, <ts>
 @Name: onFilter function
 @Who: Suika
 @When: 07-September-2021
 @Why: ROST-2693
 @What: use for Searching record
  */
 public onFilter(inputValue: string): void {  
  this.loadingSearch = false;
  if (inputValue.length > 0 && inputValue.length < 3) {
    return;
  }
  this.searchVal = inputValue;
  this.pageNo = 1;
  this.systemSettingService.getskillsList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
    repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
        this.loadingSearch = false; 
        if(repsonsedata['Data']){
          this.skillData = repsonsedata['Data'].filter(x => x.Status == 1); 
        if(this.skillData.length>0){         
          this.patchValueInFormArray();   
        }  
        } 
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loadingSearch = false;
      }
    }, err => {
      if (err.StatusCode == undefined) {
        this.loadingSearch = false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loadingSearch = false;
    })
}


input($event: any) {
  $event.stopPropagation();
  // $event.preventDefault();
}

 /*
      @Type: File, <ts>
      @Name: selectSkillList function
      @Who: Suika
      @When: 07-September-2021
      @Why: ROST-2693
      @What:select tag list
      */

     selectSkillList($event: any, skill: any) {     
      $event.stopPropagation();
      $event.preventDefault(); 
      var item = this.skillData.find(x => x.Id == skill.Id);
      if (item) {
        if (skill.IsMapped == 1) {
          item.IsMapped = 0;
        } else {
          item.IsMapped = 1;
        }
        if(skill.IsMapped==1){
          this.selectedSkillData.push(item);
          if(this.selectedSkillData.length > 6){
            let items = this.selectedSkillData.slice(0, 6);
            let threeDotItems = this.selectedSkillData.slice(6, this.selectedSkillData.length);
            this.selectedSkillData = items;
            this.smallScreenTagData.push(threeDotItems[0]);
          }
        }else{
          var removeIndex = this.selectedSkillData.map(function(item) { return item.Id; }).indexOf(item.Id);        
          this.selectedSkillData.splice(removeIndex, 1);         
        }
       
      }
    }
  
    removeSkill(skill){    
      var item = this.skillData.find(x => x.Id == skill.Id);
      item['IsMapped'] = 0;
      var removeIndex = this.selectedSkillData.map(function(item) { return item.Id; }).indexOf(item.Id);         
      this.selectedSkillData.splice(removeIndex, 1);
      if(this.smallScreenTagData.length > 0 && this.selectedSkillData.length < 6){        
        let items = this.smallScreenTagData.slice(0, 1);
        this.removeSkillFromSmallScreen(items[0]);        
        items[0].IsMapped = 1;
        this.selectedSkillData.push(items[0]);
      }

    }

    removeSkillFromSmallScreen(skill){    
      var item = this.skillData.find(x => x.Id == skill.Id);
      item['IsMapped'] = 0;
      var removeIndex = this.smallScreenTagData.map(function(item) { return item.Id; }).indexOf(item.Id);         
      this.smallScreenTagData.splice(removeIndex, 1); 
    }

     /*
     @Type: File, <TS>
     @Name: mobileMenu()
     @Who: Suika
     @When: 07-September-2021
     @Why: ROST-2693
     @What: menu which will be shown as an header for screen size smaller
     */

  
  mobileMenu(data) {
    if (data) {
      let items = data.slice(0, 6);
      let threeDotItems = data.slice(6, data.length);
      this.selectedSkillData = items;
      this.smallScreenTagData = threeDotItems;

    }

  }
/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 20-dec-2022
   @Why: EWM-9954
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

 

 
}

