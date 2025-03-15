import { Injectable } from '@angular/core';
import { Actions } from '../interface/actions';

@Injectable({
  providedIn: 'root'
})
export class ActionserviceService {
  constants: Actions = {
    PERSONAL_INFO: 'PERSONAL_INFO',
    DOCUMENT_INFO: 'DOCUMENT_INFO',
    KNOCK_OUT: 'KNOCK_OUT',
  
  };
}
