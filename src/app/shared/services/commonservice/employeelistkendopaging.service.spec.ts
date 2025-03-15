import { TestBed } from '@angular/core/testing';

import { EmployeelistkendopagingService } from './employeelistkendopaging.service';

describe('EmployeelistkendopagingService', () => {
  let service: EmployeelistkendopagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeelistkendopagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
