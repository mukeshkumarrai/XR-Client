import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIndustryComponent } from './manage-industry.component';

describe('ManageIndustryComponent', () => {
  let component: ManageIndustryComponent;
  let fixture: ComponentFixture<ManageIndustryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageIndustryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
