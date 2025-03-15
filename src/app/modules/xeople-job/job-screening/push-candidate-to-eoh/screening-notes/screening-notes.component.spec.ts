import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreeningNotesComponent } from './screening-notes.component';

describe('ScreeningNotesComponent', () => {
  let component: ScreeningNotesComponent;
  let fixture: ComponentFixture<ScreeningNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreeningNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreeningNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
