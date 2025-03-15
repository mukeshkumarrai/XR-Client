import { TestBed } from '@angular/core/testing';

import { EmployeeTagService } from './employee-tag.service';

describe('EmployeeTagService', () => {
  let service: EmployeeTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
