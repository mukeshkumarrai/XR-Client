import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesCategoryComponent } from './notes-category.component';

describe('NotesCategoryComponent', () => {
  let component: NotesCategoryComponent;
  let fixture: ComponentFixture<NotesCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
