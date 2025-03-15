import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageApplicationFormComponent } from './manage-application-form.component';

describe('ManageApplicationFormComponent', () => {
  let component: ManageApplicationFormComponent;
  let fixture: ComponentFixture<ManageApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageApplicationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
