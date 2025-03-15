import { TestBed } from '@angular/core/testing';

import { UserAdministrationService } from './user-administration.service';

describe('UserAdministrationService', () => {
  let service: UserAdministrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAdministrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
