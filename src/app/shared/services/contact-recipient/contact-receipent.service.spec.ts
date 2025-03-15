import { TestBed } from '@angular/core/testing';

import { ContactReceipentService } from './contact-receipent.service';

describe('ContactReceipentService', () => {
  let service: ContactReceipentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactReceipentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
