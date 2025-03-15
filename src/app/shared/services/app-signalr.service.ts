import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppSignalrService {
  //private hubConnection: signalR.HubConnection;
 // applicationParam= localStorage.getItem('Token');
  //applicationURL='wss://localhost:7042/NotificationHub?access_token='+this.applicationParam;
  // applicationURL='wss://webnotification-dev-ewm.entiredev.in/NotificationHub?access_token='+'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiJlZWI1ZDdiOS1lZmU4LTRiNzctYjg1Ni0wNTgyMzFiNTMxNGYiLCJVTmFtZSI6IlZpdmVrICBCYXRyYSIsIlRlbmFudElkIjoiMWRlMTJkZTEtMTM3ZS00YjkxLThlNDAtMDc5Yjc5NmYxYzFmIiwiRGV2aWNlIjoiV2ViIiwiSVAiOiIxMDMuMTYwLjY0LjEzMiIsIk9yZ2FuaXphdGlvbklkIjoiOTc0NGZlZjgtMmE2My00Yjg1LTg3NmYtYzBjNGNhMWUzNWFkIiwiVXNlclR5cGUiOiIzIiwianRpIjoiNEYxOUI2REEtN0Q0Ny00QTMwLTkwQTgtNjU3RTEwOEVFMTZFIiwiSXNDaGVja1Nlc3Npb24iOiIxIiwiVGltZVpvbmVJZCI6IkF1c3RyYWxpYS9QZXJ0aCIsIlgtQ29kZSI6IntcIlNlcnZpY2VOYW1lXCI6XCJBdWRpdFwiLFwiUHJpbWFyeVJlYWRcIjpcIlUyRnNkR1ZrWDE5eGtLdE9tVS90b2NqNVVvUDk3aDkxKzR1ak5UaHJMaEM3S2V0WTdkeitIZDF1NmxiQVBsdFVwZnFnNllQNmRUcVJiRVBjTTE4dmNtOCtUZ1hmbUVhcHZqbllHK2JxclZRPVwiLFwiU2Vjb25kYXJ5UmVhZFwiOlwiVTJGc2RHVmtYMTl4a0t0T21VL3RvY2o1VW9QOTdoOTErNHVqTlRockxoQzdLZXRZN2R6K0hkMXU2bGJBUGx0VXBmcWc2WVA2ZFRxUmJFUGNNMTh2Y204K1RnWGZtRWFwdmpuWUcrYnFyVlE9XCIsXCJQcmltYXJ5V3JpdGVcIjpcIlUyRnNkR1ZrWDE5eGtLdE9tVS90b2NqNVVvUDk3aDkxKzR1ak5UaHJMaEM3S2V0WTdkeitIZDF1NmxiQVBsdFVwZnFnNllQNmRUcVJiRVBjTTE4dmNtOCtUZ1hmbUVhcHZqbllHK2JxclZRPVwiLFwiU2Vjb25kYXJ5V3JpdGVcIjpcIlUyRnNkR1ZrWDE5eGtLdE9tVS90b2NqNVVvUDk3aDkxKzR1ak5UaHJMaEM3S2V0WTdkeitIZDF1NmxiQVBsdFVwZnFnNllQNmRUcVJiRVBjTTE4dmNtOCtUZ1hmbUVhcHZqbllHK2JxclZRPVwiLFwiRGJUeXBlXCI6XCJVMkZzZEdWa1gxOHhEL2RYMXV5ckhPQzZQUnQxVHZVVUUybTg3ZlJDQ0NJPVwifSIsIm5iZiI6MTcwOTE4Mjc3OSwiZXhwIjoxNzA5MjE4Nzc5LCJpYXQiOjE3MDkxODI3Nzl9.mAGbT6Z2d1h2oT8KFXGW56DJ4EBSIoNrstMGWB2YAW4';
  // constructor() { 
  //   console.log("URL:",this.applicationURL);
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //   .configureLogging(signalR.LogLevel.Debug)
  //    .withUrl(this.applicationURL, {
  //      skipNegotiation: true,
  //      transport: signalR.HttpTransportType.WebSockets
  //    }).build();
  // }
  // startConnection(): Observable<void> {
  //   return new Observable<void>((observer) => {
  //     this.hubConnection
  //       .start()
  //       .then(() => {
  //         console.log('Connection established with SignalR hub');
  //         observer.next();
  //         observer.complete();
  //       })
  //       .catch((error) => {
  //         console.error('Error connecting to SignalR hub:', error);
  //         observer.error(error);
  //       });
  //   });
  // }

  // receiveMessagepop(): Observable<string> {
  //   return new Observable<any>((observer) => {
  //     this.hubConnection.on('pop', (type) => {
  //       observer.next(type);
  //     });
  //   });
  // }

  // receiveMessagebell(): Observable<string> {
  //   return new Observable<any>((observer) => {
  //     this.hubConnection.on('bell', (type) => {
  //       console.log("bell:",type);
  //       observer.next(type);
  //     });
  //   });
  // }

  // sendMessage(message: string): void {
  //   this.hubConnection.invoke('SendMessage', message);
  // }

}
