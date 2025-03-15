import { TestBed } from '@angular/core/testing';

import { CandidateFolderService } from './candidate-folder.service';

describe('CandidateFolderService', () => {
  let service: CandidateFolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateFolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
