/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash Gupta
  @When: 21-May-2021
  @Why: EWM-1449 EWM-1583
  @What: this section handle all social profile component related functions
*/

import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ButtonTypes, ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../services/system-setting/system-setting.service';

@Component({
  selector: 'app-add-social',
  templateUrl: './add-social.component.html',
  styleUrls: ['./add-social.component.scss']
})
export class AddSocialComponent implements OnInit {

  /************************global variables declared here*******************/
  public socialProfile: any = [];
  public urlpattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  blankval: boolean = true;
  socialForm: FormGroup;
  socialChip: any;
  linkDuplicate: boolean;
  mode: string;
  animationVar: any;
  @ViewChild('target') private myScrollContainer: ElementRef;


  constructor(public dialogRef: MatDialogRef<AddSocialComponent>, private systemSettingService: SystemSettingService,
    private commonserviceService: CommonserviceService, private snackBService: SnackBarService, private translateService: TranslateService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    //this.socialForm = data.socialmul;
    this.socialChip = data.socialChip;
    this.mode = data.mode;

    this.socialForm = this.fb.group({
      socialInfo: this.fb.array([this.createSocial()]),
    });


    if (this.socialChip.length != 0) {
      this.socialForm = this.fb.group({
        socialInfo: this.fb.array([this.createSocial()]),
      });
    }

    if (this.mode == 'Edit' || this.mode == 'edit' || this.mode == 'View' || this.mode == 'view') {
      this.patchValues(data.values);
      // console.log("phoneValue:",data.values);
      this.blankval = false;
    } else {
      this.blankval = true;
    }

  }

  ngOnInit(): void {
    this.socialProfileList();
    this.animationVar = ButtonTypes;
  }
  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

  /*
 @Type: File, <ts>
 @Name: checkforLink
 @Who: Anup
 @When: 24-Sep-2021
 @Why: ROST-1586
 @What: duplicacy check
 */

  checkforLink(linkVal) {
    const checkLinkExistence = linkParam => this.socialChip.some(({ link }) => link == linkParam)
    if (checkLinkExistence(linkVal) == true) {
      this.linkDuplicate = true;
    } else {
      this.linkDuplicate = false;
    }

  }

  /*
   @Type: File, <ts>
   @Name: createSocial
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
   @What: when user click on add to create form group with same formcontrol
   */
  // @Who: maneesh, @When: 29-dec-2022,@Why: EWM-9653 Validators require in ProfileURL

  createSocial(): FormGroup {
    return this.fb.group({ 
      ProfileURL: ['',[Validators.required,Validators.pattern(this.urlpattern), Validators.maxLength(100), Validators.minLength(1), RxwebValidators.unique()]],
      TypeId: [[], [Validators.required, RxwebValidators.unique()]]
    });
  }

  /*
  @Type: File, <ts>
  @Name: socialInfo
  @Who: Renu
  @When: 26-May-2021
  @Why: ROST-1586
  @What: for getting the formarray with this instance
  */
  socialInfo(): FormArray {
    return this.socialForm.get("socialInfo") as FormArray
  }


  /*
 @Type: File, <ts>
 @Name: addSocialRow
 @Who: Renu
 @When: 26-May-2021
 @Why: ROST-1586
 @What: on add mulitple row
 */
  addSocialRow(el) {
    this.socialInfo().push(this.createSocial());
    setTimeout(() => { this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight, 
      left: 0, 
      behavior: 'smooth' }); }, 0);
  }

  /*
  @Type: File, <ts>
  @Name: removeRow
  @Who: Renu
  @When: 26-May-2021
  @Why: ROST-1586
  @What: for removing the single row
  */

  removeRow(i: number) {
    this.socialInfo().removeAt(i);
  }


  /*
   @Type: File, <ts>
   @Name: onConfirmSocial
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
   @What: on save btn save data to chiplist
   */
  onConfirmSocial(): void {
    let socialdata = this.socialForm.value.socialInfo;
    let socialArr: any = [];
    for (let i = 0; i < socialdata.length; i++) {
      if (socialdata[i].ProfileURL != '' && socialdata[i].ProfileURL != null) {
        socialArr.push({
          'ProfileURL': socialdata[i].ProfileURL,
          'TypeId': parseInt(socialdata[i].TypeId)
        })
      }
    }

    document.getElementsByClassName("add_SocialPofile")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_SocialPofile")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: socialArr }); }, 200);
    const control = <FormArray>this.socialForm.controls['socialInfo'];
    for (let i = control.length - 1; i > 0; i--) {
      control.removeAt(i)
    }
  }

  /* 
    @Type: File, <ts>
    @Name: onDismissSocial
    @Who: Renu
    @When: 27-MAY-2021
    @Why: For Closing the dialog pop-up.
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onDismissSocial(): void {
    // Close the dialog, return false
    //this.dialogRef.close(false);
    document.getElementsByClassName("add_SocialPofile")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_SocialPofile")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: '' }); }, 200);
    const control = <FormArray>this.socialForm.controls['socialInfo'];
    for (let i = control.length - 1; i > 0; i--) {
      control.removeAt(i)
    }

  }

  /*
   @Type: File, <ts>
   @Name: socialProfileList
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
   @What: To get Data from people type will be from user types where type is People
   */
  socialProfileList() {
    this.systemSettingService.getSocialProfileListAll('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.socialProfile = repsonsedata.Data;
        } else {
          //   this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
   @Type: File, <ts>
   @Name: socialProfileList
   @Who: Adarsh singh
   @When: 26-OCt-2022
   @Why: ROST-9259
   @What: for patching data in form
   */
    // @Who: maneesh, @When: 28-dec-2022,@Why: EWM-9653 Validators require in ProfileURL
  patchValues(formvalues) {
    if (formvalues.socials.length > 0) {
      const control = <FormArray>this.socialForm.controls['socialInfo'];
      control.clear();
      formvalues.socials.forEach((x) => {
        control.push(
          this.fb.group({
            ProfileURL: [x.ProfileURL, [Validators.required,Validators.pattern(this.urlpattern), Validators.maxLength(100), Validators.minLength(1), RxwebValidators.unique()]],
            TypeId: [x.TypeId, [Validators.required, RxwebValidators.unique()]]
          })
        )
      })
      if (this.data.IsDisabled) {
        this.onDisabledFormArrayFiled();
      }
    }
    if (this.mode == 'View' || this.mode == 'view') {
      const control = <FormArray>this.socialForm.controls['socialInfo'];
      control.disable();
      // this.IsDisabled = true;
    }
  }

/*
   @Type: File, <ts>
   @Name: onDisabledFormArrayFiled
   @Who: Adarsh singh
   @When: 27-OCt-2022
   @Why: ROST-9259
   @What: for disabled all filed in patching mode
*/
  onDisabledFormArrayFiled(){
    setTimeout(() => {
      for(var i = 0; i<this.socialInfo().controls.length; i++){
        const profileFiled = document.getElementById('social-link'+i) as HTMLInputElement | null;
        const type = document.getElementById('social-profiletype'+i) as HTMLInputElement | null;
        profileFiled?.setAttribute('disabled', 'true');
        profileFiled.style.pointerEvents = 'none';
        type?.setAttribute('disabled', 'true');
        type.style.pointerEvents = 'none';
        type.style.opacity = '.6';
      }
    }, 500);
  }
}
