import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomIndeedLocationComponent } from './custom-indeed-location.component';

describe('CustomIndeedLocationComponent', () => {
  let component: CustomIndeedLocationComponent;
  let fixture: ComponentFixture<CustomIndeedLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomIndeedLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomIndeedLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
