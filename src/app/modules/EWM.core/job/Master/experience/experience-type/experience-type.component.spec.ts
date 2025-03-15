import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceTypeComponent } from './experience-type.component';

describe('ExperienceTypeComponent', () => {
  let component: ExperienceTypeComponent;
  let fixture: ComponentFixture<ExperienceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperienceTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
