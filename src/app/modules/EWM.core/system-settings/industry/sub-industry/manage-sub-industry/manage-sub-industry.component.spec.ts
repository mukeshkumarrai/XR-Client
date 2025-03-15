import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSubIndustryComponent } from './manage-sub-industry.component';

describe('ManageSubIndustryComponent', () => {
  let component: ManageSubIndustryComponent;
  let fixture: ComponentFixture<ManageSubIndustryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSubIndustryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSubIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
