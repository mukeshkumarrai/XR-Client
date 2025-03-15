import { TestBed } from '@angular/core/testing';

import { BroadbeanService } from './broadbean.service';

describe('BroadbeanService', () => {
  let service: BroadbeanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BroadbeanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
