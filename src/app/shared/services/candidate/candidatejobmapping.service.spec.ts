import { TestBed } from '@angular/core/testing';

import { CandidatejobmappingService } from './candidatejobmapping.service';

describe('CandidatejobmappingService', () => {
  let service: CandidatejobmappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidatejobmappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
