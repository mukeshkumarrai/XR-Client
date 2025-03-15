import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClientAccessComponent } from './manage-client-access.component';

describe('ManageClientAccessComponent', () => {
  let component: ManageClientAccessComponent;
  let fixture: ComponentFixture<ManageClientAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageClientAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageClientAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
