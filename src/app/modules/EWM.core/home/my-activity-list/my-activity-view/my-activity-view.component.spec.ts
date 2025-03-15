import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyActivityViewComponent } from './my-activity-view.component';

describe('MyActivityViewComponent', () => {
  let component: MyActivityViewComponent;
  let fixture: ComponentFixture<MyActivityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyActivityViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyActivityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
