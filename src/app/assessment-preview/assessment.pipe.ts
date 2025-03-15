import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assessment'
})
export class AssessmentPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let quesComp:number=0;
   let finalQues= args.filter((x:unknown[],i)=>{
      if(typeof(x)=='object')
      {
        for (let key in x) {
          let sectionId = x[key]['sectionId'];
          if(sectionId==value)
          {
            quesComp=x[key]['totalCompleteQues'];
          }
        }
      }
    });
    return quesComp;
  }

}
