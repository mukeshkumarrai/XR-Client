import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddemailComponent } from './addemail.component';

describe('AddemailComponent', () => {
  let component: AddemailComponent;
  let fixture: ComponentFixture<AddemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
