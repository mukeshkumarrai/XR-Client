import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobActivityComponent } from './add-job-activity.component';

describe('AddJobActivityComponent', () => {
  let component: AddJobActivityComponent;
  let fixture: ComponentFixture<AddJobActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJobActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJobActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
