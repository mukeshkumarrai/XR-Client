import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCallHistroyComponent } from './job-call-histroy.component';

describe('JobCallHistroyComponent', () => {
  let component: JobCallHistroyComponent;
  let fixture: ComponentFixture<JobCallHistroyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCallHistroyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCallHistroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
