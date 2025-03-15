import { TestBed } from '@angular/core/testing';

import { RosterservicelistService } from './rosterservicelist.service';

describe('RosterservicelistService', () => {
  let service: RosterservicelistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RosterservicelistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
