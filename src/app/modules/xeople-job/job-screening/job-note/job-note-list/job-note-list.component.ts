import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
@Component({
  selector: 'app-job-note-list',
  templateUrl: './job-note-list.component.html',
  styleUrls: ['./job-note-list.component.scss']
})
export class JobNoteListComponent implements OnInit {
  notesInfo:any;
  gridList: any;
  public userpreferences: Userpreferences;
  documentTypeOptions: any;
  hoverIndex: number;
  public loading: boolean = true;
  selectedItemListForActiveClass = null;
  public isReadMore: any[] = [false];
  public searchSubject$ = new Subject<any>();
  public searchNotes: Subscription;
  public loadingSearch: boolean;
  public searchValue:string='';
  public gridListData: any = [];
  animationVar: any;
  constructor(public dialogRef: MatDialogRef<JobNoteListComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private jobService: JobService, public _userpreferencesService: UserpreferencesService,
    private snackBService: SnackBarService, private translateService: TranslateService, private http: HttpClient,) {
    this.notesInfo = data; 
    this.userpreferences = this._userpreferencesService.getuserpreferences();

    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
    })

  }


  ngOnInit(): void {
    this.getNoteListPage(this.searchValue);
          //  who:maneesh:what:ewm-15142 for searchdata,when:20/11/2023
          this.searchNotes= this.searchSubject$.pipe(debounceTime(1000)).subscribe(value => {
            this.loadingSearch = true;
            this.getNoteListPage(value);
          });
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


          //  who:maneesh:what:ewm-15142 for unsubcribe data,when:20/11/2023
  ngOnDestroy(): void {
    this.searchNotes?.unsubscribe();
  }
  getIcon(uploadDocument) {
    if (uploadDocument) {

      const list = uploadDocument.split('.');
      const fileType = list[list.length - 1];
      let FileTypeJson = this.documentTypeOptions.filter(x => x['type'] === fileType.toLocaleLowerCase());
      if (FileTypeJson[0]) {
        let logo = FileTypeJson[0].logo;
        return logo;
      }

    }
  }

  sortName(fisrtName, lastName) {
    const Name = fisrtName;
    const ShortName = Name.match(/\b(\w)/g).join('');
    return ShortName.toUpperCase();

  }



  /*
@Type: File, <ts>
@Name: getNoteListPage function
@Who: Bantee
@When: 5-June-2023
@Why: EWM-11780 EWM-12635
@What: on navigating to the note page for edit/delete 
*/
  getNoteListPage(value) {
      //  who:maneesh:what:ewm-15142 for  searchdata ,function:onFilterClear,when:20/11/2023
     if (this.searchValue!='' || value!='') {
        this.notesInfo.Search=value;
      }else if (value=='') {
        this.notesInfo.Search=null;
      }
    this.jobService.getJobActionNotes(this.notesInfo)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.gridList = data.Data;
            this.gridListData = data.Data;
            this.loadingSearch = false;
          }
          else if (data.HttpStatusCode === 204) {
            this.gridList = [];
            this.gridListData = data.Data;

            this.loadingSearch = false;
          }
          else {
            this.gridListData = data.Data;
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loadingSearch = false;
          }
          this.loading = false;
          this.loadingSearch = false;
        // who:bantee,what:ewm-13525 ,when:16/08/2023

          this.gridList?.forEach(x =>
            { if(x.Description.indexOf('<img')==-1){
              // @When: 02-04-2024 @who:Amit @why: EWM-16545 @what: replace tag comment
              // x.Description = x.Description?.replace(/(<([^>]+)>)/ig, '')
            }
              
              });

        }, err => {

          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loading = false;
          this.loadingSearch = false;

        });
    // this.loading = false;

  }


  onHover(i: number) {
    this.hoverIndex = i;
    var element = document.getElementById("flex-box-hover");
    if (i != -1) {
      element.classList.add("test");
    } else {
      this.hoverIndex = i;

      element.classList.remove("test");
    }
  }

  /*
@Type: File, <ts>
@Name: edit function
@Who: Bantee
@When: 5-June-2023
@Why: EWM-11780 EWM-12635
@What: on navigating to the note page for edit/delete 
*/
  editNotes() {
    let url = window.location.href.replace('tabIndex=0', 'tabIndex=3');
    window.open(url, '_blank')
  }


  /*
@Type: File, <ts>
@Name: onDismiss function
@Who: Bantee
@When: 5-June-2023
@Why: EWM-11780 EWM-12635
@What: to close the pop up 
*/
  onDismiss() {
    document.getElementsByClassName("quick-modal-drawer")[0].classList.remove("animate__slideInRight")
    document.getElementsByClassName("quick-modal-drawer")[0].classList.add("animate__slideOutRight");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }


    /* 
  @Name: getBackgroundColor function
  @Who: Bantee Kumar
  @When: 23-06-2023
  @Why: EWM-7926
  @What: set background color
*/
getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }

}
      //  who:maneesh:what:ewm-15142 for searchdata ,function:onFilter,when:20/11/2023
      public onFilter(inputValue: string): void {
        // if (inputValue?.length > 0 && inputValue?.length < 3) {
        //   this.loadingSearch = false;
        //   return;
        // }
        this.searchValue=inputValue;
        this.searchSubject$.next(inputValue);
      }
      //  who:maneesh:what:ewm-15142 for clear searchdata ,function:onFilterClear,when:20/11/2023
      public onFilterClear(): void {
        this.searchValue = ''; 
        this.getNoteListPage('');
    
      }
          /*
  @Type: File, <ts>
  @Name: refreshComponent function
  @Who:maneesh
  @When: 12-12-2023
  @Why: EWM-15412
  @What: refreshComponent for refress  get client list
*/
refreshComponent(){
  this.getNoteListPage(this.searchValue);
}

}
