import { TestBed } from '@angular/core/testing';

import { XeopleSearchService } from './xeople-search.service';

describe('XeopleSearchService', () => {
  let service: XeopleSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XeopleSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
