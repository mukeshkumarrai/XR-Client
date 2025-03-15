import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeaccessComponent } from './revokeaccess.component';

describe('RevokeaccessComponent', () => {
  let component: RevokeaccessComponent;
  let fixture: ComponentFixture<RevokeaccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevokeaccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevokeaccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
