import { TestBed } from '@angular/core/testing';

import { ClientfolderlistService } from './clientfolderlist.service';

describe('ClientfolderlistService', () => {
  let service: ClientfolderlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientfolderlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
