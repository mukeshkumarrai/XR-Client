import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchJobNoteByContactComponent } from './search-job-note-by-contact.component';

describe('SearchJobNoteByContactComponent', () => {
  let component: SearchJobNoteByContactComponent;
  let fixture: ComponentFixture<SearchJobNoteByContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchJobNoteByContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchJobNoteByContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
