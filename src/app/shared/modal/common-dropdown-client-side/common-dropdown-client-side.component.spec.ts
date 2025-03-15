import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDropdownClientSideComponent } from './common-dropdown-client-side.component';

describe('CommonDropdownClientSideComponent', () => {
  let component: CommonDropdownClientSideComponent;
  let fixture: ComponentFixture<CommonDropdownClientSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonDropdownClientSideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonDropdownClientSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
