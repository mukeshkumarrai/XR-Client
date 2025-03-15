import { TestBed } from '@angular/core/testing';

import { AppSignalrService } from './app-signalr.service';

describe('AppSignalrService', () => {
  let service: AppSignalrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppSignalrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
