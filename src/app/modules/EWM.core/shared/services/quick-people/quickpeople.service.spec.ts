import { TestBed } from '@angular/core/testing';

import { QuickpeopleService } from './quickpeople.service';

describe('QuickpeopleService', () => {
  let service: QuickpeopleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuickpeopleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
