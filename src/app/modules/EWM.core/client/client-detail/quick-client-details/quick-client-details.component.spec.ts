import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickClientDetailsComponent } from './quick-client-details.component';

describe('QuickClientDetailsComponent', () => {
  let component: QuickClientDetailsComponent;
  let fixture: ComponentFixture<QuickClientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickClientDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickClientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
