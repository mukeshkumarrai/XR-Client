import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeActivityPageComponent } from './custome-activity-page.component';

describe('CustomeActivityPageComponent', () => {
  let component: CustomeActivityPageComponent;
  let fixture: ComponentFixture<CustomeActivityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomeActivityPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeActivityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
