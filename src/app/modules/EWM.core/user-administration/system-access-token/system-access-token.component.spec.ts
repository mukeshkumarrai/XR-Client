import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAccessTokenComponent } from './system-access-token.component';

describe('SystemAccessTokenComponent', () => {
  let component: SystemAccessTokenComponent;
  let fixture: ComponentFixture<SystemAccessTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemAccessTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAccessTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
