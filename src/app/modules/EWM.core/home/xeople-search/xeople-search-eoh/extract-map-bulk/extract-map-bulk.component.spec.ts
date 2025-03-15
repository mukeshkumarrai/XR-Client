import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractMapBulkComponent } from './extract-map-bulk.component';

describe('ExtractMapBulkComponent', () => {
  let component: ExtractMapBulkComponent;
  let fixture: ComponentFixture<ExtractMapBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtractMapBulkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractMapBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
