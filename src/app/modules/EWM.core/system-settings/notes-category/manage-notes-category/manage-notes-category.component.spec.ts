import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNotesCategoryComponent } from './manage-notes-category.component';

describe('ManageNotesCategoryComponent', () => {
  let component: ManageNotesCategoryComponent;
  let fixture: ComponentFixture<ManageNotesCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageNotesCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNotesCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
