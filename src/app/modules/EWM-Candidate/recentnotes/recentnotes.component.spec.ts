import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentnotesComponent } from './recentnotes.component';

describe('RecentnotesComponent', () => {
  let component: RecentnotesComponent;
  let fixture: ComponentFixture<RecentnotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentnotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentnotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
