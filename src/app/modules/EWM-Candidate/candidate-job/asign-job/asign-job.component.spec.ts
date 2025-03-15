import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignJobComponent } from './asign-job.component';

describe('AsignJobComponent', () => {
  let component: AsignJobComponent;
  let fixture: ComponentFixture<AsignJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
