import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverPageViewDetailsComponent } from './cover-page-view-details.component';

describe('CoverPageViewDetailsComponent', () => {
  let component: CoverPageViewDetailsComponent;
  let fixture: ComponentFixture<CoverPageViewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverPageViewDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverPageViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
