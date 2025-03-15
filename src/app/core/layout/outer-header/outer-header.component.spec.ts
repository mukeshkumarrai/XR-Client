import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuterHeaderComponent } from './outer-header.component';

describe('OuterHeaderComponent', () => {
  let component: OuterHeaderComponent;
  let fixture: ComponentFixture<OuterHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuterHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OuterHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
