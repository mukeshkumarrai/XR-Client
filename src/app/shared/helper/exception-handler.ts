/* @(C): Entire Software
@Type: File, <ts>
@Name: exception-handling.ts
@Who: Renu
@When: 16-Sep-2020
@Why: For handling Exception while api call
@What: Exception handler class
 */

import { throwError } from 'rxjs';

export   function handleError(error) {
  let errorMessage = '';
  if(error.error instanceof ErrorEvent) {
    // Get client-side error
    errorMessage = error.error.message;
  } else {
    // Get server-side error
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }

  /* @Who: Renu  @When: 5-Sept-2021 @Why:  ROST-8235 ROST-8659 @What: to log all error which caught by status */
  let obj={};
  obj['InputValue']=JSON.stringify(error);
  this.commonserviceService.logErrorApi(obj).subscribe((data: any) => {
    ((res: any) => {
      // console.log('res',res);
  })
  }, (error) => {
  });
  return throwError(errorMessage);
}
