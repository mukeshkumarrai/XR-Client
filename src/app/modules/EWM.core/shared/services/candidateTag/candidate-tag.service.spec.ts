import { TestBed } from '@angular/core/testing';

import { CandidateTagService } from './candidate-tag.service';

describe('CandidateTagService', () => {
  let service: CandidateTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
