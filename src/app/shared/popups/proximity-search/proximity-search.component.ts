/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Ankit Rawat
  @When: 29-Feb-2024
  @Why: EWM-16114 EWM-16203
  @What:  This page will be use for common Proximity search
*/
import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-proximity-search',
  templateUrl: './proximity-search.component.html',
  styleUrls: ['./proximity-search.component.scss']
})
export class ProximitySearchComponent implements OnInit {
  public proximityForm: FormGroup;
  public ProximitySearchResult = {
    Latitude: 0,
    Longitude: 0,
    Distance:0,
    Unit:'KM',
    Address:'',
    Action: 'SEARCH',
    Source:'',
    ShowClientContactsProximity:1
  }
  public onlyNumberPattern = RegExp('^(0|[1-9]\\d{0,7})$');
  //new RegExp(/^(?:100(?:\.0)?|\d{1,1000}?)$/);
  ShowClientContactsProximity:number;
  contactPageProximityData:boolean;
  getLocalStorageContactsProximity:string | number;
  Address:string;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<ProximitySearchComponent>,
    @Inject(MAT_DIALOG_DATA) public proximitySearchData: any,@Inject(MAT_DIALOG_DATA) public data: any
) { 

    if(proximitySearchData && proximitySearchData!==undefined){
      this.ProximitySearchResult=proximitySearchData.proximitySearchData;
    }    
    this.contactPageProximityData=data?.contactPageProximityData;//by maneesh changes ewm-18154
    if (this.contactPageProximityData==true) {//by maneesh changes ewm-18154
    this.Address=data?.Address;//by maneesh changes ewm-18154
    this.ShowClientContactsProximity=data?.ShowClientContactsProximity;

    if (this.Address==null || this.Address=='') {
    this.ShowClientContactsProximity=1;  
    }
    }
  }

  ngOnInit(): void {
    this.proximityForm = this.fb.group({
      proximityLocation: [, [Validators.required]],
      proximityKM:[0, [Validators.required]],
    });

    this.proximityForm?.get('proximityLocation')?.setValue(this.ProximitySearchResult.Address);
    this.proximityForm?.get('proximityKM')?.setValue(this.ProximitySearchResult.Distance);

  }

  public fetchDataFromAddressBar(address) {
    this.ProximitySearchResult.Latitude=address?.geometry?.location?.lat() ?? 0;
    this.ProximitySearchResult.Longitude=address?.geometry?.location?.lng()?? 0;
    this.ProximitySearchResult.Address=address.formatted_address;
    this.proximityForm?.get('proximityLocation')?.setValue(this.ProximitySearchResult.Address);
    this.proximityForm.get("proximityLocation")?.clearValidators();
    this.proximityForm.get("proximityLocation")?.markAsPristine();
  }

  public focusOutAddress(){
    setTimeout(()=>{ 
      if(this.proximityForm?.get('proximityLocation')?.value!=this.ProximitySearchResult.Address){
        this.proximityForm.get("proximityLocation")?.setErrors({ selectAddress: true });
        this.proximityForm.get("proximityLocation")?.markAsDirty();
        }
  }, 200);
  }

  onProximiySearch(value) {
    if(this.proximityForm?.get('proximityLocation')?.value!=this.ProximitySearchResult.Address){
      this.proximityForm.get("proximityLocation")?.setErrors({ selectAddress: true });
      this.proximityForm.get("proximityLocation")?.markAsDirty();
    }
    if (this.proximityForm.valid) {
    this.ProximitySearchResult.Action='SEARCH';
    this.ProximitySearchResult.Distance=value.proximityKM ?? 0;
    this.ProximitySearchResult.ShowClientContactsProximity=this.contactPageProximityData==true?this.ShowClientContactsProximity:null;//by maneesh changes ewm-18154
    this.dialogRef.close(this.ProximitySearchResult);
    }
  }

  onDismiss(): void {    
    this.ProximitySearchResult.ShowClientContactsProximity=this.contactPageProximityData==true?this.ShowClientContactsProximity:null;//by maneesh changes ewm-18154
    this.ProximitySearchResult.Action='DISMISS';
    this.dialogRef.close(this.ProximitySearchResult);
  }

  onProximityValidation(event: KeyboardEvent) {
    this.proximityForm.get('proximityKM')?.setValidators([Validators.required]);
    let values = this.proximityForm.get("proximityKM")?.value;
    if (100000000 > values && values!=null) {
      if(values >= 0){
        this.proximityForm.get("proximityKM")?.clearValidators();
        this.proximityForm.get("proximityKM")?.markAsPristine();
        this.proximityForm.get('proximityKM')?.setValidators([Validators.pattern(this.onlyNumberPattern)]);
     }  else {
        this.proximityForm.get("proximityKM")?.setErrors({ numbercheck: true });
        this.proximityForm.get("proximityKM")?.markAsDirty();
      }
    }
    else if (values===null) {
      this.proximityForm?.get('proximityKM')?.setValue('');
      this.proximityForm.get('proximityKM')?.setValidators([Validators.required]);
    }
    else if((values%1)==0) {
      this.proximityForm.get("proximityKM")?.setErrors({ numbercheck: true });
    }
    else{
      this.proximityForm.get('proximityKM')?.setValidators([Validators.pattern(this.onlyNumberPattern)]);
    }
  }

  onItemChange(data){ //by maneesh changes ewm-18154
    this.ShowClientContactsProximity=Math.floor(data?.value)
 }
}
