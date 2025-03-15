import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { KeywordSearch, ProfileDetails } from 'src/app/shared/models/job-screening';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-job-candidate-key-word-search',
  templateUrl: './job-candidate-key-word-search.component.html',
  styleUrls: ['./job-candidate-key-word-search.component.scss']
})
export class JobCandidateKeyWordSearchComponent implements OnInit {
  public isLoading: boolean = false;
  loading: boolean;
  candidateResumeData: KeywordSearch;
  canProfileData: ProfileDetails;
  loadingSearch: boolean = false;
  searchSubject$ = new Subject<any>();
  textToSearch: string;
  @Input() loaderAddInfo: boolean = true;

  @Input() set keywordSearchData(value: KeywordSearch) {
    this.candidateResumeData = value;
    if (value || value === null) { // api response received
      if (value) {
        this.getResumeByCandidateId();
      }
      else {
        this.candidateResumeData = null;
        this.canProfileData = null;
        this.isLoading = false;
      }
      this.loading = false;
    } else { // api not yet called
      this.loading = true;
    }
  }
  get resumeInfo() {
    return this.candidateResumeData;
  }
  constructor(public candidateService: CandidateService, private snackBService: SnackBarService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      if (val == '') {
        this.clearSearch();
      } else {
        this.highligthSearchText(val);
      }
    });
  }

  /*
@Type: File, <ts>
@Name: getResumeByCandidateId
@Who: Bantee
@When: 28-May-2023
@Why: EWM-1732.EWM-12540
@What: get candidate resume parse list for candidate
*/

  getResumeByCandidateId() {
    this.loading = true;
    this.isLoading = true;
    if (this.candidateResumeData) {
      this.canProfileData = this.candidateResumeData.ProfileDetails;
      this.loading = false;
      this.isLoading = false;

    }
  }

  /*
@Type: File, <ts>
@Name: highligthSearchTextVal function
@Who: Bantee
@When: 28-May-2023
@Why: EWM-1732.EWM-12540
@What: generic function to highlight search text
*/

  highligthSearchTextVal(e: any) {
    let textToSearch = e.target.value
    if (textToSearch != '') {
      // who:maneesh,what:ewm.10018 fixed loading, when:27/12/2022
      this.loadingSearch = true;

      this.searchSubject$.next(textToSearch);
    } else {
      this.loadingSearch = false;

      this.searchSubject$.next('');
    }

  }

  /*
@Type: File, <ts>
@Name: highligthSearchText function
@Who: Bantee
@When: 28-May-2023
@Why: EWM-1732.EWM-12540
@What: generic function to highlight search text
*/

  highligthSearchText(textToSearch) {
    //let textToSearch = e.target.value
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
        // window.scroll(0, 0);
        this.scrollTop();

      }
    }

    setTimeout(() => {
      if (textToSearch != '') {
        if (arr?.length == 0) {
          this.snackBService.showNoRecordDataSnackBar(this.translateService.instant('label_search_nomatch'), '400');
        }
      }
    }, 1500);
    this.loadingSearch = false;

  }


  /*
@Type: File, <ts>
@Name: clearSearch function
@Who: Bantee
@When: 28-May-2023
@Why: EWM-1732.EWM-12540
@What: generic function to clear search text
*/
  clearSearch() {
    this.textToSearch = "";
    let pattern = new RegExp(`${this.textToSearch}`, "gi");
    const documentAll = document.getElementsByClassName('inputval') as HTMLCollectionOf<Element> | null;
    for (var x = 0; x < documentAll?.length; x++) {
      documentAll[x].innerHTML = documentAll[x].textContent.replace(pattern, match => match);
    }
    this.scrollTop();
  }

  /*
@Type: File, <ts>
@Name: scrollTop function
@Who: Bantee
@When: 28-May-2023
@Why: EWM-1732.EWM-12540
@What: generic function to scroll top
*/
  scrollTop() {
    const maindiv = document.getElementById('scrolltop');
    maindiv.scrollTop = 0;
  }


  /*
@Type: File, <ts>
@Name: unMarkAll function
@Who: Bantee
@When: 28-May-2023
@Why: EWM-1732.EWM-12540
@What: generic function to unmark search text
*/
  unMarkAll(textToSearch) {
    let pattern = new RegExp(`${textToSearch}`, "gi");
    const documentAll = document.getElementsByClassName('inputval') as HTMLCollectionOf<Element> | null;
    for (var x = 0; x < documentAll?.length; x++) {
      documentAll[x].innerHTML = documentAll[x].textContent.replace(pattern, match => match);
    }
  }

  /*
@Type: File, <ts>
@Name: scrollData function
@Who: Bantee
@When: 28-May-2023
@Why: EWM-1732.EWM-12540
@What: generic function to scroll search text
*/
  scrollData() {
    // debugger;
    const highlightAll = document.getElementsByClassName('highlight') as HTMLCollectionOf<Element> | null;
    highlightAll[0].scrollIntoView({ behavior: "smooth", block: 'center' });
  }
}
