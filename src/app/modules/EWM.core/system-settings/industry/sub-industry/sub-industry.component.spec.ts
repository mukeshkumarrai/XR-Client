import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubIndustryComponent } from './sub-industry.component';

describe('SubIndustryComponent', () => {
  let component: SubIndustryComponent;
  let fixture: ComponentFixture<SubIndustryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubIndustryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
