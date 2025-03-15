import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EohSearchCardViewComponent } from './eoh-search-card-view.component';

describe('EohSearchCardViewComponent', () => {
  let component: EohSearchCardViewComponent;
  let fixture: ComponentFixture<EohSearchCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EohSearchCardViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EohSearchCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
