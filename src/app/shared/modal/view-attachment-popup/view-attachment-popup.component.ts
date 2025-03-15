/*
  @Name: view attachment component
  @Who: Nitin Bhati
  @When: 16-Oct-2023
  @Why: EWM-14663
  @What: for view attachment
*/
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilePreviwerPopupComponent } from '@app/modules/EWM.core/job/screening/file-previwer-popup/file-previwer-popup.component';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { AppSettingsService } from '../../services/app-settings.service';

@Component({
  selector: 'app-view-attachment-popup',
  templateUrl: './view-attachment-popup.component.html',
  styleUrls: ['./view-attachment-popup.component.scss']
})
export class ViewAttachmentPopupComponent implements OnInit {
  public fileType: string;
  public fileSizetoShow: any;
  public fileSize: number;
  public fileAttachments: any[] = [];
  maxUploadFile: any;
  loading: boolean = false;
  public showHideDocumentButtons: boolean = false;
  documentTypeOptions: any = [];
  public dirctionalLang: any;
  PreviewUrlPath: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public _appSetting: AppSettingsService,
    public dialogRef: MatDialogRef<ViewAttachmentPopupComponent>, public dialog: MatDialog, public systemSettingService: SystemSettingService, private http: HttpClient) {
    this.maxUploadFile = _appSetting.maxUploadFile;
    if (data != undefined) {
      this.fileType = data?.fileType;
      this.fileSizetoShow = data?.fileSizetoShow;
      this.fileSize = data?.fileSize;
      if (data?.fileAttachments?.length > 0) {
        let files = [];
        data?.fileAttachments.forEach(element => {
          if (element.hasOwnProperty('Path')) {
            files.push(element);
          }
        });
        let attachmentModel = files;
        attachmentModel.forEach(element => {
          const list = element?.Path?.split('.');
          const fileType = list[list?.length - 1];
          element['FileExtention'] = fileType;
        });
        this.fileAttachments = attachmentModel;
      }
    }
  }

  ngOnInit(): void {
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
    });
  }

  eventEmitDoubleClick(PreviewUrl: string, FileName: string, Path: string) {
    this.loading = true;
    this.PreviewUrlPath = Path;
    const list = PreviewUrl?.split('.');
    this.fileType = list[list?.length - 1];
    if (this.fileType?.toLowerCase() == 'zip' || this.fileType?.toLowerCase() == 'rar') {
      this.downloadData(PreviewUrl);
    } else {
      this.showResume(PreviewUrl, FileName);
    }
  }

  eventEmitSingleClick(Path: string) {
    this.PreviewUrlPath = Path;
  }

  public onDismiss() {
    document.getElementsByClassName("customAttachment")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("customAttachment")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ isFile: false }); }, 200);
  }

  showResume(PreviewUrl, FileName) {
    this.loading = false;
    var filename = PreviewUrl?.split('.').pop();
    let fname = 'resume.' + filename;
    const dialogRef = this.dialog.open(FilePreviwerPopupComponent, {
      data: new Object({ ResumeUrl: PreviewUrl, FileName: FileName ? FileName : fname, TabName: 'Attachment' }),
      panelClass: ['xeople-modal-full-screen', 'resume-docs', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
      }
    });
  }

  getIconColor(iconColor) {
    let FileTypeJson = this.documentTypeOptions?.filter(x => x['type'] === iconColor?.toLowerCase());
    let colorForIcon = FileTypeJson[0]?.iconColor;;
    return colorForIcon;
  }

  downloadData(url) {
    this.loading = false;
    window.open(url, '_blank');
  }



}
