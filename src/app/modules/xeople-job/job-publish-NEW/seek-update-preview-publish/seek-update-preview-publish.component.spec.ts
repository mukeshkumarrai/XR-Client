import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekUpdatePreviewPublishComponent } from './seek-update-preview-publish.component';

describe('SeekUpdatePreviewPublishComponent', () => {
  let component: SeekUpdatePreviewPublishComponent;
  let fixture: ComponentFixture<SeekUpdatePreviewPublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeekUpdatePreviewPublishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekUpdatePreviewPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
