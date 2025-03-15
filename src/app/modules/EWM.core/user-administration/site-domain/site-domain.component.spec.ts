import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteDomainComponent } from './site-domain.component';

describe('SiteDomainComponent', () => {
  let component: SiteDomainComponent;
  let fixture: ComponentFixture<SiteDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteDomainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
