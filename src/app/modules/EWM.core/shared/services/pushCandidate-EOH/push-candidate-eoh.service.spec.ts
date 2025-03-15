import { TestBed } from '@angular/core/testing';

import { PushCandidateEOHService } from './push-candidate-eoh.service';

describe('PushCandidateEOHService', () => {
  let service: PushCandidateEOHService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushCandidateEOHService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
