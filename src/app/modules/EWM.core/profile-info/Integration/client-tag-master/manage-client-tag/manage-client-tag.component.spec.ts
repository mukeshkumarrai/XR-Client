import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClientTagComponent } from './manage-client-tag.component';

describe('ManageClientTagComponent', () => {
  let component: ManageClientTagComponent;
  let fixture: ComponentFixture<ManageClientTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageClientTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageClientTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
