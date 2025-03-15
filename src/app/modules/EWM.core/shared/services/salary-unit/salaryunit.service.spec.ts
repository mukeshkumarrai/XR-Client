import { TestBed } from '@angular/core/testing';

import { SalaryunitService } from './salaryunit.service';

describe('SalaryunitService', () => {
  let service: SalaryunitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryunitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
