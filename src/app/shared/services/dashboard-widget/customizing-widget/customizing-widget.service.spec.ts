import { TestBed } from '@angular/core/testing';

import { CustomizingWidgetService } from './customizing-widget.service';

describe('CustomizingWidgetService', () => {
  let service: CustomizingWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomizingWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
