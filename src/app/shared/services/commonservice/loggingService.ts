// Handeling logging central depending upon appsetting [Abhishek]
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings.service'
import { Logging ,LogType} from '../../models';

@Injectable({
  providedIn: 'root'
})

export class loggingService{
    private _log: Logging;
    constructor(  private appSettingsService: AppSettingsService) {
        this._log = appSettingsService.logging;

     }

     xwmLog(linenumber:number,functionname:string,logtype:LogType,message :string):void
     {
        console.log(this._log.Info);
        if(logtype == LogType.Debug)
        {
            if(this._log.Debug == 1)
            {
                console.log("DEBUG:: Line:"+linenumber+" FunctionName:"+functionname + " Message:"+ message);
            }
        }
        if(logtype == LogType.Info)
        {

            if(this._log.Info == 1)
            {
                console.log("INFO:: Line:"+linenumber+" FunctionName:"+functionname + " Message:"+ message);
            }
        }
        if(logtype == LogType.Error)
        {
            if(this._log.Error == 1)
            {
                console.log("ERROR:: Line:"+linenumber+" FunctionName:"+functionname + " Message:"+ message);
            }
        }

     }

}