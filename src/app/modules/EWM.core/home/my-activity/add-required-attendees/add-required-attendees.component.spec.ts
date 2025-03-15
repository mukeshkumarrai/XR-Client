import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequiredAttendeesComponent } from './add-required-attendees.component';

describe('AddRequiredAttendeesComponent', () => {
  let component: AddRequiredAttendeesComponent;
  let fixture: ComponentFixture<AddRequiredAttendeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRequiredAttendeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequiredAttendeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
