import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuterFooterComponent } from './outer-footer.component';

describe('OuterFooterComponent', () => {
  let component: OuterFooterComponent;
  let fixture: ComponentFixture<OuterFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuterFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OuterFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
