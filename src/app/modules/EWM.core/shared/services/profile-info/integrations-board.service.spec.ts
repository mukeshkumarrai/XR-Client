import { TestBed } from '@angular/core/testing';

import { IntegrationsBoardService } from './integrations-board.service';

describe('IntegrationsBoardService', () => {
  let service: IntegrationsBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrationsBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
