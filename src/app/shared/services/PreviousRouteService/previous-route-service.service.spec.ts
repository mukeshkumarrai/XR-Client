import { TestBed } from '@angular/core/testing';

import { PreviousRouteServiceService } from './previous-route-service.service';

describe('PreviousRouteServiceService', () => {
  let service: PreviousRouteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviousRouteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
