import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadPopupComponent } from './image-upload-popup.component';

describe('ImageUploadPopupComponent', () => {
  let component: ImageUploadPopupComponent;
  let fixture: ComponentFixture<ImageUploadPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageUploadPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
