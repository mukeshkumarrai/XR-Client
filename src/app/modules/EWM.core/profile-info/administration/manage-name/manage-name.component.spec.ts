import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNameComponent } from './manage-name.component';

describe('ManageNameComponent', () => {
  let component: ManageNameComponent;
  let fixture: ComponentFixture<ManageNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
