import { TestBed } from '@angular/core/testing';

import { SystemSettingService } from './system-setting.service';

describe('SystemSettingService', () => {
  let service: SystemSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
