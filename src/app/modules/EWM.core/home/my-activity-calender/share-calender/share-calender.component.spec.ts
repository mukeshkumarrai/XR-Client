import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareCalenderComponent } from './share-calender.component';

describe('ShareCalenderComponent', () => {
  let component: ShareCalenderComponent;
  let fixture: ComponentFixture<ShareCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
