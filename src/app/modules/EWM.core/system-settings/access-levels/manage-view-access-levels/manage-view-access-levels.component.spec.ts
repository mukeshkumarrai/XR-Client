import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageViewAccessLevelsComponent } from './manage-view-access-levels.component';

describe('ManageViewAccessLevelsComponent', () => {
  let component: ManageViewAccessLevelsComponent;
  let fixture: ComponentFixture<ManageViewAccessLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageViewAccessLevelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageViewAccessLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
