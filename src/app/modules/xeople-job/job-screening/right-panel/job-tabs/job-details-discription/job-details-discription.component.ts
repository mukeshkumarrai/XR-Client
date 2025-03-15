//  @When: 18-09-2023 @who:maneesh @why: EWM-13769 @what: create component for job deiscription 
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BroadbeanService } from 'src/app/modules/EWM.core/shared/services/broadbean/broadbean.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ShowDiscriptionComponent } from '../show-discription/show-discription.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
@Component({
  selector: 'app-job-details-discription',
  templateUrl: './job-details-discription.component.html',
  styleUrls: ['./job-details-discription.component.scss']
})
export class JobDetailsDiscriptionComponent implements OnInit {
  jobHeaderDetails: any = []
  @Input() loaderAddInfo: boolean = true;
  searchSubject$ = new Subject<any>();
  loadingSearch: boolean = false;
  public dirctionalLang: any;
  public textToSearch: string;
  public fileUrl;
  @ViewChild('pdfTable') pdfTable: ElementRef;

  discriptionDATA: any;
  pdfByteArrays = [];
  public loading: boolean = false;
  constructor(public dialog: MatDialog, private _broadBeanService: BroadbeanService, private sanitizer: DomSanitizer,
    private snackBService: SnackBarService, private translateService: TranslateService,
    public _commonService: CommonserviceService) { }

  ngOnInit(): void {
    this._broadBeanService.onJobHeaderDetailsSelected.subscribe((headerDiscription: any) => {
      this.jobHeaderDetails = headerDiscription?.HeaderDetails?.JobDetails?.Description;
    })
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      if (val == '') {
        this.clearSearch();
      } else {
        this.highligthSearchText(val);
      }
    });

  }

//  @When: 18-09-2023 @who:maneesh @why: EWM-13769 @what: highligthSearchTextVal for keyword search
  highligthSearchTextVal(e: any) {
    let textToSearch = e.target.value
    if (textToSearch != '') {
      this.loadingSearch = true;
      this.searchSubject$.next(textToSearch);
    } else if(textToSearch=='') {
      //  this.pdfData=true;
      this.loadingSearch = false;
      this.searchSubject$.next('');

    }

  }
//  @When: 18-09-2023 @who:maneesh @why: EWM-13769 @what: highligthSearchText for keyword search
  highligthSearchText(textToSearch) {
    textToSearch = textToSearch.trim().replace(/([.^$|*+?()\[\]{}\\-])/g, "\\$1");
    this.unMarkAll(textToSearch);
    let pattern;
    try {
      pattern = new RegExp(`${textToSearch}`, "gi");
    }
    catch {
      this.loadingSearch = false;
      this.snackBService.showNoRecordDataSnackBar(this.translateService.instant('label_search_nomatch'), '400');
      return;
    }
    const documentAll = document.getElementsByClassName('inputval') as HTMLCollectionOf<Element> | null;

    let arr = [];
    for (var x = 0; x < documentAll?.length; x++) {
      if (documentAll[x].innerHTML.toLowerCase().match(textToSearch.toLowerCase())) {
        documentAll[x].innerHTML = documentAll[x].textContent.replace(pattern, match => `<span class="highlight"><mark>${match}</mark></span>`);
        arr.push(textToSearch);
        
        this.scrollData();
      } else {
        documentAll[x].innerHTML = documentAll[x].textContent.replace(pattern, match => match);
        this.scrollTop();

      }
    }

    setTimeout(() => {
      if (textToSearch != '') {
        if (arr?.length == 0) {
          document.getElementById('pdfTable').innerHTML= this.jobHeaderDetails;
          this.snackBService.showNoRecordDataSnackBar(this.translateService.instant('label_search_nomatch'), '400');
        }
      }
    }, 1500);
    this.loadingSearch = false;

  }
  unMarkAll(textToSearch) {
    let pattern = new RegExp(`${textToSearch}`, "gi");
    const documentAll = document.getElementsByClassName('inputval') as HTMLCollectionOf<Element> | null;
    for (var x = 0; x < documentAll?.length; x++) {
      documentAll[x].innerHTML = documentAll[x].textContent.replace(pattern, match => match);
    }
  }
//  @When: 18-09-2023 @who:maneesh @why: EWM-13769 @what: showDiscription for show discription click on expand icon
  showDiscription(jobHeaderDetails) {
    const dialogRef = this.dialog.open(ShowDiscriptionComponent, {
      data: new Object({ Discription: jobHeaderDetails }),
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
  scrollData() {
    // debugger;
    const highlightAll = document.getElementsByClassName('highlight') as HTMLCollectionOf<Element> | null;
    highlightAll[0]?.scrollIntoView({ behavior: "smooth", block: 'center' });
  }
  scrollTop() {
    const maindiv = document.getElementById('scrolltop');
    maindiv.scrollTop = 0;
  }
  clearSearch() {
   this.textToSearch = "";
   document.getElementById('pdfTable').innerHTML= this.jobHeaderDetails;

  }
//  @When: 18-09-2023 @who:maneesh @why: EWM-13769 @what:  for print discription
  print() {
    const printContents = document.getElementById('pdfTable').innerHTML;
    const printableContent = this.sanitizer.bypassSecurityTrustHtml(printContents);
    const popupWin = window.open('', '_blank', 'width=900,height=600');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Job Description</title>
        </head>
        <body >
        <div [innerHTML]=" ${printableContent}"></div>
        <script type="text/javascript">
          window.onload = function() {
            window.print();
            window.addEventListener('click', function () {
              window.close(); // Close the window when a click event occurs
            });
            setTimeout(function() {
              window.close();
            }, 10);
            window.onafterprint = function() {
            window.close();
            }
          }
        </script></body>
      </html>
    `);
    popupWin.document.close();
  }

  /*
  
  @Type: File, <ts> 
  @Name: downloadJobDescription function  @Who: Mukesh 
  @What: download job description 
  */
  downloadJobDescription() {
    this.loading = true;
    let fileObj = {};
    fileObj['Html'] = '<html><head></head><body>' + this.jobHeaderDetails + '</body></html>';
    fileObj['Filename'] = 'JobDescription.pdf';
    fileObj['FileType'] = 'pdf';
    this.loading = true;
    this._commonService.downloadPdf(fileObj).subscribe(
      (data: any) => {
        this.loading = false;
        const Url = URL.createObjectURL(data)
        let fileName = 'JobDescription.pdf';
        this.loading = false;
        this.downloadFile(data, fileName);
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.loading = false;
      })
  }
  /*
  
  @Type: File, <ts> 
  @Name: downloadJobDescription function  @Who: Mukesh 
  @What: download job description 
  */
  private downloadFile(data, filename) {
    const downloadedFile = new Blob([data], { type: data.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = filename;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }
}
