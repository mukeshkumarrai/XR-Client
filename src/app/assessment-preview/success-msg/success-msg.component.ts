import { Component, Input, OnInit } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';

@Component({
  selector: 'app-success-msg',
  templateUrl: './success-msg.component.html',
  styleUrls: ['./success-msg.component.scss']
})
export class SuccessMsgComponent implements OnInit {

  @Input() patternId:any;
  @Input() totalSections:any;
  @Input() totalQues:any;
  @Input() guideLines:any;
  @Input() totalAtteptQuestion:any;
  finealAttemptQuestionLength:number = 0;
  patternIdCountQuestion:any = 0;
  constructor(private commonService: CommonserviceService) { }

  ngOnInit(): void {
    this.commonService.assessmentTotalNoOfQuestionObj.subscribe((data:any)=>{
      this.patternIdCountQuestion = data;
    })

    this.commonService.assessmentTotalQuestionsCount.subscribe((data:any)=>{
      const allQuestionAttempt = Object.values(data);
      let filterOnlyAttempt = allQuestionAttempt.filter(s => s === 2);
      this.finealAttemptQuestionLength = filterOnlyAttempt?.length;
    });
    
    // console.log(this.finealAttemptQuestionLength);
    
    // const allQuestionAttempt = Object.values(this.totalAtteptQuestion);
    // let filterOnlyAttempt = allQuestionAttempt.filter(s => s === 2);
    // this.finealAttemptQuestionLength = filterOnlyAttempt?.length;
    
  }

}
