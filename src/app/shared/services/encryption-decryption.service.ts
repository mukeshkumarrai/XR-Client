import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { AppSettingsService } from './app-settings.service';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EncryptionDecryptionService {
  encryptSecretKey = ""; //= "mySecretKeyHere!"; //adding secret key
  encrypted: any = "";
  decrypted: string;
  key: any;

  constructor(private appSettingsService: AppSettingsService) {
    this.encryptSecretKey = environment.encryptSecretKey;
  }
  //Data Encryption Function\

  encryptData(data) {
    this.encrypted = CryptoJS.AES.encrypt(data?.trim(), this.encryptSecretKey.trim()).toString();
    return this.encrypted;
  }

  decrypt(data) {
    this.decrypted = CryptoJS.AES.decrypt(data?.trim(), this.encryptSecretKey.trim()).toString(CryptoJS.enc.Utf8);
    return this.decrypted;
  }

}
