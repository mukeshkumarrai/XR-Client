import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { json } from '@rxweb/reactive-form-validators';
import { delay } from 'rxjs/operators';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { AppSettingsService } from '../app-settings.service';
import { SnackBarService } from '../snackbar/snack-bar.service';
import { CommonserviceService } from './commonservice.service';

@Injectable({
  providedIn: 'root'
})
export class TextChangeLngService {

  // client = {
  //     singular:
  //     {
  //       client: 'Hospital',
  //       eng: 'Hospital',
  //       hin: 'अस्पताल',
  //       ara: 'مستشفى '
  //      },

  //     plural: {
  //       client: 'Hospitals',
  //       eng: 'Hospitals',
  //       hin: 'अस्पताल',
  //       ara: 'المستشفيات'
  //        },
  //   }


  // employee = {
  //   singular:
  //   {
  //     employee: "Worker",
  //     eng: "Worker",
  //     hin: "मज़दूर",
  //     ara: "عامل"
  //    },

  //   plural: {
  //     employee: "Workers",
  //     eng: "Workers",
  //     hin: "कर्मी",
  //     ara: "عمال"
  //   },
  // }

  constructor(private translateService: TranslateService, private _profileInfoService: ProfileInfoService,
    private snackBService: SnackBarService, private commonserviceService: CommonserviceService,
    private _appSetting: AppSettingsService) {

  }


  getData(data) {
    let clientData = JSON.parse(localStorage.getItem('client'));
    let lan = localStorage.getItem('Language')
    let result = {
      client: clientData[data][lan],
    };
    return (result);
  }

  getDataEmployee(data) {
    let clientData = JSON.parse(localStorage.getItem('employee'));
    let lan = localStorage.getItem('Language')
    let result = {
      employee: clientData[data][lan],
    };
    return (result);
  }

}
