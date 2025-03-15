import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentnotesPopupComponent } from './recentnotes-popup.component';

describe('RecentnotesPopupComponent', () => {
  let component: RecentnotesPopupComponent;
  let fixture: ComponentFixture<RecentnotesPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentnotesPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentnotesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
