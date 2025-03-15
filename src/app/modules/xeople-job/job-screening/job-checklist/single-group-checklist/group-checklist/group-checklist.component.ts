/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: job-checklist.component.ts
 @Who: Nitin Bhati
 @When: 12-Sep-2023
 @Why: EWM-12599 EWM-13985
 @What: job-checklist
 */
import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder,FormGroup} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ViewAttachmentPopupComponent } from '@app/shared/modal/view-attachment-popup/view-attachment-popup.component';
import { TranslateService } from '@ngx-translate/core';
import { DataBindingDirective, GridComponent, SelectableSettings } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { CustomAttachmentPopupComponent } from 'src/app/shared/modal/custom-attachment-popup/custom-attachment-popup.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { DescriptionPopupComponent } from '../../popup/description-popup/description-popup.component';
@Component({
  selector: 'app-group-checklist',
  templateUrl: './group-checklist.component.html',
  styleUrls: ['./group-checklist.component.scss']
})
export class GroupChecklistComponent implements OnInit {

  public loading: boolean = false;
  public checkList: any[] = [];
  public checklistForm: FormGroup;
  originalProducts = [];
  isEditMode = false;
  @ViewChild('grid') grid: GridComponent;
  documentTypeOptions: any;
  iconFileType: any;
  fileType: any;
  fileSize: any;
  fileSizetoShow: string;
  fileInfo: string;
  filestatus: boolean = true;
  @Input() checklistType: any;
  @Input() candidateId: any;
  @Input() jobId: string;
  @Input() isEditable: boolean;
  fileInfoData: any;
  uploadFiles: any;
  @Input() resetComponent: Subject<any> = new Subject<any>();
  @Output() savedChecklist = new EventEmitter<any>();
  type: any;
  checkListGroupName: any;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  loadingRowIndex: string;
  @ViewChildren(MatExpansionPanel) accordion: QueryList<MatExpansionPanel>;
  multi = true;
  expanded: boolean = false;
  WorkflowChecklistStatus: any;
  @Input() EmailId: string;
  @Input() WorkFlowStageId: any;
  isEditModeChecklist = false;
  commentsRowIndex: number = 0;
  public fileAttachments: any[] = [];
  public fileAttachmentsOnlyTow: any[] = [];
  public selectedCallback = (args: { dataItem: {}; }) => args.dataItem;
  selectableSettings: SelectableSettings = {
    checkboxOnly: true
  }
  GroupId: number = 0;
  @Input() checklistId: number;
  SaveButtonFilter:any=[];
  public DescriptionResult = {
    Description:'',
    RowIndex:-1,
    IsMandatory:0,
    Action: 'SAVE',
    Source:''
  }
  constructor(private jobService: JobService, private formBuilder: FormBuilder, private snackBService: SnackBarService, private translateService: TranslateService, public dialog: MatDialog,
    private _appSetting: AppSettingsService, private _commonserviceService: CommonserviceService) {
    // initialise products form with empty form array
    this.checklistForm = this.formBuilder.group({
      checklistInfo: new FormArray([])
    });
    this.fileType = _appSetting.file_file_type_extralarge;
    this.fileSizetoShow = this._appSetting.file_file_size_extraExtraLarge;
    this._commonserviceService.groupchecklistServiceObsObj.subscribe((res: any) => {
      if (res) {
        this.type= 'Group';
        this.checkList = res;
         this.checkList.forEach(element => {
          element['checked'] = element.Status==1?true:false;
        });
        //this.resetForm();
        //setTimeout(() => {
        //  this.expanded = true;
        //this.checkList?.forEach((x, i) => {
        //  if(x.IsComment===1){  //x.Status===1 && 
        //    if(this.grid){
        //      this.grid?.editRow(i, <FormGroup>this.fa.controls[i]);
        //    }           
        //  }       
        //});
        //}, 1500);
        this.SaveButtonFilter = this.checkList?.filter(x => x['checked'] == true);
      }
    });
   }
  ngOnInit(): void {
  }
  // convenience getters for easy access to form fields
  get f() { return this.checklistForm.controls; }
  get fa() { return this.f.checklistInfo as FormArray; }

  onChangeChecklist(ob: MatCheckboxChange, rowIndex, item) {
    item.Status = item.checked==true?1:0;
    this.GroupId = item.Id
    this.commentsRowIndex = rowIndex;
    this.isEditModeChecklist = ob.checked;
    this.originalProducts = [...  this.checkList];
    this.isEditMode = true;
    this.checkList?.filter((x, i) => {
      if (i === rowIndex) {
        x.Status = x.Status;
      }
    })
    this.SaveButtonFilter = this.checkList?.filter(x => x['checked'] == true);
    this.resetForm();
    if(item?.IsComment===1){
      this.editAllRows();
    } 
    this.onSave();
  }

  /*
    @Name: createFormGroup function
    @Who: Nitin Bhati
    @When: 12-Sep-2023
    @Why: EWM-12599 EWM-13985
    @What: create formgroup
  */
  private createFormGroup(product: any = {}) {
    // create a new form group containing controls and validators for a product
    return this.formBuilder.group({
      Id: [product.Id],
      QstId: [product.QstId],
      TaskName: [product.TaskName],
      Comments: [product.Comments],
      Status: [product.Status],
      Files: [product.Files]
    })
  }

  /*
    @Name: resetForm function
    @Who: Nitin Bhati
    @When: 12-Sep-2023
    @Why: EWM-12599 EWM-13985
    @What: on  reset rows checklist
  */
  private resetForm() {
    // clear form array and create a new form group for each product
    this.fa.clear();
    this.checkList.forEach((x, i) => {
      this.fa.push(this.createFormGroup(x));
    });
  }

  /*
    @Name: editAllRows function
    @Who: Nitin Bhati
    @When: 12-Sep-2023
    @Why: EWM-12599 EWM-13985
    @What: on  edit mode rows checklist
  */
  private editAllRows() {
    //this.expanded = false;
    //if (this.isEditModeChecklist == true) {
    //  this.grid.editRow(this.commentsRowIndex, <FormGroup>this.fa.controls[this.commentsRowIndex]);
    //} else {
    //  this.grid.closeRow(this.commentsRowIndex);
    //}
  }

  /*
   @Name: onCancel function
   @Who: Nitin Bhati
   @When: 12-Sep-2023
   @Why: EWM-12599 EWM-13985
   @What: on cancel edit mode rows checklist
 */
  onCancel() {
    this.closeAllRows();
    this.checkList = this.originalProducts;
    this.isEditMode = false;
  }

  /*
   @Name: closeAllRows function
   @Who: Nitin Bhati
   @When: 12-Sep-2023
   @Why: EWM-12599 EWM-13985
   @What: on close edit mode rows checklist
 */
  private closeAllRows() {
    this.checkList.forEach((x, i) => {
      if (this.grid) {
        this.grid.closeRow(i);
      }
    });
  }

  /*
  @Name: onSave function
  @Who: Nitin Bhati
  @When: 12-Sep-2023
  @Why: EWM-12599 EWM-13985
  @What: on save for checklist
*/
  onSave() {
    this.checklistForm.markAllAsTouched();
    if (this.checklistForm.invalid) {
      return;
    }
    this.isEditMode = false;
    this.updateCheckList();
  }

  /*
    @Name: updateCheckList function
    @Who: Nitin Bhati
    @When: 12-Sep-2023
    @Why: EWM-12599 EWM-13985
    @What: on update status for checklist
  */

  updateCheckList() {
    this.loading = true;
    let parentobj = [];
    if (this.checklistForm.value.checklistInfo.length > 0) {
      this.checklistForm.value.checklistInfo.forEach((x, index) => {
        parentobj.push({
          'Id': x.Id,
          'JobId': this.jobId,
          'StageId': this.WorkFlowStageId, 
          'CandidateId': this.candidateId,
          'ChecklistId': this.checklistId,
          'QstId': x.QstId,
          'TaskName': x.TaskName,
          'Comments': x.Comments,
          'Status': x.Status,
          'Files': x.Files
        })
      });
    } else {
      this.checkList.forEach((x, index) => {
        parentobj.push({
          'Id': x.Id,
          'JobId': this.jobId,
          'StageId': this.WorkFlowStageId, 
          'CandidateId': this.candidateId,
          'ChecklistId': this.checklistId,
          'QstId': x.QstId,
          'TaskName': x.TaskName,
          'Comments': x.Comments,
          'Status': x.Status,
          'Files': x.Files
        })
      });
    }
    this.jobService.updateChecklistInfo(parentobj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.closeAllRows();
          this.savedChecklist.emit(this.checkList);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
    @Name: onCommentChange function
    @Who: Nitin Bhati
    @When: 12-Sep-2023
    @Why: EWM-12599 EWM-13985
    @What: on change comment for checklist
  */

  onCommentChange(event: any, rowIndex: number, type: string, groupCheckList: any) {
      if (type === 'Single') {
      this.checkList?.filter((x, i) => {
        if (i === rowIndex) {
          x.Comments = event;
        } else {
          x.Comments = x.Comments;
        }
      })
    } else {
      this.checkListGroupName?.filter(x => {
        if (x['CheckListName'] === groupCheckList) {
          x['CheckListQst'].filter((com, k) => {
            if (k === rowIndex) {
              com.Comments = event;
            } else {
              com.Comments = com.Comments;
            }
            this.checkList.push(com);
          })
        }
      });
    }
    this.checklistForm.patchValue({
      'checklistInfo': this.checkList
    })
  }
  /*
  @Name: checkListOpen function
  @Who: Nitin Bhati
  @When: 16-Oct-2023
  @Why: EWM-14663
  @What: for view attachment
*/
   openMultipleAttachmentModal(fileAttachments: any, rowIndex: number, type: string, groupCheckList: any) {
    this.loadingRowIndex = rowIndex + groupCheckList;
    let files = [];
    fileAttachments?.forEach(element => {
      if (element.hasOwnProperty('Path')) {
        files.push(element);
      }
    });
    const dialogRef = this.dialog.open(CustomAttachmentPopupComponent, {
      maxWidth: "600px",
      data: new Object({
        fileType: this.fileType, fileSize: this.fileSize, fileSizetoShow: this.fileSizetoShow,
        fileAttachments: files
      }),
      width: "100%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'customAttachment', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res?.isFile == true) {
        this.fileAttachments = [];
        this.fileAttachments = res?.fileAttachments;
         this.checkList.filter((x, i) => {
          if (i === rowIndex) {
            x.Files = res?.fileAttachments;
            x.Comments = x.Comments;
          }
        });
        this.checkList = [...  this.checkList];
        this.checklistForm.patchValue({
          'checklistInfo': this.checkList
        })
      }
    })
  }
  openViewAttachmentModal(fileAttachments: any, rowIndex: number, type: string, groupCheckList: any) {
    this.loadingRowIndex = rowIndex + groupCheckList;
    let files = [];
    fileAttachments?.forEach(element => {
      if (element.hasOwnProperty('Path')) {
        files.push(element);
      }
    });
    const dialogRef = this.dialog.open(ViewAttachmentPopupComponent, {
      maxWidth: "600px",
      data: new Object({
        fileType: this.fileType, fileSize: this.fileSize, fileSizetoShow: this.fileSizetoShow,
        fileAttachments: files
      }),
      width: "100%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'customAttachment', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res?.isFile == true) {
        this.fileAttachments = [];
        this.fileAttachments = res?.fileAttachments;
         this.checkList.filter((x, i) => {
          if (i === rowIndex) {
            x.Files = res?.fileAttachments;
            x.Comments = x.Comments;
          }
        });
        this.checkList = [...  this.checkList];
        this.checklistForm.patchValue({
          'checklistInfo': this.checkList
        })
      }
    })
  }

  openDialogforDescription(rowIndex:number,item: any) {
    this.DescriptionResult.RowIndex=rowIndex;
    this.DescriptionResult.Source='GROUP';
    this.DescriptionResult.Description=item.Comments;
    this.DescriptionResult.IsMandatory=item.IsMandatory;
    const dialogRef = this.dialog.open(DescriptionPopupComponent, {
        panelClass: ['xeople-modal-md', 'add_jobDescription', 'animate__animated', 'animate__zoomIn'],
        data: { 'DescriptionData': this.DescriptionResult},
        disableClose: true,
       });
       dialogRef.afterClosed().subscribe(res => {
        if(res.Action=='SAVE'){
          if(item.Comments!=this.DescriptionResult.Description){
            this.DescriptionResult=res;
            this.checkList?.filter((x, i) => {
              if (i === rowIndex) {
                x.Comments = this.DescriptionResult.Description;
              } else {
                x.Comments = x.Comments;
              }
            });

            this.checklistForm.patchValue({
              'checklistInfo': this.checkList
            })
            this.SaveChecklist(item,rowIndex);
          //this.quickJobForm.patchValue({
          //  DescriptionDetails: DescriptionData
          //});
          //this.DescriptionValue = DescriptionData;
          }
        }
        else if(res.Action=='DISMISS'){
          this.DescriptionResult=res;
        }
       });
   
     }
SaveChecklist(item,rowIndex){
    this.GroupId = item.Id
    this.commentsRowIndex = rowIndex;
    //item.checked = !item.checked;
    item.Status = item.checked==true?1:0;
    this.originalProducts = [...  this.checkList];
    this.isEditMode = true;
    this.checkList?.filter((x, i) => {
      if (i === rowIndex) {
        x.Status = x.Status;
      }
    })
    this.SaveButtonFilter = this.checkList?.filter(x => x['checked'] == true);
    this.resetForm();
    if(item?.IsComment===1){
      this.editAllRows();
    } 
    this.onSave();
  }

}
