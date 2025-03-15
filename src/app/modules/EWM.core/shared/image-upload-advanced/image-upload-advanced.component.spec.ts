import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadAdvancedComponent } from './image-upload-advanced.component';

describe('ImageUploadAdvancedComponent', () => {
  let component: ImageUploadAdvancedComponent;
  let fixture: ComponentFixture<ImageUploadAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageUploadAdvancedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
