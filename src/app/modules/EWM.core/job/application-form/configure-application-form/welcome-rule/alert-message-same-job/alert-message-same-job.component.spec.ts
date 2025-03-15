import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMessageSameJobComponent } from './alert-message-same-job.component';

describe('AlertMessageSameJobComponent', () => {
  let component: AlertMessageSameJobComponent;
  let fixture: ComponentFixture<AlertMessageSameJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertMessageSameJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertMessageSameJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
