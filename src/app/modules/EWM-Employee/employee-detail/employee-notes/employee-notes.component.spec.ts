import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNotesComponent } from './employee-notes.component';

describe('EmployeeNotesComponent', () => {
  let component: EmployeeNotesComponent;
  let fixture: ComponentFixture<EmployeeNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
