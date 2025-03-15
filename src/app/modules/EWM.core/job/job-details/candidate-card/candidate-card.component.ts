import { Component, Input, OnInit } from '@angular/core';
import { Userpreferences } from '@app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';

@Component({
  selector: 'app-candidate-card',
  templateUrl: './candidate-card.component.html',
  styleUrls: ['./candidate-card.component.scss']
})
export class CandidateCardComponent implements OnInit {
  @Input() can: any;
  public timezonName: any = localStorage.getItem('UserTimezone');
  public TimeZone: any= localStorage.getItem('TimeZone')
  public userpreferences: Userpreferences;
  constructor(public _userpreferencesService: UserpreferencesService) { }

  ngOnInit() {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
console.log('child ',this.can)
  }

}
