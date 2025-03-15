import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickCompanyComponent } from './quick-company.component';

describe('QuickCompanyComponent', () => {
  let component: QuickCompanyComponent;
  let fixture: ComponentFixture<QuickCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
