import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNoteByContactComponent } from './search-note-by-contact.component';

describe('SearchNoteByContactComponent', () => {
  let component: SearchNoteByContactComponent;
  let fixture: ComponentFixture<SearchNoteByContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchNoteByContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNoteByContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
