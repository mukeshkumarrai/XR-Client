import { TestBed } from '@angular/core/testing';

import { MfaAuthService } from './mfa-auth.service';

describe('MfaAuthService', () => {
  let service: MfaAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MfaAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
