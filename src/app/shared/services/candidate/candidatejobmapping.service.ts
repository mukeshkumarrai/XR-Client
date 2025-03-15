import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../helper/exception-handler';
import { ServiceListClass } from '../sevicelist';
@Injectable({
  providedIn: 'root'
})
export class CandidatejobmappingService {
  constructor(private http:HttpClient,private serviceListClass:ServiceListClass) { }
  getAllCandidateJobMapping(formData)
  {
   return this.http.post(this.serviceListClass.getAllCandidateJobMapping,formData)
   .pipe(retry(1),catchError(handleError));
  }
  getfilterConfig(GridId) {
    return this.http.get(this.serviceListClass.getfilterConfig+'?GridId='+GridId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getTimeLinedata(candidateId,workflowId,jobId) {
    return this.http.get(this.serviceListClass.gettimelineData+'?candidateid='+candidateId+'&jobid='+jobId+'&workflowid='+workflowId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getCandidateMappedtoallJobTimelines(candidateId,workflowId,jobId) {
    return this.http.get(this.serviceListClass.getCandidateMappedtoallJobTimelines+'?candidateid='+candidateId+'&jobid='+jobId+'&workflowid='+workflowId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getApplicantList(formData)
  {
   return this.http.post(this.serviceListClass.applicantList,formData)
   .pipe(retry(1),catchError(handleError));
  }
  // by maneesh when:20/06/2024 for use applicant list open timeline popup then not send jobid
  getJobTimelinesForApplicant(candidateId,workflowId,otherPipeline,yourPipeline) {
    return this.http.get(this.serviceListClass.getCandidateMappedtoallJobTimelines+'?candidateid='+candidateId+'&workflowid='+workflowId +'&otherPipeline='+otherPipeline +'&yourPipeline='+ yourPipeline).pipe(
      retry(1),
      catchError(handleError)
    );
  }
    // by maneesh when:20/06/2024 for use applicant list open timeline popup then not send jobid for jobdetails timeline
    getJobTimelinesForJobDetails(candidateId,workflowId,otherPipeline,yourPipeline,jobId) {
      return this.http.get(this.serviceListClass.getCandidateMappedtoallJobTimelines+'?candidateid='+candidateId+'&workflowid='+workflowId +'&otherPipeline='+otherPipeline +'&yourPipeline='+ yourPipeline +'&jobid='+jobId).pipe(
        retry(1),
        catchError(handleError)
      );
    }
}
