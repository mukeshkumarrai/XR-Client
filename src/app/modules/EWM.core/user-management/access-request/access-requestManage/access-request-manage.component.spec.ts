import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRequestManageComponent } from './access-request-manage.component';

describe('AccessRequestManageComponent', () => {
  let component: AccessRequestManageComponent;
  let fixture: ComponentFixture<AccessRequestManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessRequestManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessRequestManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
