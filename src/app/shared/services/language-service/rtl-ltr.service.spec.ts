import { TestBed } from '@angular/core/testing';

import { RtlLtrService } from './rtl-ltr.service';

describe('RtlLtrService', () => {
  let service: RtlLtrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RtlLtrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
