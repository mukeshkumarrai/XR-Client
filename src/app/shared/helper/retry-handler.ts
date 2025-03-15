


/* @(C): Entire Software
@Type: File, <ts>
@Name: retry-handler.ts
@Who: Renu
@When: 05-Sep-2022
@Why: For handling Exception while api call
@What: Exception handler class
 */

import { throwError } from 'rxjs';

export   function retryHandler(error) {
    const retryLimit = 3;
    let attempt = 0;
    if (++attempt >= retryLimit || (error.status !== 500 && error.status !== 502)) {
    return throwError(error);
    }
    
}