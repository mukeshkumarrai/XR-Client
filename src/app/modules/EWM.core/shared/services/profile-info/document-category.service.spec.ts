import { TestBed } from '@angular/core/testing';

import { DocumentCategoryService } from './document-category.service';

describe('DocumentCategoryService', () => {
  let service: DocumentCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
