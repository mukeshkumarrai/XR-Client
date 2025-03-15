import { TestBed } from '@angular/core/testing';

import { CandidateDegreeTypeService } from './candidate-degree-type.service';

describe('CandidateDegreeTypeService', () => {
  let service: CandidateDegreeTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateDegreeTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
