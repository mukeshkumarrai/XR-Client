import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobPostingComponent } from './manage-job-posting.component';

describe('ManageJobPostingComponent', () => {
  let component: ManageJobPostingComponent;
  let fixture: ComponentFixture<ManageJobPostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageJobPostingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageJobPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
