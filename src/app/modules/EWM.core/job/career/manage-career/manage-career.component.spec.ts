import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCareerComponent } from './manage-career.component';

describe('ManageCareerComponent', () => {
  let component: ManageCareerComponent;
  let fixture: ComponentFixture<ManageCareerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCareerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCareerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
