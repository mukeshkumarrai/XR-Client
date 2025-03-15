import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQualificationDocumentComponent } from './add-qualification-document.component';

describe('AddQualificationDocumentComponent', () => {
  let component: AddQualificationDocumentComponent;
  let fixture: ComponentFixture<AddQualificationDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQualificationDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQualificationDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
