import { TestBed } from '@angular/core/testing';

import { RouteByPassGuardService } from './route-by-pass-guard.service';

describe('RouteByPassGuardService', () => {
  let service: RouteByPassGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteByPassGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
