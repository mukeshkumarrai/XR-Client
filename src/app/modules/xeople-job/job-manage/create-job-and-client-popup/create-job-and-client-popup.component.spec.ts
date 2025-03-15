import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobAndClientPopupComponent } from './create-job-and-client-popup.component';

describe('CreateJobAndClientPopupComponent', () => {
  let component: CreateJobAndClientPopupComponent;
  let fixture: ComponentFixture<CreateJobAndClientPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateJobAndClientPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJobAndClientPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
