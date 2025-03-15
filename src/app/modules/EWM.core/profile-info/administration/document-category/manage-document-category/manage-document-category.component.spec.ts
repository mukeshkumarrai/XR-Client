import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDocumentCategoryComponent } from './manage-document-category.component';

describe('ManageDocumentCategoryComponent', () => {
  let component: ManageDocumentCategoryComponent;
  let fixture: ComponentFixture<ManageDocumentCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDocumentCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDocumentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
