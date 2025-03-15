import { TestBed } from '@angular/core/testing';

import { SystemLookFeelService } from './system-look-feel.service';

describe('SystemLookFeelService', () => {
  let service: SystemLookFeelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemLookFeelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
