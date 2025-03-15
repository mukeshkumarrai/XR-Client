import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidatorFn, Validators,AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { email, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../services/system-setting/system-setting.service';
import { ButtonTypes } from 'src/app/shared/models';

@Component({
  selector: 'app-addemail',
  templateUrl: './addemail.component.html',
  styleUrls: ['./addemail.component.scss']
})
export class AddemailComponent implements OnInit {

  /*********************Global Varaible declaraed here*************** */
  public contactCategory: any=[];
  public emailData:any=[];

  public mainId: number;
  public mainExists: any;
  public mainExistVal: boolean=false;
  public emailForm: FormGroup;
  public emailChip: any;
  emailDuplicate: boolean;
  typeDuplicate: boolean;
  mode: any;
  IsDisabled: boolean;
  blankval:boolean = false;
  isAdd:boolean=false;
  selectedIn: any;
  isMainEmailIdOptionDisabled:boolean;
  isMainDefault: boolean=false;
  animationVar: any;
  @ViewChild('target') private myScrollContainer: ElementRef;
  mainEmailEditable: number;
  showAddBtn: boolean=false;
  emailPattern:string;
  constructor(public dialogRef: MatDialogRef<AddemailComponent>,public systemSettingService:SystemSettingService,
    private commonserviceService: CommonserviceService,private fb:FormBuilder,private snackBService: SnackBarService, private translateService: TranslateService,
    public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,private appSettingsService: AppSettingsService) {
       //@who:priti;@when:26-nov-2021;@why:to handle no form case 
     if(data.showAddBtn==true){
       this.showAddBtn=true;
      }
     this.emailPattern=this.appSettingsService.emailPattern;
      if(data.emailmul!=null) 
       {this.emailForm=data.emailmul;
      }
      else{
        this.emailForm = this.fb.group({
          emailInfo: this.fb.array([this.createItem()]),
         });
      }// end @who:priti;@when:26-nov-2021
        this.emailChip=data.emailsChip;
        if(this.emailChip.length!=0 ){
          this.emailForm = this.fb.group({
            emailInfo: this.fb.array([this.createItem()]),
           });                 
        }else if(data?.noRequiredValidation==true) { //condition working only quickaddcontact add email ewm-18417 and  for handel required validation show in quick add contact page         
          this.emailForm = this.fb.group({
            emailInfo: this.fb.array([this.createItem()]),
           });
        }
       
         //@who:priti;@when:26-nov-2021;@why:to handle edit case validation 
         this.isAdd=data.IsAddShow==undefined?false:data.IsAddShow;
        this.mode=data.mode;     
        if( this.mode=='Edit' || this.mode=='edit' || this.mode=='View'|| this.mode=='view'){
         // this.mainEmailEditable=data?.values?.Email[0]?.IsMainEmailEditable;
          this.patchValues( data.values);
          this.blankval=false;
        }else{
          this.blankval=true;
        }
     if (data?.isMainEmailOptionDisabled) {
       this.isMainEmailIdOptionDisabled = data.isMainEmailOptionDisabled
     }
   
     this.isMainDefault=data.isMainDefault;
     
  }

  ngOnInit(): void {
    this.getUserContactTypeCategory();
    // (<FormArray>this.emailForm.get('emailInfo'))?.at(0).disable()
    this.animationVar = ButtonTypes;
    setTimeout(() => {
      this.markAllAsUntouched(this.emailForm);
    }, 0); 
  }
 // who:Ankit Rawat,what:EWM-17801,Set all controls untouched on page load,when:02 Aug 24
  markAllAsUntouched(control: AbstractControl) {
    if (control instanceof FormGroup) {
      Object.values(control.controls).forEach((ctrl) => this.markAllAsUntouched(ctrl));
    } else if (control instanceof FormArray) {
      control.controls.forEach((ctrl) => this.markAllAsUntouched(ctrl));
    } else {
      control.markAsUntouched();
    }
  }

  /*
   @Type: File, <ts>
   @Name: createItem
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
   @What: when user click on add to create form group with same formcontrol
   */

  createItem(): FormGroup {
    return this.fb.group({
      EmailId: ['',[Validators.pattern(this.emailPattern),Validators.maxLength(100),RxwebValidators.unique(),Validators.required]],
      Type: [[],[Validators.required,RxwebValidators.unique()]],
      TypeName:[]
    });
  }
   /*
   @Type: File, <ts>
   @Name: emailInfo
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
   @What: for getting the formarray with this instance
   */
  emailInfo() : FormArray {
    return this.emailForm.get("emailInfo") as FormArray
  }

  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

  /*
   @Type: File, <ts>
   @Name: addEmailRow
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
   @What: on add mulitple row
   */
   
  addEmailRow(el) {
    this.blankval=true;
    this.mainExistVal=false;
    this.emailInfo().push(this.createItem());
    setTimeout(() => 
      { 
      this.myScrollContainer.nativeElement.scroll({
       top: this.myScrollContainer.nativeElement.scrollHeight, 
       left: 0, 
       behavior: 'smooth'
       }); }, 0);
  }
   /*
   @Type: File, <ts>
   @Name: removeRow
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
   @What: for removing the single row
   */
  removeRow(i:number) {
    this.emailInfo().removeAt(i);
         //@who:bantee;@when:10-08-2023;  what: 13759 @why:Validation message remains even after removing the duplicate email Type and emailId.

    const arr=<FormArray>this.emailForm.controls['emailInfo'];
        
      arr.controls.forEach((fg, i) => {
       fg.get('Type').updateValueAndValidity();
       fg.get('EmailId').updateValueAndValidity();
  })
  }
  /*
   @Type: File, <ts>
   @Name: onConfirmemail
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
   @What: on save btn save data to chiplist
   */
   checkEmail=[];
         //@who:bantee;@when:26-09-2023;  what: 14431 @why:Validation missing for fields like Firstname, Lastname, Email allowed to accept alphanumeric characters for FN, LN and partial email format.

   checkforEmail(emailVal,index){   
    const emailFormArray = this.emailForm.get("emailInfo") as FormArray;
    if(emailVal?.trim())
    {
     this.blankval=false;
    }else{
      return false;
    }
    //@who:priti;@when:26-nov-2021;@why:to handle edit case validation 
  let emailforEdit;
  if(this.data.values!=undefined)
  {
    emailforEdit=this.data.values?.Email[0]?.EmailId?.trim();
  }
  if(emailVal?.trim()){ 
     const checkEmailExistence = emailParam => this.emailChip.some( ({email}) => email == emailParam && email!=emailforEdit)
  //end code by priti 
     if(checkEmailExistence(emailVal?.trim())==true)
     {
          this.emailDuplicate=true;
          //emailFormArray.at(index).get('EmailId').setErrors({ nameTaken: true });
          emailFormArray.at(index).get('EmailId').markAsTouched();
          emailFormArray.at(index).get('EmailId').markAsDirty();
     }else
     {
          this.emailDuplicate=false;
          emailFormArray.at(index).get('EmailId').clearValidators();
          emailFormArray.at(index).get('EmailId').markAsPristine();
          emailFormArray.at(index).get('EmailId').setValidators([Validators.required,Validators.maxLength(100),Validators.pattern(this.emailPattern),RxwebValidators.unique()]);
         //@who:bantee;@when:26-09-2023;  what: 14431 @why:Validation missing for fields like Firstname, Lastname, Email allowed to accept alphanumeric characters for FN, LN and partial email format.

          emailFormArray.at(index).get('EmailId').updateValueAndValidity();
     }
    }
    
   }
         /*@Who: Bantee kumar,@When: 26-july-2023,@Why: EWM-13328,@What: Main Email id across system should be editable*/

  onConfirmemail(): void {
    let emaildata=this.emailForm.getRawValue().emailInfo;
    let emailArr:any=[];
    for (let i = 0; i< emaildata.length; i++) { 
      for (var j = 0; j< this.contactCategory.length; j++) { 
          if (emaildata[i].Type == this.contactCategory[j].Id) {            
             emailArr.push({
         //@who:bantee;@when:10-08-2023;  what: 13759 @why:Validation message remains even after removing the duplicate email Type and emailId.
         //@who:bantee;@when:26-09-2023;  what: 14431 @why:Validation missing for fields like Firstname, Lastname, Email allowed to accept alphanumeric characters for FN, LN and partial email format.

               'EmailId':emaildata[i].EmailId?.toLowerCase()?.trim(),
               'Type':parseInt(emaildata[i].Type),
               'Name':this.contactCategory[j].Name,
               'IsDefault':Boolean(this.contactCategory[j].IsDefault),
               ...(emaildata[i].hasOwnProperty('IsMainEmailEditable')) && {'IsMainEmailEditable': emaildata[i].IsMainEmailEditable},
              })
          }
      }
  }
  if(this.emailChip.length==0)
  {
    this.mainExists=emaildata.some(e => e.Type == this.mainId);
    if(this.mainExists==true){
      this.mainExistVal=false;
    }else
    {
      this.mainExistVal=true;
      return;
    }
  }else{
    this.mainExists=emaildata.some(e => e.Type == this.mainId);
    const checkTYpeExistence = typeParam => this.emailChip.some( ({type}) => type == typeParam);
    if(this.mainExists==true){
      //@who:priti;@when:26-nov-2021;@why:to handle edit case validation 
        /*@Who: Bantee kumar,@When: 10-08-2023,@Why: EWM-13746,@What: Main Email Id should be dynamic*/

      // let mainEmailTypeIndex=emaildata.findIndex(x => x.Type == this.mainId);
      // if(this.data.values!=undefined && this.mainId==this.data.values.Email[mainEmailTypeIndex].Type)
      // {
      //   this.typeDuplicate=false;
      // }
      // else if(checkTYpeExistence(this.mainId)==true)
      // {
      //     this.typeDuplicate=true;
      //     return;
      // }else{
      //   this.typeDuplicate=false;
      // }
      this.mainExistVal=false;
    }else
    {
      if(this.isMainDefault!=true){
        if(checkTYpeExistence(this.mainId)==true)
        {
          this.mainExistVal=false;
        }else{
          this.mainExistVal=true;
          return;
        }
      }else{
        this.mainExistVal=false;
      }
     
     
    }
  }
    document.getElementsByClassName("add_email")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_email")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({data:emailArr}); }, 200);
    const control = <FormArray>this.emailForm.controls['emailInfo'];
    for(let i = control.length-1; i > 0; i--) {
        control.removeAt(i)
      } 
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.remove("is-blurred");
      }
  }

  /*
    @Name: onDismissemail
    @Who: Renu
    @When: 26-May-2021
    @Why: For Closing the dialog pop-up.
    @What: Function will call when user click on cancel button.
  */

  onDismissemail(): void {

    document.getElementsByClassName("add_email")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_email")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: '' }); }, 200);
    const control = <FormArray>this.emailForm.controls['emailInfo'];
    for(let i = control.length-1; i > 0; i--) {
        control.removeAt(i)
      } 
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.remove("is-blurred");
      }
  }
  
  /*
   @Type: File, <ts>
   @Name: getUserContactTypeCategory
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
   @What: To get Data of contact based on categopry type
   */
   getUserContactTypeCategory() {
     let category="email";
    this.systemSettingService.getUserContactTypeCategory(category).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
         this.contactCategory=repsonsedata.Data;
         let mainFilter=this.contactCategory.filter(res=>res.IsDefault==1);
          if(mainFilter.length!==0)
          {
         /*@Who: Bantee kumar,@When: 26-july-2023,@Why: EWM-13328,@What: Main Email id across system should be editable*/
           
           this.mainId=mainFilter[0]['Id'];
            const checkEmailExistence = typeParam => this.emailChip.some( ({type}) => type == typeParam)
            if(this.isMainDefault!=true && this.mode?.toLowerCase()!='edit'){
            if(checkEmailExistence(this.mainId)==false)
            {
              this.emailInfo().at(0)?.patchValue({
                Type:this.mainId//changed by priti at 29-nov-2021
              });
            }
          }
        }
        } else {
         // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
       
        }
         /*@Who: Bantee kumar,@When: 27-09-2023,@Why: EWM-14192,@What: The Type dropdown of the main email ID should be disabled.*/

        this.disabledSelectedMainTypeInEditMode(this.data.pageName);

      }, err => {
       // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

   /*
   @Type: File, <ts>
   @Name: checkMainType
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
   @What: check main type on dropdown changevalue and validate the form
   */
  checkMainType(mainId,index){
  
    this.blankval=false;
    if(this.emailChip.length==0)
    {
      let emaildata=this.emailForm.value.emailInfo;
      this.mainExists=emaildata.some(e => e.Type == this.mainId);
      if(this.mainExists==true){
        this.mainExistVal=false;
      }else
      {
      
        this.mainExistVal=true;
        return;
      }
    }
    else
    {
      const emailFormArray = this.emailForm.get("emailInfo") as FormArray;
      if(this.mainId==mainId){
        
        const checkTYpeExistence = typeParam => this.emailChip.some( ({type}) => type == typeParam)
       //@who:priti;@when:26-nov-2021;@why:to handle edit case validation 
        if(this.data.values!=undefined && mainId==this.data.values.Email[0].Type)
        {
          this.typeDuplicate=false;
          emailFormArray.at(index).get('Type').clearValidators();
          emailFormArray.at(index).get('Type').markAsPristine();
          emailFormArray.at(index).get('Type').setValidators([Validators.required, RxwebValidators.unique()]);
          
        }
        else if(checkTYpeExistence(this.mainId)==true)
        {
            this.typeDuplicate=true;
            emailFormArray.at(index).get('Type').setErrors({ TypeTaken: true });
            emailFormArray.at(index).get('Type').markAsTouched();
            emailFormArray.at(index).get('Type').markAsDirty();
        }else
        {
            this.typeDuplicate=false;
            emailFormArray.at(index).get('Type').clearValidators();
            emailFormArray.at(index).get('Type').markAsPristine();
            emailFormArray.at(index).get('Type').setValidators([Validators.required, RxwebValidators.unique()]);
            this.mainExistVal=false; // @suika @EWM-10662 @whn 22-03-2023 @handle main
        }
      }else{
        this.typeDuplicate=false;
        emailFormArray.at(index).get('Type').clearValidators();
        emailFormArray.at(index).get('Type').markAsPristine();
        emailFormArray.at(index).get('Type').setValidators([Validators.required, RxwebValidators.unique()]);
      }
     
    }
}



patchValues(formvalues){
  this.typeDuplicate = false;
  const control=<FormArray>this.emailForm.controls['emailInfo'];
  control.clear();
  if(formvalues.Email.length>0){
  formvalues.Email.forEach((x) => {
    control.push(
       this.fb.group({      
        EmailId: [x.EmailId,[Validators.pattern(this.emailPattern),Validators.maxLength(100),RxwebValidators.unique()]],
        Type: [x.Type,[Validators.required, RxwebValidators.unique()]],
        TypeName:[x.Name],
        IsMainEmailEditable:[x.IsMainEmailEditable]
       })
     );
   });
  
  }
  if( this.mode=='View' ||  this.mode=='view'){
  control.disable();
  this.IsDisabled=true;
 }
}

/*
  @Type: File, <ts>
  @Name: disabledSelectedMainTypeInEditMode
  @Who: Adarsh singh
  @When: 25-JuAugne-2022
  @Why: ROST-8367
  @What: for disabled Email and type filed while editing data for Edit Organization Details
 */

  disabledSelectedMainTypeInEditMode(pageName) {
    
      if (pageName === 'orgPage') {
        const eamilId = document.getElementById('EmailId0') as HTMLInputElement | null;
        const emailType = document.getElementById('email-category0') as HTMLInputElement | null;

        if (this.data.mode == 'edit') {
          eamilId?.setAttribute('disabled', 'true');
          emailType?.setAttribute('disabled', 'true');
          emailType.style.pointerEvents = 'none';
          emailType.style.opacity = '.6';
          // (<FormArray>this.phoneForm.get('phoneInfo'))?.at(0).disable()
        } else {
          eamilId?.removeAttribute('disabled');
          emailType?.removeAttribute('disabled');
          emailType.style.pointerEvents = 'auto';
          emailType.style.opacity = '1';
        }
      }
         /*@Who: Bantee kumar,@When: 26-july-2023,@Why: EWM-13328,@What: Main Email id across system should be editable*/

      if (pageName === 'genralInfoPage') {
        const arr=<FormArray>this.emailForm.controls['emailInfo'];
        
       
        if (this.data.mode == 'edit') {
          const arrRawData = arr.getRawValue();
          arr.controls.forEach((fg, i) => {
            if(arrRawData[i].Type == this.mainId){
              fg.get('Type').disable();
            }
            if(arrRawData[i].IsMainEmailEditable==0 && arrRawData[i].Type == this.mainId){
              fg.get('Type').disable();
              fg.get('EmailId').disable();

            }
          });
          
        }
        
      }

  }

}
