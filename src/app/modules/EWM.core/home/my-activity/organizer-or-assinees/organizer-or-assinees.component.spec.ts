import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerOrAssineesComponent } from './organizer-or-assinees.component';

describe('OrganizerOrAssineesComponent', () => {
  let component: OrganizerOrAssineesComponent;
  let fixture: ComponentFixture<OrganizerOrAssineesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizerOrAssineesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizerOrAssineesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
