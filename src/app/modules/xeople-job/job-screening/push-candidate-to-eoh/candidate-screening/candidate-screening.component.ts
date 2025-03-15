import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PushCandidateEOHService } from '@app/modules/EWM.core/shared/services/pushCandidate-EOH/push-candidate-eoh.service';
import { ResponceData } from '@app/shared/models/responce.model';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { CommonServiesService } from '@app/shared/services/common-servies.service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { PushcandidateToEohFromPopupComponent } from '../../pushcandidate-to-eoh-from-popup/pushcandidate-to-eoh-from-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

enum Tab {
  'Candidate Profile',
  'Screening Action',
  'Notes',
  'Review and Final Summary',
}

@Component({
  selector: 'app-candidate-screening',
  templateUrl: './candidate-screening.component.html',
  styleUrls: ['./candidate-screening.component.scss']
})
export class CandidateScreeningComponent implements OnInit {
  EOHIntegrationObj: any;
  IsEOHIntergrated: boolean = false;
  eohRegistrationCode: string;
  recruiterList: string[] = [];
  public tabActive: string;
  selectedTabIndex: any = 0;
  @Input() JobId: any;
  selectedValue = '1';
  selectedMemberStatus: boolean = false;
  dirctionalLang: string;
  candPageTypeSubs: Subscription;
  candidateId: string;
  candidateScreening:boolean=true;
  constructor(private route: Router, private commonServiesService: CommonServiesService,
    private appSettingsService: AppSettingsService,public dialog: MatDialog,private pushCandidateEOHService: PushCandidateEOHService) {
    this.eohRegistrationCode = this.appSettingsService.eohRegistrationCode;    
  }

  ngOnInit(): void {
    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    this.EOHIntegrationObj = JSON.parse(localStorage.getItem("EOHIntegration"));
    let eohRegistrationCode = otherIntegrations?.filter(res => res.RegistrationCode === this.eohRegistrationCode);
    this.IsEOHIntergrated = eohRegistrationCode[0]?.Connected;

    this.candPageTypeSubs = this.pushCandidateEOHService.SetPushCandPageType.subscribe((details: any)=>{
      if (details) {
        // this.IsOpenFor=details.pageType;
        // this.showWarningAlert = details.showWarningAlert;
        details.pageType === 2 ? this.candidateId = details.candidateID:this.candidateId = details.candidateID;
      }
     // this.pushCandidateToEOH();
    })
    
  }

  redirectOnMarketPlace() {
    window.open(this.commonServiesService.getIntegrationRedirection(this.eohRegistrationCode));
  }

  ActiveTab(event: { index: string | number; }) {
    this.tabActive = Tab[event.index];
  }

  nextTabMove($event) {
    if ($event) {
      this.selectedTabIndex = this.selectedTabIndex + 1;
    }
  }

  tabClick(tab: { index: any; }) {
    this.selectedTabIndex = tab?.index;
  }

  onSelectionChange(event: any) {
    if (event.value === '1') {
      this.selectedValue = event?.value;
      this.selectedMemberStatus = false;
    } else {
      this.selectedValue = event?.value;
      this.selectedMemberStatus = true;
    }
  }

  pushCandidateToEOH(){
    const dialogRef = this.dialog.open(PushcandidateToEohFromPopupComponent, {
      data: new Object({candidateId:this.candidateId,IsOpenFor:'popUp',candidateName:this.candidateId}),
      panelClass: ['xeople-modal-full-screen', 'push-candidate-to-eoh-modal', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
  // RTL Code
  let dir: string;
  dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
  for (let i = 0; i < classList.length; i++) {
    classList[i].setAttribute('dir', this.dirctionalLang);
  }
} 

}
