import { Injectable } from '@angular/core';
declare var webkitSpeechRecognition: any;
@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {
  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords: any;
  transcript_arr = [];
  confidence_arr = [];
  isStarted = false; //<< this Flag to check if the user stop the service
  isStoppedAutomatically = true; //<< this Flag to check if the service stopped automaticically.
  constructor() {}

  init() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.addEventListener('result', (e: any) => {

      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.transcript_arr.push(transcript);
      this.tempWords = transcript;
      const confidence = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.confidence)
        .join('');
      this.confidence_arr.push(confidence);
    });

    this.recognition.addEventListener('end', (condition: any) => {
      this.wordConcat();
      if (this.isStoppedAutomatically) {
        this.recognition.stop();
        this.recognition.start();
        this.isStoppedAutomatically = true;
      }
    });
  }

  start() {
    if (!this.isStarted) {
      this.recognition.start();
      this.isStarted = true;
    }
    return true;
  }
  stop(preFetchVal:string) {
    if (this.isStarted) {
      this.isStoppedAutomatically = false;
      this.wordConcat(preFetchVal);
      this.recognition.stop();
      this.isStarted = false;
    }
    return false;
  }

  wordConcat(preFetchVal?:string) {
    this.text = preFetchVal?preFetchVal:''+' '+this.text + ' ' + this.tempWords;
    this.tempWords = '';
  }
  startListening(preFetchVal?:string): Promise<string> {
    this.isStarted = true;
    this.tempWords = '';
    return new Promise((resolve, reject) => {
      this.recognition.onresult = (event) => {
         const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');

          this.transcript_arr.push(transcript);
          this.tempWords = transcript;
          this.text=''
          this.text = (preFetchVal?preFetchVal:'') +' '+this.text + ' ' + this.tempWords;
          const confidence = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.confidence)
            .join('');
          this.confidence_arr.push(confidence);


        const result = event.results[0][0].transcript;
        resolve(this.text);
      };

      this.recognition.onerror = (event) => {
        reject(event.error);
      };

      this.recognition.start();
    });
  }

  stopListening() {
    if (this.isStarted) {
      this.isStoppedAutomatically = false;
      this.recognition.stop();
      this.isStarted = false;
    }
    return false;

  }
}
