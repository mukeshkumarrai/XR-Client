import { TestBed } from '@angular/core/testing';

import { CountryMasterService } from './country-master.service';

describe('CountryMasterService', () => {
  let service: CountryMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
