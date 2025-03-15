import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAddContactComponent } from './quick-add-contact.component';

describe('QuickAddContactComponent', () => {
  let component: QuickAddContactComponent;
  let fixture: ComponentFixture<QuickAddContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickAddContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickAddContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
