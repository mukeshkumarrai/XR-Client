import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReopenJobComponent } from './reopen-job.component';

describe('ReopenJobComponent', () => {
  let component: ReopenJobComponent;
  let fixture: ComponentFixture<ReopenJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReopenJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReopenJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
