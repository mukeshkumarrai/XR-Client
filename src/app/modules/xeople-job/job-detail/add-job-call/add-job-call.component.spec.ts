import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobCallComponent } from './add-job-call.component';

describe('AddJobCallComponent', () => {
  let component: AddJobCallComponent;
  let fixture: ComponentFixture<AddJobCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJobCallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJobCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
