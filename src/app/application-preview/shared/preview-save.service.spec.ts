import { TestBed } from '@angular/core/testing';

import { PreviewSaveService } from './preview-save.service';

describe('PreviewSaveService', () => {
  let service: PreviewSaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviewSaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
