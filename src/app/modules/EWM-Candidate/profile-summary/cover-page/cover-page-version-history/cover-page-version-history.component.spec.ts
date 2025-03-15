import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverPageVersionHistoryComponent } from './cover-page-version-history.component';

describe('CoverPageVersionHistoryComponent', () => {
  let component: CoverPageVersionHistoryComponent;
  let fixture: ComponentFixture<CoverPageVersionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverPageVersionHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverPageVersionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
