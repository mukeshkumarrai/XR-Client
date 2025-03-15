/*
@(C): Entire Software
@Type: File, <html>
@Name: captcha.component
@Who: Satya Prakash Gupta
@When: 31-Jan-2022
@Why: EWM-4643 EWM-4857
@What: this page for capcha
*/
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
//import {CaptchaService} from './captcha.service';

@Component({
  selector: 'app-common-captcha',
  templateUrl: './common-captcha.component.html',
  styleUrls: ['./common-captcha.component.scss']
})
export class CommonCaptchaComponent implements OnChanges {
  
  @Input("config") config: any = {};
  @Output() captchaCodeResult = new EventEmitter();
  captch_input:any = null;
  code: any = null;
  resultCode:any = null;


  constructor(){}

  ngOnChanges() {
    if (this.config) {
      if (!this.config.length) {
        this.config["length"] = 5;
         }
   this.createCaptcha()
    }
  }

  
  createCaptcha() {
    let showNum = [];
    let canvasWinth = 150;
    let canvasHeight = 30;
    setTimeout(() => {
    let canvas:any = document.getElementById('valicode');
    var context = canvas.getContext('2d');
    canvas.width = canvasWinth;
    canvas.height = canvasHeight;

    let sCode = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9';
    let saCode = sCode.split(',');
    let saCodeLen = saCode.length;
    for (let i = 0; i <= this.config.length; i++) {
      let sIndex = Math.floor(Math.random()*saCodeLen);
      let sDeg = (Math.random()*30*Math.PI) / 180;
      let cTxt = saCode[sIndex];
      showNum[i] = cTxt;
      let x = 10 + i*20;
      let y = 20 + Math.random()*8;
      context.font = 'bold 23px 微软雅黑';
      context.translate(x, y);
      context.rotate(sDeg);
  
      context.fillStyle = this.randomColor();
      context.fillText(cTxt, 0, 0);
  
      context.rotate(-sDeg);
      context.translate(-x, -y);
    }
    for (let i = 0; i <= 5; i++) {
      context.strokeStyle = this.randomColor();
      context.beginPath();
      context.moveTo(
        Math.random() * canvasWinth,
        Math.random() * canvasHeight
      );
      context.lineTo(
        Math.random() * canvasWinth,
        Math.random() * canvasHeight
      );
      context.stroke();
    }
    for (let i = 0; i < 30; i++) {
      context.strokeStyle = this.randomColor();
      context.beginPath();
      let x = Math.random() * canvasWinth;
      let y = Math.random() * canvasHeight;
      context.moveTo(x,y);
      context.lineTo(x+1, y+1);
      context.stroke();
    }
    this.resultCode = showNum.join('');
  },100)
  }



  randomColor () {
    let r = Math.floor(Math.random()*256);
    let g = Math.floor(Math.random()*256);
    let b = Math.floor(Math.random()*256);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }


  checkCaptcha() {
    if (this.captch_input !== this.resultCode) {
      this.captchaCodeResult.emit({'isValid':false, 'inputValue':this.captch_input,'resultValue':this.resultCode});
      
    } else  {
      this.captchaCodeResult.emit({'isValid':true, 'inputValue':this.captch_input,'resultValue':this.resultCode});
    }

  }

  playCaptcha() {
    var msg = new SpeechSynthesisUtterance(this.resultCode);
    msg.pitch = 0.1;
    window.speechSynthesis.speak(msg);
  }
  
}