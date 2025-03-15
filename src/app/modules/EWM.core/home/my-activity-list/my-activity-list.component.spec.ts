import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyActivityListComponent } from './my-activity-list.component';

describe('MyActivityListComponent', () => {
  let component: MyActivityListComponent;
  let fixture: ComponentFixture<MyActivityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyActivityListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
