import { TestBed } from '@angular/core/testing';

import { CandidateExperienceService } from './candidate-experience.service';

describe('CandidateExperienceService', () => {
  let service: CandidateExperienceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateExperienceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
