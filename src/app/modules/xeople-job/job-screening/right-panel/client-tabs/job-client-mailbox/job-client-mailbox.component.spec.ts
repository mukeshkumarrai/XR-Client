import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobClientMailboxComponent } from './job-client-mailbox.component';

describe('JobClientMailboxComponent', () => {
  let component: JobClientMailboxComponent;
  let fixture: ComponentFixture<JobClientMailboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobClientMailboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobClientMailboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
