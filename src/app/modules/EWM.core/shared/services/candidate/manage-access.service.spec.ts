import { TestBed } from '@angular/core/testing';

import { ManageAccessService } from './manage-access.service';

describe('ManageAccessService', () => {
  let service: ManageAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
