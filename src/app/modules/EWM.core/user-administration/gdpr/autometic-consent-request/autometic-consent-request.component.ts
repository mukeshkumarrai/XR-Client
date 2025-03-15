/*
 @(C): Entire Software
 @Type: File, <TS>
 @Who: Anup Singh
 @When: 09-Feb-2022
 @Why: EWM-4674 EWM-5115
 @What: This page wil be use only for autometic consent request Component TS
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';

@Component({
  selector: 'app-autometic-consent-request',
  templateUrl: './autometic-consent-request.component.html',
  styleUrls: ['./autometic-consent-request.component.scss']
})
export class AutometicConsentRequestComponent implements OnInit {


  public IsFormCandidateEnaledToggle: boolean = false;
  public IsAppliedCandidateEnaledToggle: boolean = false;
  public IsFormEmployeeEnaledToggle: boolean = false;

  public IsFormCandidate = 0;
  public IsAppliedCandidate = 0;
  public IsFormEmployee = 0;

  @Input() GDPRCompliance: any;

  @Output() consentReqValue = new EventEmitter();
  positionMatTab: any;
  constructor(private commonserviceService: CommonserviceService) { }

  ngOnInit(): void {
    if (this.GDPRCompliance.IsFormCandidate == 1) {
      this.IsFormCandidateEnaledToggle = true;
    } else {
      this.IsFormCandidateEnaledToggle = false;
    }

    if (this.GDPRCompliance.IsAppliedCandidate == 1) {
      this.IsAppliedCandidateEnaledToggle = true;
    } else {
      this.IsAppliedCandidateEnaledToggle = false;
    }

    if (this.GDPRCompliance.IsFormEmployee == 1) {
      this.IsFormEmployeeEnaledToggle = true;
    } else {
      this.IsFormEmployeeEnaledToggle = false;
    }

    this.IsFormCandidate = this.GDPRCompliance.IsFormCandidate;
    this.IsAppliedCandidate = this.GDPRCompliance.IsAppliedCandidate;
    this.IsFormEmployee = this.GDPRCompliance.IsFormEmployee;

    

    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.positionMatTab=res;
    });
  }



  /*
   @Type: File, <ts>
   @Name: onChangeformCandidate
   @Who: Anup Singh
   @When: 09-Feb-2022
   @Why: EWM-4674 EWM-5115
   @What: change toggle Gdpr Compliance Status
   */
  onChangeformCandidate(value) {
    if (value.checked === true) {
      this.IsFormCandidate = 1;
      this.IsFormCandidateEnaledToggle = true;
      this.consentReqValue.emit({
        'isConsentReq': true, 'IsFormCandidate': this.IsFormCandidate, 'IsAppliedCandidate': this.IsAppliedCandidate,
        'IsFormEmployee': this.IsFormEmployee
      })

    } else {
      this.IsFormCandidate = 0;
      this.IsFormCandidateEnaledToggle = false;
      this.consentReqValue.emit({
        'isConsentReq': true, 'IsFormCandidate': this.IsFormCandidate, 'IsAppliedCandidate': this.IsAppliedCandidate,
        'IsFormEmployee': this.IsFormEmployee
      })
    }
  }


  /*
  @Type: File, <ts>
  @Name: onChangeApplyCandidate
  @Who: Anup Singh
  @When: 09-Feb-2022
  @Why: EWM-4674 EWM-5115
  @What: change toggle Gdpr Compliance Status
  */
  onChangeApplyCandidate(value) {
    if (value.checked === true) {
      this.IsAppliedCandidate = 1;
      this.IsAppliedCandidateEnaledToggle = true;
      this.consentReqValue.emit({
        'isConsentReq': true, 'IsFormCandidate': this.IsFormCandidate, 'IsAppliedCandidate': this.IsAppliedCandidate,
        'IsFormEmployee': this.IsFormEmployee
      })
    } else {
      this.IsAppliedCandidate = 0;
      this.IsAppliedCandidateEnaledToggle = false;
      this.consentReqValue.emit({
        'isConsentReq': true, 'IsFormCandidate': this.IsFormCandidate, 'IsAppliedCandidate': this.IsAppliedCandidate,
        'IsFormEmployee': this.IsFormEmployee
      })
    }
  }


  /*
@Type: File, <ts>
@Name: onChangeFormEmployee
@Who: Anup Singh
@When: 09-Feb-2022
@Why: EWM-4674 EWM-5115
@What: change toggle Gdpr Compliance Status
*/
  onChangeFormEmployee(value) {
    if (value.checked === true) {
      this.IsFormEmployee = 1;
      this.IsFormEmployeeEnaledToggle = true;
      this.consentReqValue.emit({
        'isConsentReq': true, 'IsFormCandidate': this.IsFormCandidate, 'IsAppliedCandidate': this.IsAppliedCandidate,
        'IsFormEmployee': this.IsFormEmployee
      })
    } else {
      this.IsFormEmployee = 0;
      this.IsFormEmployeeEnaledToggle = false;
      this.consentReqValue.emit({
        'isConsentReq': true, 'IsFormCandidate': this.IsFormCandidate, 'IsAppliedCandidate': this.IsAppliedCandidate,
        'IsFormEmployee': this.IsFormEmployee
      })
    }
  }


}
