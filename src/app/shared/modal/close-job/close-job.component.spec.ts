import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseJobComponent } from './close-job.component';

describe('CloseJobComponent', () => {
  let component: CloseJobComponent;
  let fixture: ComponentFixture<CloseJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
