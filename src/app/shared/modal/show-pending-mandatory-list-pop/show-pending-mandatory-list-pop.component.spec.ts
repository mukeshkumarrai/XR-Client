import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPendingMandatoryListPopComponent } from './show-pending-mandatory-list-pop.component';

describe('ShowPendingMandatoryListPopComponent', () => {
  let component: ShowPendingMandatoryListPopComponent;
  let fixture: ComponentFixture<ShowPendingMandatoryListPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPendingMandatoryListPopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPendingMandatoryListPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
