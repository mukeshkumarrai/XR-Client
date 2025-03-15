import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizingWidgetsComponent } from './customizing-widgets.component';

describe('CustomizingWidgetsComponent', () => {
  let component: CustomizingWidgetsComponent;
  let fixture: ComponentFixture<CustomizingWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomizingWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizingWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
