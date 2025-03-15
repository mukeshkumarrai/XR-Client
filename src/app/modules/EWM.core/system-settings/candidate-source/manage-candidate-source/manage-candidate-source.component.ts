import { Component, OnInit } from '@angular/core';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CandidateSourceService } from 'src/app/modules/EWM.core/shared/services/candidate-source/candidate-source.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateSource, CandidateSourceList, CreateCandidateSource } from 'src/app/shared/models/candidate-source.model';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-candidate-source',
  templateUrl: './manage-candidate-source.component.html',
  styleUrls: ['./manage-candidate-source.component.scss']
})
export class ManageCandidateSourceComponent implements OnInit {
  public loading = false;

  candidateID: any;
  public currentMenuWidth: number;
  formGroupSource: FormGroup;

  public ddlStatusConfig: DRP_CONFIG;
  public maxMoreLengthForStatus: number = 5;
  public selectedStatusItem: any = {};

  public ddlTagConfig: DRP_CONFIG;
  public maxMoreLengthForTag: number = 4;
  public selectedTagItem: any = {};

  public ddlFolderConfig: DRP_CONFIG;
  public maxMoreLengthForFolder: number = 4;
  public selectedFolderItem: any = {};
  candidateSourceList: CandidateSourceList;
  candidateFrom: CandidateSource;
  candidateTo: CandidateSource
  isSatusValid: boolean = false;
  ToColorCode: string;
  public type: string = '';
  public isResponseGet: boolean = false;
  public IsSystemDefined: number;
  constructor(private appSettingsService: AppSettingsService, private serviceListClass: ServiceListClass, private fb: FormBuilder, private candidateSourceService: CandidateSourceService, private route: Router, private router: ActivatedRoute, private snackBService: SnackBarService, private translateService: TranslateService) {
    this.candidateID = this.appSettingsService.candidateID;
    this.candidateSourceList = new CandidateSourceList();
    this.candidateSourceList.From = new CandidateSource();
    this.candidateSourceList.To = new CandidateSource();
    this.formGroupSource = this.fb.group({
      sourceId: [[]],
      sourceName: [null, [Validators.required, this.noWhitespaceValidator(), Validators.maxLength(50)]],
      sourceDescription: [null, [Validators.required, this.noWhitespaceValidator(), Validators.maxLength(100)]]
    })
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(
      params => {
        if (params?.SourceId != undefined && params?.SourceId != null && params?.SourceId != '') {
          this.getSourceFormId(params?.SourceId);
        }
        if (params?.type) {
          this.type = params?.type;
        }
      })

    this.currentMenuWidth = window.innerWidth;

    this.bindConfigStatus();
    this.screenMediaQuiryForStatus();

    this.bindConfigTag();
    this.screenMediaQuiryForTag();

    this.bindConfigFolder();
    this.screenMediaQuiryForFolder();
  }

  bindConfigStatus() {
    this.ddlStatusConfig = {
      API: this.serviceListClass.getallStatusDetails + '?GroupId=' + this.candidateID + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo',
      MANAGE: '/client/core/administrators/group-master/status?groupId=' + this.candidateID,
      BINDBY: 'Code',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'label_candidate_source_status',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE: 'ProfileImage',
      FIND_BY_INDEX: 'Id'
    }
  }

  ddlChangeStatus(data) {
    if (data == null || data == "") {
      this.selectedStatusItem = null;
      this.isSatusValid = false;
    }
    else {
      this.selectedStatusItem = data;
      this.isSatusValid = true;
      this.ToColorCode = data?.ColorCode;
    }
  }

  screenMediaQuiryForStatus() {
    if (this.currentMenuWidth >= 240 && this.currentMenuWidth <= 767) {
      this.maxMoreLengthForStatus = 1;
    } else if (this.currentMenuWidth >= 767 && this.currentMenuWidth <= 900) {
      this.maxMoreLengthForStatus = 2;
    } else if (this.currentMenuWidth >= 900 && this.currentMenuWidth <= 1040) {
      this.maxMoreLengthForStatus = 3;
    } else {
      this.maxMoreLengthForStatus = 4;
    }
  }

  bindConfigTag() {
    this.ddlTagConfig = {
      API: this.serviceListClass.getCandidateTagAll + '?orderBy=Code,asc',
      MANAGE: '',
      BINDBY: 'DescriptionShort',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'label_candidate_source_tag',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: false,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE: '',
      FIND_BY_INDEX: 'Id'
    }
  }

  ddlChangeTag(data) {
    if (data == null || data == "") {
      this.selectedTagItem = null;
    }
    else {
      this.selectedTagItem = data;
    }
  }

  screenMediaQuiryForTag() {
    if (this.currentMenuWidth >= 240 && this.currentMenuWidth <= 767) {
      this.maxMoreLengthForTag = 1;
    } else if (this.currentMenuWidth >= 767 && this.currentMenuWidth <= 900) {
      this.maxMoreLengthForTag = 2;
    } else if (this.currentMenuWidth >= 900 && this.currentMenuWidth <= 1040) {
      this.maxMoreLengthForTag = 3;
    } else {
      this.maxMoreLengthForTag = 4;
    }
  }


  bindConfigFolder() {
    this.ddlFolderConfig = {
      API: this.serviceListClass.candidateFolderAllList + '?userType=CAND',
      MANAGE: '',
      BINDBY: 'FolderName',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'label_candidate_source_folder',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: false,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE: '',
      FIND_BY_INDEX: 'FolderId'
    }
  }

  ddlChangeFolder(data) {
    if (data == null || data == "") {
      this.selectedFolderItem = null;
    }
    else {
      this.selectedFolderItem = data;
    }
  }

  screenMediaQuiryForFolder() {
    if (this.currentMenuWidth >= 240 && this.currentMenuWidth <= 767) {
      this.maxMoreLengthForFolder = 1;
    } else if (this.currentMenuWidth >= 767 && this.currentMenuWidth <= 900) {
      this.maxMoreLengthForFolder = 2;
    } else if (this.currentMenuWidth >= 900 && this.currentMenuWidth <= 1040) {
      this.maxMoreLengthForFolder = 3;
    } else {
      this.maxMoreLengthForFolder = 4;
    }
  }

  getSourceFormId(sourceID: number) {
    this.loading = true;
    this.candidateSourceService.getCandidateSourceByID('?SourceId=' + sourceID)
      .subscribe(
        (data: any) => {
          this.loading = false;
          if (data.HttpStatusCode === 200) {
            this.IsSystemDefined = data.Data[0]?.IsSystemDefined,
            this.candidateSourceList.From = data.Data[0] as CandidateSource;
            this.formGroupSource.patchValue({
              sourceId: this.candidateSourceList.From?.SourceId,
              sourceName: this.candidateSourceList.From?.ApplicationSource,
              sourceDescription: this.candidateSourceList.From?.Description
            });
            this.selectedStatusItem = {
              'Id': this.candidateSourceList.From?.StatusId,
              'Code': this.candidateSourceList.From?.StatusName
            }
            this.isSatusValid = true;
            this.selectedFolderItem = this.candidateSourceList.From?.CandidateSourceFolder;
            this.selectedTagItem = this.candidateSourceList.From?.CandidateSourceTag.map(item => ({
              'Id': item.TagId,
              'DescriptionShort': item.TagName
            }));
          }
        }, err => {
          this.loading = false;
        });
  }

  onSave(value) {    
    if (this.formGroupSource.invalid) {
      return;
    }
    this.loading = true;
    var candidateSourceTo = new CandidateSource();
    candidateSourceTo.SourceId = value?.sourceId;
    candidateSourceTo.StatusId = this.selectedStatusItem?.Id;
    candidateSourceTo.StatusName = this.selectedStatusItem?.Code;
    candidateSourceTo.StatusColor = this.ToColorCode;
    if (Array.isArray(this.selectedFolderItem) && this.selectedFolderItem?.length > 0) {
      candidateSourceTo.CandidateSourceFolder = this.selectedFolderItem?.map(item => ({
        'FolderId': item?.FolderId,
        'FolderName': item?.FolderName
      }));
    } else {
      candidateSourceTo.CandidateSourceFolder = [];
    } if (Array.isArray(this.selectedTagItem) && this.selectedTagItem?.length > 0) {
      candidateSourceTo.CandidateSourceTag = this.selectedTagItem?.map(item => ({
        'TagId': item?.Id,
        'TagName': item?.DescriptionShort
      }));
    } else {
      candidateSourceTo.CandidateSourceTag = [];
    }
    candidateSourceTo.LastUpdated = new Date().getTime();
    this.candidateSourceList.To = candidateSourceTo;
    this.candidateSourceList.To.ApplicationSource = value?.sourceName;
    this.candidateSourceList.To.ApplicationSourceKey = this.candidateSourceList.From?.ApplicationSourceKey;
    this.candidateSourceList.To.Description = value?.sourceDescription;
    this.candidateSourceService.updateCandidateSource(this.candidateSourceList).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.route.navigate(['./client/core/system-settings/candidate-source']);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  //by maneesh ewm-18474 when:18/11/2024
  createCandidateSourceURL(value) {
    this.isResponseGet = true;
    if (this.formGroupSource.invalid) {
      return;
    }
    this.loading = true;
    var createCandidateSourceTo = new CreateCandidateSource();
    createCandidateSourceTo.ApplicationSource = value?.sourceName?.trim();
    createCandidateSourceTo.Description = value?.sourceDescription?.trim();
    createCandidateSourceTo.StatusId = this.selectedStatusItem?.Id;
    createCandidateSourceTo.StatusName = this.selectedStatusItem?.Code;
    if (Array.isArray(this.selectedFolderItem) && this.selectedFolderItem?.length > 0) {
      createCandidateSourceTo.CandidateSourceFolder = this.selectedFolderItem?.map(item => ({
        'FolderId': item?.FolderId,
        'FolderName': item?.FolderName
      }));
    } else {
      createCandidateSourceTo.CandidateSourceFolder = [];
    } if (Array.isArray(this.selectedTagItem) && this.selectedTagItem?.length > 0) {
      createCandidateSourceTo.CandidateSourceTag = this.selectedTagItem.map(item => ({
        'TagId': item?.Id,
        'TagName': item?.DescriptionShort
      }));
    } else {
      createCandidateSourceTo.CandidateSourceTag = [];
    }
    createCandidateSourceTo.LastUpdated = new Date().getTime();
    createCandidateSourceTo.StatusColor = this.ToColorCode;
    this.candidateSourceService.createCandidateSourceURL(createCandidateSourceTo).subscribe(
      repsonsedata => {
        this.loading = false;
        this.isResponseGet = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.isResponseGet = false;
          this.route.navigate(['./client/core/system-settings/candidate-source']);
        }
      }, err => {
        this.loading = false;
        this.isResponseGet = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  //by maneesh ewm-18474 when:18/11/2024 handel whitespace
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '')?.trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
}
