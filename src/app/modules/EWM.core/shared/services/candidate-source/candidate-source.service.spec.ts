import { TestBed } from '@angular/core/testing';

import { CandidateSourceService } from './candidate-source.service';

describe('CandidateSourceService', () => {
  let service: CandidateSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
