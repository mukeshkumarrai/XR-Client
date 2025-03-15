import { TestBed } from '@angular/core/testing';

import { JoblandingkendopagingService } from './joblandingkendopaging.service';

describe('JoblandingkendopagingService', () => {
  let service: JoblandingkendopagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoblandingkendopagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
