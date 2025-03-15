import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickIndeedLocationComponent } from './quick-indeed-location.component';

describe('QuickIndeedLocationComponent', () => {
  let component: QuickIndeedLocationComponent;
  let fixture: ComponentFixture<QuickIndeedLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickIndeedLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickIndeedLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
